import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials/credentials.json");
const SHEET_ID = "1ZExVbaNlkCZjLF_EpxJeeiU0ieo0VNU_U5bWt-APH4Q"; // Google Sheet ID

async function getSheetsClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
  return google.sheets({ version: "v4", auth });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Received body for Google Sheet:", body); // Debug log
  const sheets = await getSheetsClient();

  // Fallbacks for missing fields
  const userId = body.userId || "";
  const userEmail = body.userEmail || "";
  const gemini = body.gemini || {};
  const googleSerpAnalysis = body.googleSerpAnalysis || {};
  const grok = body.grok || {};

  // Helper to format text as paragraph
  function toParagraph(text: string | undefined) {
    if (!text) return "";
    return String(text).replace(/(\\n|\n)+/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Prepare Gemini row
  const geminiRow = [
    userId,
    userEmail,
    body.queryName || "",
    "Gemini",
    toParagraph(gemini.brand_visibility),
    (gemini.competitor_mentions || []).join(", "),
    toParagraph(gemini.brand_sentiment),
    toParagraph(gemini.competitor_analysis),
    new Date().toISOString(),
  ];

  // Prepare SERP row
  const serpRow = [
    userId,
    userEmail,
    body.queryName || "",
    "SERP",
    toParagraph(googleSerpAnalysis.brand_visibility),
    (googleSerpAnalysis.competitor_mentions || []).join(", "),
    toParagraph(googleSerpAnalysis.brand_sentiment),
    toParagraph(googleSerpAnalysis.competitor_analysis),
    new Date().toISOString(),
  ];

  // Prepare Grok row
  const grokRow = [
    userId,
    userEmail,
    body.queryName || "",
    "Grok",
    toParagraph(grok.brand_visibility),
    (grok.competitor_mentions || []).join(", "),
    toParagraph(grok.brand_sentiment),
    toParagraph(grok.competitor_analysis),
    new Date().toISOString(),
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1",
      valueInputOption: "RAW",
      requestBody: { values: [geminiRow, serpRow, grokRow] },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Google Sheets append error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error)?.message || error },
      { status: 500 }
    );
  }
}
