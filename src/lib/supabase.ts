import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

console.group('🛡️ Supabase Debug');
console.log('URL:', supabaseUrl);
console.log('Key Length:', supabaseAnonKey?.length);
console.log('Key Start:', supabaseAnonKey?.substring(0, 15));
console.groupEnd();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
