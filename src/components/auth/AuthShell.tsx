import { getTranslations } from "next-intl/server";
import { DaggerheartMark } from "./DaggerheartMark";

export async function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations("auth");

  return (
    <div className="rounded-3xl border border-border bg-surface/80 p-6 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:p-8">
      <div className="mb-7 flex flex-col items-center text-center">
        <span className="dh-mark-glow">
          <DaggerheartMark className="h-12 w-12" />
        </span>
        <p className="mt-3 font-display text-[0.7rem] uppercase tracking-[0.3em] text-gold/80">
          {t("brand")}
        </p>
        <h1 className="mt-3 font-display text-[1.65rem] font-semibold leading-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-muted">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
