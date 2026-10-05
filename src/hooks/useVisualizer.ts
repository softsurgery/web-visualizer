"use client";
import React, { useEffect } from "react";
import { create } from "zustand";
import type { Group, LayoutType } from "@/types";
import { groups as groupsApi } from "@/api/groups";
let syncTimeout: NodeJS.Timeout | null = null;
const syncGroupsToDB = async (groups: Group[]) => {
  if (typeof window === "undefined") return;
  if (syncTimeout) clearTimeout(syncTimeout);
  
  syncTimeout = setTimeout(async () => {
    try {
      const data = await groupsApi.sync(groups);
      if (data.groups && Array.isArray(data.groups)) {
        const currentGroups = useVisualizerStore.getState().groups;
        let changed = false;
        const mapped = currentGroups.map((cg) => {
          const serverMatch =
            data.groups.find((sg: any) => String(sg.id) === String(cg.id)) ||
            data.groups.find((sg: any) => sg.name === cg.name);
          if (serverMatch && serverMatch.id !== cg.id) {
            changed = true;
            return { ...cg, id: serverMatch.id };
          }
          return cg;
        });
        if (changed) {
          const currentActiveId = useVisualizerStore.getState().activeGroupId;
          const updatedActive = mapped.find((g) => {
            const prev = currentGroups.find((cg) => cg.id === currentActiveId);
            return prev && prev.name === g.name;
          });
          useVisualizerStore.setState({
            groups: mapped,
            activeGroupId: updatedActive ? updatedActive.id : currentActiveId,
          });
        }
      }
    } catch (e) {
      console.error("Failed to sync groups to database", e);
    }
  }, 300);
};
import { v4 as uuidv4 } from "uuid";

interface VisualizerStore {
  groups: Group[];
  activeGroupId: string | null;
  isInitialized: boolean;
  addGroup: (name: string) => void;
  editGroup: (id: string, name: string) => void;
  deleteGroup: (id: string) => void;
  setActiveGroupId: (id: string | null) => void;
  addUrl: (url: string, name: string, pointToCenter?: boolean) => void;
  editUrl: (index: number, url: string, name: string, pointToCenter?: boolean) => void;
  deleteUrl: (index: number) => void;
  importGroups: (groups: Group[]) => void;
  changeGroupLayout: (id: string, layout: LayoutType) => void;
  reorderUrls: (groupId: string, newUrls: Group['urls']) => void;
  reorderGroups: (newGroups: Group[]) => void;
  initialize: () => Promise<void>;
}

export const useVisualizerStore = create<VisualizerStore>((set, get) => ({
  groups: [],
  activeGroupId: null,
  isInitialized: false,

  initialize: async () => {
    if (get().isInitialized) return;
    try {
      const payloadGroups = await groupsApi.findAll({ sort: 'order', limit: 1000 });
      if (payloadGroups && payloadGroups.length > 0) {
        // Deduplicate groups by name in case DB had duplicates
        const seenNames = new Set<string>();
        const uniqueGroups: Group[] = [];
        let hadDuplicates = false;
        for (const g of payloadGroups) {
          if (seenNames.has(g.name)) {
            hadDuplicates = true;
          } else {
            seenNames.add(g.name);
            uniqueGroups.push(g);
          }
        }
        
        let initialActiveId = uniqueGroups[0]?.id || null;
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const groupName = params.get("group");
          if (groupName) {
            const found = uniqueGroups.find((g) => g.name === groupName);
            if (found) {
              initialActiveId = found.id;
            }
          }
        }

        set({ groups: uniqueGroups, activeGroupId: initialActiveId });

        if (hadDuplicates) {
          syncGroupsToDB(uniqueGroups);
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

  editGroup: (id: string, name: string) => {
    const { groups, isInitialized } = get();
    const newGroups = groups.map((g) => (g.id === id ? { ...g, name } : g));
    set({ groups: newGroups });
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

  reorderGroups: (newGroups: Group[]) => {
    const { isInitialized } = get();
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
