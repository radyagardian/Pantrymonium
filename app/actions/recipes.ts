import { supabase } from "../../lib/supabase";

export async function getCategorizedRecipes(searchQuery?: string, refreshKey?: string) {
  const { data: items, error } = await supabase.from("pantry_items").select("title");
  
  let ingredientsString = "";
  if (!error && items && items.length > 0) {
    ingredientsString = items
      .map((item) => item.title.toLowerCase().trim().replace(/\s+/g, "+"))
      .join(",+");
  }

  const apiKey = process.env.SPOONACULAR_API_KEY;
  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&addRecipeInformation=true&fillIngredients=true&number=30`;

  // If searching, prioritize the search term and DO NOT restrict by pantry ingredients
  if (searchQuery) {
    url += `&query=${encodeURIComponent(searchQuery)}`;
  } else if (ingredientsString) {
    // Only restrict to pantry items if they are browsing their recommendations
    url += `&includeIngredients=${ingredientsString}&sort=max-used-ingredients`;
  }

  if (refreshKey) {
    const randomOffset = Math.floor(Math.random() * 40);
    url += `&offset=${randomOffset}`;
  }

  try {
    const fetchOptions: RequestInit = (searchQuery || refreshKey) 
      ? { cache: "no-store" } 
      : { next: { revalidate: 3600 } };

    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error("Failed to fetch recipes");
    
    const data = await res.json();
    const fullData = data.results || [];

    if (fullData.length === 0) {
      return { heavyMeals: [], lightBites: [], desserts: [], searchResults: [] };
    }

    // Return the flat array for the grid view if a search is active
    if (searchQuery) {
      return { heavyMeals: [], lightBites: [], desserts: [], searchResults: fullData };
    }

    // Otherwise, categorize into the horizontal rows
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
      searchResults: []
    };
  } catch (err) {
    console.error("Recipe fetch error:", err);
    return { heavyMeals: [], lightBites: [], desserts: [], searchResults: [] };
  }

  
}

export async function getRecipeDetails(id: string) {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
    );
    if (!res.ok) throw new Error("Failed to fetch recipe details");
    return await res.json();
  } catch (err) {
    console.error("Error fetching recipe details:", err);
    return null;
  }
}