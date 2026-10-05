"use client";

import React, { createContext, useContext, useState, type ReactNode } from "react";

export type BreadcrumbRoute = { title: string; href?: string };

export interface BreadcrumbContextProps {
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
