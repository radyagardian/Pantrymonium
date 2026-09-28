"use client";

import React, { useState, useEffect, useCallback } from "react";
import { TextFlippingBoard } from "../../components/ui/text-flipping-board";

const MESSAGES: string[] = [
  "HELLO \nGIRLFRIEND!",
  "WHAT ARE WE\nCOOKING TODAY?",
  "MADE WITH LOVE \nFOR MY FAVORITE CHEF",
];

export default function WelcomePage() {
  const [msgIdx, setMsgIdx] = useState(0);

  const next = useCallback(
    () => setMsgIdx((i) => (i + 1) % MESSAGES.length),
    [],
  );

  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#FCF8F5] p-8">
      <TextFlippingBoard text={MESSAGES[msgIdx]} />
    </main>
  );
}