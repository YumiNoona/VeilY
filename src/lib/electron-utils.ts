/**
 * Detects if the current environment is Electron.
 * Checks for the presence of the window.electronAPI object exposed in preload.js.
 */
export const isElectron = (): boolean => {
    return typeof window !== 'undefined' && !!window.electronAPI;
};

/**
 * Returns a CSS class name conditional on being in Electron.
 */
export const electronClass = (className: string): string => {
    return isElectron() ? className : "";
};
