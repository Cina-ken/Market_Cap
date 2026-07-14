const FINNHUB_BASE = "https://finnhub.io/api/v1";

function apiKey() {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error("FINNHUB_API_KEY is not set");
  return key;
}

export type Quote = {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number; // day high
  l: number; // day low
  o: number; // day open
  pc: number; // previous close
  t: number; // quote timestamp (unix seconds)
};

export async function getQuote(
  symbol: string,
  revalidate = 15
): Promise<Quote> {
  const res = await fetch(
    `${FINNHUB_BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey()}`,
    { next: { revalidate } }
  );
  if (!res.ok) {
    throw new Error(`Finnhub quote request failed: ${res.status}`);
  }
  return res.json();
}

export type SymbolResult = {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
};

export async function searchSymbols(query: string): Promise<SymbolResult[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `${FINNHUB_BASE}/search?q=${encodeURIComponent(query)}&token=${apiKey()}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) {
    throw new Error(`Finnhub search request failed: ${res.status}`);
  }
  const data = await res.json();
  const results = (data.result ?? []) as SymbolResult[];
  return results.filter((r) => r.type === "Common Stock").slice(0, 8);
}

export type CompanyProfile = {
  name: string;
  ticker: string;
  logo: string;
  finnhubIndustry: string;
  exchange: string;
  marketCapitalization: number;
};

export async function getCompanyProfile(
  symbol: string
): Promise<CompanyProfile | null> {
  const res = await fetch(
    `${FINNHUB_BASE}/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data?.name ? (data as CompanyProfile) : null;
}

export type BasicFinancials = {
  peBasicExclExtraTTM?: number;
  peTTM?: number;
  "52WeekHigh"?: number;
  "52WeekLow"?: number;
};

export async function getBasicFinancials(
  symbol: string
): Promise<BasicFinancials | null> {
  const res = await fetch(
    `${FINNHUB_BASE}/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all&token=${apiKey()}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return (data?.metric as BasicFinancials) ?? null;
}

export function isQuoteEmpty(quote: Quote) {
  return quote.c === 0 && quote.pc === 0 && quote.o === 0 && quote.h === 0;
}

export type NewsArticle = {
  id: number;
  headline: string;
  source: string;
  url: string;
  datetime: number;
  image: string;
  summary: string;
};

function toDateStamp(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getCompanyNews(
  symbol: string,
  days = 14
): Promise<NewsArticle[]> {
  const to = new Date();
  const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);

  const res = await fetch(
    `${FINNHUB_BASE}/company-news?symbol=${encodeURIComponent(symbol)}&from=${toDateStamp(from)}&to=${toDateStamp(to)}&token=${apiKey()}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) {
    throw new Error(`Finnhub company-news request failed: ${res.status}`);
  }
  const data = (await res.json()) as NewsArticle[];
  return data.slice(0, 10);
}

export async function getMarketNews(): Promise<NewsArticle[]> {
  const res = await fetch(
    `${FINNHUB_BASE}/news?category=general&token=${apiKey()}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) {
    throw new Error(`Finnhub news request failed: ${res.status}`);
  }
  const data = (await res.json()) as NewsArticle[];
  return data.slice(0, 20);
}
