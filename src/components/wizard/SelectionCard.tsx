"use client";

interface Props {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  badge?: string;
  children?: React.ReactNode;
}

export function SelectionCard({ selected, onClick, title, description, badge, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full flex-col gap-1.5 rounded-2xl border p-4 text-left transition active:scale-[0.98] ${
        selected
          ? "border-gold bg-gold/[0.08] shadow-[0_0_0_1px_rgba(217,164,65,0.4),0_4px_20px_-8px_rgba(217,164,65,0.3)]"
          : "border-border bg-surface-2/40 hover:border-border-strong hover:bg-surface-2/60"
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-[#2a1d05]">
          ✓
        </span>
      )}
      {badge && (
        <span className="mb-0.5 inline-block rounded-md bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
          {badge}
        </span>
      )}
      <span className="font-display text-sm font-semibold leading-tight text-foreground">{title}</span>
      {description && (
        <span className="text-xs leading-relaxed text-muted">{description}</span>
      )}
      {children}
    </button>
  );
}
