"use client";

import React, { useState } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { motion } from "framer-motion";

export default function KanbanBoard() {
  return (
    <div className="w-full text-[#733D26]">
      <Board />
    </div>
  );
}

const Board = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS);

  return (
    <div className="flex h-full w-full gap-4 overflow-x-auto pb-12 pt-4 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <Column title="Pantry" column="pantry" cards={cards} setCards={setCards} />
      <Column title="Monday" column="monday" cards={cards} setCards={setCards} />
      <Column title="Tuesday" column="tuesday" cards={cards} setCards={setCards} />
      <Column title="Wednesday" column="wednesday" cards={cards} setCards={setCards} />
      <Column title="Thursday" column="thursday" cards={cards} setCards={setCards} />
      <Column title="Friday" column="friday" cards={cards} setCards={setCards} />
      <Column title="Weekend" column="weekend" cards={cards} setCards={setCards} />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

const Column = ({ title, cards, column, setCards }: any) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: any, card: any) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: any) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
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

  const filteredCards = cards.filter((c: any) => c.column === column);

  return (
    <div className="w-64 shrink-0 snap-start">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-extrabold text-xl text-[#733D26]">{title}</h3>
        <span className="rounded-full bg-[#FFBFCC] px-2.5 py-0.5 text-sm font-bold text-[#733D26]">
          {filteredCards.length}
        </span>
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
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
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
      className="my-1 h-1.5 w-full rounded-full bg-[#733D26] opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards }: any) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: any) => {
    const cardId = e.dataTransfer.getData("cardId");
    setCards((pv: any) => pv.filter((c: any) => c.id !== cardId));
    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 snap-start place-content-center rounded-2xl border-2 border-dashed text-3xl transition-colors ${
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };

    setCards((pv: any) => [...pv, newCard]);
    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new meal..."
            className="w-full rounded-xl border-2 border-[#F8B0C8] bg-white p-3 text-sm font-semibold text-[#733D26] placeholder-[#AF8B87] focus:border-[#733D26] focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
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
          <span>Add meal</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

const DEFAULT_CARDS = [
  // PANTRY / IDEAS
  { title: "Garlic Butter Steak", id: "1", column: "pantry" },
  { title: "Creamy Tuscan Salmon", id: "2", column: "pantry" },
  { title: "Leftovers", id: "3", column: "pantry" },
  
  // MONDAY
  { title: "Baked Italian Chicken", id: "5", column: "monday" },
  
  // TUESDAY
  { title: "Taco Tuesday (Beef)", id: "6", column: "tuesday" },
  
  // WEDNESDAY
  { title: "Vegetarian Chili", id: "7", column: "wednesday" },
];