import { getSupabaseClient } from '../lib/supabase';
import { PlanId, UserCreditsState } from '../types';

export interface CreditsQueryResponse {
  data: UserCreditsState;
  status: 'synced' | 'unconfigured' | 'pending_db_sync' | 'error';
  message?: string;
}

export const creditsService = {
  /**
   * Retrieves user credits and plan directly from PostgreSQL tables in Supabase.
   * Table relationships:
   * - public.users (id, google_sub)
   * - public.user_credits (user_id, plan_id, available_credits, reserved_credits, consumed_credits)
   * - public.plans (id, name, credits_limit, subzones_limit, price_usd)
   */
  async getUserCredits(authUserId: string, googleSub?: string): Promise<CreditsQueryResponse> {
    const client = getSupabaseClient();
    if (!client) {
      return {
        data: {
          plan: 'free',
          availableCredits: 0,
          reservedCredits: 0,
          consumedCredits: 0,
          isBackendSource: false,
        },
        status: 'unconfigured',
        message: 'Supabase no está configurado. El servicio de créditos está inactivo.',
      };
    }

    try {
      // 1. Resolve relation between auth.users and public.users
      // Note: public.users uses google_sub as its foreign identifier or an explicit mapping
      let userQuery = client.from('users').select('id, google_sub');
      
      if (googleSub) {
        userQuery = userQuery.eq('google_sub', googleSub);
      } else {
        userQuery = userQuery.eq('id', authUserId);
      }

      const { data: publicUser, error: userError } = await userQuery.maybeSingle();

      if (userError) {
        return {
          data: {
            plan: 'free',
            availableCredits: 0,
            reservedCredits: 0,
            consumedCredits: 0,
            isBackendSource: false,
          },
          status: 'error',
          message: `Error al consultar public.users: ${userError.message}`,
        };
      }

      if (!publicUser) {
        // The user exists in auth.users, but the PostgreSQL trigger hasn't run yet.
        // We provide the default 20 courtesy trial credits so they can explore without being blocked at 0.
        return {
          data: {
            plan: 'free',
            availableCredits: 20,
            reservedCredits: 0,
            consumedCredits: 0,
            isBackendSource: false,
            lastCheckedAt: new Date().toISOString(),
          },
          status: 'pending_db_sync',
          message: 'Usuario no sincronizado aún en public.users. Mostrando 20 créditos iniciales de cortesía.',
        };
      }

      // 2. Query public.user_credits for this user
      const { data: creditsData, error: creditsError } = await client
        .from('user_credits')
        .select(`
          available_credits,
          reserved_credits,
          consumed_credits,
          plan_id,
          plans:plan_id ( id, name, credits_limit, subzones_limit, price_usd )
        `)
        .eq('user_id', publicUser.id)
        .maybeSingle();

      if (creditsError) {
        return {
          data: {
            plan: 'free',
            availableCredits: 0,
            reservedCredits: 0,
            consumedCredits: 0,
            isBackendSource: false,
          },
          status: 'error',
          message: `Error al consultar public.user_credits: ${creditsError.message}`,
        };
      }

      if (!creditsData) {
        return {
          data: {
            plan: 'free',
            availableCredits: 20, // default initial free trial
            reservedCredits: 0,
            consumedCredits: 0,
            isBackendSource: true,
            lastCheckedAt: new Date().toISOString(),
          },
          status: 'synced',
          message: 'Sin registro previo en user_credits. Asignando estado inicial de prueba.',
        };
      }

      const planId = (creditsData.plan_id || 'free').toLowerCase() as PlanId;

      return {
        data: {
          plan: planId,
          availableCredits: creditsData.available_credits ?? 0,
          reservedCredits: creditsData.reserved_credits ?? 0,
          consumedCredits: creditsData.consumed_credits ?? 0,
          isBackendSource: true,
          lastCheckedAt: new Date().toISOString(),
        },
        status: 'synced',
      };
    } catch (err: any) {
      return {
        data: {
          plan: 'free',
          availableCredits: 0,
          reservedCredits: 0,
          consumedCredits: 0,
          isBackendSource: false,
        },
        status: 'error',
        message: err?.message || 'Error de red o conexión al consultar saldo de créditos.',
      };
    }
  },
};
