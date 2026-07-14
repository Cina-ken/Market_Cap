import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-page px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"
        >
          <ArrowLeft size={16} />
          Back to MarketCap
        </Link>

        <div className="mt-6 rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-ink">Terms of Service</h1>
          <p className="mt-1 text-sm text-muted">Last updated: July 2026</p>

          <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink">
            <p>
              By using MarketCap, you agree to these terms. If you do not
              agree, please do not use the service.
            </p>
            <div>
              <h2 className="font-semibold text-ink">1. The service</h2>
              <p className="mt-1 text-muted">
                MarketCap provides stock market data, news, and a personal
                watchlist feature. Market data is sourced from third-party
                providers and may be delayed; it is provided for informational
                purposes only and is not investment advice.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-ink">2. Accounts</h2>
              <p className="mt-1 text-muted">
                You&apos;re responsible for keeping your account credentials
                secure and for all activity under your account.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-ink">3. Subscriptions</h2>
              <p className="mt-1 text-muted">
                The Paid plan is billed monthly and renews automatically until
                cancelled. You can cancel anytime from your account
                settings; access continues until the end of the current
                billing period.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-ink">4. No investment advice</h2>
              <p className="mt-1 text-muted">
                Nothing on MarketCap constitutes financial or investment
                advice. Always do your own research before making investment
                decisions.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-ink">5. Changes</h2>
              <p className="mt-1 text-muted">
                We may update these terms from time to time. Continued use of
                the service after changes means you accept the updated terms.
              </p>
            </div>
            <p className="text-muted">
              Questions? Contact{" "}
              <a href="mailto:support@marketcap.app" className="text-accent">
                support@marketcap.app
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
