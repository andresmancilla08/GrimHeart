import Image from "next/image";
import Link from "next/link";
import { AppMenu } from "@/components/AppMenu";

/** Sticky, safe-area-aware top bar: brand left, account menu right. */
export function AppHeader({ username }: { username: string }) {
  return (
    <header className="pt-safe sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-screen-md items-center justify-between px-4 py-[10px]">
        <Link href="/" aria-label="Inicio">
          <Image src="/logo-sm.png" alt="GrimHeart" width={42} height={42} priority />
        </Link>
        <AppMenu username={username} />
      </div>
    </header>
  );
}
