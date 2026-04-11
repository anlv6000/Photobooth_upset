import React, { createContext, useContext, useState } from "react";

const CandidContext = createContext<any>(null);

export const CandidProvider = ({ children }: { children: React.ReactNode }) => {
  const [numberOfCopies, setNumberOfCopies] = useState<number>(1);
  const [layoutType, setLayoutType] = useState<string>("1");
  const [orientation, setOrientation] = useState<string>("portrait");
  const [theme, setTheme] = useState<string>("default");
  const [editorSettings, setEditorSettings] = useState<any>({});

  return (
    <CandidContext.Provider
      value={{
        numberOfCopies,
        setNumberOfCopies,
        layoutType,
        setLayoutType,
        orientation,
        setOrientation,
        theme,
        setTheme,
        editorSettings,
        setEditorSettings,
      }}
    >
      {children}
    </CandidContext.Provider>
  );
};

export const useCandidContext = () => useContext(CandidContext);
