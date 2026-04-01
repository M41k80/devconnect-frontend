"use client";

import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-display font-bold transition-transform duration-200 group-hover:scale-105"
        style={{
          background: "linear-gradient(135deg, var(--brand), var(--accent))",
        }}
      >
        DC
      </div>
      <span
        className="hidden sm:block font-display font-bold text-lg tracking-tight"
        style={{ color: "var(--text)" }}
      >
        DevConnect
      </span>
    </Link>
  );
}
