"use client";
import React from "react";
import { create } from "zustand";
import type { Group, LayoutType } from "@/types";
import { groups as groupsApi } from "@/api/groups";
let syncTimeout: NodeJS.Timeout | null = null;
const syncGroupsToDB = async (groups: Group[]) => {
  if (typeof window === "undefined") return;
  if (useVisualizerStore.getState().isReadOnly) return;
  if (syncTimeout) clearTimeout(syncTimeout);

  syncTimeout = setTimeout(async () => {
    try {
      const data = await groupsApi.sync(groups);
      if (data.groups && Array.isArray(data.groups)) {
        const currentGroups = useVisualizerStore.getState().groups;
        let changed = false;
        const mapped = currentGroups.map((cg) => {
          const serverMatch =
            (cg.uuid && data.groups.find((sg: any) => sg.uuid === cg.uuid)) ||
            data.groups.find((sg) => String(sg.id) === String(cg.id)) ||
            data.groups.find((sg) => sg.name === cg.name);
          if (
            serverMatch &&
            (serverMatch.id !== cg.id ||
              (serverMatch.uuid && serverMatch.uuid !== cg.uuid) ||
              serverMatch.isPublic !== cg.isPublic)
          ) {
            changed = true;
            return {
              ...cg,
              id: String(serverMatch.id),
              uuid: serverMatch.uuid || cg.uuid,
              isPublic: Boolean(serverMatch.isPublic),
            };
          }
          return cg;
        });
        if (changed) {
          const currentActiveId = useVisualizerStore.getState().activeGroupId;
          const updatedActive = mapped.find((g) => {
            const prev = currentGroups.find((cg) => cg.id === currentActiveId);
            return prev && (prev.uuid === g.uuid || prev.name === g.name);
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
  isReadOnly?: boolean;
  isShared?: boolean;
  addGroup: (name: string, isPublic?: boolean) => void;
  editGroup: (id: string, name: string, isPublic?: boolean) => void;
  deleteGroup: (id: string) => void;
  setActiveGroupId: (id: string | null) => void;
  addUrl: (url: string, name: string, pointToCenter?: boolean) => void;
  editUrl: (
    index: number,
    url: string,
    name: string,
    pointToCenter?: boolean,
  ) => void;
  deleteUrl: (index: number) => void;
  importGroups: (groups: Group[]) => void;
  changeGroupLayout: (id: string, layout: LayoutType) => void;
  reorderUrls: (groupId: string, newUrls: Group["urls"]) => void;
  reorderGroups: (newGroups: Group[]) => void;
  initialize: () => Promise<void>;
}

export const useVisualizerStore = create<VisualizerStore>((set, get) => ({
  groups: [],
  activeGroupId: null,
  isInitialized: false,
  isReadOnly: false,
  isShared: false,

  initialize: async () => {
    if (get().isInitialized) return;
    try {
      const urlParams =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      let groupParam = urlParams?.get("group");
      const isSharedPath =
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/share");

      if (!groupParam && isSharedPath && typeof window !== "undefined") {
        const shareMatch = window.location.pathname.match(/\/share\/([^/?#]+)/);
        if (shareMatch) {
          groupParam = decodeURIComponent(shareMatch[1]);
        }
      }

      let payloadGroups: Group[] = [];
      let isAuth = false;
      try {
        payloadGroups = await groupsApi.findAll({ sort: "order", limit: 1000 });
        isAuth = true;
      } catch {
        // Not logged in or fetch failed
      }

      // Deduplicate groups
      const seenKeys = new Set<string>();
      const uniqueGroups: Group[] = [];
      for (const g of payloadGroups) {
        const key = g.uuid || g.id || g.name;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          uniqueGroups.push(g);
        }
      }

      let activeGroupFound: Group | null = null;
      if (groupParam) {
        activeGroupFound =
          uniqueGroups.find((g) => g.uuid === groupParam) ||
          uniqueGroups.find((g) => String(g.id) === groupParam) ||
          uniqueGroups.find((g) => g.name === groupParam) ||
          null;

        // If not found in user's groups, load from public share endpoint
        if (!activeGroupFound) {
          const sharedGroup = await groupsApi.findByShareUuid(groupParam);
          if (sharedGroup) {
            uniqueGroups.unshift(sharedGroup);
            activeGroupFound = sharedGroup;
          }
        }
      }

      const initialActiveId = activeGroupFound
        ? activeGroupFound.id
        : uniqueGroups[0]?.id || null;
      const isShared = Boolean(
        isSharedPath ||
          urlParams?.get("shared") === "true" ||
          (!isAuth && Boolean(activeGroupFound)),
      );
      const isReadOnly = isShared || (!isAuth && Boolean(activeGroupFound));

      set({
        groups: uniqueGroups,
        activeGroupId: initialActiveId,
        isReadOnly,
        isShared,
      });
    } finally {
      set({ isInitialized: true });
    }
  },

  addGroup: (name: string, isPublic: boolean = false) => {
    const newUuid = uuidv4();
    const newGroup: Group = {
      id: newUuid,
      uuid: newUuid,
      name,
      urls: [],
      isPublic,
    };
    const { groups, isInitialized } = get();
    const newGroups = [...groups, newGroup];
    set({ groups: newGroups, activeGroupId: newGroup.id });
    if (isInitialized) syncGroupsToDB(newGroups);
  },

  editGroup: (id: string, name: string, isPublic?: boolean) => {
    const { groups, isInitialized } = get();
    const newGroups = groups.map((g) =>
      g.id === id
        ? {
            ...g,
            name,
            isPublic: isPublic !== undefined ? isPublic : g.isPublic,
          }
        : g,
    );
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
      g.id === activeGroupId
        ? { ...g, urls: [...g.urls, { url, name, pointToCenter }] }
        : g,
    );
    set({ groups: newGroups });
    if (isInitialized) syncGroupsToDB(newGroups);
  },

  editUrl: (
    indexToEdit: number,
    url: string,
    name: string,
    pointToCenter?: boolean,
  ) => {
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

  reorderUrls: (groupId: string, newUrls: Group["urls"]) => {
    const { groups, isInitialized } = get();
    const newGroups = groups.map((g) =>
      g.id === groupId ? { ...g, urls: newUrls } : g,
    );
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

  React.useEffect(() => {
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
