"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

type AnalysisSummaryProps = {
  competitor_analysis?: string;
  brand_analysis_summary?: string;
};

// Add spacing between list items
function formatCompetitorAnalysis(text: string) {
  return text
    .replace(/\n-/g, "\n\n-") // ensure extra space before each new competitor
    .replace(/^(- \w+:)/gm, (_, match) => `**${match}**`); // bold names like "HP:"
}

// Add spacing for normal text
function formatWithSpacing(text: string) {
  return text.replace(/\n/g, "\n\n");
}

export default function AnalysisSummary({
  competitor_analysis,
}: AnalysisSummaryProps) {
  return (
    <div className="bg-gradient-to-br from-white to-slate-50/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 md:col-span-2 group/card">
      <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center mr-3 group-hover/card:scale-110 transition-transform duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        Competitor Analysis
      </h3>

      <div className="space-y-6">
        {/* Competitor Analysis */}
        {competitor_analysis && (
          <div>
           
            <div className="bg-gradient-to-r from-indigo-50/50 to-cyan-50/30 p-5 rounded-xl border border-indigo-200/30 shadow-sm">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>
                  {formatCompetitorAnalysis(competitor_analysis)}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Brand Analysis */}
        {/* {brand_analysis_summary && (
          <div>
            <div className="text-sm font-bold text-slate-700 mb-3 flex items-center">
              <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
              Brand Summary:
            </div>
            <div className="bg-gradient-to-r from-cyan-50/50 to-slate-50/30 p-5 rounded-xl border border-cyan-200/30 shadow-sm">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{formatWithSpacing(brand_analysis_summary)}</ReactMarkdown>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
