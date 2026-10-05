import React from "react";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { Button } from "@/components/ui/button";
import { useGroupStore } from "@/hooks/stores";
import { useSheet } from "@/hooks/useSheet";
import { useAddGroupFormStructure } from "../forms/useAddGroupFormStructure";
import { cn } from "cn";

interface UseCreateGroupSheetProps {
  className?: string;
  onAddGroup: (name: string) => void;
}

export const useCreateGroupSheet = ({
  className,
  onAddGroup,
}: UseCreateGroupSheetProps) => {
  const store = useGroupStore();
  const { addGroupFormStructure } = useAddGroupFormStructure({ store });

  const handleReset = React.useCallback(() => {
    store.resetCreate();
  }, [store]);

  const handleOpen = () => {
    handleReset();
    openSheet();
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    const name = store.createDto.name.trim();
    if (!name) return;

    onAddGroup(name);
    store.resetCreate();
    closeSheet();
  };

  const { SheetFragment, openSheet, closeSheet } = useSheet({
    title: "Add New Group",
    description: "Enter a name for the new URL group.",
    side: "right",
    className: "min-w-[33vw] px-4",
    headerClassName: "px-0",
    children: (
      <form
        onSubmit={handleAddGroup}
        className={cn("flex flex-col flex-1 gap-4 pb-4", className)}
      >
        <FormBuilder structure={addGroupFormStructure} />
        <div className="flex justify-end gap-2 mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
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

  return {
    SheetFragment,
    openSheet: handleOpen,
    closeSheet,
  };
};
