const { ipcRenderer } = require('electron');

window.electronAPI = {
  saveFrameFile: (payload) => ipcRenderer.invoke('save-frame-file', payload),
  loadAppState: () => ipcRenderer.invoke('load-app-state'),
  saveAppState: (state) => ipcRenderer.invoke('save-app-state', state),
  savePhotoToLibrary: (dataUrl) => ipcRenderer.invoke('save-photo-to-library', dataUrl),
  loadPhotoLibrary: () => ipcRenderer.invoke('load-photo-library'),
};
