import React from "react";
import type { Group } from "@/types";
import { GroupItem } from "@/components/sidebar/GroupItem";
import { SidebarHeader } from "@/components/sidebar/SidebarHeader";
import { SidebarActions } from "@/components/sidebar/SidebarActions";
import { StorageService } from "@/services/StorageService";

interface SidebarProps {
  groups: Group[];
  activeGroupId: string | null;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onAddGroup: (name: string) => void;
  onDeleteGroup: (id: string, e: React.MouseEvent) => void;
  onSetActiveGroup: (id: string) => void;
  onImportGroups: (groups: Group[]) => void;
}

export function Sidebar({
  groups,
  activeGroupId,
  isSidebarOpen,
  setIsSidebarOpen,
  onAddGroup,
  onDeleteGroup,
  onSetActiveGroup,
  onImportGroups,
}: SidebarProps) {
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedGroups = await StorageService.importGroups(file);
      onImportGroups(importedGroups);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <aside
      className={`${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } absolute md:relative z-40 w-72 h-full bg-muted/30 border-r border-border flex flex-col transition-transform duration-300 ease-in-out`}
    >
      <SidebarHeader onClose={() => setIsSidebarOpen(false)} />

      <SidebarActions
        onAddGroup={onAddGroup}
        onExport={() => StorageService.exportGroups(groups)}
        onImport={handleImport}
      />

      <div className="flex-1 overflow-y-auto">
        {groups.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No groups yet. Create one above!
          </div>
        ) : (
          <ul className="py-2">
            {groups.map((group) => (
              <GroupItem
                key={group.id}
                group={group}
                isActive={activeGroupId === group.id}
                onSelect={onSetActiveGroup}
                onDelete={onDeleteGroup}
              />
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
