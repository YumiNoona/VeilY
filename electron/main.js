import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Store from "electron-store";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();

function createWindow() {
  const bounds = store.get("window-bounds");

  const win = new BrowserWindow({
    width: bounds?.width || 1200,
    height: bounds?.height || 800,
    x: bounds?.x,
    y: bounds?.y,
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: false,
    backgroundColor: "#0f0f0f",
    title: "Veily",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.removeMenu();

  // Save window state on close
  win.on("close", () => {
    store.set("window-bounds", win.getBounds());
  });

  // Load the index.html from dist
  win.loadFile(path.join(__dirname, "../dist/index.html"));

  // Optional: Open DevTools
  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }

  // Native Polish: Disable Zoom
  win.webContents.setZoomFactor(1);

  // Native Polish: Prevent Reload Shortcuts in production
  if (app.isPackaged) {
    win.webContents.on("before-input-event", (event, input) => {
      if (input.control && input.key.toLowerCase() === "r") {
        event.preventDefault();
      }
    });
  }
}

// Global IPC Listeners (Outside createWindow to prevent memory leaks/duplicates)
ipcMain.on("window-minimize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.on("window-maximize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.on("window-close", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
