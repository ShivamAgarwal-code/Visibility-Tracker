import { useEffect, useState } from "react";
import BrandAnalysisDisplay from "./BrandAnalysisDisplay";

type AnalysisData = {
  brand_visibility?: string;
  brand_visibility_score?: number;
  brand_mentions_count?: number;
  competitor_mentions?: string[];
  competitor_mentions_count?: Record<string, number>;
  brand_sentiment?: string;
  brand_sentiment_breakdown?: {
    positive?: number;
    neutral?: number;
    negative?: number;
  };
  competitor_analysis?: string;
  brand_analysis_summary?: string;
};

type ApiResult = {
  gemini?: AnalysisData;
  googleSerpAnalysis?: AnalysisData;
  grok?: AnalysisData;
};

type Props = { brandName: string; selectedApi: string };

// Helpers 
const normalize = (obj: unknown): AnalysisData => {
  const data = obj as Partial<AnalysisData> | undefined;
  return {
    brand_visibility: data?.brand_visibility || "",
    brand_visibility_score: typeof data?.brand_visibility_score === "number" ? data.brand_visibility_score : 0,
    brand_mentions_count: typeof data?.brand_mentions_count === "number" ? data.brand_mentions_count : 0,
    competitor_mentions: Array.isArray(data?.competitor_mentions) ? data.competitor_mentions : [],
    competitor_mentions_count: typeof data?.competitor_mentions_count === "object" && data?.competitor_mentions_count !== null ? data.competitor_mentions_count : {},
    brand_sentiment: data?.brand_sentiment || "",
    brand_sentiment_breakdown: typeof data?.brand_sentiment_breakdown === "object" && data?.brand_sentiment_breakdown !== null ? data.brand_sentiment_breakdown : {},
    competitor_analysis: data?.competitor_analysis || "",
    brand_analysis_summary: data?.brand_analysis_summary || "",
  };
};

const fetchApi = async (url: string, brandName: string, key: keyof ApiResult) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brandName }),
  });
  const data = await res.json();
  if (key === "grok") {
    try {
      return { [key]: typeof data.output === "string" ? JSON.parse(data.output) : data.output };
    } catch {
      return { [key]: data.output || data };
    }
  }
  return data;
};

// ---------- Component ----------
export default function BrandAnalysisResult({ brandName, selectedApi }: Props) {
  const [state, setState] = useState<{
    gemini: ApiResult | null;
    serp: ApiResult | null;
    grok: ApiResult | null;
    loading: boolean;
    sheetStatus: null | "success" | "error";
    stored: boolean;
  }>({ gemini: null, serp: null, grok: null, loading: false, sheetStatus: null, stored: false });

  // reset storage flag when brandName changes
  useEffect(() => setState((s) => ({ ...s, stored: false })), [brandName]);

  // fetch APIs
  useEffect(() => {
    if (!brandName) return setState((s) => ({ ...s, gemini: null, serp: null, grok: null }));

    (async () => {
      setState((s) => ({ ...s, loading: true }));
      const [g, sData, gr] = await Promise.all([
        fetchApi("/api/gemini", brandName, "gemini"),
        fetchApi("/api/serp", brandName, "googleSerpAnalysis"),
        fetchApi("/api/grok", brandName, "grok"),
      ]);
      setState((s) => ({ ...s, gemini: g, serp: sData, grok: gr, loading: false }));
    })();
  }, [brandName]);

  // save to Google Sheets
  useEffect(() => {
    const { gemini, serp, grok, loading, stored } = state;
    if (!brandName || !gemini || !serp || loading || stored) return;

    const userId = localStorage.getItem("userId") || "";
    let userEmail = localStorage.getItem("userEmail") || "";
    if (!userEmail) {
      try {
        userEmail = JSON.parse(localStorage.getItem("user") || "{}").email || "";
      } catch {}
    }

    const payload = {
      userId,
      userEmail,
      queryName: brandName,
      gemini: normalize(gemini.gemini),
      googleSerpAnalysis: normalize(serp.googleSerpAnalysis),
      grok: normalize(grok?.grok),
    };

    (async () => {
      try {
        const res = await fetch("/api/google-sheet", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setState((s) => ({
          ...s,
          sheetStatus: res.ok ? "success" : "error",
          stored: res.ok,
        }));
      } catch {
        setState((s) => ({ ...s, sheetStatus: "error" }));
      }
    })();
  }, [brandName, state.gemini, state.serp, state.grok, state.loading, state.stored]);

  // Helper to get normalized data for display
  const getDisplayData = () => {
    return {
      gemini: state.gemini ? normalize(state.gemini.gemini) : undefined,
      serp: state.serp ? normalize(state.serp.googleSerpAnalysis) : undefined,
      grok: state.grok ? normalize(state.grok.grok) : undefined,
    };
  };

  if (!brandName) return null;

  const displayData = getDisplayData();

  return (
    <BrandAnalysisDisplay
      geminiResults={selectedApi === "All" || selectedApi === "Gemini" ? displayData.gemini : undefined}
      serpResults={selectedApi === "All" || selectedApi === "Google SERP" ? displayData.serp : undefined}
      grokResults={selectedApi === "All" || selectedApi === "Grok" ? displayData.grok : undefined}
      loading={state.loading}
      sheetStatus={state.sheetStatus}
      brandName={brandName}
    />
  );
}
