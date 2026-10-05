import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { Button } from "@/components/ui/button";
import { useUrlStore } from "@/hooks/stores";
import { useSheet } from "@/hooks/useSheet";
import { useAddUrlFormStructure } from "../forms/useAddUrlFormStructure";
import { cn } from "cn";

interface useCreateURLSheetProps {
  className?: string;
  groupName?: string;
  onAddUrl: (url: string, name: string, pointToCenter?: boolean) => void;
}

export const useCreateUrlSheet = ({
  className,
  groupName,
  onAddUrl,
}: useCreateURLSheetProps) => {
  const store = useUrlStore();
  const { addUrlFormStructure } = useAddUrlFormStructure({ store });

  function handleAddUrl(e: React.FormEvent) {
    e.preventDefault();
    const { name, url, pointToCenter } = store.createDto;
    if (!url.trim() || !name.trim()) return;

    let urlToAdd = url.trim();
    if (!urlToAdd.startsWith("http://") && !urlToAdd.startsWith("https://")) {
      urlToAdd = "https://" + urlToAdd;
    }

    onAddUrl(urlToAdd, name.trim(), pointToCenter);
    store.resetCreate();
    closeSheet();
  }

  const { SheetFragment, openSheet, closeSheet } = useSheet({
    title: "Add New URL",
    description: groupName ? `Add a new URL to ${groupName}` : "Add a new URL",
    side: "right",
    className: "min-w-[33vw] px-4",
    headerClassName: "px-0",
    children: (
      <form
        onSubmit={handleAddUrl}
        className={cn("flex flex-col flex-1 gap-4 pb-4", className)}
      >
        <FormBuilder structure={addUrlFormStructure} />
        <div className="flex justify-end gap-2 mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => store.resetCreate()}
            className="w-fit"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={
              !store.createDto.url.trim() || !store.createDto.name.trim()
            }
            className="w-fit"
          >
            Save
          </Button>
        </div>
      </form>
    ),
  });

  return { SheetFragment, openSheet, closeSheet };
};
