import React from "react";
import { getCategorizedRecipes } from "../actions/recipes";
import Link from "next/link";

const RecipeCard = ({ 
  id,
  title, 
  image, 
  usedCount, 
  missingCount = 0 
}: { 
  id: number;
  title: string; 
  image: string; 
  usedCount: number; 
  missingCount?: number; 
}) => {
  // Dynamically update the tag and color based on missing ingredients
  const tag = missingCount === 0 ? "Ready to Cook" : `Missing ${missingCount}`;
  const tagColor = missingCount === 0 
    ? "bg-[#F9D0DE] border-brand-accent text-brand-text" 
    : "bg-red-100 border-red-300 text-red-700";

  return (
    <Link 
      href={`/recipe/${id}`}
      className="min-w-[280px] w-[280px] snap-start shrink-0 flex flex-col bg-white rounded-xl overflow-hidden border-2 border-brand-accent shadow-sm group hover:border-[#733D26] transition-colors cursor-pointer"
    >
      <div className="h-44 bg-brand-surface relative flex items-center justify-center overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 border-2 text-[10px] font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-sm z-10 whitespace-nowrap ${tagColor}`}>
          {tag}
        </div>
      </div>
      
      <div className="pt-8 pb-5 px-5 flex flex-col flex-1">
        <h3 className="font-extrabold text-lg text-brand-text leading-tight mb-2 line-clamp-2" title={title}>
          {title}
        </h3>
        
        <div className="flex items-center text-xs text-brand-text/80 mb-5 gap-2 font-medium">
          <span>{usedCount} {usedCount === 1 ? 'ingredient' : 'ingredients'} used</span>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          {/* Converted from <button> to <div> to prevent breaking the Link wrapper */}
          <div className="w-full py-2.5 border-2 border-brand-text rounded-xl font-bold text-brand-text group-hover:bg-brand-surface group-hover:border-brand-accent transition-colors flex items-center justify-center gap-2">
            Save Recipe
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}; // <-- This closing bracket and semicolon were missing

export default async function KitchenPage() {
  const { heavyMeals, lightBites, desserts } = await getCategorizedRecipes();
  const hasNoRecipes = heavyMeals.length === 0 && lightBites.length === 0 && desserts.length === 0;

  return (
    <main className="p-8 pb-20 font-[family-name:var(--font-geist-sans)] max-w-7xl mx-auto bg-[#FCF8F5] min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-brand-text">Kitchen</h1>
        <p className="text-brand-text/80 text-lg font-medium">Find your next meal based on your pantry.</p>
      </header>

      {hasNoRecipes && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C29D93] bg-[#FFBFCC]/20 py-20 text-center">
          <p className="text-xl font-bold text-[#AF8B87]">We need more ingredients!</p>
          <p className="mt-2 font-medium text-[#733D26]">Add items to your pantry to discover recipes.</p>
        </div>
      )}

      {heavyMeals.length > 0 && (
        <section className="mb-12 relative">
          <h2 className="text-2xl font-extrabold text-brand-text mb-6">Heavy Meals</h2>
          {/* Scroll-hiding classes removed. pb-6 allows the scrollbar to sit cleanly below the cards */}
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory">
            {heavyMeals.map((recipe: any) => (
              <RecipeCard id={recipe.id} key={recipe.id} title={recipe.title} image={recipe.image} usedCount={recipe.usedIngredientCount} missingCount={recipe.missedIngredientCount} />
            ))}
          </div>
        </section>
      )}

      {lightBites.length > 0 && (
        <section className="mb-12 relative">
          <h2 className="text-2xl font-extrabold text-brand-text mb-6">Light Bites</h2>
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory">
            {lightBites.map((recipe: any) => (
              <RecipeCard id={recipe.id} key={recipe.id} title={recipe.title} image={recipe.image} usedCount={recipe.usedIngredientCount} missingCount={recipe.missedIngredientCount} />
            ))}
          </div>
        </section>
      )}

      {desserts.length > 0 && (
        <section className="mb-12 relative">
          <h2 className="text-2xl font-extrabold text-brand-text mb-6">Desserts</h2>
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory">
            {desserts.map((recipe: any) => (
              <RecipeCard id={recipe.id} key={recipe.id} title={recipe.title} image={recipe.image} usedCount={recipe.usedIngredientCount} missingCount={recipe.missedIngredientCount} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}