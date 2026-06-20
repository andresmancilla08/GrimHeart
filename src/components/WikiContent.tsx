"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { IconSearch, IconX, IconBookOff, IconChevronLeft } from "@tabler/icons-react";
import { WIKI_ENTRIES, EQUIP_DISPLAY, type WikiCategory, type WikiEntry } from "@/lib/wiki/entries";
import { SECONDARY_WEAPONS, ARMORS } from "@/lib/daggerheart/equipment";

// ── Category meta ────────────────────────────────────────────────────────────

type CategoryOption = WikiCategory | "all";

interface CategoryMeta {
  value: CategoryOption;
  emoji: string;
  labelKey: string;
  accentClass: string;
  spineClass: string;
  badgeClass: string;
  /** Art image used for the landing card */
  landingArt: string;
  /** CSS objectPosition for the landing card image */
  landingArtPosition: string;
  /** Gradient overlay for landing card — bottom-to-top */
  landingGradient: string;
  /** Accent color for the landing card border glow */
  landingBorderClass: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    value: "all",
    emoji: "✦",
    labelKey: "wiki.all",
    accentClass: "border-gold/40 bg-gold/[0.12] text-gold",
    spineClass: "bg-gold/60",
    badgeClass: "bg-black/65 border border-white/10 text-gold",
    landingArt: "/art/cover.jpg",
    landingArtPosition: "center 25%",
    landingGradient: "from-background via-background/60 to-transparent",
    landingBorderClass: "border-gold/30 hover:border-gold/60",
  },
  {
    value: "ancestry",
    emoji: "🧬",
    labelKey: "wiki.category.ancestry",
    accentClass: "border-gold/40 bg-gold/[0.12] text-gold",
    spineClass: "bg-gold/40",
    badgeClass: "bg-black/65 border border-white/10 text-gold",
    landingArt: "/art/cover.jpg",
    landingArtPosition: "left 25%",
    landingGradient: "from-background via-background/55 to-transparent",
    landingBorderClass: "border-gold/20 hover:border-gold/50",
  },
  {
    value: "community",
    emoji: "🏘️",
    labelKey: "wiki.category.community",
    accentClass: "border-gold/40 bg-gold/[0.12] text-gold",
    spineClass: "bg-gold/40",
    badgeClass: "bg-black/65 border border-white/10 text-gold",
    landingArt: "/art/community/ridgeborne.jpg",
    landingArtPosition: "center 25%",
    landingGradient: "from-background via-background/55 to-transparent",
    landingBorderClass: "border-gold/20 hover:border-gold/50",
  },
  {
    value: "class",
    emoji: "⚔️",
    labelKey: "wiki.category.class",
    accentClass: "border-fear/40 bg-fear/[0.12] text-fear-bright",
    spineClass: "bg-fear/60",
    badgeClass: "bg-black/65 border border-white/10 text-fear-bright",
    landingArt: "/art/night-dragon.jpg",
    landingArtPosition: "center 30%",
    landingGradient: "from-background via-background/50 to-transparent",
    landingBorderClass: "border-fear/25 hover:border-fear-bright/50",
  },
  {
    value: "domain",
    emoji: "✨",
    labelKey: "wiki.category.domain",
    accentClass: "border-fear/40 bg-fear/[0.12] text-fear-bright",
    spineClass: "bg-fear/60",
    badgeClass: "bg-black/65 border border-white/10 text-fear-bright",
    landingArt: "/art/guardian.jpg",
    landingArtPosition: "center 20%",
    landingGradient: "from-background via-background/45 to-transparent",
    landingBorderClass: "border-fear/25 hover:border-fear-bright/50",
  },
  {
    value: "equipment",
    emoji: "🗡️",
    labelKey: "wiki.category.equipment",
    accentClass: "border-gold-deep/40 bg-gold-deep/[0.12] text-gold-deep",
    spineClass: "bg-gold-deep/50",
    badgeClass: "bg-black/65 border border-white/10 text-gold-deep",
    landingArt: "/art/equipment/primary.jpg",
    landingArtPosition: "center 25%",
    landingGradient: "from-background via-background/60 to-transparent",
    landingBorderClass: "border-gold-deep/25 hover:border-gold-deep/55",
  },
  {
    value: "rules",
    emoji: "📜",
    labelKey: "wiki.category.rules",
    accentClass: "border-gold/40 bg-gold/[0.12] text-gold",
    spineClass: "bg-gold/40",
    badgeClass: "bg-black/65 border border-white/10 text-gold",
    landingArt: "/art/night-sky.jpg",
    landingArtPosition: "center 40%",
    landingGradient: "from-background via-background/65 to-transparent",
    landingBorderClass: "border-gold/20 hover:border-gold/50",
  },
];

