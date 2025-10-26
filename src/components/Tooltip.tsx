import React from "react";
import { useHelpContext } from "../context/HelpContext";

interface TooltipProps {
  helpText: React.ReactNode;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ helpText, children }) => {
  const { isHelpModeActive } = useHelpContext();

  const helpTargetClasses = isHelpModeActive
    ? "ring-2 ring-indigo-500 rounded-md ring-offset-2 transition-all duration-300"
    : "";

  return (
    <div className={`relative inline-block ${helpTargetClasses}`}>
      {children}

      {isHelpModeActive && (
        <div
          className="absolute z-50 p-1.5 bg-indigo-700 text-white text-[0.65rem] rounded-md shadow-xl pointer-events-none 
                     whitespace-normal max-w-xs left-1/2 transform -translate-x-1/2 bottom-full mb-1.5"
        >
          <i className="bi bi-question-circle-fill inline-block w-3 h-3 mr-1 align-sub"></i>
          {helpText}
          <div
            className="absolute bottom-[-3px] left-1/2 transform -translate-x-1/2 w-0 h-0 
                       border-l-[3px] border-r-[3px] border-t-[3px] 
                       border-l-transparent border-r-transparent border-t-indigo-700"
          ></div>
        </div>
      )}
    </div>
  );
};
