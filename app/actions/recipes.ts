"use server";
import { supabase } from "../../lib/supabase";

export async function getCategorizedRecipes() {
  const { data: items, error } = await supabase.from("pantry_items").select("title");

  if (error || !items || items.length === 0) {
    return { heavyMeals: [], lightBites: [], desserts: [] };
  }

  // Format ingredients for the Spoonacular API
  const ingredientsString = items
    .map((item) => item.title.toLowerCase().trim().replace(/\s+/g, "+"))
    .join(",+");

  const apiKey = process.env.SPOONACULAR_API_KEY;

  try {
    // 1. Fetch top 20 recipes based on the pantry ingredients
    const findRes = await fetch(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientsString}&number=20&ranking=2&apiKey=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    
    if (!findRes.ok) throw new Error("Failed to fetch recipes");
    const recipes = await findRes.json();
    
    if (recipes.length === 0) {
      return { heavyMeals: [], lightBites: [], desserts: [] };
    }

    // 2. Fetch bulk information for these specific recipes to get their "dishTypes"
    const recipeIds = recipes.map((r: any) => r.id).join(",");
    const infoRes = await fetch(
      `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds}&apiKey=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    const detailedRecipes = await infoRes.json();

    // 3. Merge the missing/used ingredient data with the dish types
    const fullData = recipes.map((recipe: any) => {
      const details = detailedRecipes.find((d: any) => d.id === recipe.id);
      return { ...recipe, dishTypes: details?.dishTypes || [] };
    });

    // 4. Categorize into the new buckets
    const heavyMeals = fullData.filter((r: any) => 
      r.dishTypes.includes("main course") || r.dishTypes.includes("dinner")
    );
    
    const desserts = fullData.filter((r: any) => 
      r.dishTypes.includes("dessert") || r.dishTypes.includes("sweet")
    );
    
    const lightBites = fullData.filter((r: any) =>
      r.dishTypes.includes("snack") ||
      r.dishTypes.includes("appetizer") ||
      r.dishTypes.includes("side dish") ||
      (!r.dishTypes.includes("main course") && !r.dishTypes.includes("dessert")) // Fallback for uncategorized
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