/** Only the 6 drillable categories (not "all") */
const LANDING_CATEGORIES = CATEGORIES.filter((c) => c.value !== "all") as CategoryMeta[];

const META_BY_VALUE: Record<CategoryOption, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c]),
) as Record<CategoryOption, CategoryMeta>;

// ── Equipment art sets ────────────────────────────────────────────────────────

const SECONDARY_IDS = new Set(SECONDARY_WEAPONS.map((w) => w.id));
const ARMOR_IDS = new Set(ARMORS.map((a) => a.id));

// ── Art resolution ────────────────────────────────────────────────────────────

function getArtSrc(entry: WikiEntry): string | null {
  switch (entry.category) {
    case "ancestry": {
      const key = entry.id.replace(/^ancestry_/, "");
      return `/art/ancestry/${key}.jpg`;
    }
    case "community": {
      const key = entry.id.replace(/^community_/, "");
      return `/art/community/${key}.jpg`;
    }
    case "class": {
      const key = entry.id.replace(/^class_/, "");
      return `/art/${key}.jpg`;
    }
    case "domain": {
      const key = entry.id.replace(/^domain_/, "");
      return `/art/domains/${key}.jpg`;
    }
    case "equipment": {
      const equipId = entry.id.replace(/^equip_/, "");
      if (ARMOR_IDS.has(equipId)) return "/art/equipment/armor.jpg";
      if (SECONDARY_IDS.has(equipId)) return "/art/equipment/secondary.jpg";
      return "/art/equipment/primary.jpg";
    }
    default:
      return null;
  }
}

// ── Equipment name/desc resolution ───────────────────────────────────────────

function resolveEntryName(entry: WikiEntry, t: (key: string) => string): string {
  if (entry.category === "equipment") {
    const equipId = entry.id.replace(/^equip_/, "");
    return EQUIP_DISPLAY[equipId]?.name ?? entry.id;
  }
  return t(entry.nameKey);
}

function resolveEntryDesc(entry: WikiEntry, t: (key: string) => string): string {
  if (entry.category === "equipment") {
    const equipId = entry.id.replace(/^equip_/, "");
    const display = EQUIP_DISPLAY[equipId];
    if (!display) return "";
    const { stats, isArmor } = display;
    if (isArmor) {
      const feature = stats.featureKey
        ? ` · ${t(`dh.equipFeature.${stats.featureKey}`)}`
        : "";
      return `${t("wizard.equipment.score")} ${stats.score} · ${t("wizard.equipment.minor")} ${stats.minor} · ${t("wizard.equipment.severe")} ${stats.severe}${feature}`;
    }
    const dmgLabel =
      stats.dmgType === "mag"
        ? t("wizard.equipment.magic")
        : t("wizard.equipment.physical");
    const burdenLabel =
      stats.burden === "oneHanded"
        ? t("wizard.equipment.oneHandedShort")
        : t("wizard.equipment.twoHandedShort");
    const feature = stats.featureKey
      ? ` · ${t(`dh.equipFeature.${stats.featureKey}`)}`
      : "";
    const spellcast = stats.requiresSpellcast
      ? ` · ${t("wizard.equipment.spellcastRequired")}`
      : "";
    return `${dmgLabel} · ${stats.damage} · ${stats.range} · ${burdenLabel}${feature}${spellcast}`;
  }
  return t(entry.descKey);
}

// ── WikiCard (entry card in category view) ────────────────────────────────────

