/**
 * Verifies Zod parsing + normalization for POST /api/analyze-hook payloads.
 * Run: npx tsx script/verify-hook-input.ts
 */
import {
  hookAnalyzeRequestSchema,
  normalizeHookAnalyzeRequest,
} from "../shared/hookAnalysis.ts";

const cases: {
  name: string;
  body: unknown;
  expect: {
    hook: string;
    platform: string;
    category: string;
    hashtagTokens: string[];
  };
}[] = [
  {
    name: "typical form body",
    body: {
      hookText: "  My hook line  ",
      platform: "tiktok",
      category: "gaming",
      hashtags: "#foodtok, grwm  #setup",
    },
    expect: {
      hook: "My hook line",
      platform: "tiktok",
      category: "gaming",
      hashtagTokens: ["foodtok", "grwm", "setup"],
    },
  },
  {
    name: "empty hashtags",
    body: {
      hookText: "x",
      platform: "youtube",
      category: "  beauty  ",
      hashtags: "",
    },
    expect: {
      hook: "x",
      platform: "youtube",
      category: "beauty",
      hashtagTokens: [],
    },
  },
];

let failed = 0;
for (const c of cases) {
  const p = hookAnalyzeRequestSchema.safeParse(c.body);
  if (!p.success) {
    console.error("FAIL", c.name, "parse", p.error.flatten());
    failed++;
    continue;
  }
  const n = normalizeHookAnalyzeRequest(p.data);
  const ok =
    n.hook === c.expect.hook &&
    n.platform === c.expect.platform &&
    n.category === c.expect.category &&
    JSON.stringify(n.hashtagTokens) === JSON.stringify(c.expect.hashtagTokens);
  if (!ok) {
    console.error("FAIL", c.name, "got", n, "expected", c.expect);
    failed++;
  } else {
    console.log("OK ", c.name);
  }
}

const bad = hookAnalyzeRequestSchema.safeParse({
  hookText: "hi",
  platform: "twitter",
  category: "x",
});
if (bad.success) {
  console.error("FAIL invalid platform should reject");
  failed++;
} else {
  console.log("OK  invalid platform rejected");
}

process.exit(failed ? 1 : 0);
