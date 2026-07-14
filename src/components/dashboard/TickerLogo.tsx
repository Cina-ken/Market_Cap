export function TickerLogo({
  ticker,
  bg,
  size = 40,
}: {
  ticker: string;
  bg: string;
  size?: number;
}) {
  const isLight = bg === "#ffffff";
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        background: bg,
        color: isLight ? "#12121a" : "#ffffff",
        border: isLight ? "1px solid var(--color-line)" : "none",
        fontSize: size * 0.4,
      }}
    >
      {ticker.charAt(0)}
    </div>
  );
}
