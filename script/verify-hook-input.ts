/**
 * Verifies Zod parsing for POST /api/hook-analyze payloads.
 * Run: npx tsx script/verify-hook-input.ts
 */
import { hookAnalyzeRequestSchema } from "../shared/hookAnalysis.ts";

const cases: {
  name: string;
  body: unknown;
  expect: {
    hook: string;
    platform: string;
    category: string;
    hashtag: string;
  };
}[] = [
  {
    name: "typical form body",
    body: {
      hook: "  My hook line  ",
      platform: "tiktok",
      category: "gaming",
      hashtag: "#foodtok, grwm  #setup",
    },
    expect: {
      hook: "My hook line",
      platform: "tiktok",
      category: "gaming",
      hashtag: "#foodtok, grwm  #setup",
    },
  },
  {
    name: "empty hashtags",
    body: {
      hook: "x",
      platform: "youtube",
      category: "  beauty  ",
      hashtag: "",
    },
    expect: {
      hook: "x",
      platform: "youtube",
      category: "beauty",
      hashtag: "",
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
  const ok =
    p.data.hook === c.expect.hook &&
    p.data.platform === c.expect.platform &&
    p.data.category === c.expect.category &&
    p.data.hashtag === c.expect.hashtag;
  if (!ok) {
    console.error("FAIL", c.name, "got", p.data, "expected", c.expect);
    failed++;
  } else {
    console.log("OK ", c.name);
  }
}

const bad = hookAnalyzeRequestSchema.safeParse({
  hook: "hi",
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
