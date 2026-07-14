"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const RANGES = ["1W", "1M", "3M", "1Y"] as const;
type Range = (typeof RANGES)[number];

type PricePoint = { date: string; value: number };

export function PriceChartCard({
  ticker,
  title = "Price Chart",
}: {
  ticker: string;
  title?: string;
}) {
  const [range, setRange] = useState<Range>("1M");
  const [data, setData] = useState<PricePoint[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Resetting loading/error state before kicking off the fetch below is the
    // standard "sync with an external system" effect pattern, not cascading state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(false);

    fetch(`/api/history/${ticker}?range=${range}`)
      .then((res) => {
        if (!res.ok) throw new Error("request failed");
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ticker, range]);

  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <div className="flex items-center gap-1 rounded-full bg-page p-1 text-xs font-medium">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-full px-3 py-1 transition-colors ${
                range === r
                  ? "bg-accent text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 h-64 sm:h-72">
        {loading && (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Loading chart…
          </div>
        )}
        {!loading && (error || !data || data.length === 0) && (
          <div className="flex h-full flex-col items-center justify-center gap-1 text-center text-sm text-muted">
            <p>Chart data unavailable right now.</p>
          </div>
        )}
        {!loading && data && data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 8, left: -12, bottom: 0 }}
            >
              <defs>
                <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#17a34a" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#17a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#8b8b9a", fontSize: 11 }}
                minTickGap={40}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#8b8b9a", fontSize: 11 }}
                width={56}
              />
              <Tooltip
                formatter={(v) => [`$${Number(v).toFixed(2)}`, "Price"]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #ececf2",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#17a34a"
                strokeWidth={2}
                fill="url(#priceFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
