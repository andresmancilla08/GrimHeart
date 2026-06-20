import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import { I18nProvider } from "@/i18n/I18nProvider";
import { DevSwKiller } from "@/components/DevSwKiller";
import { LANG_COOKIE, normalizeLocale } from "@/i18n/config";
import en from "@/i18n/locales/en.json";
import es from "@/i18n/locales/es.json";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

async function getLang() {
  const store = await cookies();
  return normalizeLocale(store.get(LANG_COOKIE)?.value);
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const m = (lang === "es" ? es : en).meta;
  return {
    title: m.title,
    description: m.description,
    manifest: "/manifest.webmanifest",
    appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Grimheart" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0c0a12",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const lang = await getLang();

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DevSwKiller />
        <I18nProvider initialLanguage={lang}>
          {/* App column: centered + capped on desktop/tablet. The `transform` makes
              this a containing block so fixed CTAs/aurora resolve to the column,
              not the full viewport (mobile unaffected — column is full-width). */}
          <div className="relative mx-auto w-full max-w-2xl transform-gpu">{children}</div>
        </I18nProvider>
      </body>
    </html>
  );
}
