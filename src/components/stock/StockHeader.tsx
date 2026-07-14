import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StockLogo } from "./StockLogo";
import { WatchlistButton } from "./WatchlistButton";

export function StockHeader({
  ticker,
  name,
  logo,
  isLoggedIn,
  isSubscribed,
  initialSaved,
}: {
  ticker: string;
  name?: string | null;
  logo?: string | null;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  initialSaved: boolean;
}) {
  return (
    <div className="space-y-4">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft size={16} />
        Back to Portfolio
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <StockLogo ticker={ticker} logo={logo} />
          <div>
            <h1 className="text-xl font-bold text-ink">{ticker}</h1>
            {name && <p className="text-sm text-muted">{name}</p>}
          </div>
        </div>

        <WatchlistButton
          ticker={ticker}
          companyName={name ?? null}
          isLoggedIn={isLoggedIn}
          isSubscribed={isSubscribed}
          initialSaved={initialSaved}
        />
      </div>
    </div>
  );
}
