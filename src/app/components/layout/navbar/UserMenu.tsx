"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, User, LogOut } from "lucide-react";
import { Avatar } from "@/app/components/ui/Avatar";
import { cn } from "@/app/lib/utils";
import { useAuthStore } from "@/app/store/auth.store";
import { useI18n } from "@/app/i18n";

export function UserMenu() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 p-1 rounded-xl transition-colors hover:bg-[--bg-overlay]"
      >
        <Avatar
          fullName={user.fullName}
          profileImageUrl={user.profileImageUrl}
          size="sm"
        />
        <ChevronDown
          size={12}
          className={cn(
            "hidden sm:block text-[--text-dim] transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-52 rounded-xl border py-1.5 shadow-xl anim-scale-in"
          style={{
            background: "var(--bg-raised)",
            borderColor: "var(--border)",
          }}
        >
          {/* User info */}
          <div
            className="px-4 py-2.5 border-b"
            style={{ borderColor: "var(--border)" }}
          >
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "var(--text)" }}
            >
              {user.fullName}
            </p>
            <p
              className="text-xs truncate mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {user.email}
            </p>
          </div>

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-[--text-muted] hover:text-[--text] hover:bg-[--bg-overlay]"
          >
            <User size={14} />
            {t.nav.profile}
          </Link>

          <div
            className="border-t mt-1 pt-1"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-red-400 hover:bg-red-500/8"
            >
              <LogOut size={14} />
              {t.nav.logout}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
