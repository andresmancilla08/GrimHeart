import Image from "next/image";
import { AppMenu } from "@/components/AppMenu";

/** Sticky, safe-area-aware top bar: brand left, account menu right. */
export function AppHeader({ username }: { username: string }) {
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-screen-md items-center justify-between px-4 pb-2">
        <Image src="/logo.png" alt="GrimHeart" width={120} height={80} className="object-contain" style={{ height: 36, width: "auto" }} priority />
        <AppMenu username={username} />
      </div>
    </header>
  );
}
