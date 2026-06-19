"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

interface Props {
  backHref?: string;
  onBack?: () => void;
  /** Replaces the logo on the right with a custom element (e.g. a cancel action). */
  rightElement?: React.ReactNode;
}

/** Interior screen header: back arrow (left) + brand or custom action (right). */
export function SubHeader({ backHref, onBack, rightElement }: Props) {
  const router = useRouter();

  function handleBack() {
    if (onBack) { onBack(); return; }
    if (backHref) { router.push(backHref); return; }
    router.back();
  }

  return (
    <div className="pt-safe bg-background/70 backdrop-blur-md">
    <div className="flex items-center justify-between px-4 py-[10px]">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Volver"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-surface-2/40 text-muted transition hover:text-foreground active:scale-95"
      >
        <IconArrowLeft size={20} stroke={1.8} />
      </button>

      {rightElement ?? <Image src="/logo-sm.png" alt="GrimHeart" width={42} height={42} />}
    </div>
    </div>
  );
}
