import React, { createContext, useContext, useState, type ReactNode } from "react";

export interface FooterContextType {
  content?: ReactNode;
  setContent: (content?: ReactNode) => void;
}

export const FooterContext = createContext<FooterContextType>({
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
