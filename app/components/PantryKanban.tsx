"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiPlus, FiTrash, FiMoreHorizontal } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { motion } from "framer-motion";
// Import your Next.js Server Actions
import { 
  addCategory, 
  renameCategory, 
  deleteCategory, 
  addItem, 
  moveItem, 
  deleteItem 
} from "../actions/pantry";

export default function PantryKanban({ initialColumns, initialCards }: any) {
  return (
    <div className="w-full text-[#733D26] h-full flex-1">
      <Board initialColumns={initialColumns} initialCards={initialCards} />
    </div>
  );
}

const Board = ({ initialColumns, initialCards }: any) => {
  // Initialize state with live Supabase data instead of hardcoded mocks
  const [columns, setColumns] = useState(initialColumns || []);
  const [cards, setCards] = useState(initialCards || []);
  const [addingCol, setAddingCol] = useState(false);
  const [newColTitle, setNewColTitle] = useState("");

  const handleAddColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColTitle.trim()) return;
    
    const newId = newColTitle.trim().toLowerCase().replace(/\s+/g, "-");
    const title = newColTitle.trim();
    
    if (!columns.some((col: any) => col.id === newId)) {
      // Optimistic UI update
      setColumns([...columns, { id: newId, title }]);
      // Background database update
      addCategory(newId, title);
    }
    
    setNewColTitle("");
    setAddingCol(false);
  };

  const handleColumnDrop = (draggedColId: string, targetColId: string) => {
    if (draggedColId === targetColId) return;
    
    setColumns((prev: any) => {
      const newCols = [...prev];
      const draggedIdx = newCols.findIndex((c: any) => c.id === draggedColId);
      const targetIdx = newCols.findIndex((c: any) => c.id === targetColId);
      
      const [draggedCol] = newCols.splice(draggedIdx, 1);
      newCols.splice(targetIdx, 0, draggedCol);
      
      return newCols;
    });
  };

  return (
    <div className="flex h-full w-full gap-4 overflow-x-auto pb-12 pt-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {columns.map((col: any) => (
        <Column 
          key={col.id} 
          title={col.title} 
          column={col.id} 
          cards={cards} 
          setCards={setCards}
          setColumns={setColumns}
          handleColumnDrop={handleColumnDrop}
        />
      ))}
      
      <div className="w-64 shrink-0 snap-start mt-[52px]">
        {addingCol ? (
          <form onSubmit={handleAddColumn} className="bg-[#FFBFCC]/30 p-3 rounded-xl border-2 border-dashed border-[#F8B0C8]">
            <input
              autoFocus
              type="text"
              value={newColTitle}
              onChange={(e) => setNewColTitle(e.target.value)}
              placeholder="Category name..."
              className="w-full rounded-xl border-2 border-[#F8B0C8] bg-white p-3 text-sm font-semibold text-[#733D26] placeholder-[#AF8B87] focus:border-[#733D26] focus:outline-none mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddingCol(false)}
                className="px-3 py-1.5 text-xs font-bold text-[#AF8B87] transition-colors hover:text-[#733D26]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-[#733D26] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#AF8B87]"
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setAddingCol(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#C29D93] bg-[#FFBFCC]/20 py-4 text-sm font-bold text-[#AF8B87] transition-colors hover:bg-[#FFBFCC]/40 hover:text-[#733D26]"
          >
            <FiPlus /> Add Category
          </button>
        )}
      </div>

      <BurnBarrel setCards={setCards} setColumns={setColumns} />
    </div>
  );
};

