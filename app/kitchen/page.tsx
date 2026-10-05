import React from "react";
import { getCategorizedRecipes } from "../actions/recipes";
import Link from "next/link";
import SaveButton from "../components/SaveButton";

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
        
        {/* Changed positioning from -bottom-3 to top-3 right-3 */}
        <div className={`absolute top-3 right-3 border-2 text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-full shadow-md z-10 whitespace-nowrap ${tagColor}`}>
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
          <SaveButton recipeId={id} title={title} image={image} />
        </div>
      </div>
    </Link>
  );
};

export default async function KitchenPage() {
  const { heavyMeals, lightBites, desserts } = await getCategorizedRecipes();
  const hasNoRecipes = heavyMeals.length === 0 && lightBites.length === 0 && desserts.length === 0;

  return (
    <main className="p-8 pb-20 font-[family-name:var(--font-geist-sans)] max-w-7xl mx-auto bg-[#FCF8F5] min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl text-[#733D26] font-extrabold tracking-tight mb-2 text-brand-text">Kitchen</h1>
        <p className="text-brand-text/80 text-[#733D26] text-lg font-medium">Find your next meal based on your pantry.</p>
      </header>

      {hasNoRecipes && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C29D93] bg-[#FFBFCC]/20 py-20 text-center">
          <p className="text-xl font-bold text-[#AF8B87]">We need more ingredients!</p>
          <p className="mt-2 font-medium text-[#733D26]">Add items to your pantry to discover recipes.</p>
        </div>
      )}

      {heavyMeals.length > 0 && (
        <section className="mb-12 relative">
          <h2 className="text-2xl text-[#733D26] font-extrabold text-brand-text mb-6">Heavy Meals</h2>
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
          <h2 className="text-2xl text-[#733D26] font-extrabold text-brand-text mb-6">Light Bites</h2>
          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory">
            {lightBites.map((recipe: any) => (
              <RecipeCard id={recipe.id} key={recipe.id} title={recipe.title} image={recipe.image} usedCount={recipe.usedIngredientCount} missingCount={recipe.missedIngredientCount} />
            ))}
          </div>
        </section>
      )}

      {desserts.length > 0 && (
        <section className="mb-12 relative">
          <h2 className="text-2xl text-[#733D26] font-extrabold text-brand-text mb-6">Desserts</h2>
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