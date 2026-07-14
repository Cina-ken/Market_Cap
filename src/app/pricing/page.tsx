import Link from "next/link";
import { Check } from "lucide-react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/dashboard/sidebar-context";
import { MobileMenuButton } from "@/components/dashboard/MobileMenuButton";
import { getCurrentUser, getSubscriptionStatus } from "@/lib/auth";
import { createCheckoutSession, openBillingPortal } from "@/lib/billing-actions";
import { PublicFooter } from "@/components/PublicFooter";

const freeFeatures = [
  "Live stock prices",
  "Search any ticker",
  "Stock detail pages",
  "Price charts (1W / 1M / 3M / 1Y)",
  "Company profiles & news",
];

const paidFeatures = [
  "Everything in Free",
  "Save stocks to your watchlist",
  "Unlimited watchlist items",
  "Watchlist synced across devices",
  "Priority support",
];

export default async function PricingPage() {
  const user = await getCurrentUser();
  const status = user ? await getSubscriptionStatus(user.id) : "free";
  const isActive = status === "active";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-page">
        <Sidebar />
        <main className="w-full min-w-0 flex-1 p-4 sm:p-6">
          <MobileMenuButton />

          <div className="mx-auto max-w-4xl py-6 sm:py-10">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-ink sm:text-4xl">
                Simple pricing
              </h1>
              <p className="mt-2 text-sm text-muted sm:text-base">
                Start free. Upgrade when you need your watchlist.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-line bg-panel p-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Free
                </span>
                <p className="mt-2 text-4xl font-bold text-ink">
                  $0
                  <span className="text-base font-medium text-muted">
                    /month
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted">
                  Everything you need to track the market.
                </p>
                <ul className="mt-6 space-y-3">
                  {freeFeatures.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-ink"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-positive"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {!user && (
                  <Link
                    href="/signup?redirectTo=%2Fpricing"
                    className="mt-8 block rounded-full border border-line py-2.5 text-center text-sm font-semibold text-ink hover:bg-page"
                  >
                    Get started free
                  </Link>
                )}
                {user && !isActive && (
                  <div className="mt-8 rounded-full border border-line py-2.5 text-center text-sm font-medium text-muted">
                    Your current plan
                  </div>
                )}
                {user && isActive && (
                  <div className="mt-8 rounded-full border border-line py-2.5 text-center text-sm font-medium text-muted">
                    Included
                  </div>
                )}
              </div>

              <div className="relative rounded-2xl border-2 border-accent bg-panel p-6">
                <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                  Pro
                </span>
                <p className="mt-2 text-4xl font-bold text-ink">
                  $20
                  <span className="text-base font-medium text-muted">
                    /month
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted">
                  For serious investors who want to save their picks.
                </p>
                <ul className="mt-6 space-y-3">
                  {paidFeatures.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-ink"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-positive"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {isActive ? (
                  <form action={openBillingPortal}>
                    <button
                      type="submit"
                      className="mt-8 w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
                    >
                      Manage subscription
                    </button>
                  </form>
                ) : (
                  <form action={createCheckoutSession}>
                    <button
                      type="submit"
                      className="mt-8 w-full rounded-full bg-accent py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
                    >
                      {user ? "Upgrade to Pro" : "Sign in to upgrade"}
                    </button>
                  </form>
                )}
                <p className="mt-2 text-center text-xs text-muted">
                  Recurring billing · Cancel anytime
                </p>
              </div>
            </div>

            <PublicFooter />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
