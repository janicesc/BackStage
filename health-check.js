import 'dotenv/config';
import OpenAI from 'openai';

// 1. Setup OpenAI (The Brain)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 2. Setup Apify (The Researcher)
const APIFY_TOKEN = process.env.APIFY_TOKEN;

async function runHealthCheck() {
  console.log("🛠️ Starting Back Stage System Check...\n");

  // --- DEBUGGING LOGS ---
  console.log("🔍 DEBUG: OpenAI Key found?", process.env.OPENAI_API_KEY ? "Yes" : "No");
  console.log("🔍 DEBUG: Apify Token found?", process.env.APIFY_TOKEN ? "Yes" : "No");
  console.log("-----------------------------------\n");

  // --- TEST 1: OPENAI ---
  try {
    console.log("🧠 Testing OpenAI Brain...");
    const aiResponse = await openai.chat.completions.create({
      messages: [{ role: "user", content: "Say 'Brain Online'" }],
      model: "gpt-4o-mini",
    });
    console.log(`✅ OpenAI: ${aiResponse.choices[0].message.content}`);
  } catch (error) {
    console.error("❌ OpenAI Failed.");
    console.error(`Error: ${error.message}\n`);
  }

  // --- TEST 2: APIFY ---
  try {
    console.log("🔍 Testing Apify Researcher...");
    
    // The correct endpoint for running an actor is /v2/acts/
    const apifyResponse = await fetch(`https://api.apify.com/v2/acts/clockworks~tiktok-scraper/runs?token=${APIFY_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        "hashtags": ["gaming"], 
        "resultsPerPage": 1 
      })
    });

    if (apifyResponse.ok) {
      console.log("✅ Apify: Scraper connection live!");
    } else {
      const errorData = await apifyResponse.json();
      throw new Error(errorData.error?.message || "Invalid Token or No Credits");
    }
  } catch (error) {
    console.error("❌ Apify Failed.");
    console.error(`Error: ${error.message}`);
  }

  console.log("\n🏁 Check Complete.");
}

runHealthCheck();