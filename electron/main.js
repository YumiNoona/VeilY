const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    // icon: path.join(__dirname, "../public/favicon.ico"), // Optional: path to icon
  });

  // In production, load the index.html from dist
  // In development, you could load from localhost if you want hot reload,
  // but the user's instructions specify loading from dist.
  win.loadFile(path.join(__dirname, "../dist/index.html"));

  // Optional: Open DevTools
  // win.webContents.openDevTools();
}

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
