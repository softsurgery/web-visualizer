import React from "react";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { Button } from "@/components/ui/button";
import { useGroupStore } from "@/hooks/stores";
import { useSheet } from "@/hooks/useSheet";
import { useEditGroupFormStructure } from "../forms/useEditGroupFormStructure";
import { cn } from "cn";
import type { Group } from "@/types";

interface UseUpdateGroupSheetProps {
  className?: string;
  group?: Group;
  groupId?: string;
  initialName?: string;
  initialIsPublic?: boolean;
  onEditGroup: (id: string, name: string, isPublic?: boolean) => void;
}

export const useUpdateGroupSheet = ({
  className,
  group,
  groupId: groupIdProp,
  initialName: initialNameProp,
  initialIsPublic: initialIsPublicProp,
  onEditGroup,
}: UseUpdateGroupSheetProps) => {
  const store = useGroupStore();
  const { editGroupFormStructure } = useEditGroupFormStructure({ store });

  const id = groupIdProp ?? group?.id ?? "";
  const name = initialNameProp ?? group?.name ?? "";
  const isPublic = initialIsPublicProp ?? group?.isPublic ?? false;

  const handleReset = React.useCallback(() => {
    store.set("updateDto", {
      name,
      isPublic,
    });
    store.set("updateDtoErrors", {});
  }, [name, isPublic, store]);

  const handleOpen = () => {
    handleReset();
    openSheet();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedName = store.updateDto.name.trim();
    if (!updatedName || !id) return;

    onEditGroup(id, updatedName, Boolean(store.updateDto.isPublic));
    store.resetUpdate();
    closeSheet();
  };

  const { SheetFragment, openSheet, closeSheet } = useSheet({
    title: "Edit Group",
    description: "Update the group name.",
    side: "right",
    className: "min-w-[33vw] px-4",
    headerClassName: "px-0",
    children: (
      <form
        onSubmit={handleUpdate}
        className={cn("flex flex-col flex-1 gap-4 pb-4", className)}
      >
        <FormBuilder structure={editGroupFormStructure} />
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
            disabled={!store.updateDto.name.trim()}
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
