import Link from "next/link";
import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { syncSubscriptionToSupabase } from "@/lib/subscription-sync";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const user = await getCurrentUser();

  if (!session_id || !user) {
    redirect("/pricing");
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["subscription"],
  });

  const subscription = session.subscription;
  const paid =
    session.payment_status === "paid" &&
    subscription &&
    typeof subscription !== "string" &&
    session.customer;

  if (paid && typeof subscription !== "string" && subscription) {
    await syncSubscriptionToSupabase({
      userId: user.id,
      customerId: session.customer as string,
      subscription,
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-panel p-8 text-center">
        {paid ? (
          <>
            <h1 className="text-xl font-bold text-ink">You&apos;re all set!</h1>
            <p className="mt-2 text-sm text-muted">
              Your Paid plan is active. You can now save stocks to your
              watchlist.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-ink">Payment processing</h1>
            <p className="mt-2 text-sm text-muted">
              We&apos;re still confirming your payment. This can take a
              moment — check back shortly.
            </p>
          </>
        )}
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          Go to Portfolio
        </Link>
      </div>
    </div>
  );
}
