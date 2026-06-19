"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/AppHeader";

interface Module {
  href: string;
  icon: string;
  labelKey: string;
  descKey: string;
  accent: string;
}

const MODULES: Module[] = [
  {
    href: "/characters",
    icon: "⚔️",
    labelKey: "home.myCharacters",
    descKey: "home.subtitle",
    accent: "from-gold/20 to-gold/5 border-gold/30",
  },
];

export function HomeContent({ username }: { username: string }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-dvh flex-col text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />

      <AppHeader username={username} />

      <main className="dh-rise z-10 flex flex-1 flex-col px-5 py-8 gap-8">
        {/* Hero */}
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
            {t("home.title")}
          </h1>
        </div>

        {/* Modules grid */}
        <div className="flex flex-col gap-3">
          {MODULES.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className={`flex items-center gap-4 rounded-2xl border bg-gradient-to-r p-5 transition active:scale-[0.99] hover:brightness-105 ${mod.accent}`}
            >
              <span className="text-3xl">{mod.icon}</span>
              <div className="flex-1">
                <p className="font-display text-base font-semibold text-foreground">{t(mod.labelKey)}</p>
                <p className="mt-0.5 text-xs text-muted line-clamp-1">{t(mod.descKey)}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted/40">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          ))}

          {/* Quick create CTA */}
          <Link
            href="/characters/new"
            className="flex h-14 items-center justify-center rounded-full bg-gradient-to-b from-gold-bright to-gold font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99]"
          >
            + {t("home.cta")}
          </Link>
        </div>
      </main>

      <footer className="pb-safe z-10 px-6 pt-2 text-center text-xs text-muted/50">
        {t("app.tagline")}
      </footer>
    </div>
  );
}
