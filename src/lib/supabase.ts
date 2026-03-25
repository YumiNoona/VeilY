import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn('Supabase URL and Publishable Key must be provided in .env.local!');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabasePublishableKey || '',
  {
    auth: {
      persistSession: true,
      storage: localStorage,
      autoRefreshToken: true,
      detectSessionInUrl: false // Required for Electron environments
    }
  }
);
