export function isUsMarketOpen(date = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
    weekday: "short",
  }).formatToParts(date);

  const weekday = parts.find((p) => p.type === "weekday")?.value;
  const hour = Number(parts.find((p) => p.type === "hour")?.value);
  const minute = Number(parts.find((p) => p.type === "minute")?.value);

  if (weekday === "Sat" || weekday === "Sun") return false;

  const minutesSinceMidnight = hour * 60 + minute;
  const open = 9 * 60 + 30;
  const close = 16 * 60;
  return minutesSinceMidnight >= open && minutesSinceMidnight < close;
}
