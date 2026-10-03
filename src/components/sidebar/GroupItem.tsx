"use client";
import React from "react";
import { X, LayoutGrid, GripVertical } from "lucide-react";
import type { Group } from "@/types";
import { useDialog } from "@/hooks/useDialog";
import { Button } from "@/components/ui/button";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { useRouter, usePathname } from "next/navigation";

interface GroupItemProps {
  className?: string;
  group: Group;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  dragHandleProps?: { attributes: any; listeners: any };
}

export function GroupItem({
  className,
  group,
  isActive,
  onSelect,
  onDelete,
  dragHandleProps,
}: GroupItemProps) {
  const { DialogFragment, openDialog } = useDialog({
    title: "Delete Group",
    description: `Are you sure you want to delete "${group.name}"? This action cannot be undone.`,
    children: (_isOpen, close) => (
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={(e) => {
            onDelete(group.id, e as any);
            close();
          }}
        >
          Delete
        </Button>
      </div>
    ),
  });

  const router = useRouter();
  const pathname = usePathname();

  return (
    <SidebarMenuItem className={className}>
      {DialogFragment}
      <SidebarMenuButton
        isActive={isActive}
        onClick={() => {
          onSelect(group.id);
          router.push(`/?group=${encodeURIComponent(group.name)}`);
        }}
        className="justify-between"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {dragHandleProps ? (
            <div
              {...dragHandleProps.attributes}
              {...dragHandleProps.listeners}
              className="cursor-grab text-muted-foreground hover:text-foreground shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="size-4" />
            </div>
          ) : (
            <LayoutGrid className="size-4 shrink-0 text-sidebar-primary" />
          )}
          <span className="truncate">{group.name}</span>
        </div>
      </SidebarMenuButton>
      <SidebarMenuAction
        onClick={(e) => {
          e.stopPropagation();
          openDialog();
        }}
        className="text-muted-foreground hover:text-destructive"
        title="Delete group"
      >
        <X size={16} />
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}
