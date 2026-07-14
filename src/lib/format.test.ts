import { describe, expect, it } from "vitest";
import { formatMarketCap, formatPrice, formatRatio } from "./format";

describe("formatMarketCap", () => {
  it("formats trillions", () => {
    expect(formatMarketCap(4_660_000)).toBe("$4.66T");
  });

  it("formats billions", () => {
    expect(formatMarketCap(1_500)).toBe("$1.50B");
  });

  it("formats millions below the billion threshold", () => {
    expect(formatMarketCap(999)).toBe("$999M");
  });

  it("returns an em dash for null, undefined, or NaN", () => {
    expect(formatMarketCap(null)).toBe("—");
    expect(formatMarketCap(undefined)).toBe("—");
    expect(formatMarketCap(NaN)).toBe("—");
  });

  it("treats exactly 1000 as the billion boundary", () => {
    expect(formatMarketCap(1_000)).toBe("$1.00B");
  });

  it("treats exactly 1,000,000 as the trillion boundary", () => {
    expect(formatMarketCap(1_000_000)).toBe("$1.00T");
  });
});

describe("formatRatio", () => {
  it("formats to two decimal places", () => {
    expect(formatRatio(37.9231)).toBe("37.92");
  });

  it("returns an em dash for null, undefined, or NaN", () => {
    expect(formatRatio(null)).toBe("—");
    expect(formatRatio(undefined)).toBe("—");
    expect(formatRatio(NaN)).toBe("—");
  });
});

describe("formatPrice", () => {
  it("formats with a dollar sign and two decimals", () => {
    expect(formatPrice(317.3)).toBe("$317.30");
  });

  it("returns an em dash for null, undefined, or NaN", () => {
    expect(formatPrice(null)).toBe("—");
    expect(formatPrice(undefined)).toBe("—");
    expect(formatPrice(NaN)).toBe("—");
  });
});
