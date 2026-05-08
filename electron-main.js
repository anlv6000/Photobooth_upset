const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const express = require("express");

let mainWindow;

async function ensureDirectory(directory) {
  await fs.promises.mkdir(directory, { recursive: true });
}

async function saveFrameFile({ type, clusterId, fileName, dataUrl }) {
  const base = path.join(app.getPath("userData"), "custom-frames");
  const clusterPath = path.join(base, clusterId);
  const typeDir = path.join(clusterPath, type === "frame" ? "frames" : `${type}s`);

  await ensureDirectory(typeDir);

  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const targetName = `${Date.now()}-${safeName}`;
  const targetPath = path.join(typeDir, targetName);

  const matches = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!matches) {
    throw new Error("Invalid data URL");
  }

  const buffer = Buffer.from(matches[2], "base64");
  await fs.promises.writeFile(targetPath, buffer);

  // Trả về URL HTTP thay vì file path
  return `/custom-frames/${clusterId}/${type === "frame" ? "frames" : `${type}s`}/${targetName}`;
}

async function loadAppState() {
  const statePath = path.join(app.getPath("userData"), "app-state.json");
  try {
    const data = await fs.promises.readFile(statePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    // Nếu file không tồn tại, trả về state mặc định
    return {
      frameComponents: [],
      frameClusters: [],
      eventFrames: []
    };
  }
}

async function saveAppState(state) {
  const statePath = path.join(app.getPath("userData"), "app-state.json");
  await fs.promises.writeFile(statePath, JSON.stringify(state, null, 2));
}

async function savePhotoToLibrary(dataUrl) {
  const libraryPath = path.join(app.getPath("userData"), "photo-library");
  await ensureDirectory(libraryPath);

  // Tạo tên file với date-time format
  const now = new Date();
  const dateTimeStr = now.toISOString().replace(/[:.]/g, '-').slice(0, -5); // YYYY-MM-DDTHH-MM-SS
  const fileName = `photo-${dateTimeStr}.png`;
  const targetPath = path.join(libraryPath, fileName);

  const matches = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!matches) {
    throw new Error("Invalid data URL");
  }

  const buffer = Buffer.from(matches[2], "base64");
  await fs.promises.writeFile(targetPath, buffer);

  return targetPath;
}

async function loadPhotoLibrary() {
  const libraryPath = path.join(app.getPath("userData"), "photo-library");

  try {
    const files = await fs.promises.readdir(libraryPath);
    // Lọc chỉ file PNG và sắp xếp theo thời gian mới nhất
    const pngFiles = files
      .filter(file => file.endsWith('.png'))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(libraryPath, a));
        const statB = fs.statSync(path.join(libraryPath, b));
        return statB.mtime - statA.mtime; // Mới nhất trước
      });

    // Trả về URL HTTP cho mỗi file
    return pngFiles.map(file => `/photo-library/${file}`);
  } catch (err) {
    // Nếu thư mục không tồn tại, trả về mảng rỗng
    return [];
  }
}

ipcMain.handle("save-frame-file", async (event, payload) => {
  console.log("Saving frame file with payload:", payload);
  return saveFrameFile(payload);
});

ipcMain.handle("load-app-state", async () => {
  return loadAppState();
});

ipcMain.handle("save-app-state", async (event, state) => {
  return saveAppState(state);
});

ipcMain.handle("save-photo-to-library", async (event, dataUrl) => {
  console.log("Saving photo to library");
  return savePhotoToLibrary(dataUrl);
});

ipcMain.handle("load-photo-library", async () => {
  return loadPhotoLibrary();
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "src", "preload.js"),
    },
    autoHideMenuBar: true,
  });
  // mainWindow.webContents.openDevTools();

  const server = express();
  server.use(express.static(path.join(__dirname, "build")));

  // Serve thư mục custom-frames qua HTTP
  server.use('/custom-frames', express.static(path.join(app.getPath("userData"), "custom-frames")));

  // Serve thư mục photo-library qua HTTP
  server.use('/photo-library', express.static(path.join(app.getPath("userData"), "photo-library")));

  const listener = server.listen(9001, () => {
    const url = `http://localhost:${listener.address().port}`;
    mainWindow.loadURL(url);
  });

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
