"use client";

import { useState } from "react";

export function StockLogo({
  ticker,
  logo,
}: {
  ticker: string;
  logo?: string | null;
}) {
  const [failed, setFailed] = useState(false);

  if (logo && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt={`${ticker} logo`}
        width={40}
        height={40}
        className="h-10 w-10 rounded-full border border-line bg-white object-contain p-1"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
      {ticker.charAt(0)}
    </div>
  );
}
