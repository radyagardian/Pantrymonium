import React from "react";
import Link from "next/link";
import { getRecipeDetails } from "../../actions/recipes";
import { supabase } from "../../../lib/supabase"; // Import Supabase to check your live pantry

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // 1. Fetch the recipe details from Spoonacular
  const recipe = await getRecipeDetails(resolvedParams.id);

  // 2. Fetch your live pantry items from Supabase
  const { data: pantryData } = await supabase.from("pantry_items").select("title");
  
  // Clean up the pantry strings for easier matching (lowercase and trimmed)
  const pantryItems = (pantryData || []).map((item: any) => item.title.toLowerCase().trim());

  // Helper function: Checks if the recipe ingredient name matches anything in your pantry
  const checkInPantry = (ingredientName: string) => {
    if (!ingredientName) return false;
    const name = ingredientName.toLowerCase();
    // This allows "Milk" in your pantry to match "1 cup of whole milk" in the recipe
    return pantryItems.some((pantryItem: string) => 
      name.includes(pantryItem) || pantryItem.includes(name)
    );
  };

  if (!recipe) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FCF8F5]">
        <h1 className="text-2xl font-bold text-[#733D26]">Recipe not found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCF8F5] p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <div className="mx-auto max-w-4xl">
        <Link 
          href="/kitchen" 
          className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#AF8B87] transition-colors hover:text-[#733D26]"
        >
          ← Back to Kitchen
        </Link>

        <div className="overflow-hidden rounded-3xl border-2 border-[#F8B0C8] bg-white shadow-sm">
          <div className="relative h-72 w-full bg-[#F9D0DE] sm:h-96">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-8 sm:p-12">
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-[#733D26]">
              {recipe.title}
            </h1>
            
            <div className="mb-10 flex flex-wrap gap-4 text-sm font-bold text-[#733D26]">
              <span className="rounded-xl bg-[#FFBFCC]/30 px-4 py-2">
                ⏱ {recipe.readyInMinutes} mins
              </span>
              <span className="rounded-xl bg-[#FFBFCC]/30 px-4 py-2">
                🍽 {recipe.servings} servings
              </span>
            </div>

            <div className="grid gap-12 md:grid-cols-3">
              {/* Ingredients Sidebar */}
              <div className="md:col-span-1">
                <h2 className="mb-4 text-2xl font-extrabold text-[#733D26]">Ingredients</h2>
                <ul className="space-y-4">
                  {recipe.extendedIngredients?.map((ing: any, index: number) => {
                    // Check if we have this specific ingredient
                    const hasIt = checkInPantry(ing.name);
                    
                    return (
                      <li key={`${ing.id}-${index}`} className={`flex items-start gap-3 ${hasIt ? 'text-[#733D26]' : 'text-gray-500'}`}>
                        {hasIt ? (
                          // Green Checkmark for owned items
                          <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          // Red X for missing items
                          <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        <span className="font-medium">
                          {ing.original}
                          {!hasIt && (
                            <span className="ml-2 block text-[10px] font-black uppercase tracking-wider text-red-400 md:inline md:ml-2">
                              (Missing)
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Instructions Main Column */}
              <div className="md:col-span-2">
                <h2 className="mb-4 text-2xl font-extrabold text-[#733D26]">Instructions</h2>
                {recipe.analyzedInstructions?.[0]?.steps?.length > 0 ? (
                  <ol className="space-y-6">
                    {recipe.analyzedInstructions[0].steps.map((step: any) => (
                      <li key={step.number} className="flex gap-4 text-[#733D26]">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFBFCC] font-bold text-[#733D26]">
                          {step.number}
                        </span>
                        <p className="pt-1 font-medium leading-relaxed">{step.step}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="font-medium text-[#733D26]" dangerouslySetInnerHTML={{ __html: recipe.instructions || recipe.summary }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}