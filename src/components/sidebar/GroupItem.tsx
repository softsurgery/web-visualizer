import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Group } from '@/types';
import { useDialog } from '@/hooks/useDialog';
import { Button } from '@/components/ui/button';

interface GroupItemProps {
  group: Group;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export function GroupItem({ group, isActive, onSelect, onDelete }: GroupItemProps) {
  const { DialogFragment, openDialog, closeDialog } = useDialog({
    title: "Delete Group",
    description: `Are you sure you want to delete "${group.name}"? This action cannot be undone.`,
    children: (isOpen, close) => (
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={close}>Cancel</Button>
        <Button variant="destructive" onClick={(e) => { onDelete(group.id, e as any); close(); }}>
          Delete
        </Button>
      </div>
    ),
  });

  return (
    <li>
      {DialogFragment}
      <Button
        variant="ghost"
        onClick={() => onSelect(group.id)}
        className={`w-full justify-between h-auto px-4 py-3 rounded-none group transition ${
          isActive
            ? 'bg-muted font-medium text-foreground'
            : 'text-muted-foreground'
        }`}
      >
        <span className="truncate pr-4">{group.name}</span>
        <span
          onClick={(e) => { e.stopPropagation(); openDialog(); }}
          className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
          title="Delete group"
        >
          <Trash2 size={16} />
        </span>
      </Button>
    </li>
  );
}
