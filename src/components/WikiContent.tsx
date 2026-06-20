"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  IconSearch,
  IconX,
  IconBookOff,
  IconChevronDown,
  IconDna2,
  IconBuildingCommunity,
  IconSwords,
  IconHexagons,
  IconShield,
  IconBook2,
  IconSword,
  IconAxe,
  IconHammer,
  IconBow,
  IconWand,
  IconSparkles,
  IconBolt,
  IconShirt,
} from "@tabler/icons-react";
import { SubHeader } from "@/components/SubHeader";
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
  /** Tabler icon for the icon-only landing card */
  LandingIcon: React.FC<{ size?: number; stroke?: number; className?: string }>;
  /** Hex color for icon glow and tint (no alpha) */
  accentHex: string;
  /** Tailwind text color class for the icon */
  accentTextClass: string;
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
    LandingIcon: IconBook2,
    accentHex: "#d9a441",
    accentTextClass: "text-gold",
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
    LandingIcon: IconDna2,
    accentHex: "#d9a441",
    accentTextClass: "text-gold",
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
    LandingIcon: IconBuildingCommunity,
    accentHex: "#d9a441",
    accentTextClass: "text-gold",
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
    LandingIcon: IconSwords,
    accentHex: "#a78bfa",
    accentTextClass: "text-fear-bright",
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
    LandingIcon: IconHexagons,
    accentHex: "#a78bfa",
    accentTextClass: "text-fear-bright",
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
    LandingIcon: IconShield,
    accentHex: "#f0c25e",
    accentTextClass: "text-gold-bright",
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
    LandingIcon: IconBook2,
    accentHex: "#d9a441",
    accentTextClass: "text-gold",
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

function WikiCard({
  entry,
  index,
  onOpen,
}: {
  entry: WikiEntry;
  index: number;
  onOpen: (entry: WikiEntry) => void;
}) {
  const { t } = useTranslation();
  const meta = META_BY_VALUE[entry.category];
  const name = resolveEntryName(entry, t);
  const artSrc = getArtSrc(entry);
  const { LandingIcon, accentHex, accentTextClass } = meta;

  const delayStyle = { animationDelay: `${Math.min(index * 30, 300)}ms` };

  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      aria-label={name}
      className="dh-rise group flex h-full min-h-[140px] flex-col overflow-hidden rounded-2xl border border-border bg-surface-2/30 text-center transition-all duration-150 active:scale-[0.98] hover:border-border-strong hover:bg-surface-2/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-inset"
      style={delayStyle}
    >
      {/* Cover */}
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
        {artSrc ? (
          <Image
            src={artSrc}
            alt=""
            fill
            sizes="(max-width: 640px) calc(50vw - 28px), 300px"
            className="object-cover transition-transform duration-200 group-hover:scale-[1.04]"
            style={{
              objectPosition: "center top",
              filter: "brightness(0.7) saturate(1.15)",
            }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `radial-gradient(ellipse 90% 80% at 50% 35%, ${accentHex}1f, transparent 72%)`,
            }}
          >
            <LandingIcon size={34} stroke={1.4} className={`${accentTextClass} opacity-50`} />
          </div>
        )}
      </div>

      {/* Name below image */}
      <div className="flex flex-1 items-center justify-center p-3">
        <h3 className="line-clamp-2 font-display text-sm font-semibold leading-tight tracking-wide text-foreground">
          {name}
        </h3>
      </div>
    </button>
  );
}

// ── WikiEntryView (full-screen detail for art entries) ────────────────────────

