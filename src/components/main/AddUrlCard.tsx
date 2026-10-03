import React from "react";
import { Plus } from "lucide-react";
import { useSheet } from "@/hooks/useSheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddUrlCardProps {
  className?: string;
  groupName?: string;
  onAddUrl: (url: string, name: string, pointToCenter?: boolean) => void;
}

export function useAddUrlSheet(
  groupName: string | undefined,
  onAddUrl: (url: string, name: string, pointToCenter?: boolean) => void
) {
  const [newUrl, setNewUrl] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [pointToCenter, setPointToCenter] = React.useState(false);

  function handleAddUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!newUrl.trim() || !newName.trim()) return;

    let urlToAdd = newUrl.trim();
    if (!urlToAdd.startsWith("http://") && !urlToAdd.startsWith("https://")) {
      urlToAdd = "https://" + urlToAdd;
    }

    onAddUrl(urlToAdd, newName.trim(), pointToCenter);
    setNewUrl("");
    setNewName("");
    setPointToCenter(false);
    closeSheet();
  }

  const { SheetFragment, openSheet, closeSheet } = useSheet({
    title: "Add New URL",
    description: groupName ? `Add a new URL to ${groupName}` : "Add a new URL",
    side: "right",
    children: (
      <form onSubmit={handleAddUrl} className="flex flex-col gap-4 mt-4">
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-foreground bg-background text-foreground"
          autoFocus
        />
        <input
          type="text"
          placeholder="https://example.com"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-foreground bg-background text-foreground"
        />
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={pointToCenter}
            onChange={(e) => setPointToCenter(e.target.checked)}
            className="rounded text-foreground focus:ring-foreground"
          />
          Point to Center (Scroll vertically to center of iframe)
        </label>
        <Button
          type="submit"
          disabled={!newUrl.trim() || !newName.trim()}
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
