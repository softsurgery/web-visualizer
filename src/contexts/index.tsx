import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Group, LayoutType } from "@/types";
import { StorageService } from "@/services/StorageService";
import { v4 as uuidv4 } from "uuid";

// --- Intro Context ---
interface IntroContextType {
  title?: ReactNode;
  description?: ReactNode;
  floating?: ReactNode;
  setIntro: (intro: { title?: ReactNode; description?: ReactNode; floating?: ReactNode }) => void;
  setTitle: (title?: ReactNode) => void;
  setDescription: (description?: ReactNode) => void;
  setFloating: (floating?: ReactNode) => void;
}

const IntroContext = createContext<IntroContextType>({
  setIntro: () => {},
  setTitle: () => {},
  setDescription: () => {},
  setFloating: () => {},
});

export function IntroProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<ReactNode>();
  const [description, setDescription] = useState<ReactNode>();
  const [floating, setFloating] = useState<ReactNode>();

  const setIntro = (intro: { title?: ReactNode; description?: ReactNode; floating?: ReactNode }) => {
    setTitle(intro.title);
    setDescription(intro.description);
    setFloating(intro.floating);
  };

  return (
    <IntroContext.Provider value={{ title, description, floating, setIntro, setTitle, setDescription, setFloating }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}

// --- Footer Context ---
interface FooterContextType {
  content?: ReactNode;
  setContent: (content?: ReactNode) => void;
}

const FooterContext = createContext<FooterContextType>({
  setContent: () => {},
});

export function FooterProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>();

  return (
    <FooterContext.Provider value={{ content, setContent }}>
      {children}
    </FooterContext.Provider>
  );
}

export function useFooter() {
  return useContext(FooterContext);
}

// --- UI Context ---
interface UIContextType {
  enableMainOverflow: boolean;
  setEnableMainOverflow: (enabled: boolean) => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

const UIContext = createContext<UIContextType>({
  enableMainOverflow: true,
  setEnableMainOverflow: () => {},
  showSidebar: true,
  setShowSidebar: () => {},
});

export function UIProvider({ children }: { children: ReactNode }) {
  const [enableMainOverflow, setEnableMainOverflow] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <UIContext.Provider value={{ enableMainOverflow, setEnableMainOverflow, showSidebar, setShowSidebar }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}

// --- Visualizer Context ---
interface VisualizerContextType {
  groups: Group[];
  activeGroupId: string | null;
  activeGroup?: Group;
  addGroup: (name: string) => void;
  deleteGroup: (id: string, e: React.MouseEvent) => void;
  setActiveGroupId: (id: string | null) => void;
  addUrl: (url: string, name: string, pointToCenter?: boolean) => void;
  editUrl: (index: number, url: string, name: string, pointToCenter?: boolean) => void;
  deleteUrl: (index: number) => void;
  importGroups: (groups: Group[]) => void;
  changeGroupLayout: (id: string, layout: LayoutType) => void;
}

const VisualizerContext = createContext<VisualizerContextType | null>(null);

export function VisualizerProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(() => StorageService.getGroups());
  const [activeGroupId, setActiveGroupId] = useState<string | null>(() => {
    const loadedGroups = StorageService.getGroups();
    return loadedGroups.length > 0 ? loadedGroups[0].id : null;
  });

  // Try to sync with Payload CMS API on mount
  useEffect(() => {
    async function syncPayloadGroups() {
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
            setGroups(payloadGroups);
            setActiveGroupId((prev) => (prev && payloadGroups.some((g) => g.id === prev) ? prev : payloadGroups[0].id));
          }
        }
      } catch {
        // Fallback to LocalStorage
      }
    }
    syncPayloadGroups();
  }, []);

  useEffect(() => {
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
                idx === indexToEdit ? { ...u, url, name, pointToCenter } : u,
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

  const importGroups = (importedGroups: Group[]) => {
    setGroups(importedGroups);
    if (importedGroups.length > 0) {
      setActiveGroupId(importedGroups[0].id);
    } else {
      setActiveGroupId(null);
    }
  };

  const changeGroupLayout = (id: string, layout: LayoutType) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, layout } : g)),
    );
  };

  const activeGroup = groups.find((g) => g.id === activeGroupId);

  return (
    <VisualizerContext.Provider
      value={{
        groups,
        activeGroupId,
        activeGroup,
        addGroup,
        deleteGroup,
        setActiveGroupId,
        addUrl,
        editUrl,
        deleteUrl,
        importGroups,
        changeGroupLayout,
      }}
    >
      {children}
    </VisualizerContext.Provider>
  );
}

export function useVisualizer() {
  const ctx = useContext(VisualizerContext);
  if (!ctx) {
    throw new Error("useVisualizer must be used within a VisualizerProvider");
  }
  return ctx;
}

// --- Breadcrumb Context ---
export type BreadcrumbRoute = { title: string; href?: string };

interface BreadcrumbContextProps {
  routes: BreadcrumbRoute[];
  setRoutes: (routes: BreadcrumbRoute[]) => void;
  clearRoutes: () => void;
}

export const BreadcrumbContext = createContext<Partial<BreadcrumbContextProps>>({});

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState<BreadcrumbRoute[]>([]);
  const clearRoutes = () => setRoutes([]);

  return (
    <BreadcrumbContext.Provider value={{ routes, setRoutes, clearRoutes }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export const useBreadcrumb = () => useContext(BreadcrumbContext);

