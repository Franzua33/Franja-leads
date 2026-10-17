import { getSupabaseClient } from '../lib/supabase';
import { ENV, isSupabaseConfigured } from '../config';
import { UserProfile } from '../types';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';

export const authService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  async signInWithGoogle(customRedirectTo?: string): Promise<{ error?: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return {
        error: 'Supabase no está configurado. Por favor configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en tu entorno.',
      };
    }

    const redirectTo = customRedirectTo || ENV.APP_URL || (typeof window !== 'undefined' ? window.location.origin : '');

    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (err: any) {
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
