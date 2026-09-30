import React, { createContext, useContext, useState, type ReactNode } from "react";

export interface IntroContextType {
  title?: ReactNode;
  description?: ReactNode;
  floating?: ReactNode;
  setIntro: (intro: { title?: ReactNode; description?: ReactNode; floating?: ReactNode }) => void;
  setTitle: (title?: ReactNode) => void;
  setDescription: (description?: ReactNode) => void;
  setFloating: (floating?: ReactNode) => void;
}

export const IntroContext = createContext<IntroContextType>({
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
