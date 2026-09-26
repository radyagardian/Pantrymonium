// app/pantry/page.tsx
"use client";

import PantryKanban from "../components/PantryKanban";

export default function PantryPage() {
  return (
    <main className="p-8 font-[family-name:var(--font-geist-sans)] text-[#733D26]">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-[#733D26]">My Pantry</h1>
        <p className="text-[#AF7F73] text-lg font-medium">Organize your ingredients into categories.</p>
      </header>

      <div className="w-full">
        <PantryKanban />
      </div>
    </main>
  );
}