import { redirect } from "next/navigation";
import { getPayloadUser, loginRedirectPath } from "@/lib/payload-auth";

export const dynamic = "force-dynamic";

export default async function DetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getPayloadUser();

  if (!user) {
    redirect(loginRedirectPath("/"));
  }

  return children;
}
