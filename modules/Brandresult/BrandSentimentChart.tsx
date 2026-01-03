import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type SentimentBreakdown = {
  positive?: number;
  neutral?: number;
  negative?: number;
};

type CompetitorSentiment = Record<string, SentimentBreakdown>;

type BrandSentimentChartProps = {
  brandName?: string;
  brandSentiment?: SentimentBreakdown;
  competitorSentiment?: CompetitorSentiment;
};

const BrandSentimentChart: React.FC<BrandSentimentChartProps> = ({
  brandName,
  brandSentiment,
  competitorSentiment,
}) => {
  // Pivoted data → X-axis = sentiment, bars = brands
  const chartData = [
    {
      sentiment: "Positive",
      [brandName || "Your Brand"]: brandSentiment?.positive || 0,
      ...Object.fromEntries(
        Object.entries(competitorSentiment || {}).map(([name, s]) => [
          name,
          s.positive || 0,
        ])
      ),
    },
    {
      sentiment: "Neutral",
      [brandName || "Your Brand"]: brandSentiment?.neutral || 0,
      ...Object.fromEntries(
        Object.entries(competitorSentiment || {}).map(([name, s]) => [
          name,
          s.neutral || 0,
        ])
      ),
    },
    {
      sentiment: "Negative",
      [brandName || "Your Brand"]: brandSentiment?.negative || 0,
      ...Object.fromEntries(
        Object.entries(competitorSentiment || {}).map(([name, s]) => [
          name,
          s.negative || 0,
        ])
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="bg-gradient-to-br from-white to-slate-50/30 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200/50 md:col-span-2 group/card">
      <h3 className="text-xl font-semibold text-slate-800 flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center mr-3 group-hover/card:scale-110 transition-transform duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        Brand Sentiment
      </h3>

      {/* Chart */}
      <div className="w-full h-[300px] md:h-[400px] lg:h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 20, bottom: 20 }}
            barGap={8}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="sentiment" />
            <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
            <Tooltip
              formatter={(value: number, name: string) => [`${value}`, name]}
              labelFormatter={(label) => label}
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                borderColor: "#e2e8f0",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend verticalAlign="top" height={36} />

            {/* One Bar per brand → fixed sentiment colors */}
            {[
              brandName || "Your Brand",
              ...Object.keys(competitorSentiment || {}),
            ].map((brand, index) => (
              <Bar
                key={brand}
                dataKey={brand}
                radius={[4, 4, 0, 0]}
                className="opacity-90 hover:opacity-100"
                fill={
                  index % 3 === 0
                    ? "#7c83f8" // indigo-purple
                    : index % 3 === 1
                      ? "#67e8f9" // light-blue
                      : "#22d3ee" // teal
                }
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </div>
  );
};

export default BrandSentimentChart;
