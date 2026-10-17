import { PlanConfig, PlanId } from '../types';

export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  N8N_SEARCH_URL: import.meta.env.VITE_N8N_SEARCH_URL || '',
  N8N_CREATE_PAYMENT_URL: import.meta.env.VITE_N8N_CREATE_PAYMENT_URL || '',
  N8N_PAYMENT_STATUS_URL: import.meta.env.VITE_N8N_PAYMENT_STATUS_URL || '',
  APP_URL: import.meta.env.VITE_APP_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
};

export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(ENV.SUPABASE_URL) &&
    Boolean(ENV.SUPABASE_ANON_KEY) &&
    !ENV.SUPABASE_URL.includes('your-project-id') &&
    !ENV.SUPABASE_ANON_KEY.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...')
  );
};

export const isN8nSearchConfigured = (): boolean => {
  return (
    Boolean(ENV.N8N_SEARCH_URL) &&
    !ENV.N8N_SEARCH_URL.includes('your-n8n-instance')
  );
};

export const isN8nPaymentConfigured = (): boolean => {
  return (
    Boolean(ENV.N8N_CREATE_PAYMENT_URL) &&
    !ENV.N8N_CREATE_PAYMENT_URL.includes('your-n8n-instance')
  );
};

/**
 * Reference configuration for plans matching the existing DB schema.
 * Note: the backend remains the ultimate authority for pricing and allowances.
 */
export const PLANS_CATALOG: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    badgeLabel: 'FREE',
    credits: 20,
    priceUsd: 0,
    maxSubzones: 1,
    features: {
      es: [
        '1 búsqueda de cortesía (hasta 20 negocios)',
        'Extracción básica de Google Maps',
        'Exportación inmediata CSV',
      ],
      en: [
        '1 trial search (up to 20 businesses)',
        'Basic Google Maps extraction',
        'Instant CSV export',
      ],
    },
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    badgeLabel: 'STARTER',
    credits: 60,
    priceUsd: 9.90,
    maxSubzones: 1,
    features: {
      es: [
        'Hasta 60 negocios verificados',
        '1 búsqueda completa con paginación',
        'Integración con Google Sheets + CSV',
        'Teléfono, WhatsApp, Web y Email',
      ],
      en: [
        'Up to 60 verified businesses',
        '1 full search with pagination',
        'Google Sheets integration + CSV',
        'Phone, WhatsApp, Web & Email',
      ],
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    badgeLabel: 'PRO',
    credits: 200,
    priceUsd: 19.90,
    maxSubzones: 5,
    popular: true,
    features: {
      es: [
        'Hasta 200 negocios verificados',
        '5 sub-zonas automáticas en la ciudad',
        'Deduplicación inteligente multi-zona',
        'Integración con Google Sheets + CSV',
        'Teléfono, WhatsApp, Web y Email',
      ],
      en: [
        'Up to 200 verified businesses',
        '5 automatic city sub-zones',
        'Smart multi-zone deduplication',
        'Google Sheets integration + CSV',
        'Phone, WhatsApp, Web & Email',
      ],
    },
  },
  business: {
    id: 'business',
    name: 'Business',
    badgeLabel: 'BUSINESS',
    credits: 500,
    priceUsd: 39.90,
    maxSubzones: 15,
    features: {
      es: [
        'Hasta 500 negocios verificados',
        '15 sub-zonas automáticas de alta cobertura',
        'Máxima densidad de extracción urbana',
        'Integración con Google Sheets + CSV',
        'Soporte prioritario para prospección B2B',
      ],
      en: [
        'Up to 500 verified businesses',
        '15 automatic high-coverage sub-zones',
        'Maximum urban extraction density',
        'Google Sheets integration + CSV',
        'Priority support for B2B prospecting',
      ],
    },
  },
};

export const COUNTRIES_LIST = [
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷' },
  { code: 'PA', name: 'Panamá', flag: '🇵🇦' },
  { code: 'DO', name: 'República Dominicana', flag: '🇩🇴' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'DE', name: 'Alemania', flag: '🇩🇪' },
  { code: 'FR', name: 'Francia', flag: '🇫🇷' },
  { code: 'IT', name: 'Italia', flag: '🇮🇹' },
  { code: 'GB', name: 'Reino Unido', flag: '🇬🇧' },
  { code: 'CA', name: 'Canadá', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
];
