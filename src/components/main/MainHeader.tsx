import React from "react";
import { Plus } from "lucide-react";
import type { Group } from "@/types";
import { useSheet } from "@/hooks/useSheet";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "cn";
import { ModeToggle } from "../shared/mode-toggle";

interface MainHeaderProps {
  className?: string;
  activeGroup: Group;
  onAddUrl: (url: string, name: string, pointToCenter?: boolean) => void;
}

export function MainHeader({
  className,
  activeGroup,
  onAddUrl,
}: MainHeaderProps) {
  const [newUrl, setNewUrl] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [pointToCenter, setPointToCenter] = React.useState(false);

  const { SheetFragment, openSheet, closeSheet } = useSheet({
    title: "Add New URL",
    description: `Add a new URL to ${activeGroup.name}`,
    side: "right",
    children: (
      <form onSubmit={handleAddUrl} className="flex flex-col gap-4 mt-4">
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent bg-background text-foreground"
          autoFocus
        />
        <input
          type="text"
          placeholder="https://example.com"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent bg-background text-foreground"
        />
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={pointToCenter}
            onChange={(e) => setPointToCenter(e.target.checked)}
            className="rounded border-border text-foreground focus:ring-foreground"
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

  return (
    <header
      className={cn(
        "px-6 py-4 border-b border-border flex items-center justify-between bg-background",
        className,
      )}
    >
      {SheetFragment}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-4 mr-2" />
        <h2 className="text-lg font-bold text-foreground">
          {activeGroup.name}
        </h2>
      </div>
      <Button onClick={openSheet} className="flex items-center gap-2">
        <Plus size={18} /> <span className="hidden sm:inline">Add URL</span>
      </Button>
      <ModeToggle />
    </header>
  );
}
