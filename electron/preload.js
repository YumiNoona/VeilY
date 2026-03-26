const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),
  // FIX: Expose openExternal so UpgradeModal can open Stripe in the system browser
  openExternal: (url) => ipcRenderer.send("open-external", url),
});
