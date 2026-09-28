"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiCalendar,
  FiChevronDown,
  FiChevronsRight,
  FiList,
  FiCoffee,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { LuCookingPot } from "react-icons/lu";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // Highlights the active page

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r-2 border-[#C29D93] bg-[#FCF8F5] p-2 z-[100] shadow-xl"
      style={{
        width: open ? "225px" : "70px", // 70px perfectly fits the icons
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-1 mt-4">
        <Option
          Icon={FiList}
          title="Pantry"
          href="/pantry"
          selected={pathname}
          open={open}
        />
        <Option
          Icon={FiCoffee}
          title="Kitchen"
          href="/kitchen"
          selected={pathname}
          open={open}
        />
        <Option
          Icon={FiCalendar}
          title="Meal Plan"
          href="/"
          selected={pathname}
          open={open}
        />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
}

const Option = ({
  Icon,
  title,
  href,
  selected,
  open,
}: {
  Icon: React.ElementType;
  title: string;
  href: string;
  selected: string;
  open: boolean;
}) => {
  const isActive = selected === href;

  return (
    <Link href={href} className="block">
      <motion.div
        layout
        className={`relative flex h-10 w-full items-center rounded-xl transition-colors ${
          isActive
            ? "bg-[#FFBFCC] text-[#733D26] font-bold"
            : "text-[#AF8B87] hover:bg-[#F9D0DE]"
        }`}
      >
        <motion.div
          layout
          className="grid h-full w-[54px] place-content-center text-xl shrink-0"
        >
          <Icon />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-md font-bold whitespace-nowrap"
          >
            {title}
          </motion.span>
        )}
      </motion.div>
    </Link>
  );
};

const TitleSection = ({ open }: { open: boolean }) => {
  return (
    <div className="mb-3 border-b-2 border-[#C29D93] pb-3">
      {/* Wrapped the header in a Link to route to the landing page */}
      <Link href="/welcome" className="flex cursor-pointer items-center justify-between rounded-xl transition-colors hover:bg-[#F9D0DE] p-1">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-md font-extrabold text-[#733D26]">
                Pantrymonium
              </span>
              <span className="block text-xs font-semibold text-[#AF8B87]">
                Virtual Kitchen
              </span>
            </motion.div>
          )}
        </div>
        {open && <FiChevronDown className="mr-2 text-[#AF8B87]" />}
      </Link>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-lg bg-[#FFBFCC] text-[#733D26]"
    >
      {/* Replaced the generic SVG with the LuCookingPot icon */}
      <LuCookingPot size={24} />
    </motion.div>
  );
};

const ToggleClose = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t-2 border-[#C29D93] transition-colors hover:bg-[#F9D0DE] text-[#AF8B87]"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-xl shrink-0 ml-1"
        >
          <FiChevronsRight
            className={`transition-transform duration-300 ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-sm font-bold"
          >
            Collapse
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};