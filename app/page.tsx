/* eslint-disable react/no-unescaped-entities */
import Navbar from "@/components/LandingPageNavabar";
import Footer from "@/components/Footer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Link from "next/link";

export default function HeroSection() {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main - section  */}
      <section className="pt-32 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-3xl md:text-3xl lg:text-7xl font-bold text-slate-800 mb-6 leading-tight">
              Is Your Brand Showing Up On{" "}
              <span className="bg-gradient-to-r from-slate-800 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                AI Search?
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              Be the first to track, benchmark, and optimize your brand's
              visibility across AI search engines. Don't just do SEO—master{" "}
              <span className="font-semibold text-indigo-500">
                Generative Engine Optimization
              </span>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/login">
                <button
                  className="group bg-slate-800 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-slate-900 ">                
                  Start Free Trial
                </button>
              </Link>
            </div>           
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            Stay Ahead in the AI Search Era
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-12 max-w-3xl mx-auto">
            AI-powered platforms like Perplexity, ChatGPT, and Google’s AI
            Overviews are shaping how users discover brands. With AI Search
            Tracker, you can finally measure your visibility, track competitors,
            and take action to lead in this new search landscape.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/70 backdrop-blur shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent text-lg">
                  Multi-Engine Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  Monitor your brand’s presence across leading AI-powered
                  platforms — all in one dashboard.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent text-lg">
                  Competitor Benchmarking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  See how your visibility compares against competitors and
                  identify opportunities to lead.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur shadow-md rounded-2xl">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent text-lg">
                  Actionable Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">
                  Track mentions, sentiment, and positioning trends — and
                  optimize your brand strategy for the AI era.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </>
  );
}
