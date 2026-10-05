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
    children: (
      <form
        onSubmit={handleAddUrl}
        className={cn("flex flex-col gap-4 mt-4", className)}
      >
        <FormBuilder structure={addUrlFormStructure} />
        <Button
          type="submit"
          disabled={!store.createDto.url.trim() || !store.createDto.name.trim()}
          className="w-full"
        >
          Add URL
        </Button>
      </form>
    ),
  });

  return { SheetFragment, openSheet, closeSheet };
};
