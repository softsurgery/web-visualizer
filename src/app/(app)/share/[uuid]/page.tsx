import { GroupView } from "@/components/main/group/GroupView";

export default async function SharePage({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const { uuid } = await params;
  return <GroupView isShared={true} shareUuid={uuid} />;
}

