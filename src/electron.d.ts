export interface IElectronAPI {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}

declare global {
  interface Window {
    electronAPI?: IElectronAPI;
    __TAURI__?: unknown;
    __TAURI_INTERNALS__?: unknown;
  }
}
