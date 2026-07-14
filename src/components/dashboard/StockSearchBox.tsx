"use client";

import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SymbolResult } from "@/lib/finnhub";

export function StockSearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SymbolResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // Clearing results when the query empties out is a sync-to-external-input
      // reset, not a cascading render; safe to set state directly here.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToTicker(symbol: string) {
    setOpen(false);
    setQuery("");
    router.push(`/stock/${symbol}`);
  }

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1 sm:flex-none">
      <Search
        size={16}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && results[0]) {
            goToTicker(results[0].symbol);
          }
        }}
        placeholder="Search stocks..."
        className="w-full rounded-full border border-line bg-panel py-2 pl-9 pr-9 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-soft sm:w-56"
      />
      {loading && (
        <Loader2
          size={14}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-muted"
        />
      )}

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-line bg-panel p-1.5 shadow-lg sm:w-72">
          {!loading && results.length === 0 && (
            <p className="px-3 py-2 text-sm text-muted">
              No matches for &quot;{query}&quot;
            </p>
          )}
          {results.map((r) => (
            <button
              key={r.symbol}
              type="button"
              onClick={() => goToTicker(r.symbol)}
              className="flex w-full flex-col items-start rounded-xl px-3 py-2 text-left hover:bg-page"
            >
              <span className="text-sm font-semibold text-ink">
                {r.displaySymbol}
              </span>
              <span className="truncate text-xs text-muted">
                {r.description}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
