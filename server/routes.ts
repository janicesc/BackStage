import type { Express } from "express";
import { createServer, type Server } from "http";
import {
  hookAnalyzeRequestSchema,
  normalizeHookAnalyzeRequest,
  stubHookAnalysis,
} from "@shared/hookAnalysis";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  /**
   * Accepts the home-page form as JSON, validates it, and returns
   * `input` (normalized for OpenAI / Apify) plus a stub `analysis` until
   * the real pipeline is implemented.
   */
  app.post("/api/analyze-hook", (req, res) => {
    const parsed = hookAnalyzeRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid request body",
        issues: parsed.error.flatten(),
      });
    }

    const input = normalizeHookAnalyzeRequest(parsed.data);
    const analysis = stubHookAnalysis(input);

    if (process.env.NODE_ENV === "development") {
      console.log("[api/analyze-hook] normalized input:", JSON.stringify(input));
    }

    return res.json({ input, analysis });
  });

  return httpServer;
}
