import { NextResponse } from "next/server";
import { getTimeSeries, type ChartRange } from "@/lib/twelvedata";

const VALID_RANGES: ChartRange[] = ["1W", "1M", "3M", "1Y"];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const { searchParams } = new URL(req.url);
  const rangeParam = searchParams.get("range") ?? "1M";
  const range = VALID_RANGES.includes(rangeParam as ChartRange)
    ? (rangeParam as ChartRange)
    : "1M";

  try {
    const data = await getTimeSeries(ticker.toUpperCase(), range);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 502 }
    );
  }
}
