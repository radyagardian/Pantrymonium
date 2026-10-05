"use server";
import { supabase } from "../../lib/supabase";
import { revalidatePath } from "next/cache";


export async function saveRecipe(recipeId: number, title: string, image: string) {
  const { data, error } = await supabase
    .from("meal_plan_items")
    .insert([{ recipe_id: recipeId, title, image, day: "saved" }])
    .select()
    .single();

  if (error) {
    console.error("Error saving recipe:", error);
  } else {
    // 2. Tell Next.js to refresh the planner data
    revalidatePath("/planner"); 
  }
  
  return data;
}

export async function getMealPlanItems() {
  const { data, error } = await supabase.from("meal_plan_items").select("*");
  if (error) {
    console.error("Error fetching meal plan:", error);
    return [];
  }
  return data;
}

export async function moveMealPlanItem(id: string, day: string) {
  const { error } = await supabase
    .from("meal_plan_items")
    .update({ day })
    .eq("id", id);
  if (error) console.error("Error moving item:", error);
}

export async function deleteMealPlanItem(id: string) {
  const { error } = await supabase.from("meal_plan_items").delete().eq("id", id);
  if (error) console.error("Error deleting item:", error);
}