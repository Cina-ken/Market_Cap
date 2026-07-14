"use client";

import { useEffect, useState } from "react";
import type { Quote } from "@/lib/finnhub";

const POLL_INTERVAL_MS = 20000;

export function PriceSummary({
  ticker,
  initialQuote,
}: {
  ticker: string;
  initialQuote: Quote;
}) {
  const [quote, setQuote] = useState(initialQuote);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch(`/api/quote/${ticker}`);
        if (res.ok) setQuote(await res.json());
      } catch {
        // keep showing the last known quote
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [ticker]);

  const positive = quote.d >= 0;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <span className="text-4xl font-bold text-ink">
        ${quote.c.toFixed(2)}
      </span>
      <span
        className={`mb-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
          positive ? "bg-positive-soft text-positive" : "bg-negative-soft text-negative"
        }`}
      >
        {positive ? "↑" : "↓"} {Math.abs(quote.dp).toFixed(2)}%
      </span>
      <span
        className={`mb-1 text-sm font-medium ${
          positive ? "text-positive" : "text-negative"
        }`}
      >
        {positive ? "+" : ""}
        {quote.d.toFixed(2)} today
      </span>
    </div>
  );
}
