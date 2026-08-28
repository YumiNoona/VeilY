/**
 * Detects if the current environment is Electron.
 * Checks for the presence of the window.electronAPI object exposed in preload.js.
 */
export const isElectron = (): boolean => {
    return typeof window !== 'undefined' && (!!window.electronAPI || !!window.__TAURI_INTERNALS__);
};

/**
 * Returns a CSS class name conditional on being in Electron.
 */
export const electronClass = (className: string): string => {
    return isElectron() ? className : "";
};

/**
 * Returns the correct redirect URL for Supabase Auth based on the current environment.
 */
export const getRedirectUrl = (): string => {
    if (typeof window === 'undefined') return "https://veily.venusapp.in";

    // Local Development (Vite default or custom port)
    if (window.location.origin.includes("localhost")) {
        return window.location.origin;
    }

    // Production or Desktop shell
    if (window.__TAURI_INTERNALS__) return "tauri://localhost";
    return "https://veily.venusapp.in";
};

/**
 * Prepends the API base URL if in Electron/Production.
 */
export const getApiUrl = (path: string): string => {
    // If inside Tauri desktop shell, always route to the live server
    if (typeof window !== 'undefined' && window.__TAURI_INTERNALS__) {
        return `https://veily.venusapp.in${path}`;
    }

    const origin = getRedirectUrl();
    // Only prepend if path is relative
    if (path.startsWith('/')) {
        return `${origin}${path}`;
    }
    return path;
};
