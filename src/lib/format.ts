export function formatMarketCap(millions?: number | null): string {
  if (millions == null || Number.isNaN(millions)) return "—";
  if (millions >= 1_000_000) return `$${(millions / 1_000_000).toFixed(2)}T`;
  if (millions >= 1_000) return `$${(millions / 1_000).toFixed(2)}B`;
  return `$${millions.toFixed(0)}M`;
}

export function formatRatio(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toFixed(2);
}

export function formatPrice(value?: number | null): string {
  if (value == null || Number.isNaN(value)) return "—";
  return `$${value.toFixed(2)}`;
}