function WikiEntryView({ entry }: { entry: WikiEntry }) {
  const { t } = useTranslation();
  const meta = META_BY_VALUE[entry.category];
  const name = resolveEntryName(entry, t);
  const artSrc = getArtSrc(entry);
  const { LandingIcon, accentHex, accentTextClass } = meta;
  const lore = entry.loreKey ? t(entry.loreKey) : resolveEntryDesc(entry, t);

  return (
    <div className="dh-rise relative z-10 flex flex-1 flex-col overflow-hidden">
      {/* Fixed: hero + title */}
      <div className="shrink-0">
        {artSrc && (
          <div className="relative aspect-[4/3] max-h-[38dvh] w-full overflow-hidden">
            <Image
              src={artSrc}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
              style={{ objectPosition: "center top" }}
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        )}

        <div className="relative z-10 mx-auto -mt-10 w-full max-w-2xl px-5 text-center">
          {/* Category chip */}
          <div className="mb-2 flex items-center justify-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl border"
              style={{ backgroundColor: `${accentHex}1a`, borderColor: `${accentHex}33` }}
            >
              <LandingIcon size={16} stroke={1.6} className={accentTextClass} />
            </div>
            <span className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${accentTextClass}`}>
              {t(meta.labelKey)}
            </span>
          </div>

          <h1 className="font-display text-3xl font-semibold leading-tight text-foreground">
            {name}
          </h1>
        </div>
      </div>

      {/* Scrollable: lore only */}
      {lore && (
        <div className="mt-4 flex-1 overflow-y-auto px-5 pb-safe">
          <p className="mx-auto max-w-[60ch] whitespace-pre-line pb-8 text-justify text-[15px] leading-relaxed text-muted [hyphens:auto]">
            {lore}
          </p>
        </div>
      )}
    </div>
  );
}

// ── WikiRuleCard (full-width accordion for rules) ─────────────────────────────

function WikiRuleCard({ entry, index }: { entry: WikiEntry; index: number }) {
  const { t } = useTranslation();
  const meta = META_BY_VALUE[entry.category];
  const name = resolveEntryName(entry, t);
  const desc = resolveEntryDesc(entry, t);
  const { LandingIcon, accentHex, accentTextClass } = meta;
  const [open, setOpen] = useState(false);

  return (
    <article
      className="dh-rise overflow-hidden rounded-2xl border border-border bg-surface-2/30 transition-colors duration-150 hover:border-border-strong"
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-transform duration-150 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-inset"
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
          style={{ backgroundColor: `${accentHex}1a`, borderColor: `${accentHex}33` }}
        >
          <LandingIcon size={18} stroke={1.5} className={accentTextClass} />
        </div>
        <h3 className="min-w-0 flex-1 font-display text-base font-semibold leading-snug tracking-wide text-foreground">
          {name}
        </h3>
        <IconChevronDown
          size={18}
          className={`shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {/* Collapsible body — CSS grid-rows trick, animates height */}
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="border-t border-border/40 px-4 pb-4 pt-3 text-sm leading-relaxed text-muted">
            {desc}
          </p>
        </div>
      </div>
    </article>
  );
}

// ── WikiEquipCard (stat-focused card for equipment) ───────────────────────────

type IconComp = React.FC<{ size?: number; stroke?: number; className?: string }>;

/** Weapon/armor icon by type — CoreBook presents equipment as stat tables (no
 *  per-item art), so we represent each piece with a type-appropriate glyph. */
function getEquipIcon(id: string, isArmor: boolean): IconComp {
  if (isArmor) return IconShirt;
  if (id.includes("shield")) return IconShield;
  if (id.includes("bow")) return IconBow;
  if (id.includes("axe")) return IconAxe;
  if (id.includes("hammer") || id.includes("mace")) return IconHammer;
  if (id.includes("staff") || id.includes("wand") || id.includes("scepter"))
    return IconWand;
  if (id.includes("rings") || id.includes("runes") || id.includes("gauntlet"))
    return IconSparkles;
  if (id.includes("whip")) return IconBolt;
  return IconSword;
}

