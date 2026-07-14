const TWELVE_DATA_BASE = "https://api.twelvedata.com";

function apiKey() {
  const key = process.env.TWELVE_DATA_API_KEY;
  if (!key) throw new Error("TWELVE_DATA_API_KEY is not set");
  return key;
}

export type ChartRange = "1W" | "1M" | "3M" | "1Y";

const RANGE_CONFIG: Record<ChartRange, { interval: string; outputsize: number }> = {
  "1W": { interval: "1h", outputsize: 50 },
  "1M": { interval: "1day", outputsize: 30 },
  "3M": { interval: "1day", outputsize: 90 },
  "1Y": { interval: "1week", outputsize: 52 },
};

export type PricePoint = { date: string; value: number };

export async function getTimeSeries(
  symbol: string,
  range: ChartRange
): Promise<PricePoint[]> {
  const { interval, outputsize } = RANGE_CONFIG[range];
  const res = await fetch(
    `${TWELVE_DATA_BASE}/time_series?symbol=${encodeURIComponent(symbol)}&interval=${interval}&outputsize=${outputsize}&apikey=${apiKey()}`,
    { next: { revalidate: 900 } }
  );
  if (!res.ok) {
    throw new Error(`Twelve Data request failed: ${res.status}`);
  }
  const data = await res.json();
  if (data.status === "error" || !Array.isArray(data.values)) {
    throw new Error(data?.message ?? "Twelve Data returned no values");
  }
  return (data.values as { datetime: string; close: string }[])
    .map((v) => ({ date: v.datetime, value: Number(v.close) }))
    .reverse();
}

// Sums daily closing prices across tickers to approximate total watchlist
// value over time (assumes one unit per ticker — we don't track share counts).
export async function getAggregateHistory(
  tickers: string[],
  range: ChartRange = "1M"
): Promise<PricePoint[]> {
  const capped = tickers.slice(0, 8); // stay within Twelve Data's free-tier rate limit
  const seriesList = await Promise.all(
    capped.map((t) => getTimeSeries(t, range).catch(() => []))
  );

  const valid = seriesList.filter((s) => s.length > 0);
  if (valid.length === 0) return [];

  const dateSets = valid.map((s) => new Set(s.map((p) => p.date)));
  const commonDates = valid[0]
    .map((p) => p.date)
    .filter((date) => dateSets.every((set) => set.has(date)));

  return commonDates.map((date) => ({
    date,
    value: valid.reduce((sum, series) => {
      const point = series.find((p) => p.date === date);
      return sum + (point?.value ?? 0);
    }, 0),
  }));
}
