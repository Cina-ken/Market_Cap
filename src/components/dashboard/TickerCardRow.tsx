import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { TickerLogo } from "./TickerLogo";
import type { TickerSnapshot } from "@/lib/mock-data";

export function TickerCardRow({ tickers }: { tickers: TickerSnapshot[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {tickers.map((t) => {
        const positive = t.changePercent >= 0;
        return (
          <Link
            key={t.ticker}
            href={`/stock/${t.ticker}`}
            className="rounded-2xl border border-line bg-panel p-5 transition-colors hover:border-accent"
          >
            <div className="mb-4 flex items-center gap-3">
              <TickerLogo ticker={t.ticker} bg={t.logoBg} />
              <div>
                <div className="text-sm font-semibold text-ink">{t.ticker}</div>
                <div className="text-xs text-muted">{t.name}</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-ink">
              ${t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div
              className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                positive ? "text-positive" : "text-negative"
              }`}
            >
              {positive ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              {Math.abs(t.changePercent).toFixed(2)}% today
            </div>
          </Link>
        );
      })}
    </div>
  );
}
