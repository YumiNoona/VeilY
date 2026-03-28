import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// FIX: detectSessionInUrl must be FALSE in Electron.
// When true, Supabase tries to parse auth tokens from the URL hash.
// In Electron the URL is file:///dist/index.html — there are no hash tokens,
// but the parser still runs and can corrupt the auth state on startup,
// causing sign-in to appear to succeed but the session never sticking.
// On web this stays true so magic links / OAuth callbacks work correctly.
const isDesktopApp = typeof window !== 'undefined' && (!!(window as any).electronAPI || !!(window as any).__TAURI_INTERNALS__);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: !isDesktopApp,
  }
});
