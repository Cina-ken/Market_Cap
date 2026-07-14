import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          <h1 className="text-2xl font-bold text-ink">Privacy Policy</h1>
          <p className="mt-1 text-sm text-muted">Last updated: July 2026</p>

          <div className="mt-6 space-y-5 text-sm leading-relaxed text-ink">
            <p>
              This policy explains what data MarketCap collects and how it&apos;s
              used.
            </p>
            <div>
              <h2 className="font-semibold text-ink">1. What we collect</h2>
              <p className="mt-1 text-muted">
                Your email address (for your account), the stocks you save to
                your watchlist, and billing information handled directly by
                Stripe — we never see or store your card details ourselves.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-ink">2. How we use it</h2>
              <p className="mt-1 text-muted">
                To run your account, sync your watchlist across devices,
                process subscription payments, and provide customer support.
                We don&apos;t sell your data.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-ink">3. Third-party services</h2>
              <p className="mt-1 text-muted">
                We use Supabase for authentication and data storage, Stripe
                for payments, and Finnhub / Twelve Data for market data. Each
                is bound by its own privacy practices.
              </p>
            </div>
            <div>
              <h2 className="font-semibold text-ink">4. Your data</h2>
              <p className="mt-1 text-muted">
                You can request deletion of your account and associated data
                at any time by contacting us.
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
