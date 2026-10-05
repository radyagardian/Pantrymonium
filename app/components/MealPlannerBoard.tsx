"use client";
import React, { useState, useEffect } from "react"; 
import { moveMealPlanItem, deleteMealPlanItem } from "../actions/planner";
import { FiTrash } from "react-icons/fi";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function MealPlannerBoard({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems || []);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setItems(initialItems || []);
  }, [initialItems]);

  const handleDragStart = (e: any, id: string) => {
    e.dataTransfer.setData("itemId", id);
  };

  const handleDrop = (e: any, targetDay: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");
    if (!itemId) return;

    // Optimistic UI update
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, day: targetDay } : item)));
    // Background DB update
    moveMealPlanItem(itemId, targetDay);
  };

  const handleDelete = (e: any) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("itemId");
    if (!itemId) return;

    setItems((prev) => prev.filter((item) => item.id !== itemId));
    deleteMealPlanItem(itemId);
  };

  const savedItems = items.filter((i) => i.day === "saved" && i.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-10 font-[family-name:var(--font-geist-sans)] text-[#733D26]">
      
      {/* ROW 1: Saved Recipes (Searchable) */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">Saved Recipes</h2>
          <input
            type="text"
            placeholder="Search saved..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border-2 border-[#F8B0C8] px-4 py-2 text-sm focus:border-[#733D26] focus:outline-none"
          />
        </div>
        
        <div 
          className="flex min-h-[160px] gap-4 overflow-x-auto rounded-2xl border-2 border-dashed border-[#C29D93] bg-[#FFBFCC]/10 p-4"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, "saved")}
        >
          {savedItems.map((item) => (
            <PlannerCard key={item.id} item={item} onDragStart={handleDragStart} />
          ))}
          {savedItems.length === 0 && <p className="m-auto font-bold text-[#AF8B87]">No saved recipes found.</p>}
        </div>
      </section>

      {/* ROW 2: The Week */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold">This Week</h2>
          
          {/* Trash Can Dropzone */}
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDelete}
            className="flex items-center gap-2 rounded-xl border-2 border-red-200 bg-red-50 px-4 py-2 text-red-500 transition-colors hover:bg-red-100"
          >
            <FiTrash /> <span className="text-sm font-bold">Drag here to remove</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
          {DAYS.map((day) => {
            const dayItems = items.filter((i) => i.day === day);
            return (
              <div 
                key={day}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, day)}
                className="flex min-h-[300px] flex-col rounded-2xl bg-[#FFBFCC]/20 p-3"
              >
                <h3 className="mb-3 text-center font-extrabold capitalize text-[#AF8B87]">{day}</h3>
                <div className="flex flex-1 flex-col gap-3">
                  {dayItems.map((item) => (
                    <PlannerCard key={item.id} item={item} onDragStart={handleDragStart} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const PlannerCard = ({ item, onDragStart }: any) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, item.id)}
    className="group relative min-w-[140px] w-full cursor-grab overflow-hidden rounded-xl border-2 border-[#F8B0C8] bg-white shadow-sm active:cursor-grabbing hover:border-[#733D26]"
  >
    <div className="h-24 w-full bg-[#F9D0DE]">
      {item.image && <img src={item.image} alt={item.title} className="h-full w-full object-cover" />}
    </div>
    <div className="p-3">
      <h4 className="line-clamp-2 text-xs font-bold text-[#733D26]">{item.title}</h4>
    </div>
  </div>
);