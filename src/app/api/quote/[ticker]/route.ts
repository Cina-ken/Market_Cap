import { NextResponse } from "next/server";
import { getQuote } from "@/lib/finnhub";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  try {
    const quote = await getQuote(ticker.toUpperCase());
    return NextResponse.json(quote);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 502 }
    );
  }
}
