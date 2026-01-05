"use client"

import { useEffect, useState } from "react"
import SearchDashboard from "@/components/search-dashboard"
import AnalyticsDashboard from "@/components/analytics-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, BarChart3, Search, Download } from "lucide-react"

export default function Home() {
  const [reports, setReports] = useState<any[]>([])
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("search")

  useEffect(() => {
    const loadReports = async () => {
      try {
        const res = await fetch("/api/reports")
        if (res.ok) {
          const data = await res.json()
          setReports(data)
        }
      } catch (e) {
        console.error("History load failed", e)
      }
    }
    loadReports()
  }, [])

  const handleRunSearch = async (category: string, brands: string[]) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, brands }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze")
      }

      const data = await response.json()
      setReports([data, ...reports])
      setSelectedReport(data)
    } catch (error: any) {
      alert(error.message)
      console.error("Analysis error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleHistoryItemClick = (report: any) => {
    setSelectedReport(report)
    setActiveTab("analytics")
  }

  const handleExportPDF = async () => {
    if (!selectedReport) return
    try {
      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedReport),
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `report-${selectedReport.category.replace(/\s+/g, "-")}.pdf`
      a.click()
    } catch (error) {
      alert("Failed to export PDF")
    }
  }

  const handleExportCSV = () => {
    if (!selectedReport) return
    const csv = generateCSVContent(selectedReport)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `report-${selectedReport.category.replace(/\s+/g, "-")}.csv`
    a.click()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      {/* Header Section */}
      <div className="relative border-b border-border/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-md opacity-50 animate-pulse" />
                <div className="relative p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                  AI Visibility Tracker
                </h1>
                <p className="text-sm text-muted-foreground mt-1 font-medium">Enterprise-Grade AI Monitoring & Analytics</p>
              </div>
            </div>
            {selectedReport && activeTab === "analytics" && (
              <div className="flex gap-3">
                <button
                  onClick={handleExportPDF}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/50 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-semibold transform hover:scale-105"
                >
                  <Download className="w-4 h-4 group-hover:animate-bounce" />
                  PDF
                </button>
                <button
                  onClick={handleExportCSV}
                  className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/50 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-sm font-semibold transform hover:scale-105"
                >
                  <Download className="w-4 h-4 group-hover:animate-bounce" />
                  CSV
                </button>
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Discover how often your brand appears in AI-generated responses across multiple models
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-fit gap-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-1.5 border border-border/50 rounded-xl shadow-lg">
            <TabsTrigger 
              value="search" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-2.5 font-semibold transition-all duration-300"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">New Search</span>
              <span className="sm:hidden">Search</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-6 py-2.5 font-semibold transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Analysis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6 animate-in fade-in-50 duration-500">
            <SearchDashboard onSearch={handleRunSearch} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 animate-in fade-in-50 duration-500">
            {selectedReport ? (
              <AnalyticsDashboard report={selectedReport} />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border/50 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                <div className="p-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                  <BarChart3 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-foreground font-semibold text-lg mb-1">No analysis yet</p>
                <p className="text-sm text-muted-foreground">Run a search to view detailed analytics</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Recent Reports History */}
        {reports.length > 0 && (
          <div className="mt-16 space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                History
              </h2>
              <span className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-full font-semibold shadow-lg">
                {reports.length} report{reports.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid gap-4">
              {reports.map((report, idx) => (
                <button
                  key={idx}
                  onClick={() => handleHistoryItemClick(report)}
                  className="group text-left p-5 rounded-xl border border-border/50 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-bold text-lg text-foreground group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                        {report.category}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2 flex flex-wrap gap-2">
                        {report.brands?.map((brand: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium">
                            {brand}
                          </span>
                        )) || "No brands"}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap font-medium bg-muted px-3 py-1.5 rounded-lg">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function generateCSVContent(report: any): string {
  let csv = "AI Visibility Tracker Report\n"
  csv += `Category,${report.category}\n`
  csv += `Date,${new Date(report.createdAt).toLocaleDateString()}\n`
  csv += `Visibility Score,${report.visibilityScore?.toFixed(1) || 0}%\n\n`

  csv += "Brand,Mentions,Visibility %\n"
  const brandMentions: Record<string, number> = {}
  report.results?.forEach((result: any) => {
    result.mentions?.forEach((mention: any) => {
      brandMentions[mention.brand] = (brandMentions[mention.brand] || 0) + 1
    })
  })

  Object.entries(brandMentions)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .forEach(([brand, count]) => {
      const visibility = Math.round(((count as number) / (report.results?.length || 1)) * 100)
      csv += `${brand},${count},${visibility}%\n`
    })

  return csv
}
