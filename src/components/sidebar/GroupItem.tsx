"use client";
import React from "react";
import { X, LayoutGrid, GripVertical, Globe, Lock } from "lucide-react";
import type { Group } from "@/types";
import { useDialog } from "@/hooks/useDialog";
import { Button } from "@/components/ui/button";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

interface GroupItemProps {
  className?: string;
  group: Group;
  isActive: boolean;
  isReadOnly?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  dragHandleProps?: { attributes: any; listeners: any };
}

export function GroupItem({
  className,
  group,
  isActive,
  isReadOnly,
  onSelect,
  onDelete,
  dragHandleProps,
}: GroupItemProps) {
  const router = useRouter();

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
            onDelete(group.id, e);
            close();
          }}
        >
          Delete
        </Button>
      </div>
    ),
  });

  return (
    <SidebarMenuItem className={className}>
      {DialogFragment}
      <SidebarMenuButton
        isActive={isActive}
        onClick={() => {
          onSelect(group.id);
          router.push(
            `/?group=${group.uuid || encodeURIComponent(group.name)}`,
          );
        }}
        className="justify-between group-has-data-[sidebar=menu-action]/menu-item:pr-14"
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
          {!isReadOnly && dragHandleProps ? (
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
          {group.isPublic ? (
            <span title="Public Group" className="flex items-center">
              <Globe size="14" />
            </span>
          ) : (
            <span title="Private Group" className="flex items-center">
              <Lock size="14" />
            </span>
          )}
          <span className="truncate flex-1">{group.name}</span>
        </div>
      </SidebarMenuButton>
      {!isReadOnly && (
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
      )}
    </SidebarMenuItem>
  );
}
