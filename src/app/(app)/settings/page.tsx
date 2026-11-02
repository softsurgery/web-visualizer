import { redirect } from "next/navigation";
import { SettingsView } from "@/components/settings/SettingsView";
import { getPayloadUser, loginRedirectPath } from "@/lib/payload-auth";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getPayloadUser();

  if (!user) {
    redirect(loginRedirectPath("/settings"));
  }

  return <SettingsView />;
}
