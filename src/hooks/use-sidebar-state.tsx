"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface SidebarContextType {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (val: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  toggle: () => {},
  setCollapsed: () => {}
});

export const useSidebarState = () => useContext(SidebarContext);

export const SidebarStateProvider = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
};
