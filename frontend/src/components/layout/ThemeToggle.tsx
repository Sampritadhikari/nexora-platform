"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle visual theme"
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1211] text-slate-700 dark:text-slate-300 hover:border-gold-500/50 dark:hover:border-gold-500/50 hover:shadow-[0_0_18px_-2px_rgba(245,158,11,0.4)] transition-all duration-200 active:scale-95 ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-all text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 transition-all text-slate-600" />
      )}
    </button>
  );
}
