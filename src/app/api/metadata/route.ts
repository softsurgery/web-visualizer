import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const urlParam = request.nextUrl.searchParams.get("url");
    if (!urlParam) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }
    const targetUrl = new URL(urlParam);
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch =
      text.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
      text.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i);
    const generatorMatch =
      text.match(/<meta[^>]*name=["']generator["'][^>]*content=["']([^"']+)["'][^>]*>/i) ||
      text.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']generator["'][^>]*>/i);

    const metadata = {
      title: titleMatch ? titleMatch[1].trim() : "Unknown Title",
      description: descMatch ? descMatch[1].trim() : "No description available",
      generator: generatorMatch ? generatorMatch[1].trim() : "Unknown Generator",
      server: response.headers.get("server") || "Unknown Server",
    };

    return NextResponse.json(metadata);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
