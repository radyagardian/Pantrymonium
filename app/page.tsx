// app/page.tsx
"use client";

import KanbanBoard from "./components/KanbanBoard";

export default function Home() {
  return (
    <main className="p-8 font-[family-name:var(--font-geist-sans)] text-[#733D26]">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-[#733D26]">Meal Planner</h1>
        <p className="text-[#AF7F73] text-lg font-medium">Drag ingredients to plan your week.</p>
      </header>

      <div className="w-full">
        <KanbanBoard />
      </div>
    </main>
  );
}