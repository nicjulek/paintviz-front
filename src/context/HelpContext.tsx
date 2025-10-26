import React, { createContext, useContext } from "react";
import { useHelpMode } from "../hooks/useHelpMode";

interface HelpContextType {
  isHelpModeActive: boolean;
}

const HelpContext = createContext<HelpContextType | undefined>(undefined);

export const HelpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isHelpModeActive } = useHelpMode();

  return (
    <HelpContext.Provider value={{ isHelpModeActive }}>
      {children}
    </HelpContext.Provider>
  );
};

export const useHelpContext = () => {
  const context = useContext(HelpContext);
  if (!context) {
    throw new Error("useHelpContext deve ser usado dentro de um HelpProvider");
  }
  return context;
};
