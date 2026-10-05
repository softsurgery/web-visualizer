import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/settings/SettingsView";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const payload = await getPayload({ config: configPromise });
  const headers = await getHeaders();
  const { user } = await payload.auth({ headers });

  if (!user) {
    redirect("/admin/login");
  }

  return <SettingsView />;
}
