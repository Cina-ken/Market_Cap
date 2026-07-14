"use client";

import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { TickerLogo } from "./TickerLogo";
import type { HoldingRow } from "@/lib/mock-data";

const columns = ["Name Stock", "Invest Date", "Volume", "Change", "Price/stock"];

export function StockTable({ rows }: { rows: HoldingRow[] }) {
  const router = useRouter();

  return (
    <div className="rounded-2xl border border-line bg-panel p-5">
      <h3 className="text-base font-semibold text-ink">My Stock</h3>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-medium text-muted">
              {columns.map((col) => (
                <th key={col} className="pb-3 pr-4 font-medium">
                  <span className="flex items-center gap-1">
                    {col}
                    <ArrowUpDown size={12} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const positive = row.changePercent >= 0;
              return (
                <tr
                  key={row.ticker}
                  onClick={() => router.push(`/stock/${row.ticker}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      router.push(`/stock/${row.ticker}`);
                    }
                  }}
                  tabIndex={0}
                  role="link"
                  className="cursor-pointer border-b border-line transition-colors last:border-0 hover:bg-page"
                >
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <TickerLogo ticker={row.ticker} bg={row.logoBg} size={32} />
                      <div>
                        <div className="font-semibold text-ink">{row.ticker}</div>
                        <div className="text-xs text-muted">{row.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-ink">{row.investDate}</td>
                  <td className="py-4 pr-4 text-ink">{row.volume}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        positive
                          ? "bg-positive-soft text-positive"
                          : "bg-negative-soft text-negative"
                      }`}
                    >
                      {positive ? "↑" : "↓"} {Math.abs(row.changePercent).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-4 pr-4 font-semibold text-ink">
                    ${row.price.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
