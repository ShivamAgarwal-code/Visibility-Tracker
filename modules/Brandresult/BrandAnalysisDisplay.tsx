import React from "react";
import BrandVisibilityCard from "./BrandVisibilityCard";
import BrandComparisonChart from "./BrandComparisonChart";
import BrandSentimentChart from "./BrandSentimentChart";
import AnalysisSummary from "./BrandAnalysis";
import Loading from "../../components/loading";

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
  competitor_sentiment?: Record<string, {
    positive?: number;
    neutral?: number;
    negative?: number;
  }>;
  competitor_analysis?: string;
  brand_analysis_summary?: string;
};

type BrandAnalysisDisplayProps = {
  geminiResults?: AnalysisData;
  serpResults?: AnalysisData;
  grokResults?: AnalysisData;
  loading: boolean;
  sheetStatus: null | "success" | "error";
  brandName?: string;
};


// // Helper function to format values for display
// function formatValue(value?: string | string[] | number | Record<string, number>): {
//   formatted: string;
//   isMarkdown: boolean;
// } {
//   let displayValue = "-";
//   let isMarkdownList = false;

//   if (Array.isArray(value) && value.length) {
//     displayValue = value.join(", ");
//   } else if (typeof value === "string" && value.trim()) {
//     displayValue = value;
//     if (/^(\s*- |\s*\d+\.)/m.test(value)) {
//       isMarkdownList = true;
//     }
//   } else if (typeof value === "number") {
//     displayValue = value.toString();
//   } else if (value && typeof value === "object") {
//     displayValue = Object.entries(value)
//       .map(([k, v]) => `${k}: ${v}`)
//       .join(", ");
//   }

//   return {
//     formatted: displayValue,
//     isMarkdown: isMarkdownList
//   };
// }

function renderModernLayout(title: string, data?: AnalysisData, brandName?: string) {
  if (!data) return null;

  return (
    <div className="mb-8 group">

      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {/* Brand Visibility Card */}
          <BrandVisibilityCard
            visibility={data.brand_visibility}
            score={data.brand_visibility_score}
          />

          {/* Brand Comparison Chart */}
          {data.competitor_mentions_count && (
            <BrandComparisonChart
              competitor_mentions_count={data.competitor_mentions_count}
              brand_mentions_count={data.brand_mentions_count}
              brandName={brandName}
            />
          )}

          {/* Brand Sentiment Card */}
          <BrandSentimentChart
            brandName={brandName}
            brandSentiment={data.brand_sentiment_breakdown}
            competitorSentiment={data.competitor_sentiment}
          />

          {/* Competitor Analysis and Summary */}
          <AnalysisSummary
            competitor_analysis={data.competitor_analysis}
            brand_analysis_summary={data.brand_analysis_summary}
          />
        </div>
      </div>
    </div >
  );
}

export default function BrandAnalysisDisplay({
  geminiResults,
  serpResults,
  grokResults,
  loading,
  brandName,
}: BrandAnalysisDisplayProps) {
  return (
    <div className="mt-8 space-y-8 min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-cyan-50/20">
      {loading && <Loading />}

      {geminiResults &&
        renderModernLayout("AI Brand Analysis Result (Gemini)", geminiResults, brandName)}

      {serpResults &&
        renderModernLayout("AI Brand Analysis Result (Google SERP)", serpResults, brandName)}

      {grokResults &&
        renderModernLayout("AI Brand Analysis Result (Grok)", grokResults, brandName)}
    </div>
  );
}