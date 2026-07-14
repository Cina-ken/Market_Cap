import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StockHeader } from "@/components/stock/StockHeader";
import { PriceSummary } from "@/components/stock/PriceSummary";
import { PriceChartCard } from "@/components/stock/PriceChartCard";
import { StatsGrid } from "@/components/stock/StatsGrid";
import { NewsList } from "@/components/stock/NewsList";
import {
  getQuote,
  getCompanyProfile,
  getBasicFinancials,
  getCompanyNews,
  isQuoteEmpty,
} from "@/lib/finnhub";
import { getCurrentUser, isSubscribed } from "@/lib/auth";
import { isTickerSaved } from "@/lib/watchlist";

export default async function StockPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker: rawTicker } = await params;
  const ticker = rawTicker.toUpperCase();

  const user = await getCurrentUser();

  const [quote, profile, financials, news, subscribed, saved] =
    await Promise.all([
      getQuote(ticker).catch(() => null),
      getCompanyProfile(ticker).catch(() => null),
      getBasicFinancials(ticker).catch(() => null),
      getCompanyNews(ticker).catch(() => []),
      user ? isSubscribed(user.id) : Promise.resolve(false),
      user ? isTickerSaved(ticker) : Promise.resolve(false),
    ]);

  if (!quote || isQuoteEmpty(quote)) {
    return (
      <div className="min-h-screen bg-page px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-5xl space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
          >
            <ArrowLeft size={16} />
            Back to Portfolio
          </Link>
          <div className="rounded-2xl border border-line bg-panel p-8 text-center">
            <p className="text-lg font-semibold text-ink">
              We couldn&apos;t find &quot;{ticker}&quot;
            </p>
            <p className="mt-1 text-sm text-muted">
              Check the ticker symbol and try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <StockHeader
          ticker={ticker}
          name={profile?.name}
          logo={profile?.logo}
          isLoggedIn={!!user}
          isSubscribed={subscribed}
          initialSaved={saved}
        />
        <PriceSummary ticker={ticker} initialQuote={quote} />
        <PriceChartCard ticker={ticker} />
        <StatsGrid quote={quote} profile={profile} financials={financials} />
        <NewsList articles={news} />
      </div>
    </div>
  );
}
