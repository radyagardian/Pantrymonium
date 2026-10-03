
import React from "react";
import Link from "next/link";
import { getRecipeDetails } from "../../actions/recipes";

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Await the params before extracting the ID
  const resolvedParams = await params;
  
  // 2. Pass the resolved ID to your server action
  const recipe = await getRecipeDetails(resolvedParams.id);

  if (!recipe) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FCF8F5]">
        <h1 className="text-2xl font-bold text-[#733D26]">Recipe not found</h1>
      </main>
    );
  }

  // ... (Keep the rest of your return statement exactly the same)

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
          {/* Header Image */}
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
                <ul className="space-y-3">
                  {recipe.extendedIngredients?.map((ing: any) => (
                    <li key={ing.id} className="flex items-start gap-2 text-[#733D26]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#F8B0C8]" />
                      <span className="font-medium">{ing.original}</span>
                    </li>
                  ))}
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