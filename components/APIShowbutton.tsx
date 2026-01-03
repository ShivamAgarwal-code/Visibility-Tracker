"use client";

import React from "react";
import Image from "next/image";

interface ApiSelectorProps {
  selectedApi: string;
  onSelect: (api: string) => void;
}

const apiOptions = [
  
  { name: "Gemini", icon: "/geminiapi.png" },
  { name: "Grok", icon: "/grokapi.png" },
  { name: "Google SERP", icon: "/googleserp.png" },
];
export default function ApiSelector({ selectedApi, onSelect }: ApiSelectorProps) {
  return (
    <div className="flex gap-4">
      {apiOptions.map((api) => (
        <button
          key={api.name}
          onClick={() => onSelect(api.name)}
          className={`flex items-center gap-2 p-2 rounded-md transition
            ${
              selectedApi === api.name
                ? "bg-gray-100 text-black"
                : "hover:bg-gray-50 text-gray-600"
            }`}
        >
          <Image 
            src={api.icon} 
            alt={`${api.name} icon`} 
            width={30} 
            height={30}
          />
          <span className={`text-sm font-medium ${selectedApi === api.name ? 'text-black' : 'text-slate-500'}`}>{api.name}</span>
        </button>
      ))}
    </div>
  );
}
