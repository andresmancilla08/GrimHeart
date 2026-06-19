"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

export function AuthShell({
  mode,
  children,
}: {
  mode: "login" | "register";
  children: React.ReactNode;
}) {
  const { t } = useTranslation(undefined, { keyPrefix: "auth" });
  const title = mode === "login" ? t("loginTitle") : t("registerTitle");
  const subtitle = mode === "login" ? t("loginSubtitle") : t("registerSubtitle");

  return (
    <div className="rounded-3xl border border-border bg-surface/80 px-6 py-7 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:px-8 sm:py-9">
      <div className="mb-6 flex flex-col items-center text-center">
        <Image src="/logo.png" alt="GrimHeart" width={120} height={80} style={{ height: 72, width: "auto" }} priority />
        <h1 className="mt-3 font-display text-[1.6rem] font-semibold leading-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
