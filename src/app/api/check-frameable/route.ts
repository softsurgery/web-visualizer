import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const urlParam = request.nextUrl.searchParams.get("url");
    if (!urlParam) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }
    const targetUrl = new URL(urlParam);
    let response = await fetch(targetUrl, {
      method: "HEAD",
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!response.ok && response.status === 405) {
      response = await fetch(targetUrl, {
        method: "GET",
        headers: { "User-Agent": "Mozilla/5.0" },
      });
    }
    const xFrameOptions = response.headers.get("x-frame-options")?.toLowerCase();
    const csp = response.headers.get("content-security-policy")?.toLowerCase();

    let frameable = true;
    if (xFrameOptions && (xFrameOptions.includes("deny") || xFrameOptions.includes("sameorigin"))) {
      frameable = false;
    }
    if (csp && csp.includes("frame-ancestors")) {
      frameable = false;
    }

    return NextResponse.json({ frameable });
  } catch {
    return NextResponse.json({ frameable: false });
  }
}
