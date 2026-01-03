"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandAnalysisResult from "@/modules/Brandresult/BrandAnalysisResult";
import { useQueriesLeft } from "@/modules/queries/hooks/useQueriesLeft";
import SearchButton from "@/components/SearchButton";
import ApiSelector from "@/components/APIShowbutton";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [searchedBrand, setSearchedBrand] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedApi, setSelectedApi] = useState<string>("All");

  const { queriesLeft, fetchQueries } = useQueriesLeft({ userId });

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthenticated(true);
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.id);
      } catch (e) {
        setUserId(null);
      }
    }
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />

      <section className=" pt-20 pb-16 overflow-hidden min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Info Section */}
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
              Track Your Brand&apos;s Visibility Across{" "}
              <span className="whitespace-nowrap bg-gradient-to-r from-slate-800 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                AI Search Engines
              </span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
              Enter your brand name to perform an AI-powered analysis
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Input + Search Button */}
              <div className="flex w-full md:w-auto max-w-sm mx-auto md:mx-0">
                <input
                  type="text"
                  placeholder="Enter your brand name.."
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-slate-800 text-sm"
                />
                <div className="flex-shrink-0 pl-5">
                  <SearchButton
                    brandName={brandName}
                    userId={userId}
                    queriesLeft={queriesLeft}
                    setSearchedBrand={setSearchedBrand}
                    refreshQueries={fetchQueries}
                    selectedApi={selectedApi}
                    setSelectedApi={setSelectedApi}
                  />
                </div>
              </div>

              {/* API Selector */}
              <div className="w-full md:w-auto flex justify-center md:justify-start">
                <ApiSelector selectedApi={selectedApi} onSelect={setSelectedApi} />
              </div>
            </div>
          </div>

          {/* Results Section */}
          {searchedBrand && (
            <div className="mt-8 px-4 sm:px-6 lg:px-40">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="inline-block">
                    <span className="text-2xl md:text-3xl font-bold whitespace-nowrap bg-gradient-to-r from-slate-800 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                      Results for {searchedBrand}
                    </span>
                    <div className="h-1 w-full mt-1 rounded bg-gradient-to-r from-slate-800 via-indigo-500 to-cyan-500"></div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <BrandAnalysisResult
                    brandName={searchedBrand}
                    selectedApi={selectedApi}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
