import { describe, expect, it } from "vitest";
import { isQuoteEmpty, type Quote } from "./finnhub";

function makeQuote(overrides: Partial<Quote> = {}): Quote {
  return { c: 0, d: 0, dp: 0, h: 0, l: 0, o: 0, pc: 0, t: 0, ...overrides };
}

describe("isQuoteEmpty", () => {
  it("is true when current, previous close, open, and high are all zero", () => {
    expect(isQuoteEmpty(makeQuote())).toBe(true);
  });

  it("is false when the current price is non-zero", () => {
    expect(isQuoteEmpty(makeQuote({ c: 317.31 }))).toBe(false);
  });

  it("is false when only the previous close is non-zero", () => {
    expect(isQuoteEmpty(makeQuote({ pc: 315.32 }))).toBe(false);
  });

  it("is false for a fully populated quote", () => {
    expect(
      isQuoteEmpty(
        makeQuote({ c: 317.31, d: 1.99, dp: 0.63, h: 323.45, l: 315.78, o: 317.01, pc: 315.32 })
      )
    ).toBe(false);
  });
});
