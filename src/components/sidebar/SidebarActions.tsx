"use client";
import { Plus } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useCreateGroupSheet } from "../main/group/modals/useCreateGroupSheet";
import { useVisualizerStore } from "@/hooks/useVisualizer";

interface SidebarActionsProps {
  className?: string;
  onAddGroup: (name: string, isPublic?: boolean) => void;
}

export function SidebarActions({ className, onAddGroup }: SidebarActionsProps) {
  const router = useRouter();

  const { SheetFragment, openSheet } = useCreateGroupSheet({
    onAddGroup: (name, isPublic) => {
      onAddGroup(name, isPublic);
      const active = useVisualizerStore
        .getState()
        .groups.find((g) => g.name === name);
      router.push(`/?group=${active?.uuid || encodeURIComponent(name)}`);
    },
  });

  return (
    <>
      {SheetFragment}
      <SidebarMenuItem className={className}>
        <SidebarMenuButton onClick={openSheet}>
          <div className="flex items-center gap-2 overflow-hidden text-muted-foreground hover:text-foreground">
            <Plus className="size-4 shrink-0" />
            <span className="truncate">Add Group</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  );
}
