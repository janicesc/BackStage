import { z } from "zod";

/** User payload from the Home form (JSON body for /api/hook-analyze) */
export const hookAnalyzeRequestSchema = z.object({
  hook: z.string().min(1).max(2000).trim(),
  platform: z.enum(["tiktok", "instagram", "youtube"]),
  category: z.string().min(1).max(64).trim(),
  /** Raw hashtag field: "#a, #b" or "a, b" */
  hashtag: z.string().max(500).default("").transform((s) => s.trim()),
});

export type HookAnalyzeRequest = z.infer<typeof hookAnalyzeRequestSchema>;

export const hookScoreDimensionsSchema = z.object({
  curiosityGap: z.number().min(0).max(100),
  emotionalStakes: z.number().min(0).max(100),
  trendAlignment: z.number().min(0).max(100),
  pacingRhythm: z.number().min(0).max(100),
  specificity: z.number().min(0).max(100),
});

export const benchmarkItemSchema = z.object({
  text: z.string(),
  views: z.string(),
  url: z.string().url().optional(),
  platform: z.enum(["tiktok", "instagram", "youtube"]).optional(),
  postedAt: z.string().optional(),
});

/** LLM + UI: structured hook evaluation (RAG-friendly: plain JSON, no markdown wrapper) */
export const hookAnalysisResultSchema = z.object({
  score: z.number().min(0).max(100),
  verdict: z.string(),
  topic: z.string(),
  category: z.string(),
  summary: z.string(),
  format: z.string(),
  length: z.string(),
  good: z.array(z.string()),
  bad: z.array(z.string()),
  tips: z.array(z.string()),
  benchmarks: z.array(benchmarkItemSchema),
  dimensions: hookScoreDimensionsSchema,
});

export type HookAnalysisResult = z.infer<typeof hookAnalysisResultSchema>;
export type HookScoreDimensions = z.infer<typeof hookScoreDimensionsSchema>;

export const hookAnalyzeMetaSchema = z.object({
  schemaVersion: z.literal("hook_analysis_v1"),
  ragCompatible: z.literal(true),
  platform: z.enum(["tiktok", "instagram", "youtube"]),
  categoryKey: z.string(),
  marketItemsUsed: z.number(),
  apifyRunId: z.string().optional(),
  timeWindow: z.string(),
  confidence: z.enum(["high", "medium", "low"]),
  evidenceInsufficient: z.boolean().default(false),
  topPostUrls: z.array(z.string().url()).default([]),
  normalizationNotes: z.array(z.string()).default([]),
});

export const hookAnalyzeSuccessResponseSchema = z.object({
  ok: z.literal(true),
  analysis: hookAnalysisResultSchema,
  meta: hookAnalyzeMetaSchema,
});

export type HookAnalyzeSuccessResponse = z.infer<typeof hookAnalyzeSuccessResponseSchema>;

export type HookAnalyzeErrorCode =
  | "VALIDATION"
  | "CONFIG"
  | "PLATFORM_UNSUPPORTED"
  | "APIFY"
  | "LLM"
  | "EVIDENCE"
  | "PARSE";

export type HookAnalyzeErrorResponse = {
  ok: false;
  error: string;
  code: HookAnalyzeErrorCode;
  details?: unknown;
};

export type HookAnalyzeResponse =
  | HookAnalyzeSuccessResponse
  | HookAnalyzeErrorResponse;
