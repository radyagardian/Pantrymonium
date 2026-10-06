import React from "react";
import { getCategorizedRecipes } from "../actions/recipes";
import Link from "next/link";
import SaveButton from "../components/SaveButton";
import KitchenControls from "../components/KitchenControls";

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

export default async function KitchenPage({ searchParams }: { searchParams: Promise<{ q?: string, r?: string }> }) {
  const resolvedParams = await searchParams;
  const isSearching = !!resolvedParams.q;
  
  // Destructure searchResults alongside the categories
  const { heavyMeals, lightBites, desserts, searchResults } = await getCategorizedRecipes(resolvedParams.q, resolvedParams.r);
  
  // Only show the empty pantry warning if we aren't actively searching
  const hasNoRecipes = !isSearching && heavyMeals.length === 0 && lightBites.length === 0 && desserts.length === 0;

  return (
    <main className="min-h-screen w-full bg-[#FCF8F5] p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-12">
        <h1 className="text-4xl text-[#733D26] font-extrabold tracking-tight mb-2 text-brand-text">Kitchen</h1>
        <p className="text-brand-text/80 text-[#733D26] text-lg font-medium">Find your next meal based on your pantry.</p>
      </header>

      <KitchenControls />

      {isSearching ? (
        // Grid View for active searches
        <div className="mt-8">
          <h2 className="text-2xl font-extrabold text-[#733D26] mb-6">Search Results for "{resolvedParams.q}"</h2>
          {searchResults && searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.map((recipe: any) => (
                <div key={recipe.id} className="flex justify-center">
                  <RecipeCard 
                    id={recipe.id}
                    title={recipe.title} 
                    image={recipe.image}
                    missingCount={recipe.missedIngredientCount || 0}
                    usedCount={recipe.usedIngredientCount || 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C29D93] bg-[#FFBFCC]/20 py-20 text-center">
              <p className="text-xl font-bold text-[#AF8B87]">No recipes found for "{resolvedParams.q}".</p>
            </div>
          )}
        </div>
      ) : (
        // Standard Categorized Rows View when NOT searching
        <>
          {hasNoRecipes && (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C29D93] bg-[#FFBFCC]/20 py-20 text-center">
              <p className="text-xl font-bold text-[#AF8B87]">We need more ingredients!</p>
              <p className="mt-2 font-medium text-[#733D26]">Add items to your pantry to discover recipes.</p>
            </div>
          )}

          {heavyMeals.length > 0 && (
            <section className="mb-12 relative">
              <h2 className="text-2xl text-[#733D26] font-extrabold text-brand-text mb-6">Heavy Meals</h2>
              <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
                {heavyMeals.map((recipe: any) => (
                  <RecipeCard 
                    id={recipe.id} 
                    key={recipe.id} 
                    title={recipe.title} 
                    image={recipe.image} 
                    usedCount={recipe.usedIngredientCount || 0} 
                    missingCount={recipe.missedIngredientCount || 0} 
                  />
                ))}
              </div>
            </section>
          )}

          {lightBites.length > 0 && (
            <section className="mb-12 relative">
              <h2 className="text-2xl text-[#733D26] font-extrabold text-brand-text mb-6">Light Bites</h2>
              <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
                {lightBites.map((recipe: any) => (
                  <RecipeCard 
                    id={recipe.id} 
                    key={recipe.id} 
                    title={recipe.title} 
                    image={recipe.image} 
                    usedCount={recipe.usedIngredientCount || 0} 
                    missingCount={recipe.missedIngredientCount || 0} 
                  />
                ))}
              </div>
            </section>
          )}

          {desserts.length > 0 && (
            <section className="mb-12 relative">
              <h2 className="text-2xl text-[#733D26] font-extrabold text-brand-text mb-6">Desserts</h2>
              <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
                {desserts.map((recipe: any) => (
                  <RecipeCard 
                    id={recipe.id} 
                    key={recipe.id} 
                    title={recipe.title} 
                    image={recipe.image} 
                    usedCount={recipe.usedIngredientCount || 0} 
                    missingCount={recipe.missedIngredientCount || 0} 
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}