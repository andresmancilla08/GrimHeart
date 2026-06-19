"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

interface Props {
  backHref?: string;
  onBack?: () => void;
}

/** Interior screen header: back arrow (left) + brand (right). */
export function SubHeader({ backHref, onBack }: Props) {
  const router = useRouter();

  function handleBack() {
    if (onBack) { onBack(); return; }
    if (backHref) { router.push(backHref); return; }
    router.back();
  }

  return (
    <div className="pt-safe flex h-14 items-center justify-between bg-background/70 px-4 backdrop-blur-md">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Volver"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-surface-2/40 text-muted transition hover:text-foreground active:scale-95"
      >
        <IconArrowLeft size={20} stroke={1.8} />
      </button>

      <Image src="/logo.png" alt="GrimHeart" width={100} height={67} className="object-contain" style={{ height: 32, width: "auto" }} />
    </div>
  );
}
