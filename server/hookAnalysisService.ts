import OpenAI from "openai";
import {
  hookAnalysisResultSchema,
  type HookAnalyzeRequest,
  type HookAnalysisResult,
} from "@shared/hookAnalysis";

const ACTORS = {
  tiktok: "clockworks~tiktok-scraper",
  instagram: "apify~instagram-scraper",
  youtube: "streamers~youtube-scraper",
} as const;
const APIFY_API = "https://api.apify.com/v2";
const LLM_MODEL = "gpt-4o-mini";
const MAX_MARKET_JSON_CHARS = 28_000;
const DATASET_MAX_ITEMS = 35;
const APIFY_TARGET_RESULTS = 100;
const LOOKBACK_DAYS = 183;
/** Apify sync `waitForFinish` often returns early (~60s) with non-terminal status; we poll instead. */
const APIFY_RUN_POLL_INTERVAL_MS = 3_000;

function parseEnvInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 0) return fallback;
  return parsed;
}

const MIN_URL_BACKED_BENCHMARKS = parseEnvInt("MIN_URL_BACKED_BENCHMARKS", 3);
const BENCHMARK_EVIDENCE_MODE =
  process.env.BENCHMARK_EVIDENCE_MODE === "strict" ? "strict" : "soft";
const APIFY_RUN_MAX_WAIT_MS = parseEnvInt("APIFY_RUN_MAX_WAIT_MS", 180_000);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function getApifyToken(): string | undefined {
  return process.env.APIFY_TOKEN;
}

