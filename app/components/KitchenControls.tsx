"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function KitchenControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize the input with the current URL search term (if any)
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    
    // Push the new URL, triggering the server to re-fetch
    router.push(`/kitchen?${params.toString()}`);
  };

  const handleRefresh = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Create a random string to force Spoonacular to fetch a new offset
    params.set("r", Math.random().toString(36).substring(7));
    router.push(`/kitchen?${params.toString()}`);
  };

  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSearch} className="flex flex-1 max-w-md items-center gap-2">
        <input
          type="text"
          placeholder="Search for a recipe (e.g. Pasta)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border-2 border-[#F8B0C8] px-4 py-3 text-sm font-medium text-[#733D26] placeholder-[#AF8B87] focus:border-[#733D26] focus:outline-none"
        />
        <button 
          type="submit"
          className="flex shrink-0 items-center justify-center rounded-xl bg-[#FFBFCC] px-5 py-3 font-bold text-[#733D26] transition-colors hover:bg-[#F9D0DE]"
        >
          Search
        </button>
      </form>

      <button 
        onClick={handleRefresh}
        className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#C29D93] bg-white px-5 py-3 font-bold text-[#733D26] transition-colors hover:border-[#733D26] hover:bg-gray-50"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Refresh Ideas
      </button>
    </div>
  );
}