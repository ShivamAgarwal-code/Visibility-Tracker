import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

const GEMINI_API = process.env.GEMINI_API;
const GOOGLE_SERP_API = process.env.GOOGLE_SERP_API;

export async function POST(req: NextRequest) {
  const { brandName } = await req.json();

  if (!brandName) {
    return NextResponse.json({ error: "brandName is required" }, { status: 400 });
  }

  const cacheKey = `serp:${brandName.toLowerCase()}`;

  try {
    // 1️⃣ Check Redis cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`✅ Returning cached SERP result for "${brandName}" from Redis.`);
      return NextResponse.json(JSON.parse(cached));
    } else {
      console.log(`❌ No cached SERP result found for "${brandName}".`);
    }

    // GOOGLE SERP FETCH
    const serpRes = await fetch(
      `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(brandName)}&api_key=${GOOGLE_SERP_API}`
    );
    const serpData = await serpRes.json().catch(() => null);

    // Combine top 5 SERP results
    interface OrganicResult {
      title: string;
      snippet: string;
      [key: string]: unknown;
    }
    const topResults: OrganicResult[] = serpData?.organic_results?.slice(0, 5) || [];
    const serpText = topResults.map((r: OrganicResult, i: number) => `Result ${i + 1}:\nTitle: ${r.title}\nSnippet: ${r.snippet}`).join('\n\n');

    // GEMINI ANALYSIS ON SERP 
    const serpPrompt = `Given the brand name \"${brandName}\", provide a detailed AI-powered brand analysis strictly as a JSON object with the following fields:

    {
      \"brand_visibility\": string,                     // textual description of brand visibility across AI-powered search results and platforms
      \"brand_visibility_score\": number,              // numeric score 0-100 representing overall visibility
      \"brand_mentions_count\": number,                // estimated number of mentions of the brand across AI platforms
      \"competitor_mentions\": string[],               // list of top competitors
      \"competitor_mentions_count\": {                 // estimated numeric mentions for top 3 competitors
        \"Competitor1\": number,
        \"Competitor2\": number,
        \"Competitor3\": number
      },
      \"brand_sentiment\": string,                     // overall sentiment: positive, neutral, negative
      \"brand_sentiment_breakdown\": {                // approximate percentages summing to 100
        \"positive\": number,
        \"neutral\": number,
        \"negative\": number
      },
      \"competitor_analysis\": string,                 // detailed competitor comparison as a Markdown bullet list (each competitor and their analysis as a separate bullet point, use '- ' for each bullet, no asterisks, no paragraph, no numbering)
    }

    Instructions:
    1. Provide textual description for brand_visibility based on AI search and platform presence.
    2. Provide numeric brand_visibility_score (0-100).
    3. Provide an estimated total mention count for the brand in brand_mentions_count.
    4. List major competitors in competitor_mentions.
    5. Estimate mentions for top 3 competitors in competitor_mentions_count.
    6. Summarize overall brand sentiment in brand_sentiment.
    7. Provide approximate percentages for positive, neutral, and negative sentiment in brand_sentiment_breakdown.
    8. competitor_analysis: Provide a detailed analysis of the brand's positioning and comparison with competitors as a Markdown bullet list (use '- ' for each competitor, no asterisks, no paragraph, no numbering).
    9. Only return valid JSON. If a field cannot be determined, use empty string, 0, or empty object.

    Top 5 Google search results:
    ${serpText}

    If you cannot find some fields, return them as empty or null. Only return valid JSON.`;

    const serpGeminiRes = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API || ''
        },
        body: JSON.stringify({ contents: [{ parts: [{ text: serpPrompt }] }] })
      }
    );

    const serpGeminiData = await serpGeminiRes.json().catch(() => null);
    let serpTextResponse = serpGeminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (serpTextResponse.startsWith('```')) serpTextResponse = serpTextResponse.replace(/```(json)?/g, '').trim();
    let googleSerpAnalysis = { brand_visibility: '', competitor_mentions: [], brand_sentiment: '', competitor_analysis: '' };
    try { googleSerpAnalysis = JSON.parse(serpTextResponse); } catch { }

    const responseData = {
      googleSerp: serpData,
      googleSerpAnalysis
    };

    // 3️Store in Redis with TTL 24 hours 
    await redis.set(cacheKey, JSON.stringify(responseData), "EX", 86400);
    console.log(`Cached SERP result for "${brandName}" in Redis (TTL: 24h)`);

    return NextResponse.json(responseData);

  } catch (error: unknown) {
    console.error('API call failed:', error);
    return NextResponse.json({ error: 'API call failed', details: (error as Error)?.message || String(error) });
  }
}