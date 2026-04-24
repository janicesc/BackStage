import type { Express } from "express";
import { type Server } from "http";
import { hookAnalyzeRequestSchema, type HookAnalyzeErrorCode } from "@shared/hookAnalysis";
import { runHookAnalysis } from "./hookAnalysisService";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.post("/api/hook-analyze", async (req, res) => {
    const parsed = hookAnalyzeRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        code: "VALIDATION" as const,
        error: "Invalid request body",
        details: parsed.error.flatten(),
      });
    }

    try {
      const { analysis, meta } = await runHookAnalysis(parsed.data);
      return res.json({
        ok: true as const,
        analysis,
        meta: {
          schemaVersion: meta.schemaVersion,
          ragCompatible: meta.ragCompatible,
          platform: parsed.data.platform,
          categoryKey: parsed.data.category,
          marketItemsUsed: meta.marketItemsUsed,
          apifyRunId: meta.apifyRunId,
          timeWindow: meta.timeWindow,
          confidence: meta.confidence,
          evidenceInsufficient: meta.evidenceInsufficient,
          topPostUrls: meta.topPostUrls,
          normalizationNotes: meta.normalizationNotes,
        },
      });
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      const code = (err as { code?: string }).code;
      const status =
        code === "CONFIG"
          ? 503
          : code === "EVIDENCE"
            ? 422
          : code === "VALIDATION" || code === "PLATFORM_UNSUPPORTED"
            ? 400
            : 502;
      const errorCode: HookAnalyzeErrorCode =
        code === "CONFIG" ||
        code === "VALIDATION" ||
        code === "PLATFORM_UNSUPPORTED" ||
        code === "PARSE" ||
        code === "LLM" ||
        code === "EVIDENCE" ||
        code === "APIFY"
          ? code
          : "APIFY";

      return res.status(status).json({
        ok: false as const,
        code: errorCode,
        error: err.message,
      });
    }
  });

  return httpServer;
}
