import Link from "next/link";
import { TickerCardRow } from "@/components/dashboard/TickerCardRow";
import { PortfolioValueCard } from "@/components/dashboard/PortfolioValueCard";
import { StatisticsChart } from "@/components/dashboard/StatisticsChart";
import { StockTable } from "@/components/dashboard/StockTable";
import { PriceChartCard } from "@/components/stock/PriceChartCard";
import { getQuote } from "@/lib/finnhub";
import { getAggregateHistory } from "@/lib/twelvedata";
import { getCurrentUser, isSubscribed } from "@/lib/auth";
import { getWatchlistOrDemo } from "@/lib/watchlist";

export async function PortfolioDashboardBody() {
  const user = await getCurrentUser();
  const [{ usingRealWatchlist, tickerList }, subscribed] = await Promise.all([
    getWatchlistOrDemo(),
    user ? isSubscribed(user.id) : Promise.resolve(false),
  ]);

  const quotes = await Promise.all(
    tickerList.map((t) => getQuote(t.ticker).catch(() => null))
  );

  const tickerSnapshots = tickerList.slice(0, 8).map((t, i) => ({
    ticker: t.ticker,
    name: t.name,
    price: quotes[i]?.c ?? 0,
    changePercent: quotes[i]?.dp ?? 0,
    logoBg: t.logoBg,
  }));

  return (
    <>
      {!usingRealWatchlist && (
        <div className="rounded-2xl border border-line bg-accent-soft px-4 py-3 text-sm text-ink">
          {!user && (
            <>
              Showing live example stocks.{" "}
              <Link href="/login" className="font-semibold text-accent">
                Sign in
              </Link>{" "}
              and subscribe to build your own portfolio.
            </>
          )}
          {user && !subscribed && (
            <>
              Showing live example stocks.{" "}
              <Link href="/pricing" className="font-semibold text-accent">
                Upgrade to the Paid plan
              </Link>{" "}
              to save stocks and see your own portfolio here.
            </>
          )}
          {user && subscribed && (
            <>
              Your watchlist is empty. Search for a stock above and save it
              to see your portfolio here.
            </>
          )}
        </div>
      )}

      <TickerCardRow tickers={tickerSnapshots} />

      {usingRealWatchlist ? (
        <PortfolioSection tickerList={tickerList} quotes={quotes} />
      ) : (
        tickerList[0] && (
          <PriceChartCard
            ticker={tickerList[0].ticker}
            title={`${tickerList[0].ticker} — Live Price Chart`}
          />
        )
      )}
    </>
  );
}

async function PortfolioSection({
  tickerList,
  quotes,
}: {
  tickerList: Awaited<ReturnType<typeof getWatchlistOrDemo>>["tickerList"];
  quotes: (Awaited<ReturnType<typeof getQuote>> | null)[];
}) {
  const statisticsData = await getAggregateHistory(
    tickerList.map((t) => t.ticker),
    "1M"
  ).catch(() => []);

  const holdings = tickerList.map((t, i) => ({
    ticker: t.ticker,
    name: t.name,
    investDate: t.investDate,
    volume: t.volume,
    changePercent: quotes[i]?.dp ?? 0,
    price: quotes[i]?.c ?? 0,
    logoBg: t.logoBg,
  }));

  const validQuotes = tickerList
    .map((t, i) => ({ ticker: t.ticker, quote: quotes[i] }))
    .filter((q): q is { ticker: string; quote: NonNullable<(typeof quotes)[number]> } => !!q.quote);

  const totalValue = validQuotes.reduce((sum, q) => sum + q.quote.c, 0);
  const totalPrevClose = validQuotes.reduce((sum, q) => sum + q.quote.pc, 0);
  const todayChange = totalValue - totalPrevClose;
  const todayChangePercent =
    totalPrevClose > 0 ? (todayChange / totalPrevClose) * 100 : 0;

  const sortedByChange = [...validQuotes].sort(
    (a, b) => b.quote.dp - a.quote.dp
  );
  const bestTicker = sortedByChange[0]?.ticker ?? null;
  const worstTicker = sortedByChange[sortedByChange.length - 1]?.ticker ?? null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PortfolioValueCard
          value={totalValue}
          changePercent={todayChangePercent}
          todayChange={todayChange}
          bestTicker={bestTicker}
          worstTicker={worstTicker}
        />
        <StatisticsChart data={statisticsData} />
      </div>

      <StockTable rows={holdings} />
    </>
  );
}
