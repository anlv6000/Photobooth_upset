declare module '*.css';
declare module '*.scss';
declare module '*.sass';

declare global {
  interface Window {
    electronAPI?: {
      saveFrameFile: (payload: any) => Promise<string>;
      loadAppState: () => Promise<any>;
      saveAppState: (state: any) => Promise<void>;
      savePhotoToLibrary: (dataUrl: string) => Promise<string>;
      loadPhotoLibrary: () => Promise<string[]>;
    };
  }
}

export {};
