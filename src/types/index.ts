export type PlanId = 'free' | 'starter' | 'pro' | 'business';

export interface PlanConfig {
  id: PlanId;
  name: string;
  badgeLabel: string;
  credits: number;
  priceUsd: number;
  maxSubzones: number;
  popular?: boolean;
  features: {
    es: string[];
    en: string[];
  };
}

export interface UserProfile {
  id: string; // Supabase auth UUID
  email?: string;
  name?: string;
  avatarUrl?: string;
  googleSub?: string;
}

export interface UserCreditsState {
  plan: PlanId;
  availableCredits: number;
  reservedCredits: number;
  consumedCredits: number;
  isBackendSource: boolean;
  lastCheckedAt?: string;
}

export interface BusinessLead {
  id?: string;
  nombre: string;
  telefono_local?: string;
  telefono_internacional?: string;
  whatsapp_numero?: string;
  whatsapp_link?: string;
  website?: string;
  direccion?: string;
  google_maps_url?: string;
  email?: string;
  categoria?: string;
  rating?: number;
  user_ratings_total?: number;
}

export interface SearchFormData {
  tipo_negocio: string;
  ubicacion: string;
  pais: string;
  cantidad: number;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'unconfigured';

export interface SearchJob {
  id: string;
  status: JobStatus;
  query: SearchFormData;
  createdAt: string;
  resultsCount: number;
  sheetUrl?: string;
  results?: BusinessLead[];
  error?: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  paymentId?: string;
  checkoutUrl?: string;
  message?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  plan?: PlanId;
  creditsAdded?: number;
  message?: string;
}

export type Language = 'es' | 'en';
