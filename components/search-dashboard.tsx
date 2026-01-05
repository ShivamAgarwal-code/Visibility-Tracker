"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Zap, BookOpen } from "lucide-react"

interface SearchDashboardProps {
  onSearch: (category: string, brands: string[]) => Promise<void>
  isLoading: boolean
}

export default function SearchDashboard({ onSearch, isLoading }: SearchDashboardProps) {
  const [category, setCategory] = useState("")
  const [brandInput, setBrandInput] = useState("")
  const [brands, setBrands] = useState<string[]>([])
  const [showMethodology, setShowMethodology] = useState(false)

  const addBrand = () => {
    if (brandInput.trim() && !brands.includes(brandInput.trim())) {
      setBrands([...brands, brandInput.trim()])
      setBrandInput("")
    }
  }

  const removeBrand = (brand: string) => {
    setBrands(brands.filter((b) => b !== brand))
  }

  const handleSearch = async () => {
    if (category.trim() && brands.length > 0) {
      await onSearch(category, brands)
    }
  }

  const isValidForm = category.trim() && brands.length > 0 && !isLoading

  return (
    <div className="grid gap-8">
      {/* Main Form Card */}
      <Card className="relative p-10 border-2 border-border/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400/10 to-purple-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative space-y-8">
          {/* Category Input */}
          <div className="space-y-3">
            <label className="text-base font-bold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
              Product Category
            </label>
            <Input
              placeholder="e.g., CRM software, project management, AI tools"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isLoading}
              className="h-14 text-base border-2 border-border/50 focus:border-blue-500 dark:focus:border-blue-400 bg-white/80 dark:bg-slate-900/80 rounded-xl shadow-sm focus:shadow-lg transition-all duration-300"
            />
            <p className="text-sm text-muted-foreground font-medium">The product/service category you want to analyze</p>
          </div>

          {/* Brand Input Section */}
          <div className="space-y-4">
            <label className="text-base font-bold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600" />
              Brands to Track
            </label>
            <div className="flex gap-3">
              <Input
                placeholder="Enter brand name"
                value={brandInput}
                onChange={(e) => setBrandInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addBrand()}
                disabled={isLoading}
                className="h-14 text-base border-2 border-border/50 focus:border-purple-500 dark:focus:border-purple-400 bg-white/80 dark:bg-slate-900/80 rounded-xl shadow-sm focus:shadow-lg transition-all duration-300 flex-1"
              />
              <Button
                onClick={addBrand}
                disabled={!brandInput.trim() || isLoading}
                size="lg"
                className="h-14 px-6 gap-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Add</span>
              </Button>
            </div>

            {/* Brand Badges */}
            {brands.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-3">
                {brands.map((brand) => (
                  <Badge
                    key={brand}
                    className="gap-2 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    {brand}
                    <button
                      onClick={() => removeBrand(brand)}
                      className="hover:text-white/80 transition-colors ml-1 rounded-full hover:bg-white/20 p-0.5"
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleSearch}
            disabled={!isValidForm}
            size="lg"
            className="w-full h-16 gap-3 font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent" />
                <span>Analyzing AI Visibility...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                <span>Analyze AI Visibility</span>
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Info Box with Methodology Toggle */}
      <Card className="p-8 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-xl backdrop-blur-sm">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4 flex-1">
              <h3 className="font-bold text-xl text-foreground flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                  <Zap className="w-5 h-5" />
                </div>
                How it Works
              </h3>
              <ol className="text-sm text-muted-foreground space-y-3 list-decimal list-inside ml-2">
                <li className="font-medium">We generate 5 diverse prompts for your category</li>
                <li className="font-medium">Query Google Gemini AI with each unique prompt</li>
                <li className="font-medium">Extract and analyze brand mentions from responses</li>
                <li className="font-medium">Calculate visibility scores and citation distribution</li>
              </ol>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowMethodology(!showMethodology)}
              className="gap-2 whitespace-nowrap border-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Methodology</span>
              <span className="sm:hidden">Info</span>
            </Button>
          </div>

          {/* Methodology Details */}
          {showMethodology && (
            <div className="pt-6 border-t-2 border-blue-200/50 dark:border-blue-800/50 space-y-5 animate-in slide-in-from-top-2 duration-300">
              <div className="space-y-3">
                <h4 className="font-bold text-base text-foreground">Measurement Methodology</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our analysis tracks how frequently your brand appears in AI-generated responses. This metric is
                  crucial for understanding your brand's visibility in the era of AI-driven content discovery.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-base text-foreground">Key Metrics</h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside ml-2">
                  <li>
                    <strong className="text-foreground">Visibility Score:</strong> Percentage of brands mentioned across all prompts
                  </li>
                  <li>
                    <strong className="text-foreground">Citation Share:</strong> Relative mention frequency vs competitors
                  </li>
                  <li>
                    <strong className="text-foreground">Prompt Coverage:</strong> How many AI responses mentioned your brand
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
