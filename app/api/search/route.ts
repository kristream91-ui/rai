import { NextResponse } from "next/server";
import { searchTitles } from "@/lib/content";

export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  const limit = Math.min(Number(searchParams.get("limit") ?? 20) || 20, 50);

  if (!query) {
    return NextResponse.json({ query, count: 0, results: [] });
  }

  const results = (await searchTitles(query)).slice(0, limit);

  return NextResponse.json({
    query,
    count: results.length,
    results: results.map((title) => ({
      id: title.id,
      title: title.title,
      type: title.type,
      year: title.year,
      platform: title.platform,
      url: `/title/${title.id}`,
    })),
  });
}
