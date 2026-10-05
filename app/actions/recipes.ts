"use server";
import { supabase } from "../../lib/supabase";

export async function getCategorizedRecipes(searchQuery?: string, refreshKey?: string) {
  // 1. Fetch pantry items
  const { data: items, error } = await supabase.from("pantry_items").select("title");
  
  let ingredientsString = "";
  if (!error && items && items.length > 0) {
    ingredientsString = items
      .map((item) => item.title.toLowerCase().trim().replace(/\s+/g, "+"))
      .join(",+");
  }

  const apiKey = process.env.SPOONACULAR_API_KEY;
  
  // 2. Build the complexSearch URL
  // addRecipeInformation gets the dishTypes, fillIngredients gets the missing/used counts
  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&addRecipeInformation=true&fillIngredients=true&number=30`;

  // Filter by pantry ingredients if available
  if (ingredientsString) {
    url += `&includeIngredients=${ingredientsString}&sort=max-used-ingredients`;
  }

  // Add the search term if the user typed one
  if (searchQuery) {
    url += `&query=${encodeURIComponent(searchQuery)}`;
  }

  // Add a random offset if the user clicked Refresh Ideas
  if (refreshKey) {
    const randomOffset = Math.floor(Math.random() * 40);
    url += `&offset=${randomOffset}`;
  }

  try {
    // 3. Fetch from Spoonacular
    // If searching or refreshing, bypass the cache completely to ensure new results
    const fetchOptions: RequestInit = (searchQuery || refreshKey) 
      ? { cache: "no-store" } 
      : { next: { revalidate: 3600 } };

    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error("Failed to fetch recipes");
    
    const data = await res.json();
    const fullData = data.results || [];

    if (fullData.length === 0) {
      return { heavyMeals: [], lightBites: [], desserts: [] };
    }

    // 4. Categorize into buckets
    const heavyMeals = fullData.filter((r: any) => 
      r.dishTypes?.includes("main course") || r.dishTypes?.includes("dinner")
    );
    
    const desserts = fullData.filter((r: any) => 
      r.dishTypes?.includes("dessert") || r.dishTypes?.includes("sweet")
    );
    
    const lightBites = fullData.filter((r: any) =>
      r.dishTypes?.includes("snack") ||
      r.dishTypes?.includes("appetizer") ||
      r.dishTypes?.includes("side dish") ||
      (!r.dishTypes?.includes("main course") && !r.dishTypes?.includes("dessert"))
    );

    return {
      heavyMeals: heavyMeals.slice(0, 6),
      lightBites: lightBites.slice(0, 6),
      desserts: desserts.slice(0, 6),
    };
  } catch (err) {
    console.error("Recipe fetch error:", err);
    return { heavyMeals: [], lightBites: [], desserts: [] };
  }
}

export async function getRecipeDetails(id: string) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("Failed to fetch recipe details");
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}