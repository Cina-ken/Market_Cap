import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { StockTable } from "@/components/dashboard/StockTable";
import { getQuote } from "@/lib/finnhub";
import { getCurrentUser, isSubscribed } from "@/lib/auth";
import { getWatchlistOrDemo } from "@/lib/watchlist";

export default async function MyStockPage() {
  const user = await getCurrentUser();
  const [{ usingRealWatchlist, tickerList }, subscribed] = await Promise.all([
    getWatchlistOrDemo(),
    user ? isSubscribed(user.id) : Promise.resolve(false),
  ]);

  return (
    <DashboardShell
      title="My Stock"
      subtitle={
        usingRealWatchlist
          ? "Every stock you've saved, in one list."
          : "Sign in and subscribe to build your own list."
      }
    >
      {!usingRealWatchlist && (
        <div className="rounded-2xl border border-line bg-accent-soft px-4 py-3 text-sm text-ink">
          {!user && (
            <>
              You haven&apos;t signed in yet.{" "}
              <Link href="/login" className="font-semibold text-accent">
                Sign in
              </Link>{" "}
              and subscribe to build your own list.
            </>
          )}
          {user && !subscribed && (
            <>
              You&apos;re signed in but not on the Paid plan yet.{" "}
              <Link href="/pricing" className="font-semibold text-accent">
                Upgrade to the Paid plan
              </Link>{" "}
              to save stocks here.
            </>
          )}
          {user && subscribed && (
            <>
              You haven&apos;t saved any stocks yet. Search for one above and
              add it.
            </>
          )}
        </div>
      )}

      {usingRealWatchlist && <MyStockTable tickerList={tickerList} />}
    </DashboardShell>
  );
}

async function MyStockTable({
  tickerList,
}: {
  tickerList: Awaited<ReturnType<typeof getWatchlistOrDemo>>["tickerList"];
}) {
  const quotes = await Promise.all(
    tickerList.map((t) => getQuote(t.ticker).catch(() => null))
  );

  const holdings = tickerList.map((t, i) => ({
    ticker: t.ticker,
    name: t.name,
    investDate: t.investDate,
    volume: t.volume,
    changePercent: quotes[i]?.dp ?? 0,
    price: quotes[i]?.c ?? 0,
    logoBg: t.logoBg,
  }));

  return <StockTable rows={holdings} />;
}
