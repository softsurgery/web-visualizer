import React, { createContext, useContext, useState, type ReactNode } from "react";

export interface UIContextType {
  enableMainOverflow: boolean;
  setEnableMainOverflow: (enabled: boolean) => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

export const UIContext = createContext<UIContextType>({
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
