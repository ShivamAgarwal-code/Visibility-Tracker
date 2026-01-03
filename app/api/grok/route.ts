import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import redis from '@/lib/redis';

const client = new OpenAI({
  apiKey: process.env.GROK_API,
  baseURL: 'https://api.groq.com/openai/v1',
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { brandName } = body;
    if (!brandName) {
      return NextResponse.json({ error: "brandName is required" }, { status: 400 });
    }

    const cacheKey = `grok:${brandName.toLowerCase()}`;

    // 1️⃣ Check Redis cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`✅ Returning cached result for "${brandName}" from Redis.`);
      return NextResponse.json({ output: JSON.parse(cached), cached: true }, { status: 200 });
    } else {
      console.log(`❌ No cached result found for "${brandName}".`);
    }

    // 2️⃣ Call Grok API if not cached
   const prompt = `Given the brand name \"${brandName}\", provide a detailed AI-powered brand analysis strictly as a JSON object with the following fields:

{
  "brand_visibility": string,
  "brand_visibility_score": number,
  "brand_mentions_count": number,
  "competitor_mentions": string[],
  "competitor_mentions_count": {
    "<CompetitorName1>": number,
    "<CompetitorName2>": number,
    "<CompetitorName3>": number
  },
  "brand_sentiment": string,
  "brand_sentiment_breakdown": {
    "positive": number,
    "neutral": number,
    "negative": number
  },
  "competitor_analysis": string, // detailed competitor comparison as a Markdown bullet list (each competitor and their analysis as a separate bullet point, use '- <CompetitorName>: <analysis>' for each bullet, no asterisks, no paragraph, no numbering)
}

Instructions:
1. Provide textual description for brand_visibility based on AI search and platform presence.
2. Provide numeric brand_visibility_score (0-100).
3. Provide an estimated total mention count for the brand in brand_mentions_count.
4. List major competitors in competitor_mentions.
5. For competitor_mentions_count, use the actual competitor names as keys, not "Competitor1".
6. Summarize overall brand sentiment in brand_sentiment.
7. Provide approximate percentages for positive, neutral, and negative sentiment in brand_sentiment_breakdown.
8. competitor_analysis: Provide a detailed analysis of the brand's positioning and comparison with competitors as a Markdown bullet list (use '- <CompetitorName>: <analysis>' for each competitor, no asterisks, no paragraph, no numbering).
9. Only return valid JSON. If a field cannot be determined, use empty string, 0, or empty object.`;

    const response = await client.responses.create({
      model: 'openai/gpt-oss-20b',
      input: prompt,
    });

    let text = response.output_text || "";
    if (text.startsWith("```")) text = text.replace(/```(json)?/g, "").trim();

    let extracted = { brand_visibility: "", competitor_mentions: [], brand_sentiment: "", competitor_analysis: "" };
    try { extracted = JSON.parse(text); } catch {
      console.log("⚠️ Failed to parse Grok response as JSON, returning empty object");
    }

    // 3️⃣ Store in Redis with TTL 24 hours (86400 seconds)
    await redis.set(cacheKey, JSON.stringify(extracted), "EX", 86400);
    console.log(`Cached result for "${brandName}" in Redis (TTL: 24h)`);

    return NextResponse.json({ output: extracted, cached: false }, { status: 200 });
  } catch (error) {
    console.error("API call failed:", error);
    return NextResponse.json({ error: 'An error occurred while fetching brand analysis' }, { status: 500 });
  }
};

export const GET = () =>
  NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });