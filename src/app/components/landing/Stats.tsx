"use client";

import { useI18n } from "@/app/i18n";

export function Stats() {
  const { t } = useI18n();

  return (
    <div className="dc-container">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 anim-fade-up delay-4">
        {[
          { value: "240+", label: t.landing.statsProjects },
          { value: "1.4k", label: t.landing.statsDevs },
          { value: "38",   label: t.landing.statsLaunched },
        ].map(({ value, label }) => (
          <div key={label} className="text-center">
            <div className="font-display text-3xl font-bold" style={{ color: "var(--text)" }}>
              {value}
            </div>
            <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
