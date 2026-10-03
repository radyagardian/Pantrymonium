// app/actions/pantry.ts
"use server";

import { supabase } from "../../lib/supabase";

// 1. Fetch initial data on page load
export async function fetchPantryBoard() {
  const { data: categories } = await supabase
    .from("pantry_categories")
    .select("*")
    .order("created_at", { ascending: true });

  const { data: items } = await supabase
    .from("pantry_items")
    .select("*")
    .order("created_at", { ascending: true });

  return {
    categories: categories || [],
    // Map database 'category_id' to 'column' so it matches your existing Kanban props
    items: (items || []).map((item) => ({
      id: item.id,
      title: item.title,
      column: item.category_id,
    })),
  };
}

// 2. Category Actions
export async function addCategory(id: string, title: string) {
  const { error } = await supabase.from("pantry_categories").insert([{ id, title }]);
  if (error) console.error("Add category error:", error);
}

export async function renameCategory(id: string, newTitle: string) {
  const { error } = await supabase.from("pantry_categories").update({ title: newTitle }).eq("id", id);
  if (error) console.error("Rename category error:", error);
}

export async function deleteCategory(id: string) {
  // Because of 'ON DELETE CASCADE' in our SQL, this will automatically delete all items inside it too
  const { error } = await supabase.from("pantry_categories").delete().eq("id", id);
  if (error) console.error("Delete category error:", error);
}

// 3. Item Actions
export async function addItem(title: string, category_id: string) {
  const { data, error } = await supabase
    .from("pantry_items")
    .insert([{ title, category_id }])
    .select()
    .single();
    
  if (error) console.error("Add item error:", error);
  return data; // Return the new item so the frontend gets the true UUID
}

export async function moveItem(id: string, new_category_id: string) {
  const { error } = await supabase.from("pantry_items").update({ category_id: new_category_id }).eq("id", id);
  if (error) console.error("Move item error:", error);
}

export async function deleteItem(id: string) {
  const { error } = await supabase.from("pantry_items").delete().eq("id", id);
  if (error) console.error("Delete item error:", error);
}