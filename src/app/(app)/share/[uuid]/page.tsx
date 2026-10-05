import { redirect } from "next/navigation";

export default async function SharePage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  redirect(`/?group=${encodeURIComponent(uuid)}`);
}
