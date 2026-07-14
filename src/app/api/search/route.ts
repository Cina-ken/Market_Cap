import { NextResponse } from "next/server";
import { searchSymbols } from "@/lib/finnhub";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";

  try {
    const results = await searchSymbols(q);
    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 502 });
  }
}
