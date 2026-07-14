import { describe, expect, it } from "vitest";
import { isUsMarketOpen } from "./market-hours";

// All times below are January (EST, UTC-5) to avoid DST ambiguity.
// Wednesday, Jan 10 2024.

describe("isUsMarketOpen", () => {
  it("is open mid-session on a weekday", () => {
    // 15:00 UTC = 10:00 America/New_York
    expect(isUsMarketOpen(new Date("2024-01-10T15:00:00Z"))).toBe(true);
  });

  it("is closed before the 9:30am open", () => {
    // 14:29 UTC = 9:29 America/New_York
    expect(isUsMarketOpen(new Date("2024-01-10T14:29:00Z"))).toBe(false);
  });

  it("is open exactly at the 9:30am open", () => {
    // 14:30 UTC = 9:30 America/New_York
    expect(isUsMarketOpen(new Date("2024-01-10T14:30:00Z"))).toBe(true);
  });

  it("is open one minute before the 4:00pm close", () => {
    // 20:59 UTC = 15:59 America/New_York
    expect(isUsMarketOpen(new Date("2024-01-10T20:59:00Z"))).toBe(true);
  });

  it("is closed exactly at the 4:00pm close", () => {
    // 21:00 UTC = 16:00 America/New_York
    expect(isUsMarketOpen(new Date("2024-01-10T21:00:00Z"))).toBe(false);
  });

  it("is closed on Saturday regardless of time", () => {
    expect(isUsMarketOpen(new Date("2024-01-13T15:00:00Z"))).toBe(false);
  });

  it("is closed on Sunday regardless of time", () => {
    expect(isUsMarketOpen(new Date("2024-01-14T15:00:00Z"))).toBe(false);
  });
});