function WikiEquipCard({ entry, index }: { entry: WikiEntry; index: number }) {
  const { t } = useTranslation();
  const equipId = entry.id.replace(/^equip_/, "");
  const display = EQUIP_DISPLAY[equipId];

  const delayStyle = { animationDelay: `${Math.min(index * 30, 300)}ms` };

  if (!display) return null;
  const { name, isArmor, stats } = display;
  const Icon = getEquipIcon(equipId, isArmor);
  const isMag = stats.dmgType === "mag";
  const glowHex = isMag ? "#a78bfa" : "#d9a441";

  // Magic weapons read purple (Fear), everything else gold (Hope).
  const tone = isMag
    ? {
        chip: "border-fear/30 bg-fear/10 text-fear-bright",
        pill: "border-fear/30 bg-fear/[0.12]",
        pillVal: "text-fear-bright",
        pillLbl: "text-fear-bright/70",
        feature: "text-fear-bright/90",
      }
    : {
        chip: "border-gold/30 bg-gold/10 text-gold",
        pill: "border-gold/30 bg-gold/[0.12]",
        pillVal: "text-gold-bright",
        pillLbl: "text-gold/70",
        feature: "text-gold/90",
      };

  // Meta line + prominent value differ for armor vs weapons.
  const metaLine = isArmor
    ? `${t("wizard.equipment.minor")} ${stats.minor} · ${t("wizard.equipment.severe")} ${stats.severe}`
    : `${t(`wizard.equipment.${isMag ? "magic" : "physical"}`)} · ${t(`dh.rangeLabel.${stats.range}`)} · ${t(
        `wizard.equipment.${stats.burden === "oneHanded" ? "oneHandedShort" : "twoHandedShort"}`,
      )}`;
  const pillValue = isArmor ? stats.score : stats.damage;
  const pillLabel = isArmor
    ? t("wizard.equipment.armorLabel")
    : t("wizard.equipment.damage");

  const feature = stats.featureKey
    ? t(`dh.equipFeature.${stats.featureKey}`)
    : null;
  const spellcast = stats.requiresSpellcast === "1";

  return (
    <article
      className="dh-rise flex flex-col gap-2.5 rounded-2xl border border-border bg-surface-2/30 p-3.5 transition-colors duration-150 hover:border-border-strong hover:bg-surface-2/45"
      style={delayStyle}
    >
      <div className="flex items-center gap-3">
        {/* Type icon — themed gradient + glow */}
        <div
          className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border ${tone.chip}`}
          style={{
            backgroundImage: `radial-gradient(circle at 50% 22%, ${glowHex}40, transparent 72%)`,
          }}
        >
          <Icon
            size={23}
            stroke={1.6}
            className={`relative drop-shadow-[0_0_6px_rgba(0,0,0,0.4)] ${isMag ? "text-fear-bright" : "text-gold-bright"}`}
          />
        </div>

        {/* Name + meta */}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-display text-base font-semibold leading-tight tracking-wide text-foreground">
            {name}
          </h3>
          <p className="mt-0.5 text-xs leading-snug text-muted">{metaLine}</p>
        </div>

        {/* Prominent damage / armor value — the visual anchor */}
        <div
          className={`flex min-w-[3.4rem] shrink-0 flex-col items-center justify-center rounded-xl border px-2.5 py-1.5 ${tone.pill}`}
        >
          <span className={`font-mono text-base font-bold leading-none ${tone.pillVal}`}>
            {pillValue}
          </span>
          <span className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${tone.pillLbl}`}>
            {pillLabel}
          </span>
        </div>
      </div>

      {/* Feature + spellcast */}
      {(feature || spellcast) && (
        <div className="flex flex-col gap-1.5 border-t border-border/40 pt-2.5">
          {feature && (
            <p className={`flex gap-1.5 text-xs leading-relaxed ${tone.feature}`}>
              <span aria-hidden className="mt-0.5 shrink-0 leading-none">
                ★
              </span>
              <span>{feature}</span>
            </p>
          )}
          {spellcast && (
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-fear-bright/80">
              <span aria-hidden>✦</span>
              {t("wizard.equipment.spellcastRequired")}
            </p>
          )}
        </div>
      )}
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
  const { LandingIcon, accentHex, accentTextClass } = meta;

  return (
    <button
      type="button"
      onClick={onClick}
      className="dh-rise group relative h-40 w-full will-change-transform overflow-hidden rounded-2xl border border-border bg-surface-2/50 text-center transition-[transform,background-color,box-shadow] duration-[120ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:border-border-strong hover:bg-surface-2/80 hover:shadow-[0_4px_24px_rgba(0,0,0,0.45)] active:scale-[0.97] active:duration-[80ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-inset motion-safe:transition-[transform,background-color,box-shadow]"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Ambient radial glow — always visible, intensifies on hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-[120ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accentHex}14, transparent 70%)`,
        }}
        aria-hidden
      />

      {/* Icon + text stack */}
      <div className="relative flex h-full flex-col items-center justify-center">
        {/* Icon circle with glow layer */}
        <div className="relative mb-3 flex items-center justify-center">
          {/* Glow pseudo-element — opacity transitions on group-hover */}
          <div
            className="pointer-events-none absolute inset-0 rounded-full opacity-0 blur-[12px] transition-opacity duration-[120ms] [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100"
            style={{ background: accentHex, transform: "scale(1.4)" }}
            aria-hidden
          />
          {/* Icon backdrop circle */}
          <div
            className="relative flex h-14 w-14 items-center justify-center rounded-full border"
            style={{
              backgroundColor: `${accentHex}1a`, // 10% alpha
              borderColor: `${accentHex}33`,      // 20% alpha
            }}
          >
            <LandingIcon
              size={28}
              stroke={1.4}
              className={`${accentTextClass} transition-colors duration-[120ms]`}
            />
          </div>
        </div>

        {/* Category name */}
        <h2 className={`line-clamp-1 font-display text-sm font-semibold tracking-[0.04em] text-foreground`}>
          {label}
        </h2>

        {/* Entry count */}
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-muted/70">
          {t("wiki.landing.entries", { count })}
        </p>
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
      <div className="flex-none border-b border-border/30 bg-background/70 px-5 pb-3 pt-5 text-center backdrop-blur-md">
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
  onOpenEntry,
}: {
  category: WikiCategory;
  onOpenEntry: (entry: WikiEntry) => void;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const meta = META_BY_VALUE[category];
  const label = t(meta.labelKey);
  const { LandingIcon, accentHex, accentTextClass } = meta;

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
      {/* Compact header — no banner */}
      <div className="relative flex-none px-5 pb-3 pt-1">
        {/* Subtle accent glow for thematic identity */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-60"
          style={{
            background: `radial-gradient(ellipse 70% 100% at 16% 0%, ${accentHex}1f, transparent 72%)`,
          }}
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-2xl">
          {/* Title row — centered */}
          <div className="flex items-center justify-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border"
              style={{
                backgroundColor: `${accentHex}1a`,
                borderColor: `${accentHex}33`,
              }}
            >
              <LandingIcon size={22} stroke={1.5} className={accentTextClass} />
            </div>
            <h1 className="font-display text-2xl font-semibold leading-tight tracking-wide text-foreground">
              {label}
            </h1>
          </div>

          {/* Search */}
          <div className="relative mt-3 flex h-11 items-center">
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
              enterKeyHint="search"
              placeholder={t("wiki.searchPlaceholder")}
              aria-label={t("wiki.searchPlaceholder")}
              className="h-11 w-full rounded-2xl border border-border bg-surface-2/40 pl-9 pr-9 text-sm text-foreground placeholder:text-muted/50 transition-colors duration-150 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
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

          <p className="mt-2 px-0.5 text-center text-xs text-muted/60" aria-live="polite">
            {t("wiki.resultCount", { count: filtered.length })}
          </p>
        </div>
      </div>

      {/* Scrollable results */}
      <div
        className="flex-1 overflow-y-auto px-5 pb-safe pt-1"
        aria-live="polite"
        aria-atomic="false"
      >
        <div className="mx-auto w-full max-w-2xl">
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
          category === "rules" ? (
            <div className="flex flex-col gap-3">
              {filtered.map((entry, index) => (
                <WikiRuleCard key={entry.id} entry={entry} index={index} />
              ))}
            </div>
          ) : category === "equipment" ? (
            <div className="flex flex-col gap-2.5">
              {filtered.map((entry, index) => (
                <WikiEquipCard key={entry.id} entry={entry} index={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((entry, index) => (
                <WikiCard key={entry.id} entry={entry} index={index} onOpen={onOpenEntry} />
              ))}
            </div>
          )
        )}
        </div>
      </div>
    </div>
  );
}

// ── WikiContent ───────────────────────────────────────────────────────────────

export function WikiContent() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<WikiCategory | null>(null);
  const [activeEntry, setActiveEntry] = useState<WikiEntry | null>(null);

  // Cascading context-aware back: entry → category → landing → home.
  const handleBack = useCallback(() => {
    if (activeEntry !== null) {
      setActiveEntry(null);
    } else if (activeCategory !== null) {
      setActiveCategory(null);
    } else {
      router.push("/");
    }
  }, [activeEntry, activeCategory, router]);

  return (
    <>
      <SubHeader onBack={handleBack} />
      {activeEntry !== null ? (
        <WikiEntryView entry={activeEntry} />
      ) : activeCategory !== null ? (
        <WikiCategoryView category={activeCategory} onOpenEntry={setActiveEntry} />
      ) : (
        <WikiLanding onSelectCategory={setActiveCategory} />
      )}
    </>
  );
}
