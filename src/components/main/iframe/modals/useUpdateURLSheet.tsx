import React from "react";
import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { Button } from "@/components/ui/button";
import { useUrlStore } from "@/hooks/stores";
import { useSheet } from "@/hooks/useSheet";
import { useEditUrlFormStructure } from "../forms/useEditUrlFormStructure";
import { cn } from "cn";

interface UseUpdateURLSheetProps {
  className?: string;
  url: string;
  name: string;
  pointToCenter?: boolean;
  onEdit: (url: string, name: string, pointToCenter: boolean) => void;
}

export const useUpdateUrlSheet = ({
  className,
  url,
  name,
  pointToCenter,
  onEdit,
}: UseUpdateURLSheetProps) => {
  const store = useUrlStore();
  const { editUrlFormStructure } = useEditUrlFormStructure({ store });

  const handleReset = React.useCallback(() => {
    store.set("updateDto", {
      name,
      url,
      pointToCenter: Boolean(pointToCenter),
    });
    store.set("updateDtoErrors", {});
  }, [name, url, pointToCenter, store]);

  const handleOpen = () => {
    handleReset();
    openSheet();
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const {
      name: updatedName,
      url: updatedUrl,
      pointToCenter: updatedPtc,
    } = store.updateDto;
    if (!updatedName.trim() || !updatedUrl.trim()) return;

    let urlToUpdate = updatedUrl.trim();
    if (
      !urlToUpdate.startsWith("http://") &&
      !urlToUpdate.startsWith("https://")
    ) {
      urlToUpdate = "https://" + urlToUpdate;
    }

    onEdit(urlToUpdate, updatedName.trim(), Boolean(updatedPtc));
    store.resetUpdate();
    closeSheet();
  };

  const { SheetFragment, openSheet, closeSheet } = useSheet({
    title: "Edit URL",
    description: "Update the details for this URL.",
    side: "right",
    className: "min-w-[33vw] px-4",
    headerClassName: "px-0",
    children: (
      <form
        onSubmit={handleUpdate}
        className={cn("flex flex-col flex-1 gap-4 pb-4", className)}
      >
        <FormBuilder structure={editUrlFormStructure} />
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
            disabled={
              !store.updateDto.url.trim() || !store.updateDto.name.trim()
            }
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

export const useUpdateURLSheet = useUpdateUrlSheet;
