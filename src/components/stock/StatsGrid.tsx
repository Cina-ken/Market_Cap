import { formatMarketCap, formatPrice, formatRatio } from "@/lib/format";
import type { BasicFinancials, CompanyProfile, Quote } from "@/lib/finnhub";

export function StatsGrid({
  quote,
  profile,
  financials,
}: {
  quote: Quote;
  profile: CompanyProfile | null;
  financials: BasicFinancials | null;
}) {
  const stats = [
    { label: "Open", value: formatPrice(quote.o) },
    { label: "Prev Close", value: formatPrice(quote.pc) },
    { label: "Day High", value: formatPrice(quote.h) },
    { label: "Day Low", value: formatPrice(quote.l) },
    { label: "Market Cap", value: formatMarketCap(profile?.marketCapitalization) },
    {
      label: "P/E Ratio",
      value: formatRatio(financials?.peTTM ?? financials?.peBasicExclExtraTTM),
    },
    { label: "52W High", value: formatPrice(financials?.["52WeekHigh"]) },
    { label: "Exchange", value: profile?.exchange ?? "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-line bg-panel p-4"
        >
          <div className="text-xs text-muted">{s.label}</div>
          <div className="mt-1 truncate text-sm font-semibold text-ink">
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}
