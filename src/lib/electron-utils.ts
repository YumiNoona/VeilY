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

/**
 * Returns the correct redirect URL for Supabase Auth based on the current environment.
 */
export const getRedirectUrl = (): string => {
    if (typeof window === 'undefined') return "https://veily.venusapp.in";

    // Local Development (Vite default or custom port)
    if (window.location.origin.includes("localhost")) {
        return "http://localhost:3000"; // Or 5173 if you prefer, but 3000 matches your dashboard setup
    }

    // Production or Electron (file:// or packaged)
    return "https://veily.venusapp.in";
};

/**
 * Prepends the API base URL if in Electron/Production.
 */
export const getApiUrl = (path: string): string => {
    const origin = getRedirectUrl();
    // Only prepend if path is relative
    if (path.startsWith('/')) {
        return `${origin}${path}`;
    }
    return path;
};
