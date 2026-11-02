import { redirect } from "next/navigation";
import { GroupView } from "@/components/main/group/GroupView";
import { getPayloadUser, loginRedirectPath } from "@/lib/payload-auth";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const params = await searchParams;
  const user = await getPayloadUser();

  if (!user && params?.group) {
    redirect(`/share/${encodeURIComponent(params.group)}`);
  }

  if (!user) {
    redirect(loginRedirectPath("/"));
  }

  return <GroupView />;
}
