"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Eye, TrendingUp, Share2, Award, AlertCircle, CheckCircle, Download } from "lucide-react"

interface AnalyticsDashboardProps {
  report: any
}

export default function AnalyticsDashboard({ report }: AnalyticsDashboardProps) {
  const handleExportPDF = async () => {
    try {
      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
      })

      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `report-${report.category.replace(/\s+/g, "-")}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("PDF export error:", error)
      alert("Failed to export PDF. Please try again.")
    }
  }

  if (!report) return null

  // Calculate metrics
  const totalPrompts = report.results?.length || 0
  const brandMentions: Record<string, number> = {}
  const mentionDetails: Array<{ prompt: string; brand: string | null; context: string }> = []

  report.results?.forEach((result: any) => {
    result.mentions?.forEach((mention: any) => {
      brandMentions[mention.brand] = (brandMentions[mention.brand] || 0) + 1
      mentionDetails.push({
        prompt: result.prompt,
        brand: mention.brand,
        context: mention.context || "Mentioned",
      })
    })
  })

  const leaderboardData = Object.entries(brandMentions)
    .map(([brand, count]) => ({
      brand,
      mentions: count,
      visibility: Math.round((count / totalPrompts) * 100),
    }))
    .sort((a, b) => b.mentions - a.mentions)

  const brandColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"]

  const getInsights = () => {
    const insights = []
    const topBrand = leaderboardData[0]
    const yourBrands = report.brands || []

    if (topBrand) {
      insights.push({
        icon: TrendingUp,
        title: "Market Leader",
        description: `${topBrand.brand} dominates with ${topBrand.visibility}% visibility`,
        color: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
        type: "success",
      })
    }

    const mentionedBrands = Object.keys(brandMentions)
    const unmentionedCount = yourBrands.length - mentionedBrands.length

    if (unmentionedCount > 0) {
      insights.push({
        icon: AlertCircle,
        title: "Content Gap",
        description: `${unmentionedCount} brand(s) need visibility improvement in AI responses`,
        color: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
        type: "warning",
      })
    }

    if (leaderboardData.length > 0) {
      const avgVisibility = leaderboardData.reduce((a, b) => a + b.visibility, 0) / leaderboardData.length
      insights.push({
        icon: CheckCircle,
        title: "Market Saturation",
        description: `Average visibility: ${Math.round(avgVisibility)}% across all tracked brands`,
        color: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
        type: "info",
      })
    }

    return insights
  }

  const insights = getInsights()

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
            Analytics Report
          </h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">{report.category}</p>
        </div>
        <button
          onClick={handleExportPDF}
          className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105"
        >
          <Download className="w-5 h-5 group-hover:animate-bounce" />
          Export as PDF
        </button>
      </div>

      {/* AI Insights section */}
      {insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {insights.map((insight, idx) => {
            const Icon = insight.icon
            return (
              <Card key={idx} className={`p-6 rounded-xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${insight.color} backdrop-blur-sm`}>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-white/50 dark:bg-black/20 shadow-md">
                    <Icon className="w-6 h-6 flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-base mb-1">{insight.title}</p>
                    <p className="text-sm mt-1 opacity-90 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative p-8 bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent dark:from-blue-950/40 dark:via-blue-900/20 border-2 border-blue-300/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">AI Visibility Score</p>
              <p className="text-5xl font-extrabold mt-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                {report.visibilityScore?.toFixed(1) || "0"}%
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">Overall brand visibility</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
              <Eye className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="relative p-8 bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-transparent dark:from-purple-950/40 dark:via-purple-900/20 border-2 border-purple-300/50 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Prompts Tracked</p>
              <p className="text-5xl font-extrabold mt-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                {totalPrompts}
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">Diverse AI prompts analyzed</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>

        <Card className="relative p-8 bg-gradient-to-br from-pink-500/10 via-pink-400/5 to-transparent dark:from-pink-950/40 dark:via-pink-900/20 border-2 border-pink-300/50 dark:border-pink-700/50 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Brands Competing</p>
              <p className="text-5xl font-extrabold mt-3 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-400">
                {report.brands?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-2 font-medium">Brands in analysis</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg">
              <Share2 className="w-7 h-7 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Citation Share Leaderboard */}
      {leaderboardData.length > 0 && (
        <Card className="p-8 border-2 border-border/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Citation Share Leaderboard
              </h2>
              <p className="text-sm text-muted-foreground mt-2 font-medium">Brand mentions across AI responses</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="space-y-4">
            {leaderboardData.map((item, idx) => (
              <div
                key={item.brand}
                className="flex items-center justify-between p-5 rounded-xl border-2 border-border/30 bg-gradient-to-r from-white/50 to-white/30 dark:from-slate-700/50 dark:to-slate-700/30 hover:from-white dark:hover:from-slate-700 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] backdrop-blur-sm"
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-xl font-extrabold text-lg shadow-lg ${
                    idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                    idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                    idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                    'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">{item.brand}</p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">{item.mentions} mention{item.mentions !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <Badge className="gap-2 px-4 py-2 text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-md rounded-lg">
                  {item.visibility}% visible
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {leaderboardData.length > 0 && (
          <Card className="p-8 border-2 border-border/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl">
            <h3 className="font-bold text-xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Brand Mentions Distribution
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={leaderboardData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis 
                  dataKey="brand" 
                  stroke="var(--muted-foreground)" 
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis 
                  stroke="var(--muted-foreground)"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--card)", 
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                  }} 
                />
                <Bar 
                  dataKey="mentions" 
                  fill="url(#colorGradient)" 
                  radius={[12, 12, 0, 0]}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {leaderboardData.length > 0 && (
          <Card className="p-8 border-2 border-border/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl">
            <h3 className="font-bold text-xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Citation Share Distribution
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={leaderboardData}
                  dataKey="mentions"
                  nameKey="brand"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {leaderboardData.map((_, idx) => (
                    <Cell 
                      key={`cell-${idx}`} 
                      fill={brandColors[idx % brandColors.length]}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "var(--card)", 
                    border: "2px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      {/* Detailed Results */}
      <Card className="p-8 border-2 border-border/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl">
        <h2 className="text-2xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          Detailed AI Response Analysis
        </h2>
        <div className="space-y-5">
          {report.results?.map((result: any, idx: number) => (
            <div
              key={idx}
              className="border-2 border-border/30 rounded-xl p-6 bg-gradient-to-br from-white/50 to-white/30 dark:from-slate-700/50 dark:to-slate-700/30 hover:from-white dark:hover:from-slate-700 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-base font-bold shadow-lg">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Prompt Analysis</p>
                  <p className="text-base italic text-foreground font-medium leading-relaxed">"{result.prompt}"</p>
                </div>
              </div>

              {result.mentions && result.mentions.length > 0 ? (
                <div className="space-y-3 ml-14">
                  {result.mentions.map((mention: any, midx: number) => (
                    <div
                      key={midx}
                      className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 p-4 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                          {mention.brand}
                        </span>
                        {mention.context && (
                          <span className="text-sm text-muted-foreground font-medium">— {mention.context}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ml-14 text-sm text-muted-foreground italic font-medium p-3 bg-muted/50 rounded-lg">
                  No brands mentioned in this response
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
