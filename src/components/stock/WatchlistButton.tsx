"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { addToWatchlist, removeFromWatchlist } from "@/lib/watchlist-actions";

export function WatchlistButton({
  ticker,
  companyName,
  isLoggedIn,
  isSubscribed,
  initialSaved,
}: {
  ticker: string;
  companyName: string | null;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  initialSaved: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <Link
        href={`/login?redirectTo=${encodeURIComponent(`/stock/${ticker}`)}`}
        className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
      >
        <Bookmark size={16} />
        Sign in to save
      </Link>
    );
  }

  if (!isSubscribed) {
    return (
      <Link
        href="/pricing"
        className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
      >
        <Bookmark size={16} />
        Upgrade to save
      </Link>
    );
  }

  function toggle() {
    const next = !saved;
    setSaved(next);
    startTransition(async () => {
      const result = next
        ? await addToWatchlist(ticker, companyName)
        : await removeFromWatchlist(ticker);
      if (!result.ok) {
        setSaved(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
        saved
          ? "bg-positive-soft text-positive"
          : "bg-accent text-white hover:bg-accent-hover"
      }`}
    >
      {pending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : saved ? (
        <BookmarkCheck size={16} />
      ) : (
        <Bookmark size={16} />
      )}
      {saved ? "Saved to watchlist" : "Add to watchlist"}
    </button>
  );
}
