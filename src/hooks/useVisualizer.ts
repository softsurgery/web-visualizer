import React, { useEffect } from "react";
import { create } from "zustand";
import type { Group, LayoutType } from "@/types";
const syncGroupsToDB = async (groups: Group[]) => {
  if (typeof window === "undefined") return;
  try {
    await fetch('/api/groups/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groups)
    });
  } catch (e) {
    console.error("Failed to sync groups to database", e);
  }
};
import { v4 as uuidv4 } from "uuid";

interface VisualizerStore {
  groups: Group[];
  activeGroupId: string | null;
  isInitialized: boolean;
  addGroup: (name: string) => void;
  deleteGroup: (id: string) => void;
  setActiveGroupId: (id: string | null) => void;
  addUrl: (url: string, name: string, pointToCenter?: boolean) => void;
  editUrl: (index: number, url: string, name: string, pointToCenter?: boolean) => void;
  deleteUrl: (index: number) => void;
  importGroups: (groups: Group[]) => void;
  changeGroupLayout: (id: string, layout: LayoutType) => void;
  reorderUrls: (groupId: string, newUrls: Group['urls']) => void;
  initialize: () => Promise<void>;
}

export const useVisualizerStore = create<VisualizerStore>((set, get) => ({
  groups: [],
  activeGroupId: null,
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;
    try {
      const res = await fetch("/api/groups");
      if (res.ok) {
        const data = await res.json();
        if (data.docs && Array.isArray(data.docs) && data.docs.length > 0) {
          const payloadGroups: Group[] = data.docs.map((doc: any) => ({
            id: String(doc.id),
            name: doc.name,
            layout: doc.layout,
            urls: (doc.urls || []).map((u: any) => ({
              url: u.url,
              name: u.name,
              pointToCenter: u.pointToCenter,
            })),
          }));
          set({ groups: payloadGroups, activeGroupId: payloadGroups[0].id });
        }
      }
    } catch {
      // Fetch failed
    } finally {
      set({ isInitialized: true });
    }
  },

  addGroup: (name: string) => {
    const newGroup: Group = { id: uuidv4(), name, urls: [] };
    const { groups, isInitialized } = get();
    const newGroups = [...groups, newGroup];
    set({ groups: newGroups, activeGroupId: newGroup.id });
    if (isInitialized) syncGroupsToDB(newGroups);
  },

  deleteGroup: (id: string) => {
    const { groups, activeGroupId, isInitialized } = get();
    const updated = groups.filter((g) => g.id !== id);
    let newActiveGroupId = activeGroupId;
    if (activeGroupId === id) {
      newActiveGroupId = updated.length > 0 ? updated[0].id : null;
    }
    set({ groups: updated, activeGroupId: newActiveGroupId });
    if (isInitialized) syncGroupsToDB(updated);
  },

  setActiveGroupId: (id: string | null) => {
    set({ activeGroupId: id });
  },

  addUrl: (url: string, name: string, pointToCenter?: boolean) => {
    const { groups, activeGroupId, isInitialized } = get();
    if (!activeGroupId) return;
    const newGroups = groups.map((g) =>
      g.id === activeGroupId ? { ...g, urls: [...g.urls, { url, name, pointToCenter }] } : g,
    );
    set({ groups: newGroups });
    if (isInitialized) syncGroupsToDB(newGroups);
  },

  editUrl: (indexToEdit: number, url: string, name: string, pointToCenter?: boolean) => {
    const { groups, activeGroupId, isInitialized } = get();
    if (!activeGroupId) return;
    const newGroups = groups.map((g) =>
      g.id === activeGroupId
        ? {
            ...g,
            urls: g.urls.map((u, idx) =>
              idx === indexToEdit ? { ...u, url, name, pointToCenter } : u,
            ),
          }
        : g,
    );
    set({ groups: newGroups });
    if (isInitialized) syncGroupsToDB(newGroups);
  },

  deleteUrl: (indexToRemove: number) => {
    const { groups, activeGroupId, isInitialized } = get();
    if (!activeGroupId) return;
    const newGroups = groups.map((g) =>
      g.id === activeGroupId
        ? { ...g, urls: g.urls.filter((_, idx) => idx !== indexToRemove) }
        : g,
    );
    set({ groups: newGroups });
    if (isInitialized) syncGroupsToDB(newGroups);
  },

  importGroups: (importedGroups: Group[]) => {
    const { isInitialized } = get();
    set({
      groups: importedGroups,
      activeGroupId: importedGroups.length > 0 ? importedGroups[0].id : null,
    });
    if (isInitialized) syncGroupsToDB(importedGroups);
  },

  changeGroupLayout: (id: string, layout: LayoutType) => {
    const { groups, isInitialized } = get();
    const newGroups = groups.map((g) => (g.id === id ? { ...g, layout } : g));
    set({ groups: newGroups });
    if (isInitialized) syncGroupsToDB(newGroups);
  },

  reorderUrls: (groupId: string, newUrls: Group['urls']) => {
    const { groups, isInitialized } = get();
    const newGroups = groups.map((g) => (g.id === groupId ? { ...g, urls: newUrls } : g));
    set({ groups: newGroups });
    if (isInitialized) syncGroupsToDB(newGroups);
  },
}));

export function useVisualizer() {
  const store = useVisualizerStore();

  useEffect(() => {
    store.initialize();
  }, [store.initialize]);

  const activeGroup = store.groups.find((g) => g.id === store.activeGroupId);

  const deleteGroup = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this group?")) {
      store.deleteGroup(id);
    }
  };

  return {
    ...store,
    activeGroup,
    deleteGroup,
  };
}
