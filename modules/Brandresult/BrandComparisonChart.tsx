"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type BrandComparisonChartProps = {
  competitor_mentions_count: Record<string, number>;
  brand_mentions_count?: number;
  brandName?: string;
  searchedBrand?: string;
};

function getChartColor(index: number) {
  const colors = [ 
   "#7c83f8", 
   "#67e8f9", 
   "#22d3ee",
  ];
  return colors[index % colors.length];
}

export default function BrandComparisonChart({
  competitor_mentions_count,
  brand_mentions_count,
  brandName,
  searchedBrand,
}: BrandComparisonChartProps) {
  const [urlBrandName, setUrlBrandName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const brandFromURL =
        searchParams.get("brand") ||
        window.location.pathname.split("/").filter(Boolean).pop() ||
        null;
      setUrlBrandName(brandFromURL);
    }
  }, []);

  if (
    !competitor_mentions_count ||
    Object.keys(competitor_mentions_count).length === 0
  )
    return null;

  // Build chart data
  const data = Object.entries(competitor_mentions_count).map(
    ([name, value], index) => ({
      name,
      value,
      fill: getChartColor(index + 1),
    })
  );

  // Add own brand if available
  if (brand_mentions_count) {
    data.unshift({
      name: brandName || searchedBrand || urlBrandName || "Brand",
      value: brand_mentions_count,
      fill: "#6366f1",
    });
  }

  return (
    <div className="rounded-xl p-6 shadow-lg border duration-300 group/card">
      <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        Brand Mentions
      </h3>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(1)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  strokeWidth={entry.name === (brandName || searchedBrand) ? 3 : 1}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [`${value}`, name]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