function WikiCard({ entry, index }: { entry: WikiEntry; index: number }) {
  const { t } = useTranslation();
  const meta = META_BY_VALUE[entry.category];
  const name = resolveEntryName(entry, t);
  const desc = resolveEntryDesc(entry, t);
  const categoryLabel = t(meta.labelKey);
  const artSrc = getArtSrc(entry);

  const delayStyle = { animationDelay: `${Math.min(index * 30, 300)}ms` };

  if (artSrc) {
    return (
      <article
        className="dh-rise group relative overflow-hidden rounded-2xl border border-border bg-surface-2/20 transition-all duration-150 active:scale-[0.985] hover:border-border-strong hover:bg-surface-2/30"
        style={delayStyle}
      >
        <div className="relative h-[100px] w-full overflow-hidden">
          <Image
            src={artSrc}
            alt=""
            fill
            sizes="(max-width: 640px) calc(50vw - 24px), 300px"
            style={{
              objectFit: "cover",
              objectPosition: "center top",
              filter: "brightness(0.65) saturate(1.15)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-surface-2/95 to-transparent" />
          <div className={`absolute inset-x-0 top-0 h-[3px] ${meta.spineClass}`} aria-hidden />
          <span
            className={`absolute right-2.5 top-3 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide backdrop-blur-sm ${meta.badgeClass}`}
          >
            {categoryLabel}
          </span>
          <h3 className="absolute bottom-2 left-3 right-8 line-clamp-1 font-display text-sm font-semibold leading-tight text-foreground drop-shadow-lg">
            {name}
          </h3>
        </div>

        <div className="px-3 pb-3 pt-2">
          {desc && (
            <p className="line-clamp-2 text-xs leading-relaxed text-muted">{desc}</p>
          )}
          {entry.tags && entry.tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {entry.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/60 bg-surface-2/40 px-2 py-0.5 text-[10px] text-muted/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    );
  }

  // Card without illustration (rules)
  return (
    <article
      className="dh-rise group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-2/20 transition-all duration-150 active:scale-[0.985] hover:bg-surface-2/40 hover:border-border-strong"
      style={delayStyle}
    >
      <div className={`h-[3px] w-full shrink-0 ${meta.spineClass}`} aria-hidden />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-foreground">
            {name}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${meta.badgeClass}`}
          >
            {categoryLabel}
          </span>
        </div>
        {desc && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted">{desc}</p>
        )}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {entry.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/60 bg-surface-2/40 px-2 py-0.5 text-[10px] text-muted/70"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

// ── WikiLandingCard ───────────────────────────────────────────────────────────

function WikiLandingCard({
  meta,
  count,
  index,
  onClick,
}: {
  meta: CategoryMeta;
  count: number;
  index: number;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const label = t(meta.labelKey);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`dh-rise group relative overflow-hidden rounded-2xl border bg-surface-2/10 text-left transition-all duration-150 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background ${meta.landingBorderClass}`}
      style={{ animationDelay: `${index * 50}ms` }}
      aria-label={label}
    >
      {/* Art */}
      <div className="relative h-[130px] w-full overflow-hidden">
        <Image
          src={meta.landingArt}
          alt=""
          fill
          sizes="(max-width: 640px) calc(50vw - 24px), 260px"
          style={{
            objectFit: "cover",
            objectPosition: meta.landingArtPosition,
            filter: "brightness(0.7) saturate(1.2)",
          }}
          priority={index < 2}
        />
        {/* Bottom fade into card body */}
        <div className={`absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t ${meta.landingGradient}`} />
        {/* Top spine accent */}
        <div className={`absolute inset-x-0 top-0 h-[3px] ${meta.spineClass}`} aria-hidden />
        {/* Emoji glyph — top-left */}
        <span
          className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-background/60 text-sm backdrop-blur-sm"
          aria-hidden
        >
          {meta.emoji}
        </span>
        {/* Entry count badge — top-right */}
        <span
          className={`absolute right-2.5 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm ${meta.badgeClass}`}
        >
          {t("wiki.landing.entries", { count })}
        </span>
      </div>

      {/* Label */}
      <div className="px-3.5 pb-3.5 pt-2.5">
        <h2 className="font-display text-[15px] font-semibold leading-tight text-foreground transition-colors duration-150 group-hover:text-gold-bright">
          {label}
        </h2>
      </div>
    </button>
  );
}

// ── WikiLanding ───────────────────────────────────────────────────────────────

function WikiLanding({ onSelectCategory }: { onSelectCategory: (cat: WikiCategory) => void }) {
  const { t } = useTranslation();

  const countByCategory = useMemo(() => {
    const counts: Partial<Record<WikiCategory, number>> = {};
    for (const entry of WIKI_ENTRIES) {
      counts[entry.category] = (counts[entry.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-none border-b border-border/30 bg-background/70 px-5 pb-3 pt-5 backdrop-blur-md">
        <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          {t("wiki.title")}
        </h1>
        <p className="mt-0.5 text-sm text-muted">
          {t("wiki.landing.subtitle")}
        </p>
      </div>

      {/* Landing grid */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-safe">
        <div className="grid grid-cols-2 gap-4">
          {LANDING_CATEGORIES.map((meta, index) => (
            <WikiLandingCard
              key={meta.value}
              meta={meta}
              count={countByCategory[meta.value as WikiCategory] ?? 0}
              index={index}
              onClick={() => onSelectCategory(meta.value as WikiCategory)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── WikiCategoryView ──────────────────────────────────────────────────────────

function WikiCategoryView({
  category,
  onBack,
}: {
  category: WikiCategory;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const meta = META_BY_VALUE[category];
  const label = t(meta.labelKey);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WIKI_ENTRIES.filter((entry) => {
      if (entry.category !== category) return false;
      if (q.length === 0) return true;
      const name =
        entry.category === "equipment"
          ? (EQUIP_DISPLAY[entry.id.replace(/^equip_/, "")]?.name ?? "").toLowerCase()
          : t(entry.nameKey).toLowerCase();
      const desc = resolveEntryDesc(entry, t).toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [query, category, t]);

  const clearQuery = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  return (
    <div className="dh-rise relative z-10 flex flex-1 flex-col overflow-hidden">
      {/* Category banner header */}
      <div className="relative flex-none overflow-hidden">
        {/* Art banner */}
        <div className="relative h-[140px] w-full">
          <Image
            src={meta.landingArt}
            alt=""
            fill
            sizes="100vw"
            style={{
              objectFit: "cover",
              objectPosition: meta.landingArtPosition,
              filter: "brightness(0.55) saturate(1.1)",
            }}
            priority
          />
          {/* Gradient fade into the header below */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/70 to-transparent" />
          {/* Top spine */}
          <div className={`absolute inset-x-0 top-0 h-[3px] ${meta.spineClass}`} aria-hidden />
        </div>

        {/* Back button + title — overlaid on bottom of banner */}
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 px-5 pb-3">
          <button
            type="button"
            onClick={onBack}
            aria-label={t("wiki.back")}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground backdrop-blur-sm transition-all duration-150 active:scale-[0.92] hover:border-border-strong hover:bg-surface-2/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            <IconChevronLeft size={18} />
          </button>
          <h1 className="font-display text-xl font-semibold leading-tight text-foreground drop-shadow-lg sm:text-2xl">
            {label}
          </h1>
        </div>
      </div>

      {/* Search + count */}
      <div className="flex-none border-b border-border/30 bg-background/80 px-5 pb-2 pt-3 backdrop-blur-md">
        <div className="relative flex h-11 items-center">
          <IconSearch
            size={17}
            className="absolute left-3.5 shrink-0 text-muted/60"
            aria-hidden
          />
          <input
            ref={inputRef}
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("wiki.searchPlaceholder")}
            aria-label={t("wiki.searchPlaceholder")}
            className="h-11 w-full rounded-2xl border border-border bg-surface-2/30 pl-9 pr-9 text-sm text-foreground placeholder:text-muted/50 transition-colors duration-150 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={clearQuery}
              aria-label={t("wiki.clearSearch")}
              className="absolute right-1 flex h-11 w-11 items-center justify-center rounded-full text-muted/60 transition hover:text-foreground active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            >
              <IconX size={14} />
            </button>
          )}
        </div>
        <p className="mt-1.5 text-xs text-muted/60">
          {t("wiki.resultCount", { count: filtered.length })}
        </p>
      </div>

      {/* Scrollable results */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4 pb-safe"
        aria-live="polite"
        aria-atomic="false"
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-20 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(124,92,196,0.18) 0%, transparent 70%)",
                  filter: "blur(8px)",
                }}
                aria-hidden
              />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-fear/20 bg-surface-2/60">
                <IconBookOff size={28} stroke={1.2} className="text-fear/50" aria-hidden />
              </div>
            </div>
            <div className="max-w-[24ch]">
              <p className="font-display text-base font-semibold text-foreground">
                {t("wiki.noResults")}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {t("wiki.noResultsHint")}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filtered.map((entry, index) => (
              <WikiCard key={entry.id} entry={entry} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── WikiContent ───────────────────────────────────────────────────────────────

export function WikiContent() {
  const [activeCategory, setActiveCategory] = useState<WikiCategory | null>(null);

  if (activeCategory !== null) {
    return (
      <WikiCategoryView
        category={activeCategory}
        onBack={() => setActiveCategory(null)}
      />
    );
  }

  return <WikiLanding onSelectCategory={setActiveCategory} />;
}
