import React from "react";

// Reusable Recipe Card Component
const RecipeCard = ({ 
  title, 
  tag, 
  time, 
  rating, 
  missing = 0 
}: { 
  title: string; 
  tag: string; 
  time: string; 
  rating: string; 
  missing?: number; 
}) => (
  <div className="min-w-[280px] w-[280px] snap-start shrink-0 flex flex-col bg-white rounded-xl overflow-hidden border-2 border-brand-accent shadow-sm group">
    
    {/* Image Placeholder */}
    <div className="h-44 bg-brand-surface relative flex items-center justify-center">
      <span className="text-brand-text/50 font-bold tracking-widest uppercase">Image</span>
      
      {/* Overlapping Category Tag[cite: 15] */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#F9D0DE] border-2 border-brand-accent text-brand-text text-[10px] font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-sm z-10 whitespace-nowrap">
        {tag}
      </div>
    </div>
    
    {/* Card Content[cite: 15] */}
    <div className="pt-8 pb-5 px-5 flex flex-col flex-1">
      <h3 className="font-extrabold text-lg text-brand-text leading-tight mb-2 line-clamp-2">
        {title}
      </h3>
      
      <div className="flex items-center text-xs text-brand-text/80 mb-5 gap-2 font-medium">
        <span>{rating}</span>
        <span>•</span>
        <span>{time}</span>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        {/* Missing Ingredients Warning for "Close Enough" row */}
        {missing > 0 && (
          <span className="text-xs font-bold text-red-400 bg-red-50 px-2 py-1 rounded-md text-center border border-red-100">
            Missing {missing} {missing === 1 ? 'ingredient' : 'ingredients'}
          </span>
        )}
        
        {/* Save Recipe Button[cite: 15] */}
        <button className="w-full py-2.5 border-2 border-brand-text rounded-xl font-bold text-brand-text hover:bg-brand-surface hover:border-brand-accent transition-colors flex items-center justify-center gap-2">
          Save Recipe
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export default function KitchenPage() {
  return (
    <main className="p-8 pb-20 font-[family-name:var(--font-geist-sans)] max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-brand-text">Kitchen</h1>
        <p className="text-brand-text/80 text-lg font-medium">Find your next meal based on your pantry.</p>
      </header>

      {/* Mains Row */}
      <section className="mb-12 relative">
        <h2 className="text-2xl font-extrabold text-brand-text mb-6">Mains</h2>
        {/* The classes below create the horizontal swipe without visible scrollbars */}
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <RecipeCard title="Baked Italian Chicken Rollatini" tag="Dinner Winner" rating="★★★★½ (10)" time="50 mins" />
          <RecipeCard title="Mississippi Sloppy Joes" tag="Kid-Pleaser" rating="★★★★☆ (21)" time="20 mins" />
          <RecipeCard title="Buffalo Chicken and Potatoes" tag="Must-Try Meal" rating="★★★★★ (376)" time="1 hr 20 mins" />
          <RecipeCard title="Garlic Butter Steak Bites" tag="Quick Fix" rating="★★★★½ (85)" time="15 mins" />
          <RecipeCard title="Creamy Tuscan Salmon" tag="Date Night" rating="★★★★★ (142)" time="30 mins" />
        </div>
      </section>

      {/* Dessert Row */}
      <section className="mb-12 relative">
        <h2 className="text-2xl font-extrabold text-brand-text mb-6">Dessert</h2>
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <RecipeCard title="Apple Butter Cinnamon Rolls" tag="Seasonal Treat" rating="★★★★★ (4)" time="11 hrs" />
          <RecipeCard title="Classic Tiramisu" tag="Crowd Favorite" rating="★★★★½ (92)" time="4 hrs" />
          <RecipeCard title="Fudgy Brownies" tag="Chocoholic" rating="★★★★★ (512)" time="45 mins" />
          <RecipeCard title="Lemon Pound Cake" tag="Sweet & Tart" rating="★★★★☆ (45)" time="1 hr 10 mins" />
        </div>
      </section>

      {/* Close Enough Row (Missing 1-3 Ingredients) */}
      <section className="mb-12 relative">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-brand-text mb-1">Close Enough</h2>
          <p className="text-brand-text/70 text-sm font-medium">You are just a few ingredients away from making these.</p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <RecipeCard title="Beef Stroganoff" tag="Comfort Food" rating="★★★★½ (34)" time="40 mins" missing={1} />
          <RecipeCard title="Shrimp Scampi Pasta" tag="Seafood" rating="★★★★★ (112)" time="25 mins" missing={2} />
          <RecipeCard title="Chicken Tikka Masala" tag="Spicy" rating="★★★★☆ (88)" time="1 hr" missing={3} />
          <RecipeCard title="Vegetarian Chili" tag="Healthy" rating="★★★★½ (67)" time="45 mins" missing={1} />
        </div>
      </section>
    </main>
  );
}