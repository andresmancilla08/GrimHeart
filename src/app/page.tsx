import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0b0f] text-white">
      <header className="flex items-center justify-between px-6 py-4">
        <span className="font-mono text-lg font-semibold tracking-tight">
          {t("app.name")}
        </span>
        <LocaleSwitcher />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {t("home.title")}
        </h1>
        <p className="max-w-xl text-lg text-white/60">{t("home.subtitle")}</p>
        <button
          type="button"
          className="rounded-full bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-white/90"
        >
          {t("home.cta")}
        </button>
      </main>

      <footer className="px-6 py-4 text-center text-xs text-white/30">
        {t("app.tagline")}
      </footer>
    </div>
  );
}
