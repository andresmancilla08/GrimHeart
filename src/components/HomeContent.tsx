"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { IconChevronRight, IconSwords, IconBook2, IconPlus } from "@tabler/icons-react";
import { AppHeader } from "@/components/AppHeader";
import type { Character } from "@/lib/daggerheart/types";
import { artUrl } from "@/lib/art";

interface Props {
  username: string;
  characters: Character[];
}

export function HomeContent({ username, characters }: Props) {
  const { t } = useTranslation();

  // Most-recently-touched character is the hero; the rest fill the shelf.
  const sorted = [...characters].sort((a, b) =>
    (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""),
  );
  const featured = sorted[0];
  const rest = sorted.slice(1);
  const hasChars = sorted.length > 0;

  return (
    <div className="relative flex h-app flex-col overflow-hidden text-foreground">
      <div className="dh-aurora" aria-hidden />
      <div className="dh-grain" aria-hidden />

      <AppHeader username={username} />

      <main className="dh-rise z-10 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-4 pt-6">
        {/* Greeting */}
        <header>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/70">
            {t("home.greetingEyebrow")}
          </span>
          <h1 className="mt-1 max-w-[18ch] truncate font-display text-2xl font-bold leading-tight text-foreground">
            {t("home.greetingTitle", { name: username })}
          </h1>
        </header>

        {hasChars ? (
          <>
            {/* Featured hero — most recent character */}
            <section>
              <SectionLabel>{t("home.continueTitle")}</SectionLabel>
              <Link
                href={`/characters/${featured.id}`}
                style={{ animationDelay: "60ms" }}
                className="dh-rise group relative block h-48 w-full overflow-hidden rounded-3xl border border-gold/20 shadow-[0_10px_40px_-16px_rgba(0,0,0,0.85)] transition-all duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              >
                <Image
                  src={artUrl(`/art/${featured.classKey}.jpg`)}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover transition-transform duration-200 group-hover:scale-[1.04]"
                  style={{ objectPosition: "center 20%" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5" aria-hidden />

                {/* Go arrow */}
                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/40 text-foreground/90 backdrop-blur-sm transition-transform duration-150 group-hover:translate-x-0.5">
                  <IconChevronRight size={18} stroke={2} />
                </span>

                <div className="absolute inset-x-4 bottom-4">
                  <span className="inline-block rounded-full border border-gold/30 bg-black/45 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold backdrop-blur-sm">
                    {t(`dh.class.${featured.classKey}`)} · {t("characters.level", { level: featured.level })}
                  </span>
                  <h2 className="mt-2 truncate font-display text-2xl font-bold leading-tight text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                    {featured.name}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(
                      [
                        ["wizard.review.evasion", featured.evasion],
                        ["wizard.review.hp", featured.hpMax],
                        ["wizard.review.hope", featured.hope],
                      ] as const
                    ).map(([key, value]) => (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] text-foreground/80 backdrop-blur-sm"
                      >
                        <span className="font-mono text-[11px] font-bold text-gold">{value}</span>
                        {t(key)}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </section>

            {/* Hero shelf — other characters + create tile */}
            {rest.length > 0 && (
              <section>
                <div className="mb-2.5 flex items-center justify-between">
                  <SectionLabel className="mb-0">{t("home.otherHeroes")}</SectionLabel>
                  <Link
                    href="/characters"
                    className="-my-1 rounded-full px-2 py-1 text-xs font-medium text-muted transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                  >
                    {t("home.viewAll")}
                  </Link>
                </div>
                <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {rest.map((c) => (
                    <Link
                      key={c.id}
                      href={`/characters/${c.id}`}
                      className="group relative h-36 w-28 shrink-0 overflow-hidden rounded-2xl border border-border transition-all duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                    >
                      <Image
                        src={artUrl(`/art/${c.classKey}.jpg`)}
                        alt=""
                        fill
                        sizes="112px"
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        style={{ objectPosition: "center 18%" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                      <div className="absolute inset-x-2 bottom-2">
                        <p className="truncate font-display text-sm font-semibold leading-tight text-foreground drop-shadow">
                          {c.name}
                        </p>
                        <p className="truncate text-[10px] text-muted">
                          {t("characters.level", { level: c.level })}
                        </p>
                      </div>
                    </Link>
                  ))}
                  <Link
                    href="/characters/new"
                    aria-label={t("home.cta")}
                    className="flex h-36 w-28 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gold/30 bg-gold/[0.04] text-gold transition-all duration-150 active:scale-[0.97] hover:bg-gold/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                  >
                    <IconPlus size={22} stroke={2} />
                    <span className="text-xs font-medium">{t("home.newCharShort")}</span>
                  </Link>
                </div>
              </section>
            )}
          </>
        ) : (
          /* Empty state — invitation */
          <section className="dh-rise flex flex-col items-center gap-5 rounded-3xl border border-gold/15 bg-surface-2/30 px-6 py-10 text-center">
            <div className="relative flex h-24 w-20 items-center justify-center rounded-lg border border-gold/25 bg-gradient-to-b from-gold/[0.08] to-transparent">
              <span className="font-display text-4xl font-bold text-gold/40">?</span>
              <div
                className="pointer-events-none absolute inset-0 rounded-lg"
                style={{ background: "radial-gradient(circle at 50% 30%, rgba(217,164,65,0.18), transparent 70%)" }}
                aria-hidden
              />
            </div>
            <div className="max-w-[30ch]">
              <h2 className="font-display text-xl font-semibold text-foreground">{t("home.emptyTitle")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t("home.emptyDesc")}</p>
            </div>
          </section>
        )}

        {/* Quick access bento */}
        <section className="grid grid-cols-2 gap-3">
          <BentoTile
            href="/characters"
            Icon={IconSwords}
            label={t("home.myCharacters")}
            tone="gold"
          />
          <BentoTile href="/wiki" Icon={IconBook2} label={t("home.wiki")} tone="fear" />
        </section>

        <footer className="mt-auto pb-1 pt-1 text-center text-xs text-muted/45">
          {t("app.tagline")}
        </footer>
      </main>

      {/* Fixed bottom CTA */}
      <div
        className="z-10 shrink-0 px-[15px] pt-6"
        style={{ paddingBottom: "15px" }}
      >
        <Link
          href="/characters/new"
          className="flex h-14 items-center justify-center gap-1.5 rounded-full bg-gradient-to-b from-gold-bright to-gold font-semibold text-[#2a1d05] shadow-[0_6px_24px_-8px_rgba(217,164,65,0.7)] transition hover:brightness-105 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-bright focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          + {t("home.cta")}
        </Link>
      </div>
    </div>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mb-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted ${className}`}>
      {children}
    </p>
  );
}

function BentoTile({
  href,
  Icon,
  label,
  tone,
}: {
  href: string;
  Icon: typeof IconSwords;
  label: string;
  tone: "gold" | "fear";
}) {
  const styles =
    tone === "gold"
      ? { card: "border-gold/25 from-gold/[0.12] to-gold/[0.02] hover:border-gold/45", wrap: "border-gold/30 bg-gold/[0.12] text-gold", glow: "#d9a441" }
      : { card: "border-fear/25 from-fear/[0.14] to-fear/[0.02] hover:border-fear/45", wrap: "border-fear/30 bg-fear/[0.12] text-fear-bright", glow: "#a78bfa" };
  return (
    <Link
      href={href}
      className={`group relative flex h-28 flex-col justify-between overflow-hidden rounded-2xl border bg-gradient-to-br p-4 transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 ${styles.card}`}
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 opacity-50 transition-opacity duration-150 group-hover:opacity-80"
        style={{ background: `radial-gradient(circle, ${styles.glow}30, transparent 70%)` }}
        aria-hidden
      />
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${styles.wrap}`}>
        <Icon size={22} stroke={1.7} />
      </span>
      <p className="font-display text-base font-semibold tracking-wide text-foreground">{label}</p>
    </Link>
  );
}