function parseHashtagList(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/[\s,]+/)
    .map((h) => h.replace(/^#+/, "").trim().toLowerCase())
    .filter((h) => h.length > 0 && h.length < 80)
    .slice(0, 6);
}

type RawItem = Record<string, unknown>;
type SupportedPlatform = HookAnalyzeRequest["platform"];
const APIFY_FETCH_TIMEOUT_MS = 45_000;
const APIFY_FETCH_RETRIES = 1;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function apifyParseRunData(json: unknown): Record<string, unknown> | null {
  const data =
    typeof json === "object" && json !== null && "data" in json
      ? (json as { data: Record<string, unknown> }).data
      : (json as Record<string, unknown> | null);
  if (!data || typeof data !== "object") return null;
  return data;
}
type MarketContextItem = {
  text: string;
  playCount: number;
  diggCount: number;
  shareCount: number;
  commentCount: number;
  createTimeISO: string | null;
  webVideoUrl: string | null;
  engagementScore: number;
  platform: SupportedPlatform;
};

function toEpochMs(value: string | null): number | null {
  if (!value) return null;
  const numeric = Number(value);
  if (!Number.isNaN(numeric)) {
    // If the actor returns seconds, normalize to ms.
    return numeric < 1_000_000_000_000 ? numeric * 1000 : numeric;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function withinLastDays(value: string | null, days: number): boolean {
  const epoch = toEpochMs(value);
  if (epoch === null) return false;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return epoch >= cutoff;
}

function pickString(obj: RawItem, key: string): string | undefined {
  const v = obj[key];
  return typeof v === "string" ? v : undefined;
}

function pickNumber(obj: RawItem, key: string): number | undefined {
  const v = obj[key];
  return typeof v === "number" && !Number.isNaN(v) ? v : undefined;
}

function getNumberFromKeys(obj: RawItem, keys: string[]): number {
  for (const key of keys) {
    const num = pickNumber(obj, key);
    if (typeof num === "number") return num;
  }
  return 0;
}

function normalizeTiktokItem(row: RawItem): MarketContextItem {
  const playCount = getNumberFromKeys(row, ["playCount", "play count"]);
  const diggCount = getNumberFromKeys(row, ["diggCount", "likesCount"]);
  const shareCount = getNumberFromKeys(row, ["shareCount", "sharesCount"]);
  const commentCount = getNumberFromKeys(row, ["commentCount", "commentsCount"]);
  return {
    text: pickString(row, "text") ?? "",
    playCount,
    diggCount,
    shareCount,
    commentCount,
    createTimeISO: pickString(row, "createTimeISO") ?? pickString(row, "createTime") ?? null,
    webVideoUrl: pickString(row, "webVideoUrl") ?? pickString(row, "url") ?? null,
    engagementScore: diggCount + commentCount * 1.2 + shareCount * 1.5,
    platform: "tiktok",
  };
}

function normalizeInstagramItem(row: RawItem): MarketContextItem {
  const playCount = getNumberFromKeys(row, [
    "videoPlayCount",
    "videoViewCount",
    "videoViewCounter",
    "viewCount",
    "viewsCount",
  ]);
  const diggCount = getNumberFromKeys(row, ["likesCount", "likes"]);
  const shareCount = getNumberFromKeys(row, ["videoShareCount", "shareCount"]);
  const commentCount = getNumberFromKeys(row, ["commentsCount", "comments"]);
  return {
    text: pickString(row, "caption") ?? pickString(row, "text") ?? "",
    playCount,
    diggCount,
    shareCount,
    commentCount,
    createTimeISO:
      pickString(row, "timestamp") ??
      pickString(row, "takenAtTimestamp") ??
      pickString(row, "createdAt") ??
      null,
    webVideoUrl: pickString(row, "url") ?? pickString(row, "displayUrl") ?? null,
    engagementScore: diggCount + commentCount * 1.25 + shareCount * 1.5,
    platform: "instagram",
  };
}

function normalizeYoutubeItem(row: RawItem): MarketContextItem {
  const playCount = getNumberFromKeys(row, ["viewCount", "views", "viewsCount"]);
  const diggCount = getNumberFromKeys(row, ["likes", "likeCount"]);
  const shareCount = getNumberFromKeys(row, ["shareCount"]);
  const commentCount = getNumberFromKeys(row, ["commentsCount", "commentCount"]);
  return {
    text: pickString(row, "title") ?? pickString(row, "text") ?? "",
    playCount,
    diggCount,
    shareCount,
    commentCount,
    createTimeISO: pickString(row, "date") ?? pickString(row, "publishedAt") ?? null,
    webVideoUrl: pickString(row, "url") ?? null,
    engagementScore: diggCount + commentCount * 1.3 + shareCount * 1.5,
    platform: "youtube",
  };
}

/** Compact rows for the LLM (and future RAG chunks): engagement + text only */
export function compactItemsForContext(
  platform: SupportedPlatform,
  items: unknown[],
): MarketContextItem[] {
  const rows: RawItem[] = items.filter(
    (i): i is RawItem => i !== null && typeof i === "object",
  ) as RawItem[];

  const normalized = rows.map((row) => {
    if (platform === "instagram") return normalizeInstagramItem(row);
    if (platform === "youtube") return normalizeYoutubeItem(row);
    return normalizeTiktokItem(row);
  });

  const rankByPerformance = (input: MarketContextItem[]): MarketContextItem[] =>
    input.sort((a, b) => {
      if (b.playCount !== a.playCount) return b.playCount - a.playCount;
      return b.engagementScore - a.engagementScore;
    });

  const recent: MarketContextItem[] = [];
  const older: MarketContextItem[] = [];
  for (const item of normalized) {
    if (withinLastDays(item.createTimeISO, LOOKBACK_DAYS)) {
      recent.push(item);
    } else {
      older.push(item);
    }
  }

  // Prioritize recent posts, then backfill with older posts when recent coverage is thin.
  return [...rankByPerformance(recent), ...rankByPerformance(older)].slice(0, DATASET_MAX_ITEMS);
}

function getConfidence(items: MarketContextItem[]): "high" | "medium" | "low" {
  if (items.length >= 24) return "high";
  if (items.length >= 10) return "medium";
  return "low";
}

type ApifyInputConfig = {
  input: Record<string, unknown>;
  timeWindow: string;
  normalizationNotes: string[];
};

function buildApifyInput(
  body: HookAnalyzeRequest,
): ApifyInputConfig {
  const tagList = parseHashtagList(body.hashtag ?? "");
  const joinedTags = tagList.map((t) => `#${t}`).join(" ");
  const querySeed = `${body.hook.slice(0, 120)} ${body.category} ${joinedTags}`.trim();

  if (body.platform === "instagram") {
    return {
      input: {
        search: querySeed || body.category,
        resultsType: "posts",
        resultsLimit: APIFY_TARGET_RESULTS,
        onlyPostsNewerThan: "6 months",
      },
      timeWindow: "last_6_months",
      normalizationNotes: [
        "Instagram target window uses onlyPostsNewerThan=6 months.",
        `Backend also post-filters to ${LOOKBACK_DAYS} days for consistency across actors.`,
        "Share metrics may be sparse; engagement weighting normalizes missing values.",
      ],
    };
  }

  if (body.platform === "youtube") {
    return {
      input: {
        searchQueries: [querySeed || body.category],
        maxResults: APIFY_TARGET_RESULTS,
        maxResultsShorts: APIFY_TARGET_RESULTS,
        maxResultsStreams: APIFY_TARGET_RESULTS,
        maxResultStreams: APIFY_TARGET_RESULTS,
        startUrls: [],
        dateFilter: "year",
      },
      timeWindow: "last_6_months",
      normalizationNotes: [
        "YouTube uses dateFilter=year as broad pre-filter.",
        `Backend post-filters to ${LOOKBACK_DAYS} days to enforce the 6-month window.`,
        "YouTube stream limit includes both maxResultsStreams and maxResultStreams for actor-schema compatibility.",
        "Public shareCount is often unavailable on YouTube and may be zero.",
      ],
    };
  }

  const searchQueries = [querySeed || body.category];
  const input: Record<string, unknown> = {
    searchQueries,
    resultsPerPage: APIFY_TARGET_RESULTS,
  };

  if (tagList.length > 0) {
    // User-supplied hashtags: scrape by tag. Do not set searchDatePosted here — the actor
    // validates date filters against the /video *search* tab; hashtag runs do not reliably
    // apply searchSection, which triggers "search section must be set to '/video'".
    input.hashtags = tagList;
  } else {
    // Search-only: hook + category are in searchQueries; recency filter is allowed with /video.
    input.searchSection = "/video";
    input.searchDatePosted = "182";
  }

  return {
    input,
    timeWindow: "last_6_months",
    normalizationNotes:
      tagList.length > 0
        ? [
            "TikTok: hashtag mode (no searchDatePosted) to satisfy actor validation.",
            `Backend post-filters to ${LOOKBACK_DAYS} days to enforce the 6-month window.`,
            "Ranking prioritizes views, then weighted engagement.",
          ]
        : [
            "TikTok: searchSection=/video with searchDatePosted=182 (6-month target).",
            `Backend post-filters to ${LOOKBACK_DAYS} days for strict recency enforcement.`,
            "Ranking prioritizes views, then weighted engagement.",
          ],
  };
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  retries = APIFY_FETCH_RETRIES,
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), APIFY_FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.status >= 500 && attempt < retries) {
        continue;
      }
      return res;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      if (attempt >= retries) break;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Apify request failed after retries");
}

async function apifyRun(
  platform: SupportedPlatform,
  input: Record<string, unknown>,
  token: string,
): Promise<{ runId: string; items: unknown[] }> {
  const actor = ACTORS[platform];
  if (!actor) {
    const err = new Error(`Unsupported platform: ${platform}`);
    (err as Error & { code: string }).code = "PLATFORM_UNSUPPORTED";
    throw err;
  }

  const startUrl = `${APIFY_API}/acts/${actor}/runs?token=${encodeURIComponent(
    token,
  )}`;

  const res = await fetchWithRetry(startUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const runJson: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errMsg =
      typeof runJson === "object" && runJson !== null && "error" in runJson
        ? JSON.stringify((runJson as { error: unknown }).error)
        : res.statusText;
    const err = new Error(`Apify run failed: ${res.status} ${errMsg}`);
    (err as Error & { code: string }).code = "APIFY";
    throw err;
  }

  const startData = apifyParseRunData(runJson);
  if (!startData) {
    const err = new Error("Apify: missing run data in start response");
    (err as Error & { code: string }).code = "APIFY";
    throw err;
  }

  const runId =
    typeof startData.id === "string" ? startData.id : String(startData.id ?? "");
  if (!runId) {
    const err = new Error("Apify: missing run id");
    (err as Error & { code: string }).code = "APIFY";
    throw err;
  }

  const deadline = Date.now() + APIFY_RUN_MAX_WAIT_MS;
  let data: Record<string, unknown> | null = startData;

  while (Date.now() < deadline) {
    const status = data.status;
    if (status === "SUCCEEDED") break;
    if (
      status === "FAILED" ||
      status === "ABORTED" ||
      status === "TIMED-OUT"
    ) {
      const err = new Error(`Apify run ended with status=${String(status)}`);
      (err as Error & { code: string }).code = "APIFY";
      throw err;
    }

    await delay(APIFY_RUN_POLL_INTERVAL_MS);

    const pollUrl = `${APIFY_API}/actor-runs/${encodeURIComponent(
      runId,
    )}?token=${encodeURIComponent(token)}`;
    const pollRes = await fetchWithRetry(pollUrl, { method: "GET" });
    const pollJson: unknown = await pollRes.json().catch(() => ({}));
    if (!pollRes.ok) {
      const errMsg =
        typeof pollJson === "object" && pollJson !== null && "error" in pollJson
          ? JSON.stringify((pollJson as { error: unknown }).error)
          : pollRes.statusText;
      const err = new Error(`Apify run poll failed: ${pollRes.status} ${errMsg}`);
      (err as Error & { code: string }).code = "APIFY";
      throw err;
    }
    const next = apifyParseRunData(pollJson);
    if (!next) {
      const err = new Error("Apify: missing run data while polling");
      (err as Error & { code: string }).code = "APIFY";
      throw err;
    }
    data = next;
  }

  if (data.status !== "SUCCEEDED") {
    const err = new Error(
      `Apify run did not finish within ${APIFY_RUN_MAX_WAIT_MS}ms (last status=${String(
        data.status,
      )})`,
    );
    (err as Error & { code: string }).code = "APIFY";
    throw err;
  }

  const defaultDatasetId = data.defaultDatasetId;
  if (typeof defaultDatasetId !== "string" || !defaultDatasetId) {
    const err = new Error("Apify: no defaultDatasetId on run");
    (err as Error & { code: string }).code = "APIFY";
    throw err;
  }

  const itemsUrl = `${APIFY_API}/datasets/${encodeURIComponent(
    defaultDatasetId,
  )}/items?token=${encodeURIComponent(token)}&format=json&clean=1&limit=100`;

  const itemsRes = await fetchWithRetry(itemsUrl, { method: "GET" });
  if (!itemsRes.ok) {
    const err = new Error(
      `Apify dataset fetch failed: ${itemsRes.status} ${itemsRes.statusText}`,
    );
    (err as Error & { code: string }).code = "APIFY";
    throw err;
  }
  const items: unknown = await itemsRes.json();
  if (!Array.isArray(items)) {
    const err = new Error("Apify dataset: expected JSON array");
    (err as Error & { code: string }).code = "APIFY";
    throw err;
  }
  return { runId, items };
}

function enforceBenchmarkEvidence(
  analysis: HookAnalysisResult,
  market: MarketContextItem[],
): HookAnalysisResult {
  const fallbackPool = market
    .filter((m) => m.webVideoUrl)
    .sort((a, b) => {
      const ae = toEpochMs(a.createTimeISO) ?? 0;
      const be = toEpochMs(b.createTimeISO) ?? 0;
      if (be !== ae) return be - ae;
      if (b.playCount !== a.playCount) return b.playCount - a.playCount;
      return b.engagementScore - a.engagementScore;
    });

  const marketToBenchmarkRow = (
    m: MarketContextItem,
  ): HookAnalysisResult["benchmarks"][number] => ({
    text: m.text || "Top performing post",
    views: `${m.playCount.toLocaleString()} views`,
    url: m.webVideoUrl ?? undefined,
    platform: m.platform,
    postedAt: m.createTimeISO ?? undefined,
  });

  /** Index-aligned backfill only for LLM rows missing URLs */
  const mergedBenchmarks = analysis.benchmarks.map((bench, i) => {
    if (bench.url) return bench;
    const replacement = fallbackPool[i] ? marketToBenchmarkRow(fallbackPool[i]) : bench;
    return replacement;
  });

  const rowsWithUrl = mergedBenchmarks.filter(
    (b) => typeof b.url === "string" && b.url.length > 0,
  );
  const usedUrls = new Set(rowsWithUrl.map((b) => b.url));

  /** Append distinct URL-backed market posts until we hit common display target (3) */
  let sourceBackedBenchmarks = rowsWithUrl;
  for (const m of fallbackPool) {
    if (!m.webVideoUrl || usedUrls.has(m.webVideoUrl)) continue;
    if (sourceBackedBenchmarks.length >= Math.max(MIN_URL_BACKED_BENCHMARKS, 3)) break;
    const row = marketToBenchmarkRow(m);
    sourceBackedBenchmarks = [...sourceBackedBenchmarks, row];
    usedUrls.add(m.webVideoUrl);
  }

  const recencySorted = sourceBackedBenchmarks.sort(
    (a, b) => (toEpochMs(b.postedAt ?? null) ?? 0) - (toEpochMs(a.postedAt ?? null) ?? 0),
  );
  return { ...analysis, benchmarks: recencySorted };
}

const analysisJsonSchemaHint = `{
  "score": 0-100 (integer),
  "verdict": "short headline for the user",
  "topic": "what the hook is about",
  "category": "human-readable vertical (e.g. Gaming)",
  "summary": "2-4 sentences",
  "format": "e.g. short-form video",
  "length": "e.g. 15-60s (estimate from patterns)",
  "good": ["strength 1", "strength 2", ...],
  "bad": ["risk or weakness 1", ...],
  "tips": ["actionable tip 1", "tip 2", ...],
  "benchmarks": [ { "text": "example hook text from or inspired by the market data", "views": "e.g. 1.2M views" } ],
  "dimensions": {
    "curiosityGap": 0-100,
    "emotionalStakes": 0-100,
    "trendAlignment": 0-100,
    "pacingRhythm": 0-100,
    "specificity": 0-100
  }
}`;

export async function runHookAnalysis(
  body: HookAnalyzeRequest,
): Promise<{
  analysis: HookAnalysisResult;
  meta: {
    schemaVersion: "hook_analysis_v1";
    ragCompatible: true;
    apifyRunId?: string;
    marketItemsUsed: number;
    platform: SupportedPlatform;
    timeWindow: string;
    confidence: "high" | "medium" | "low";
    evidenceInsufficient: boolean;
    topPostUrls: string[];
    normalizationNotes: string[];
  };
}> {
  const apifyToken = getApifyToken();
  if (!apifyToken) {
    const err = new Error("Server missing APIFY_TOKEN");
    (err as Error & { code: string }).code = "CONFIG";
    throw err;
  }
  if (!process.env.OPENAI_API_KEY) {
    const err = new Error("Server missing OPENAI_API_KEY");
    (err as Error & { code: string }).code = "CONFIG";
    throw err;
  }

  const apifyConfig = buildApifyInput(body);
  const { runId, items } = await apifyRun(body.platform, apifyConfig.input, apifyToken);
  const marketCompact = compactItemsForContext(body.platform, items);

  const system = `You are a senior short-form content strategist. You receive:
(1) The creator's proposed hook and metadata.
(2) A JSON array "marketData" of recent social posts (text + engagement), collected via Apify based on the selected platform. This is not private data—only public fields.

Task: Use marketData to infer what is working in the niche, compare to the user's hook, and estimate how the hook would perform. Score reflects likelihood of strong engagement and scroll-stopping power relative to the sample—not a guarantee of virality.

Return ONLY a single JSON object (no markdown fences) with this exact shape and keys:
${analysisJsonSchemaHint}
Benchmarks should reflect patterns from marketData and must include URL-backed evidence whenever webVideoUrl is present.
For each benchmark item include: text, views, url (if available), platform, postedAt (if available).
If marketData is empty, set score conservatively, explain limited data, and use generic benchmarks.`;

  let marketForLlm: unknown = marketCompact;
  const marketStr = JSON.stringify(marketCompact);
  if (marketStr.length > MAX_MARKET_JSON_CHARS) {
    marketForLlm = {
      _note: "sample truncated for token limits",
      items: marketCompact.slice(0, Math.max(1, Math.floor(DATASET_MAX_ITEMS / 2))),
    };
  }

  const userPayload = {
    hook: body.hook,
    platform: body.platform,
    contentCategory: body.category,
    creatorHashtagField: body.hashtag ?? "",
    marketData: marketForLlm,
  };

  const completion = await openai.chat.completions.create({
    model: LLM_MODEL,
    temperature: 0.35,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: `Analyze this JSON (marketData = Apify ${body.platform} sample; contentCategory is the app vertical id):\n${JSON.stringify(userPayload, null, 2)}`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    const err = new Error("OpenAI returned empty content");
    (err as Error & { code: string }).code = "LLM";
    throw err;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    const err = new Error("OpenAI did not return valid JSON");
    (err as Error & { code: string }).code = "PARSE";
    throw err;
  }

  const result = hookAnalysisResultSchema.safeParse(parsed);
  if (!result.success) {
    const err = new Error(
      `LLM output failed schema validation: ${result.error.message}`,
    );
    (err as Error & { code: string }).code = "PARSE";
    throw err;
  }

  const analysisWithEvidence = enforceBenchmarkEvidence(result.data, marketCompact);
  const urlBackedBenchmarks = analysisWithEvidence.benchmarks.filter(
    (b) => typeof b.url === "string" && b.url.length > 0,
  ).length;
  const evidenceInsufficient = urlBackedBenchmarks < MIN_URL_BACKED_BENCHMARKS;
  if (evidenceInsufficient && BENCHMARK_EVIDENCE_MODE === "strict") {
    const err = new Error(
      `Insufficient source-backed benchmarks: required ${MIN_URL_BACKED_BENCHMARKS}, got ${urlBackedBenchmarks}`,
    );
    (err as Error & { code: string }).code = "EVIDENCE";
    throw err;
  }

  return {
    analysis: analysisWithEvidence,
    meta: {
      schemaVersion: "hook_analysis_v1",
      ragCompatible: true,
      apifyRunId: runId,
      marketItemsUsed: marketCompact.length,
      platform: body.platform,
      timeWindow: apifyConfig.timeWindow,
      confidence: evidenceInsufficient ? "low" : getConfidence(marketCompact),
      evidenceInsufficient,
      topPostUrls: marketCompact
        .map((item) => item.webVideoUrl)
        .filter((v): v is string => typeof v === "string")
        .slice(0, 5),
      normalizationNotes: [
        "Cross-platform engagement uses normalized fields (views, likes, comments, shares).",
        "Missing platform metrics are treated as zero in ranking to keep scores comparable.",
        `Benchmark thresholds: MIN_URL_BACKED_BENCHMARKS=${MIN_URL_BACKED_BENCHMARKS}, mode=${BENCHMARK_EVIDENCE_MODE}.`,
        ...apifyConfig.normalizationNotes,
      ],
    },
  };
}
