export function DaggerheartMark({ className }: { className?: string }) {
  // A dagger descending through a heart — the Daggerheart motif.
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="dh-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--gold-bright)" />
          <stop offset="1" stopColor="var(--gold-deep)" />
        </linearGradient>
      </defs>
      {/* Heart */}
      <path
        d="M32 54C16 43 8 35 8 25.5 8 18.6 13.4 13 20 13c4.6 0 8.7 2.6 12 7 3.3-4.4 7.4-7 12-7 6.6 0 12 5.6 12 12.5C56 35 48 43 32 54Z"
        stroke="url(#dh-gold)"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="rgba(217,164,65,0.06)"
      />
      {/* Dagger blade */}
      <path
        d="M32 8 36 20 32 46 28 20 32 8Z"
        fill="url(#dh-gold)"
      />
      {/* Crossguard */}
      <path
        d="M22 22H42"
        stroke="url(#dh-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Pommel */}
      <circle cx="32" cy="50" r="2.4" fill="var(--gold-bright)" />
    </svg>
  );
}
