// src/context/storeContext.ts
/// <reference path="../global.d.ts" />
import React, { createContext, useContext, useState, useEffect } from "react";
import { Theme } from "./themes"; // import interface Theme

export interface FrameComponent {
  id: string;
  name: string;
  type: 'header' | 'footer' | 'background' | 'frame';
  src: string;
}

export interface FrameCluster {
  id: string;
  name: string;
  headers: FrameComponent[];
  footers: FrameComponent[];
  backgrounds: FrameComponent[];
  frames: FrameComponent[];
}

export interface EventFramePreset {
  id: string;
  name: string;
  clusterId: string;
  layoutType: string;
  headerId: string;
  footerId: string;
  backgroundIds: string[]; // per slot
  frameId?: string; // optional overlay
}

interface CandidContextType {
  numberOfCopies: number;
  setNumberOfCopies: (n: number) => void;
  layoutType: string;
  setLayoutType: (t: string) => void;
  orientation: string;
  setOrientation: (o: string) => void;
  theme: Theme | null;
  setTheme: (t: Theme) => void;
  editorSettings: any;
  setEditorSettings: (s: any) => void;
  requiredCount: number;
  setRequiredCount: (n: number) => void;
  mode: string;
  setMode: (m: string) => void;
  frameComponents: FrameComponent[];
  setFrameComponents: React.Dispatch<React.SetStateAction<FrameComponent[]>>;
  frameClusters: FrameCluster[];
  setFrameClusters: React.Dispatch<React.SetStateAction<FrameCluster[]>>;
  eventFrames: EventFramePreset[];
  setEventFrames: React.Dispatch<React.SetStateAction<EventFramePreset[]>>;
  selectedEventPreset: EventFramePreset | null;
  setSelectedEventPreset: (preset: EventFramePreset | null) => void;
}

const CandidContext = createContext<CandidContextType | null>(null);

export const CandidProvider = ({ children }: { children: React.ReactNode }) => {
  const [numberOfCopies, setNumberOfCopies] = useState<number>(1);
  const [layoutType, setLayoutType] = useState<string>("1");
  const [orientation, setOrientation] = useState<string>("portrait");
  const [theme, setTheme] = useState<Theme | null>(null); // sửa ở đây
  const [editorSettings, setEditorSettings] = useState<any>({});
  const [requiredCount, setRequiredCount] = useState<number>(6);
  const [mode, setMode] = useState<string>("auto");
  const [frameComponents, setFrameComponents] = useState<FrameComponent[]>([]);
  const [frameClusters, setFrameClusters] = useState<FrameCluster[]>([]);
  const [eventFrames, setEventFrames] = useState<EventFramePreset[]>([]);
  const [selectedEventPreset, setSelectedEventPreset] = useState<EventFramePreset | null>(null);

  const [loaded, setLoaded] = useState(false);
  // Load state từ disk khi mount
  useEffect(() => {
    const loadState = async () => {
      if ((window as any).electronAPI?.loadAppState) {
        try {
          const state = await (window as any).electronAPI.loadAppState();
          console.log("📂 Loaded app state:", JSON.stringify(state, null, 2));
          setFrameComponents(state.frameComponents || []);
          setFrameClusters(state.frameClusters || []);
          setEventFrames(state.eventFrames || []);
          console.log("App state loaded:", state);
        } catch (error) {
          console.error("Failed to load app state:", error);
        } finally {
          setLoaded(true); // đánh dấu đã load xong
        }
      }
    };
    loadState();
    console.log("CandidProvider mounted, loading state...");
  }, []);



  return (
    <CandidContext.Provider
      value={{
        numberOfCopies, setNumberOfCopies,
        layoutType, setLayoutType,
        orientation, setOrientation,
        theme, setTheme,
        editorSettings, setEditorSettings,
        requiredCount, setRequiredCount,
        mode, setMode,
        frameComponents, setFrameComponents,
        frameClusters, setFrameClusters,
        eventFrames, setEventFrames,
        selectedEventPreset, setSelectedEventPreset
      }}
    >
      {children}
    </CandidContext.Provider>
  );
};

export const useCandidContext = () => {
  const ctx = useContext(CandidContext);
  if (!ctx) throw new Error("useCandidContext must be used within CandidProvider");
  return ctx;
};
