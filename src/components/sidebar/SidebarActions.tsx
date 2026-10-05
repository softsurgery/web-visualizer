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
    side: "right",
    className: "min-w-[33vw] px-4",
    headerClassName: "px-0",
    children: (
      <form
        onSubmit={handleAddGroup}
        className="flex flex-col flex-1 gap-4 pb-4"
      >
        <FormBuilder structure={addGroupFormStructure} />
        <div className="flex justify-end gap-2 mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => store.reset()}
            className="w-fit"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={!store.createDto.name.trim()}
            className="w-fit"
          >
            Save
          </Button>
        </div>
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
