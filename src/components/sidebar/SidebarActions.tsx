import React from "react";
import { Plus } from "lucide-react";
import { useSheet } from "@/hooks/useSheet";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

import { useRouter } from "next/navigation";

interface SidebarActionsProps {
  className?: string;
  onAddGroup: (name: string) => void;
}

export function SidebarActions({
  className,
  onAddGroup,
}: SidebarActionsProps) {
  const [newGroupName, setNewGroupName] = React.useState("");
  const router = useRouter();

  const { SheetFragment, openSheet, closeSheet } = useSheet({
    title: "Add New Group",
    description: "Enter a name for the new URL group.",
    side: "left",
    children: (
      <form onSubmit={handleAddGroup} className="flex flex-col gap-4 mt-4">
        <input
          type="text"
          placeholder="New Group Name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent bg-background text-foreground"
          autoFocus
        />
        <Button type="submit" disabled={!newGroupName.trim()} className="w-full">
          Add Group
        </Button>
      </form>
    ),
  });

  function handleAddGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onAddGroup(newGroupName);
    const nameToPush = newGroupName.trim();
    setNewGroupName("");
    closeSheet();
    router.push(`/?group=${encodeURIComponent(nameToPush)}`);
  }

  return (
    <div className={cn("p-4 border-t border-border bg-background mt-auto", className)}>
      {SheetFragment}

      <Button onClick={openSheet} className="w-full flex items-center gap-2">
        <Plus size={18} /> Add Group
      </Button>
    </div>
  );
}
