"use client";
import React, { useState } from "react";
import { saveRecipe } from "../actions/planner";

export default function SaveButton({ recipeId, title, image }: { recipeId: number, title: string, image: string }) {
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the <Link> from triggering
    e.stopPropagation();
    if (saved) return;
    
    await saveRecipe(recipeId, title, image);
    setSaved(true);
  };

  return (
    <button 
      onClick={handleSave}
      className={`w-full py-2.5 border-2 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 ${
        saved 
          ? "bg-[#D1E7DD] border-[#0F5132] text-[#0F5132]" 
          : "border-brand-text text-brand-text group-hover:bg-brand-surface group-hover:border-brand-accent"
      }`}
    >
      {saved ? "Saved to Planner!" : "Save Recipe"}
      {!saved && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )}
    </button>
  );
}