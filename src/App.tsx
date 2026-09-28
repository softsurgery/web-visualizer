import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { MainView } from "@/components/main/MainView";
import { StorageService } from "@/services/StorageService";
import type { Group } from "@/types";

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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

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

  const addUrl = (url: string, name: string) => {
    if (!activeGroupId) return;
    setGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroupId ? { ...g, urls: [...g.urls, { url, name }] } : g,
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
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden">
      {/* Sidebar Overlay for mobile */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-4 left-4 z-50 p-2 bg-foreground text-background rounded-md shadow-md md:hidden hover:opacity-90 transition"
        >
          <Menu size={20} />
        </button>
      )}

      <Sidebar
        groups={groups}
        activeGroupId={activeGroupId}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onAddGroup={addGroup}
        onDeleteGroup={deleteGroup}
        onSetActiveGroup={setActiveGroupId}
        onImportGroups={handleImportGroups}
      />

      <main className="flex-1 flex flex-col h-full bg-background relative">
        <MainView
          activeGroup={activeGroup}
          onAddUrl={addUrl}
          onDeleteUrl={deleteUrl}
        />
      </main>
    </div>
  );
}

export default App;
