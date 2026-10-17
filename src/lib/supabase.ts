import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ENV, isSupabaseConfigured } from '../config';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    supabaseInstance = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'franja_supabase_auth_token',
      },
    });
    return supabaseInstance;
  } catch (err) {
    console.error('[Supabase Init Error]', err);
    return null;
  }
}

export const supabase = getSupabaseClient();