const Column = ({ title, cards, column, setCards, setColumns, handleColumnDrop }: any) => {
  const [active, setActive] = useState(false);
  const [colDragOver, setColDragOver] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteCategory = () => {
    // Optimistic UI update
    setColumns((prev: any) => prev.filter((c: any) => c.id !== column));
    setCards((prev: any) => prev.filter((c: any) => c.column !== column));
    setShowMenu(false);
    // Background database update
    deleteCategory(column);
  };

  const handleRenameSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editTitle.trim()) {
      setEditTitle(title); 
      setIsEditing(false);
      return;
    }
    
    const newTitle = editTitle.trim();
    // Optimistic UI update
    setColumns((prev: any) => 
      prev.map((c: any) => c.id === column ? { ...c, title: newTitle } : c)
    );
    setIsEditing(false);
    // Background database update
    renameCategory(column, newTitle);
  };

  const handleDragStart = (e: any, card: any) => {
    e.dataTransfer.setData("cardid", card.id);
  };

  const handleDragEnd = (e: any) => {
    const cardId = e.dataTransfer.getData("cardid");
    if (!cardId) return;

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((c: any) => c.id === cardId);
      if (!cardToTransfer) return;
      
      const previousColumn = cardToTransfer.column;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c: any) => c.id !== cardId);
      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el: any) => el.id === before);
        if (insertAtIndex === undefined) return;
        copy.splice(insertAtIndex, 0, cardToTransfer);
      }
      
      // Optimistic UI update
      setCards(copy);
      
      // Background database update (only update DB if the column actually changed)
      if (previousColumn !== column) {
        moveItem(cardId, column);
      }
    }
  };

  const handleDragOver = (e: any) => {
    if (e.dataTransfer.types.includes("cardid")) {
      e.preventDefault();
      highlightIndicator(e);
      setActive(true);
    }
  };

  const clearHighlights = (els?: any) => {
    const indicators = els || getIndicators();
    indicators.forEach((i: any) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: any) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: any, indicators: any[]) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const handleColDragOver = (e: any) => {
    if (e.dataTransfer.types.includes("colid")) {
      e.preventDefault();
      setColDragOver(true);
    }
  };

  const handleColDragLeave = (e: any) => {
    if (e.dataTransfer.types.includes("colid")) {
      setColDragOver(false);
    }
  };

  const handleColDrop = (e: any) => {
    if (e.dataTransfer.types.includes("colid")) {
      setColDragOver(false);
      const droppedColId = e.dataTransfer.getData("colid");
      if (droppedColId && droppedColId !== column) {
        e.stopPropagation();
        handleColumnDrop(droppedColId, column);
      }
    }
  };

  const filteredCards = cards.filter((c: any) => c.column === column);

  return (
    <div 
      className="relative flex items-stretch"
      onDragOver={handleColDragOver}
      onDragLeave={handleColDragLeave}
      onDrop={handleColDrop}
    >
      <div 
        className={`absolute -left-2 top-0 bottom-0 w-1.5 rounded-full bg-[#733D26] shadow-[0_0_8px_#733D26] transition-all duration-300 ease-in-out z-10 ${
          colDragOver ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
        }`}
      />

      <div 
        draggable={!isEditing}
        onDragStart={(e) => {
          e.dataTransfer.setData("colid", column);
        }}
        className={`w-64 shrink-0 snap-start transition-transform duration-300 ease-in-out ${colDragOver ? "translate-x-3" : ""}`}
      >
        <div className="mb-4 flex items-center justify-between cursor-grab active:cursor-grabbing group px-1">
          <div className="flex items-center gap-2 flex-1">
            {isEditing ? (
              <form onSubmit={handleRenameSubmit} className="flex-1 mr-2">
                <input
                  autoFocus
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleRenameSubmit}
                  className="w-full rounded-md border-2 border-[#F8B0C8] bg-white px-2 py-0.5 text-xl font-extrabold text-[#733D26] focus:border-[#733D26] focus:outline-none"
                />
              </form>
            ) : (
              <>
                <h3 className="font-extrabold text-xl text-[#733D26] truncate">{title}</h3>
                <span className="rounded-full bg-[#FFBFCC] px-2.5 py-0.5 text-sm font-bold text-[#733D26]">
                  {filteredCards.length}
                </span>
              </>
            )}
          </div>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-[#733D26] transition-colors p-1 rounded-md hover:bg-[#FFBFCC]/50"
              title="Category Options"
            >
              <FiMoreHorizontal size={20} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 rounded-xl bg-white shadow-xl border-2 border-[#F8B0C8] z-50 overflow-hidden py-1">
                <button 
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }} 
                  className="w-full text-left px-4 py-2 text-sm font-bold text-[#733D26] hover:bg-[#FFBFCC]/30"
                >
                  Rename
                </button>
                <button 
                  onClick={handleDeleteCategory} 
                  className="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          onDrop={handleDragEnd}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`h-full w-full min-h-[150px] rounded-xl transition-colors p-2 ${
            active ? "bg-[#FFBFCC]/30 border-2 border-dashed border-[#F8B0C8]" : "bg-transparent border-2 border-transparent"
          }`}
        >
          {filteredCards.map((c: any) => {
            return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
          })}
          <DropIndicator beforeId={null} column={column} />
          <AddCard column={column} setCards={setCards} />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, id, column, handleDragStart }: any) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e: any) => {
          e.stopPropagation();
          handleDragStart(e, { title, id, column });
        }}
        className="cursor-grab rounded-xl border-2 border-[#F790B2] bg-[#F9D0DE] p-4 shadow-sm active:cursor-grabbing hover:border-[#733D26] transition-colors"
      >
        <p className="text-sm font-bold text-[#733D26]">{title}</p>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }: any) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-1 h-1.5 w-full rounded-full bg-[#733D26] opacity-0 shadow-[0_0_8px_#733D26] transition-all duration-200 ease-in-out"
    />
  );
};

const BurnBarrel = ({ setCards, setColumns }: any) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: any) => {
    const cardId = e.dataTransfer.getData("cardid");
    const colId = e.dataTransfer.getData("colid");

    if (cardId) {
      setCards((pv: any) => pv.filter((c: any) => c.id !== cardId));
      deleteItem(cardId); // Database update
    } else if (colId) {
      setColumns((pv: any) => pv.filter((c: any) => c.id !== colId));
      setCards((pv: any) => pv.filter((c: any) => c.column !== colId));
      deleteCategory(colId); // Database update
    }
    
    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-[52px] grid h-56 w-56 shrink-0 snap-start place-content-center rounded-2xl border-2 border-dashed text-3xl transition-colors ${
        active
          ? "border-red-400 bg-red-100 text-red-500"
          : "border-[#C29D93] bg-[#FFBFCC]/20 text-[#AF8B87]"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

const AddCard = ({ column, setCards }: any) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!text.trim().length) return;

    const title = text.trim();
    
    // We await this specific action so we get the real generated UUID back from Postgres
    // This ensures that if the user drags it immediately after creating it, the drag system has the correct ID.
    const addedItem = await addItem(title, column);
    
    if (addedItem) {
      setCards((pv: any) => [...pv, { id: addedItem.id, title: addedItem.title, column: addedItem.category_id }]);
    }
    
    setText("");
    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add item..."
            className="w-full rounded-xl border-2 border-[#F8B0C8] bg-white p-3 text-sm font-semibold text-[#733D26] placeholder-[#AF8B87] focus:border-[#733D26] focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs font-bold text-[#AF8B87] transition-colors hover:text-[#733D26]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-[#733D26] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#AF8B87]"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-2.5 text-sm font-bold text-[#AF8B87] transition-colors hover:text-[#733D26] hover:bg-[#FFBFCC]/30 rounded-xl"
        >
          <span>Add item</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};