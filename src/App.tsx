import React from "react";
import { v4 as uuidv4 } from "uuid";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { MainView } from "@/components/main/MainView";
import { SettingsView } from "@/components/main/SettingsView";
import { WebsiteDetailsView } from "@/components/main/WebsiteDetailsView";
import { StorageService } from "@/services/StorageService";
import type { Group } from "@/types";
import { Routes, Route } from "react-router-dom";

function App() {
  const [groups, setGroups] = React.useState<Group[]>(() =>
    StorageService.getGroups(),
  );
  const [activeGroupId, setActiveGroupId] = React.useState<string | null>(
    () => {
      const loadedGroups = StorageService.getGroups();
      return loadedGroups.length > 0 ? loadedGroups[0].id : null;
    },
  );

  // Save to LocalStorage
  React.useEffect(() => {
    StorageService.saveGroups(groups);
  }, [groups]);

  const addGroup = (name: string) => {
    const newGroup: Group = {
      id: uuidv4(),
      name,
      urls: [],
    };
    setGroups((prev) => [...prev, newGroup]);
    setActiveGroupId(newGroup.id);
  };

  const deleteGroup = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this group?")) {
      setGroups((prev) => {
        const updated = prev.filter((g) => g.id !== id);
        if (activeGroupId === id) {
          setActiveGroupId(updated.length > 0 ? updated[0].id : null);
        }
        return updated;
      });
    }
  };

  const addUrl = (url: string, name: string, pointToCenter?: boolean) => {
    if (!activeGroupId) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroupId ? { ...g, urls: [...g.urls, { url, name, pointToCenter }] } : g,
      ),
    );
  };

  const editUrl = (indexToEdit: number, url: string, name: string, pointToCenter?: boolean) => {
    if (!activeGroupId) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroupId
          ? {
              ...g,
              urls: g.urls.map((u, idx) =>
                idx === indexToEdit ? { ...u, url, name, pointToCenter } : u
              ),
            }
          : g,
      ),
    );
  };

  const deleteUrl = (indexToRemove: number) => {
    if (!activeGroupId) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroupId
          ? { ...g, urls: g.urls.filter((_, idx) => idx !== indexToRemove) }
          : g,
      ),
    );
  };

  const handleImportGroups = (importedGroups: Group[]) => {
    setGroups(importedGroups);
    if (importedGroups.length > 0) {
      setActiveGroupId(importedGroups[0].id);
    } else {
      setActiveGroupId(null);
    }
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId);

  return (
    <SidebarProvider>
      <Sidebar
        groups={groups}
        activeGroupId={activeGroupId}
        onAddGroup={addGroup}
        onDeleteGroup={deleteGroup}
        onSetActiveGroup={setActiveGroupId}
      />

      <SidebarInset className="overflow-hidden">
        <Routes>
          <Route path="/" element={
            <MainView
              activeGroup={activeGroup}
              onAddUrl={addUrl}
              onEditUrl={editUrl}
              onDeleteUrl={deleteUrl}
            />
          } />
          <Route path="/settings" element={
            <SettingsView groups={groups} onImportGroups={handleImportGroups} />
          } />
          <Route path="/details/:urlId" element={<WebsiteDetailsView />} />
        </Routes>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
