import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { redirect } from "next/navigation";
import { GroupView } from "@/components/main/group/GroupView";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const params = await searchParams;
  const payload = await getPayload({ config: configPromise });
  const headers = await getHeaders();
  const { user } = await payload.auth({ headers });

  if (!user && params?.group) {
    redirect(`/share/${encodeURIComponent(params.group)}`);
  }

  if (!user) {
    redirect("/admin/login");
  }

  return <GroupView />;
}
