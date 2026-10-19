import { getSupabaseClient } from '../lib/supabase';
import { ENV, isSupabaseConfigured } from '../config';
import { UserProfile } from '../types';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  async signInWithGoogle(customRedirectTo?: string): Promise<{ error?: string; url?: string }> {
    const client = getSupabaseClient();
    if (!client) {
      const msg = !ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY
        ? 'Faltan las variables VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY en tu archivo .env local.'
        : 'Las credenciales de Supabase en tu archivo .env contienen valores de ejemplo o incompletos.';
      console.error('[Supabase Auth Error]', msg);
      return { error: msg };
    }

    // Always prefer the active browser origin (e.g. http://localhost:3000) so redirects land back on the exact running instance
    const currentOrigin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
    const redirectTo = customRedirectTo || currentOrigin || ENV.APP_URL;

    console.log('[Supabase Auth] Starting Google OAuth with redirectTo:', redirectTo);

    try {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        console.error('[Supabase Auth signInWithOAuth error]:', error);
        return { error: error.message };
      }

      // If a URL is returned by Supabase, ensure the browser navigates to Google
      if (data?.url && typeof window !== 'undefined') {
        window.location.assign(data.url);
      }

      return { url: data?.url };
    } catch (err: any) {
      console.error('[Supabase Auth Exception]:', err);
      return { error: err?.message || 'Error inesperado durante la autenticación con Google.' };
    }
  },

  async signOut(): Promise<{ error?: string }> {
    const client = getSupabaseClient();
    if (!client) return {};

    try {
      const { error } = await client.auth.signOut();
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err?.message || 'Error al cerrar sesión.' };
    }
  },

  async getSession(): Promise<{ session: Session | null; error?: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { session: null, error: 'Supabase no configurado.' };
    }

    try {
      const { data, error } = await client.auth.getSession();
      if (error) return { session: null, error: error.message };
      return { session: data.session };
    } catch (err: any) {
      return { session: null, error: err?.message };
    }
  },

  async getAccessToken(): Promise<string | null> {
    const client = getSupabaseClient();
    if (!client) return null;

    try {
      const { data } = await client.auth.getSession();
      return data.session?.access_token || null;
    } catch {
      return null;
    }
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const client = getSupabaseClient();
    if (!client) {
      return { unsubscribe: () => {} };
    }

    const { data: { subscription } } = client.auth.onAuthStateChange(callback);
    return {
      unsubscribe: () => subscription.unsubscribe(),
    };
  },

  extractUserProfile(session: Session | null): UserProfile | null {
    if (!session?.user) return null;

    const user = session.user;
    const meta = user.user_metadata || {};

    return {
      id: user.id,
      email: user.email || meta.email,
      name: meta.full_name || meta.name || user.email?.split('@')[0] || 'Usuario',
      avatarUrl: meta.avatar_url || meta.picture || '',
      googleSub: meta.sub || user.identities?.find((id) => id.provider === 'google')?.id,
    };
  },
};
