import React from "react";
import MealPlannerBoard from "../components/MealPlannerBoard";
import { getMealPlanItems } from "../actions/planner";

export const dynamic = "force-dynamic";

export default async function PlannerPage() {
  const items = await getMealPlanItems();

  return (
    <main className="min-h-screen w-full bg-[#FCF8F5] p-8 pb-20">
      <header className="mb-10">
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight font-[family-name:var(--font-geist-sans)] text-[#733D26]">Meal Planner</h1>
        <p className="text-lg font-medium font-[family-name:var(--font-geist-sans)] text-[#733D26]/80">Drag your saved recipes to schedule your week.</p>
      </header>

      <MealPlannerBoard initialItems={items} />
    </main>
  );
}