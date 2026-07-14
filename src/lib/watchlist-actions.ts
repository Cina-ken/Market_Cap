"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, isSubscribed } from "@/lib/auth";

export type WatchlistActionResult =
  | { ok: true }
  | { ok: false; reason: "signed_out" | "not_subscribed" | "error" };

export async function addToWatchlist(
  ticker: string,
  companyName: string | null
): Promise<WatchlistActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, reason: "signed_out" };

  if (!(await isSubscribed(user.id))) {
    return { ok: false, reason: "not_subscribed" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("watchlist_items").insert({
    user_id: user.id,
    ticker: ticker.toUpperCase(),
    company_name: companyName,
  });

  if (error && error.code !== "23505") {
    // 23505 = unique_violation (already saved) — treat as success, idempotent
    return { ok: false, reason: "error" };
  }

  revalidatePath("/");
  revalidatePath(`/stock/${ticker.toUpperCase()}`);
  return { ok: true };
}

export async function removeFromWatchlist(
  ticker: string
): Promise<WatchlistActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, reason: "signed_out" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("watchlist_items")
    .delete()
    .eq("user_id", user.id)
    .eq("ticker", ticker.toUpperCase());

  if (error) return { ok: false, reason: "error" };

  revalidatePath("/");
  revalidatePath(`/stock/${ticker.toUpperCase()}`);
  return { ok: true };
}
