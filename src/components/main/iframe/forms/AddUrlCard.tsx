import React from "react";
import { Plus } from "lucide-react";
import { useSheet } from "@/hooks/useSheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { FormBuilder } from "@/components/shared/form-builder/FormBuilder";
import { useAddUrlFormStructure } from "./useAddUrlFormStructure";
import { useUrlStore } from "@/hooks/stores";

interface AddUrlCardProps {
  className?: string;
  groupName?: string;
  onAddUrl: (url: string, name: string, pointToCenter?: boolean) => void;
}

export function useAddUrlSheet(
  groupName: string | undefined,
  onAddUrl: (url: string, name: string, pointToCenter?: boolean) => void,
) {
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
      <form onSubmit={handleAddUrl} className="flex flex-col gap-4 mt-4">
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
}

export function AddUrlCard({
  className,
  groupName,
  onAddUrl,
}: AddUrlCardProps) {
  const { SheetFragment, openSheet } = useAddUrlSheet(groupName, onAddUrl);

  return (
    <div
      onClick={openSheet}
      className={cn(
        "flex flex-col items-center justify-center bg-background rounded-lg border-2 border-dashed border-border shadow-sm hover:border-foreground/50 hover:bg-muted/50 cursor-pointer transition-all h-full relative group min-h-50",
        className,
      )}
    >
      {SheetFragment}
      <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground">
        <Plus size={50} />
      </div>
    </div>
  );
}
