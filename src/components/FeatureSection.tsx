"use client";

import { useTranslation } from "react-i18next";
import { IconSparkles } from "@tabler/icons-react";
import { CLASS_DEFS } from "@/lib/daggerheart/classes";
import type { ClassKey } from "@/lib/daggerheart/types";

export interface Feat {
  name: string;
  text: string;
}

type Accent = "gold" | "fear";

/** Safely read an array of feats from an i18n key (returns [] if missing/malformed). */
function useFeats(key: string): Feat[] {
  const { t } = useTranslation();
  const v = t(key, { returnObjects: true }) as unknown;
  return Array.isArray(v) ? (v as Feat[]) : [];
}

/** Safely read a single feat object from an i18n key (null if missing). */
function useFeat(key: string): Feat | null {
  const { t } = useTranslation();
  const v = t(key, { returnObjects: true }) as unknown;
  return v && typeof v === "object" && "name" in (v as object)
    ? (v as Feat)
    : null;
}

const ACCENT: Record<Accent, { bar: string; name: string }> = {
  gold: { bar: "bg-gold/60", name: "text-gold" },
  fear: { bar: "bg-fear-bright/60", name: "text-fear-bright" },
};

/** A single named ability: accent bar + bold name + body text. */
export function FeatureItem({
  feat,
  accent = "gold",
  badge,
}: {
  feat: Feat;
  accent?: Accent;
  badge?: string;
}) {
  const a = ACCENT[accent];
  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-surface-2/40 pl-4 pr-3.5 py-3">
      <span className={`absolute inset-y-0 left-0 w-1 ${a.bar}`} aria-hidden />
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className={`font-display text-sm font-semibold leading-tight ${a.name}`}>
          {feat.name}
        </span>
        {badge && (
          <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold/90">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-muted">
        {feat.text}
      </p>
    </div>
  );
}

/** A labelled group of features (e.g. "Foundation"). Renders nothing when empty. */
export function FeatureGroup({
  label,
  feats,
  accent = "gold",
}: {
  label?: string;
  feats: Feat[];
  accent?: Accent;
}) {
  if (feats.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted/80">
          {label}
        </p>
      )}
      {feats.map((f, i) => (
        <FeatureItem key={`${f.name}-${i}`} feat={f} accent={accent} />
      ))}
    </div>
  );
}

/**
 * Full abilities block for the character sheet. A clearly delimited section
 * (heading + accented panel) that groups ancestry, community, class and
 * subclass features so it reads as its own zone, distinct from stats/heritage.
 */
export function CharacterFeatures({
  ancestryKey,
  communityKey,
  classKey,
  subclassKey,
}: {
  ancestryKey: string;
  communityKey: string;
  classKey: string;
  subclassKey: string;
}) {
  const { t } = useTranslation();

  const ancestry = useFeats(`dh.ancestryFeat.${ancestryKey}`);
  const community = useFeat(`dh.communityFeat.${communityKey}`);
  const classHope = useFeat(`dh.classFeat.${classKey}.hope`);
  const classFeats = useFeats(`dh.classFeat.${classKey}.features`);
  const foundation = useFeats(`dh.subclassFeat.${subclassKey}.foundation`);
  const specialization = useFeats(`dh.subclassFeat.${subclassKey}.specialization`);
  const mastery = useFeats(`dh.subclassFeat.${subclassKey}.mastery`);

  const hasAny =
    ancestry.length || community || classHope || classFeats.length ||
    foundation.length || specialization.length || mastery.length;
  if (!hasAny) return null;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-b from-gold/[0.07] via-gold/[0.02] to-transparent p-4 shadow-[0_1px_0_rgba(217,164,65,0.12)_inset]">
      {/* Corner flourish — illuminated-tome motif */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold/10 blur-2xl"
      />

      {/* Chapter heading — sigil + title + gold hairline rule */}
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/40 bg-gold/10 shadow-[0_0_12px_rgba(217,164,65,0.25)]">
          <IconSparkles size={16} className="text-gold-bright" stroke={1.8} />
        </span>
        <h2 className="font-display text-base font-semibold tracking-wide text-gold-bright">
          {t("feat.sectionTitle")}
        </h2>
        <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
      </div>

      <div className="flex flex-col gap-5">
        {/* Ancestry */}
        {ancestry.length > 0 && (
          <FeatureBlock title={t("feat.ancestryTitle")}>
            <FeatureGroup feats={ancestry} />
          </FeatureBlock>
        )}

        {/* Community (trasfondo) */}
        {community && (
          <FeatureBlock title={t("feat.communityTitle")}>
            <FeatureGroup feats={[community]} />
          </FeatureBlock>
        )}

        {/* Class */}
        {(classHope || classFeats.length > 0) && (
          <FeatureBlock title={t("feat.classTitle")}>
            {classHope && (
              <FeatureItem feat={classHope} accent="fear" badge={t("feat.hopeLabel")} />
            )}
            <FeatureGroup feats={classFeats} />
          </FeatureBlock>
        )}

        {/* Subclass */}
        {(foundation.length > 0 || specialization.length > 0 || mastery.length > 0) && (
          <FeatureBlock title={t("feat.subclassTitle")}>
            <FeatureGroup label={t("feat.foundation")} feats={foundation} />
            <FeatureGroup label={t("feat.specialization")} feats={specialization} />
            <FeatureGroup label={t("feat.mastery")} feats={mastery} />
          </FeatureBlock>
        )}
      </div>
    </section>
  );
}

