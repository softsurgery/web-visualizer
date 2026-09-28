import React from "react";
import { Plus, Download, Upload } from "lucide-react";
import { useSheet } from "@/hooks/useSheet";
import { Button } from "@/components/ui/button";

interface SidebarActionsProps {
  onAddGroup: (name: string) => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SidebarActions({
  onAddGroup,
  onExport,
  onImport,
}: SidebarActionsProps) {
  const [newGroupName, setNewGroupName] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { SheetFragment, openSheet, closeSheet } = useSheet({
    title: "Add New Group",
    description: "Enter a name for the new URL group.",
    side: "left",
    children: (
      <form onSubmit={handleAddGroup} className="flex flex-col gap-4 mt-4">
        <input
          type="text"
          placeholder="New Group Name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent bg-background text-foreground"
          autoFocus
        />
        <Button type="submit" disabled={!newGroupName.trim()} className="w-full">
          Add Group
        </Button>
      </form>
    ),
  });

  function handleAddGroup(e: React.FormEvent) {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    onAddGroup(newGroupName);
    setNewGroupName("");
    closeSheet();
  }

  return (
    <div className="p-4 border-b border-border bg-background">
      {SheetFragment}
      <div className="flex gap-2 mb-4">
        <button
          onClick={onExport}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium border border-border rounded hover:bg-muted transition text-foreground"
        >
          <Download size={16} /> Export
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-foreground text-background rounded hover:opacity-90 transition"
        >
          <Upload size={16} /> Import
        </button>
        <input
          type="file"
          accept=".json"
          className="hidden"
          ref={fileInputRef}
          onChange={onImport}
        />
      </div>

      <Button onClick={openSheet} className="w-full flex items-center gap-2">
        <Plus size={18} /> Add Group
      </Button>
    </div>
  );
}
