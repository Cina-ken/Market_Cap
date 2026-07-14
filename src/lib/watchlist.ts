import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { featuredTickers, type FeaturedTicker } from "@/lib/featured-tickers";

export type WatchlistItem = {
  ticker: string;
  company_name: string | null;
  added_at: string;
};

export async function getUserWatchlist(): Promise<WatchlistItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watchlist_items")
    .select("ticker, company_name, added_at")
    .order("added_at", { ascending: false });

  return data ?? [];
}

export async function isTickerSaved(ticker: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("watchlist_items")
    .select("ticker")
    .eq("ticker", ticker.toUpperCase())
    .maybeSingle();

  return !!data;
}

export async function getWatchlistOrDemo(): Promise<{
  usingRealWatchlist: boolean;
  tickerList: FeaturedTicker[];
}> {
  const user = await getCurrentUser();
  const watchlist = user ? await getUserWatchlist() : [];
  const usingRealWatchlist = watchlist.length > 0;

  const tickerList: FeaturedTicker[] = usingRealWatchlist
    ? watchlist.map((w) => ({
        ticker: w.ticker,
        name: w.company_name ?? w.ticker,
        logoBg: "#6d4aff",
        investDate: new Date(w.added_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        volume: "—",
      }))
    : featuredTickers;

  return { usingRealWatchlist, tickerList };
}
