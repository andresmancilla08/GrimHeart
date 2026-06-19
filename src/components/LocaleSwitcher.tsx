"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { setUserLocale } from "@/i18n/locale";
import { localeNames, locales, type Locale } from "@/i18n/config";

export function LocaleSwitcher() {
  const active = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-0.5 text-sm">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await setUserLocale(locale);
            })
          }
          className={`rounded-full px-3 py-1 transition-colors ${
            active === locale
              ? "bg-white text-black"
              : "text-white/70 hover:text-white"
          }`}
        >
          {localeNames[locale]}
        </button>
      ))}
    </div>
  );
}
