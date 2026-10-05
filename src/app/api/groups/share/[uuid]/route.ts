import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ uuid: string }> },
) {
  try {
    const { uuid } = await params;
    if (!uuid) {
      return NextResponse.json({ error: "Missing UUID" }, { status: 400 });
    }

    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "groups",
      where: {
        or: [
          { uuid: { equals: uuid } },
          { name: { equals: decodeURIComponent(uuid) } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    });

    if (!result.docs || result.docs.length === 0) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    const doc = result.docs[0];
    return NextResponse.json({
      group: {
        id: String(doc.id),
        uuid: (doc as any).uuid || String(doc.id),
        name: doc.name,
        layout: doc.layout || "md",
        urls: (doc.urls || []).map((u) => ({
          url: u.url,
          name: u.name,
          pointToCenter: u.pointToCenter,
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
