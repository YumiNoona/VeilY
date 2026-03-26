import { app, BrowserWindow, ipcMain, shell, session } from "electron";
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

  win.on("close", () => {
    store.set("window-bounds", win.getBounds());
  });

  // FIX: Intercept API response headers to add CORS for file:// origin.
  // When Electron loads from file://, requests to your API at veily.venusapp.in
  // are blocked by CORS because the browser sees origin as "null" (file://).
  // This intercepts the response and injects the required CORS headers so the
  // fetch in UpgradeModal succeeds.
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const isApiCall = details.url.includes("veily.venusapp.in/api") ||
                      details.url.includes("supabase.co");
    if (isApiCall) {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          "Access-Control-Allow-Origin": ["*"],
          "Access-Control-Allow-Headers": ["Content-Type", "Authorization", "apikey", "x-client-info"],
          "Access-Control-Allow-Methods": ["GET, POST, PUT, DELETE, PATCH, OPTIONS"],
        },
      });
    } else {
      callback({ responseHeaders: details.responseHeaders });
    }
  });

  win.loadFile(path.join(__dirname, "../dist/index.html"));

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }

  win.webContents.setZoomFactor(1);

  if (app.isPackaged) {
    win.webContents.on("before-input-event", (event, input) => {
      if (input.control && input.key.toLowerCase() === "r") {
        event.preventDefault();
      }
    });
  }

  // FIX: Intercept any navigation away from file:// (e.g. Stripe checkout URL).
  // Without this, clicking "Get Pro" would navigate the Electron window to
  // stripe.com, destroying the app. This catches it and opens the system browser.
  win.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith("file://")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });
}

// Window controls
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

// FIX: IPC handler so renderer can open URLs in the system browser.
// Used by UpgradeModal to open the Stripe checkout URL properly.
ipcMain.on("open-external", (_event, url) => {
  if (typeof url === "string" && url.startsWith("https://")) {
    shell.openExternal(url);
  }
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
