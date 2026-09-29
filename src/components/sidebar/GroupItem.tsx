import React from 'react';
import { Trash2, LayoutGrid } from 'lucide-react';
import type { Group } from '@/types';
import { useDialog } from '@/hooks/useDialog';
import { Button } from '@/components/ui/button';
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuAction } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

interface GroupItemProps {
  className?: string;
  group: Group;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export function GroupItem({ className, group, isActive, onSelect, onDelete }: GroupItemProps) {
  const { DialogFragment, openDialog } = useDialog({
    title: "Delete Group",
    description: `Are you sure you want to delete "${group.name}"? This action cannot be undone.`,
    children: (_isOpen, close) => (
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={close}>Cancel</Button>
        <Button variant="destructive" onClick={(e) => { onDelete(group.id, e as any); close(); }}>
          Delete
        </Button>
      </div>
    ),
  });

  const navigate = useNavigate();

  return (
    <SidebarMenuItem className={className}>
      {DialogFragment}
      <SidebarMenuButton
        isActive={isActive}
        onClick={() => {
          onSelect(group.id);
          navigate("/");
        }}
        className="justify-between group-hover:bg-sidebar-accent"
      >
        <div className="flex items-center gap-2 overflow-hidden">
          <LayoutGrid className="size-4 shrink-0 text-sidebar-primary" />
          <span className="truncate">{group.name}</span>
        </div>
      </SidebarMenuButton>
      <SidebarMenuAction
        onClick={(e) => { e.stopPropagation(); openDialog(); }}
        className="text-muted-foreground hover:text-red-500"
        title="Delete group"
      >
        <Trash2 size={16} />
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}