/**
 * Wiki detail-view abilities, keyed by category + entry key. Renders the
 * features for an ancestry, community or class entry (classes also list the
 * features of both their subclasses).
 */
export function WikiEntryFeatures({
  category,
  entryKey,
}: {
  category: "ancestry" | "community" | "class";
  entryKey: string;
}) {
  const { t } = useTranslation();

  const ancestry = useFeats(`dh.ancestryFeat.${entryKey}`);
  const community = useFeat(`dh.communityFeat.${entryKey}`);
  const classHope = useFeat(`dh.classFeat.${entryKey}.hope`);
  const classFeats = useFeats(`dh.classFeat.${entryKey}.features`);

  if (category === "ancestry") {
    if (ancestry.length === 0) return null;
    return (
      <WikiFeaturePanel title={t("feat.ancestryTitle")}>
        <FeatureGroup feats={ancestry} />
      </WikiFeaturePanel>
    );
  }

  if (category === "community") {
    if (!community) return null;
    return (
      <WikiFeaturePanel title={t("feat.communityTitle")}>
        <FeatureGroup feats={[community]} />
      </WikiFeaturePanel>
    );
  }

  // class
  const subclasses: string[] = [
    ...(CLASS_DEFS[entryKey as ClassKey]?.subclasses ?? []),
  ];
  if (!classHope && classFeats.length === 0 && subclasses.length === 0) return null;
  return (
    <WikiFeaturePanel title={t("feat.classTitle")}>
      {classHope && (
        <FeatureItem feat={classHope} accent="fear" badge={t("feat.hopeLabel")} />
      )}
      <FeatureGroup feats={classFeats} />
      {subclasses.map((subKey) => (
        <SubclassFeatures key={subKey} subKey={subKey} />
      ))}
    </WikiFeaturePanel>
  );
}

function SubclassFeatures({ subKey }: { subKey: string }) {
  const { t } = useTranslation();
  const foundation = useFeats(`dh.subclassFeat.${subKey}.foundation`);
  const specialization = useFeats(`dh.subclassFeat.${subKey}.specialization`);
  const mastery = useFeats(`dh.subclassFeat.${subKey}.mastery`);
  if (!foundation.length && !specialization.length && !mastery.length) return null;
  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-border/50 bg-surface-2/20 p-3">
      <p className="font-display text-sm font-semibold text-foreground/90">
        {t(`dh.subclass.${subKey}`)}
      </p>
      <FeatureGroup label={t("feat.foundation")} feats={foundation} />
      <FeatureGroup label={t("feat.specialization")} feats={specialization} />
      <FeatureGroup label={t("feat.mastery")} feats={mastery} />
    </div>
  );
}

function WikiFeaturePanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-2 w-full max-w-[60ch] rounded-2xl border border-gold/25 bg-gradient-to-b from-gold/[0.06] to-transparent p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gold/30 bg-gold/10">
          <IconSparkles size={15} className="text-gold" stroke={1.8} />
        </span>
        <h2 className="font-display text-sm font-semibold text-gold">{title}</h2>
      </div>
      <div className="flex flex-col gap-2.5 text-left">{children}</div>
    </section>
  );
}

/** Sub-heading + content within the abilities section. */
function FeatureBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground/85">
        <span aria-hidden className="text-[9px] text-gold/70">◆</span>
        {title}
      </p>
      {children}
    </div>
  );
}
