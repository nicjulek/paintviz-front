import { useState, useEffect, useCallback } from "react";

export const useHelpMode = () => {
  const [isHelpModeActive, setIsHelpModeActive] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === "F1" || event.keyCode === 112) {
      event.preventDefault();
      setIsHelpModeActive((prev) => !prev);
    }
    if (event.key === "Escape") {
      setIsHelpModeActive(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { isHelpModeActive, setIsHelpModeActive };
};
