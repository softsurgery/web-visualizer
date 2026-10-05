"use client";
import React from "react";
import { Plus } from "lucide-react";
import { useSheet } from "@/hooks/useSheet";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { useAddGroupFormStructure } from "@/components/main/group/forms/useAddGroupFormStructure";
import { useGroupStore } from "@/hooks/stores";

interface SidebarActionsProps {
  className?: string;
  onAddGroup: (name: string) => void;
}

export function SidebarActions({ className, onAddGroup }: SidebarActionsProps) {
  const store = useGroupStore();
  const router = useRouter();

  const { addGroupFormStructure } = useAddGroupFormStructure({
    store,
  });

  const { SheetFragment, openSheet, closeSheet } = useSheet({
    title: "Add New Group",
    description: "Enter a name for the new URL group.",
    side: "left",
    children: (
      <form onSubmit={handleAddGroup} className="flex flex-col gap-4 mt-4">
        <FormBuilder structure={addGroupFormStructure} />
        <Button
          type="submit"
          disabled={!store.createDto.name.trim()}
          className="w-full"
        >
          Add Group
        </Button>
      </form>
    ),
  });

  function handleAddGroup(e: React.FormEvent) {
    e.preventDefault();
    const name = store.createDto.name.trim();
    if (!name) return;
    onAddGroup(name);
    store.reset();
    closeSheet();
    router.push(`/?group=${encodeURIComponent(name)}`);
  }

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
