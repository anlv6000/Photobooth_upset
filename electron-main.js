const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
  });

    // Prod mode: spin up express to serve build
    const server = express();
    server.use(express.static(path.join(__dirname, "build")));
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
