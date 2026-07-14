import Link from "next/link";
import {
  MoreVertical,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export function PortfolioValueCard({
  value,
  changePercent,
  todayChange,
  bestTicker,
  worstTicker,
}: {
  value: number;
  changePercent: number;
  todayChange: number;
  bestTicker: string | null;
  worstTicker: string | null;
}) {
  const positive = changePercent >= 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-panel p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Portfolio Values</h3>
        <button
          type="button"
          className="text-muted hover:text-ink"
          aria-label="More options"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-3xl font-bold text-ink">
          ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span
          className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
            positive ? "bg-positive-soft text-positive" : "bg-negative-soft text-negative"
          }`}
        >
          {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(changePercent).toFixed(2)}%
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">
        Your watchlist is {positive ? "up" : "down"} $
        {Math.abs(todayChange).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
        today across your saved stocks.
      </p>

      <div className="mt-4 flex gap-2">
        {worstTicker ? (
          <Link
            href={`/stock/${worstTicker}`}
            className="flex-1 rounded-full border border-line px-4 py-2 text-center text-sm font-medium text-ink hover:bg-page"
          >
            Worst: {worstTicker}
          </Link>
        ) : (
          <span className="flex-1 rounded-full border border-line px-4 py-2 text-center text-sm font-medium text-muted">
            Worst Performance
          </span>
        )}
        {bestTicker ? (
          <Link
            href={`/stock/${bestTicker}`}
            className="flex-1 rounded-full bg-accent px-4 py-2 text-center text-sm font-medium text-white hover:bg-accent-hover"
          >
            Top: {bestTicker}
          </Link>
        ) : (
          <span className="flex-1 rounded-full bg-accent px-4 py-2 text-center text-sm font-medium text-white opacity-60">
            Top Performance
          </span>
        )}
      </div>

      <button
        type="button"
        className="mt-4 flex items-center gap-3 rounded-xl bg-accent-soft px-4 py-3 text-left text-sm font-medium text-ink hover:brightness-95"
      >
        <Sparkles size={18} className="shrink-0 text-accent" />
        <span className="flex-1">
          Here&apos;s to improve your portfolio and understanding how investing
          works.
        </span>
        <ChevronRight size={16} className="shrink-0 text-muted" />
      </button>
    </div>
  );
}
