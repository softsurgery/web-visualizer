import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return handleProxy(request);
}

export async function POST(request: NextRequest) {
  return handleProxy(request);
}

export async function PUT(request: NextRequest) {
  return handleProxy(request);
}

export async function DELETE(request: NextRequest) {
  return handleProxy(request);
}

async function handleProxy(request: NextRequest) {
  try {
    const urlParam = request.nextUrl.searchParams.get("url");
    if (!urlParam) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }
    const targetUrl = new URL(urlParam);

    let body: ArrayBuffer | undefined = undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      body = await request.arrayBuffer();
    }

    const fetchHeaders: Record<string, string> = {
      "User-Agent": request.headers.get("user-agent") || "Mozilla/5.0",
      Accept: request.headers.get("accept") || "*/*",
    };
    const contentType = request.headers.get("content-type");
    if (contentType) {
      fetchHeaders["Content-Type"] = contentType;
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: fetchHeaders,
      body: body ? Buffer.from(body) : undefined,
    });

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (
        ![
          "x-frame-options",
          "content-security-policy",
          "content-security-policy-report-only",
          "strict-transport-security",
        ].includes(lowerKey)
      ) {
        responseHeaders.set(key, value);
      }
    });

    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "*");

    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Proxy error" }, { status: 500 });
  }
}
