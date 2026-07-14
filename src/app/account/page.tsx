import Link from "next/link";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getCurrentUser, getSubscriptionStatus } from "@/lib/auth";
import { openBillingPortal } from "@/lib/billing-actions";
import { signOut } from "@/lib/auth-actions";

export default async function AccountPage() {
  const user = await getCurrentUser();
  const status = user ? await getSubscriptionStatus(user.id) : "free";
  const isActive = status === "active";

  return (
    <DashboardShell title="Account" subtitle="Manage your account and plan.">
      {!user ? (
        <div className="rounded-2xl border border-line bg-panel p-8 text-center">
          <p className="text-lg font-semibold text-ink">
            Sign in to manage your account
          </p>
          <Link
            href="/login?redirectTo=%2Faccount"
            className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-panel p-6">
            <h2 className="text-sm font-semibold text-ink">Email</h2>
            <p className="mt-1 text-sm text-muted">{user.email}</p>
          </div>

          <div className="rounded-2xl border border-line bg-panel p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-ink">Plan</h2>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isActive
                        ? "bg-positive-soft text-positive"
                        : "bg-line text-muted"
                    }`}
                  >
                    {isActive ? "Pro" : "Free"}
                  </span>
                  {isActive
                    ? "You can save stocks to your watchlist."
                    : "Upgrade to save stocks to your watchlist."}
                </p>
              </div>

              {isActive ? (
                <form action={openBillingPortal}>
                  <button
                    type="submit"
                    className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-page"
                  >
                    Manage subscription
                  </button>
                </form>
              ) : (
                <Link
                  href="/pricing"
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-panel p-6">
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-page"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
