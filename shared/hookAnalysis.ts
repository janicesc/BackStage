import { z } from "zod";

/** Raw JSON body from the analyze form (matches what the client sends). */
export const hookAnalyzeRequestSchema = z.object({
  hookText: z.string().min(1, "Hook is required").max(8000),
  platform: z.enum(["tiktok", "instagram", "youtube"]),
  category: z.string().min(1, "Category is required"),
  hashtags: z.string().optional().default(""),
});

export type HookAnalyzeRequest = z.infer<typeof hookAnalyzeRequestSchema>;

/**
 * Shape you pass into OpenAI / Apify / internal jobs — trimmed strings,
 * enums, and hashtag tokens instead of a single raw input string.
 */
export type NormalizedHookInput = {
  hook: string;
  platform: HookAnalyzeRequest["platform"];
  category: string;
  /** Tokens without #, suitable for Apify `hashtags` or similar APIs */
  hashtagTokens: string[];
};

export function normalizeHookAnalyzeRequest(
  body: HookAnalyzeRequest,
): NormalizedHookInput {
  const hashtagTokens = body.hashtags
    .split(/[,;\n]+/)
    .flatMap((chunk) => chunk.split(/\s+/))
    .map((t) => t.replace(/^#+/, "").trim())
    .filter(Boolean)
    .slice(0, 10);

  return {
    hook: body.hookText.trim(),
    platform: body.platform,
    category: body.category.trim(),
    hashtagTokens,
  };
}

/** Response payload for the results panel (replace with real model output later). */
export type HookAnalysisResult = {
  score: number;
  verdict: string;
  topic: string;
  category: string;
  summary: string;
  format: string;
  length: string;
  good: string[];
  bad: string[];
  tips: string[];
  benchmarks: { text: string; views: string }[];
};

/** Temporary stand-in until OpenAI + Apify drive this object. */
export function stubHookAnalysis(input: NormalizedHookInput): HookAnalysisResult {
  const preview =
    input.hook.length > 160 ? `${input.hook.slice(0, 160)}…` : input.hook;
  const tags =
    input.hashtagTokens.length > 0
      ? input.hashtagTokens.map((t) => `#${t}`).join(", ")
      : "(none)";

  return {
    score: 0,
    verdict: "Pipeline stub — APIs not wired yet",
    topic: input.category,
    category: input.category,
    summary: `Platform: ${input.platform}. Category: ${input.category}. Tags: ${tags}. Hook preview: ${preview}`,
    format: "—",
    length: "—",
    good: [
      `Normalized ${input.hashtagTokens.length} hashtag token(s) for downstream scrapers.`,
      "Request passed validation; safe to pass `input` to OpenAI / Apify.",
    ],
    bad: [
      "Scores and benchmarks are placeholders until the real analysis job runs.",
    ],
    tips: [
      "Next step: map `input.platform` to the correct Apify actor or dataset.",
      "Use `input.hashtagTokens` in Apify and `input.hook` in your OpenAI prompt.",
    ],
    benchmarks: [
      { text: "Example hook A", views: "—" },
      { text: "Example hook B", views: "—" },
    ],
  };
}
