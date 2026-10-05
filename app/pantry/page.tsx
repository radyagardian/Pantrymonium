import PantryKanban from "../components/PantryKanban";
import { fetchPantryBoard } from "../actions/pantry";

export default async function PantryPage() {
  // Fetch data directly from Supabase before the page loads
  const boardData = await fetchPantryBoard();

  return (
    <main className="flex h-screen w-full flex-col bg-[#FCF8F5] p-8">
      <h1 className="mb-8 text-4xl font-[family-name:var(--font-geist-sans)] font-extrabold text-[#733D26]">My Pantry</h1>
      
      {/* Pass the live database rows into the client component */}
      <PantryKanban 
        initialColumns={boardData.categories} 
        initialCards={boardData.items} 
      />
    </main>
  );
}