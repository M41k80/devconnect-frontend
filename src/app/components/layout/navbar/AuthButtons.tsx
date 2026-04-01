"use client";

import Link from "next/link";
import { useAuthStore } from "@/app/store/auth.store";
import { useI18n } from "@/app/i18n";

export function AuthButtons() {
  const { isAuthenticated } = useAuthStore();
  const { t } = useI18n();

  if (isAuthenticated) return null;

  return (
    <div className="hidden sm:flex items-center gap-2">
      <Link href="/login" className="dc-btn-ghost py-2 px-4 text-sm">
        {t.nav.login}
      </Link>
      <Link href="/register" className="dc-btn-primary py-2 px-4 text-sm">
        {t.nav.register}
      </Link>
    </div>
  );
}
