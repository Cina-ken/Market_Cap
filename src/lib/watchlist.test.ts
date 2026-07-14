import { beforeEach, describe, expect, it, vi } from "vitest";
import { featuredTickers } from "./featured-tickers";

const { getCurrentUserMock } = vi.hoisted(() => ({
  getCurrentUserMock: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({ getCurrentUser: getCurrentUserMock }));

const { fromMock, chainable, chainResult } = vi.hoisted(() => {
  const chainResult: { current: { data: unknown; error?: unknown } } = {
    current: { data: null },
  };
  const chainable: Record<string, ReturnType<typeof vi.fn>> = {};
  chainable.select = vi.fn(() => chainable);
  chainable.order = vi.fn(() => chainable);
  chainable.eq = vi.fn(() => chainable);
  chainable.maybeSingle = vi.fn(() => Promise.resolve(chainResult.current));
  // Supabase query builders are thenable, so `await supabase.from(...).select(...).order(...)`
  // resolves without an explicit terminal call.
  (chainable as { then?: unknown }).then = (
    resolve: (value: unknown) => unknown,
    reject: (reason: unknown) => unknown
  ) => Promise.resolve(chainResult.current).then(resolve, reject);
  const fromMock = vi.fn(() => chainable);
  return { fromMock, chainable, chainResult };
});
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ from: fromMock })),
}));

const { getUserWatchlist, isTickerSaved, getWatchlistOrDemo } = await import(
  "./watchlist"
);

beforeEach(() => {
  getCurrentUserMock.mockReset();
  chainResult.current = { data: null };
  fromMock.mockClear();
  Object.values(chainable).forEach((fn) => {
    if (typeof fn === "function" && "mockClear" in fn) fn.mockClear();
  });
});

describe("getUserWatchlist", () => {
  it("returns an empty array when supabase returns no data", async () => {
    chainResult.current = { data: null };
    expect(await getUserWatchlist()).toEqual([]);
  });

  it("returns the rows supabase provides", async () => {
    const rows = [
      { ticker: "AAPL", company_name: "Apple Inc", added_at: "2024-01-01T00:00:00Z" },
    ];
    chainResult.current = { data: rows };
    expect(await getUserWatchlist()).toEqual(rows);
  });
});

describe("isTickerSaved", () => {
  it("is true when a matching row exists", async () => {
    chainResult.current = { data: { ticker: "AAPL" } };
    expect(await isTickerSaved("aapl")).toBe(true);
  });

  it("is false when no matching row exists", async () => {
    chainResult.current = { data: null };
    expect(await isTickerSaved("aapl")).toBe(false);
  });

  it("uppercases the ticker before querying", async () => {
    chainResult.current = { data: null };
    await isTickerSaved("aapl");
    expect(chainable.eq).toHaveBeenCalledWith("ticker", "AAPL");
  });
});

describe("getWatchlistOrDemo", () => {
  it("falls back to featured tickers when signed out", async () => {
    getCurrentUserMock.mockResolvedValue(null);

    const result = await getWatchlistOrDemo();

    expect(result.usingRealWatchlist).toBe(false);
    expect(result.tickerList).toBe(featuredTickers);
  });

  it("falls back to featured tickers when signed in with an empty watchlist", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "user-1" });
    chainResult.current = { data: [] };

    const result = await getWatchlistOrDemo();

    expect(result.usingRealWatchlist).toBe(false);
    expect(result.tickerList).toBe(featuredTickers);
  });

  it("maps the user's saved tickers when the watchlist has items", async () => {
    getCurrentUserMock.mockResolvedValue({ id: "user-1" });
    const addedAt = "2024-02-22T12:00:00Z";
    chainResult.current = {
      data: [{ ticker: "AAPL", company_name: null, added_at: addedAt }],
    };

    const result = await getWatchlistOrDemo();
    const expectedDate = new Date(addedAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    expect(result.usingRealWatchlist).toBe(true);
    expect(result.tickerList).toEqual([
      {
        ticker: "AAPL",
        name: "AAPL", // company_name was null, falls back to the ticker
        logoBg: "#6d4aff",
        investDate: expectedDate,
        volume: "—",
      },
    ]);
  });
});
