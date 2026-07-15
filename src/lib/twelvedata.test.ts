import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAggregateHistory } from "./twelvedata";

type RawPoint = { datetime: string; close: string };

// Twelve Data returns newest-first; getTimeSeries reverses it back to
// chronological order, so the mock feeds data in the raw (descending) order.
function rawSeries(dates: string[], closes: number[]): RawPoint[] {
  return dates.map((datetime, i) => ({ datetime, close: String(closes[i]) })).reverse();
}

function mockFetch(bySymbol: Record<string, RawPoint[] | "error">) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const symbol = new URL(String(input)).searchParams.get("symbol")!;
    const entry = bySymbol[symbol];
    if (entry === undefined) {
      throw new Error(`unexpected symbol requested: ${symbol}`);
    }
    if (entry === "error") {
      return { ok: false, status: 500, json: async () => ({}) } as Response;
    }
    return {
      ok: true,
      status: 200,
      json: async () => ({ status: "ok", values: entry }),
    } as Response;
  });
}

beforeEach(() => {
  process.env.TWELVE_DATA_API_KEY = "test-key";
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getAggregateHistory", () => {
  it("caps fan-out at the first 8 tickers", async () => {
    const tickers = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    const bySymbol: Record<string, RawPoint[]> = {};
    for (const t of tickers.slice(0, 8)) {
      bySymbol[t] = rawSeries(["2024-01-01"], [10]);
    }
    const fetchMock = mockFetch(bySymbol);
    vi.stubGlobal("fetch", fetchMock);

    await getAggregateHistory(tickers, "1M");

    expect(fetchMock).toHaveBeenCalledTimes(8);
    const requested = fetchMock.mock.calls.map(
      ([input]) => new URL(String(input)).searchParams.get("symbol")
    );
    expect(requested.sort()).toEqual(["A", "B", "C", "D", "E", "F", "G", "H"]);
    expect(requested).not.toContain("I");
    expect(requested).not.toContain("J");
  });

  it("tolerates one ticker failing without failing the whole chart", async () => {
    const fetchMock = mockFetch({
      AAPL: rawSeries(["2024-01-01", "2024-01-02"], [100, 101]),
      MSFT: "error",
      GOOGL: rawSeries(["2024-01-01", "2024-01-02"], [50, 52]),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await getAggregateHistory(["AAPL", "MSFT", "GOOGL"], "1M");

    expect(result).toEqual([
      { date: "2024-01-01", value: 150 },
      { date: "2024-01-02", value: 153 },
    ]);
  });

  it("returns an empty series (not a throw) when every ticker fails", async () => {
    const fetchMock = mockFetch({ AAPL: "error", MSFT: "error" });
    vi.stubGlobal("fetch", fetchMock);

    const result = await getAggregateHistory(["AAPL", "MSFT"], "1M");

    expect(result).toEqual([]);
  });

  it("reduces to the intersection of dates, not a union or the first series' range", async () => {
    const fetchMock = mockFetch({
      // AAPL has an extra leading date (01-01) that MSFT lacks.
      AAPL: rawSeries(["2024-01-01", "2024-01-02", "2024-01-03"], [10, 20, 30]),
      // MSFT has an extra trailing date (01-04) that AAPL lacks.
      MSFT: rawSeries(["2024-01-02", "2024-01-03", "2024-01-04"], [1, 2, 3]),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await getAggregateHistory(["AAPL", "MSFT"], "1M");

    // Only 01-02 and 01-03 appear in both series; 01-01 and 01-04 must be dropped.
    expect(result).toEqual([
      { date: "2024-01-02", value: 21 },
      { date: "2024-01-03", value: 32 },
    ]);
  });
});
