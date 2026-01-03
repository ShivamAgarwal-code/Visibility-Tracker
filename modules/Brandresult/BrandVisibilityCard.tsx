import React from "react";

type BrandVisibilityCardProps = {
  visibility?: string;
  score?: number;
};

export default function BrandVisibilityCard({ visibility, score }: BrandVisibilityCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-slate-200 p-4 sm:p-6 w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="truncate">Brand Visibility</span>
        </h3>

        {score !== undefined && (
          <div className="flex items-center justify-between sm:justify-end">
            <span className="text-xs sm:text-sm font-semibold text-slate-700 mr-2">
              Visibility Score
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md">
              {score}/100
            </span>
          </div>
        )}
      </div>

      {/* Visibility Text */}
      <div className="text-slate-700 mb-4 text-sm sm:text-base lg:text-lg font-medium bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-500 break-words">
        {visibility || "No visibility data available"}
      </div>
    </div>
  );
}
