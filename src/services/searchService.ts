import { ENV, isN8nSearchConfigured } from '../config';
import { authService } from './authService';
import { BusinessLead, SearchFormData, SearchJob } from '../types';

export interface SearchExecutionResponse {
  success: boolean;
  job?: SearchJob;
  results?: BusinessLead[];
  sheetUrl?: string;
  total?: number;
  message?: string;
  statusCode?: number;
  isUnconfigured?: boolean;
}

export const searchService = {
  isConfigured(): boolean {
    return isN8nSearchConfigured();
  },

  async executeSearch(formData: SearchFormData): Promise<SearchExecutionResponse> {
    // 1. Check endpoint configuration
    if (!this.isConfigured()) {
      return {
        success: false,
        isUnconfigured: true,
        statusCode: 501,
        message: 'La búsqueda todavía no está disponible. El servicio webhook de n8n (01_buscar_negocios.json) está pendiente de configuración en la variable VITE_N8N_SEARCH_URL.',
      };
    }

    // 2. Form field validation
    if (!formData.tipo_negocio.trim()) {
      return {
        success: false,
        message: 'Debes ingresar el tipo de negocio a buscar.',
      };
    }
    if (!formData.ubicacion.trim()) {
      return {
        success: false,
        message: 'Debes ingresar la ciudad o ubicación geográfica.',
      };
    }
    if (!formData.pais) {
      return {
        success: false,
        message: 'Debes seleccionar el país de búsqueda.',
      };
    }
    if (!formData.cantidad || formData.cantidad <= 0) {
      return {
        success: false,
        message: 'La cantidad de prospectos solicitada debe ser mayor a 0.',
      };
    }

    // 3. Verify Supabase Auth session & get JWT token
    const token = await authService.getAccessToken();
    if (!token) {
      return {
        success: false,
        statusCode: 401,
        message: 'Sesión no válida o expirada. Por favor vuelve a iniciar sesión con Google.',
      };
    }

    try {
      // 4. Send request to n8n webhook.
      // Notice: Only search criteria are sent in the body.
      // The backend validates the Bearer token, determines the user identity, checks plan limits and handles credit reservation!
      const response = await fetch(ENV.N8N_SEARCH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipo_negocio: formData.tipo_negocio.trim(),
          ubicacion: formData.ubicacion.trim(),
          pais: formData.pais,
          cantidad: Number(formData.cantidad),
        }),
      });

      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          statusCode: response.status,
          message: 'Error de autorización: Tu sesión no tiene permisos suficientes o el token ha expirado.',
        };
      }

      if (response.status === 402) {
        return {
          success: false,
          statusCode: 402,
          message: 'Créditos insuficientes en tu cuenta. Por favor elige o renueva un plan para continuar extrayendo negocios.',
        };
      }

      if (response.status === 501) {
        return {
          success: false,
          statusCode: 501,
          isUnconfigured: true,
          message: 'La búsqueda todavía no está disponible. El servicio está pendiente de configuración.',
        };
      }

      if (!response.ok) {
        const errText = await response.text();
        return {
          success: false,
          statusCode: response.status,
          message: `El servidor devolvió un error (HTTP ${response.status}): ${errText || 'Error desconocido'}`,
        };
      }

      const data = await response.json();

      // Normalize results format from n8n response
      const results: BusinessLead[] = Array.isArray(data.negocios)
        ? data.negocios
        : Array.isArray(data.results)
        ? data.results
        : Array.isArray(data)
        ? data
        : [];

      const sheetUrl = data.sheet_url || data.download_url || data.sheets_url;
      const total = data.total ?? data.cantidad ?? results.length;

      const job: SearchJob = {
        id: data.job_id || `job_${Date.now()}`,
        status: data.status || 'completed',
        query: formData,
        createdAt: new Date().toISOString(),
        resultsCount: total,
        sheetUrl,
        results,
      };

      return {
        success: true,
        job,
        results,
        sheetUrl,
        total,
        message: `Búsqueda completada exitosamente. Se extrajeron ${total} negocios.`,
      };
    } catch (err: any) {
      console.error('[SearchService Error]', err);
      return {
        success: false,
        message: `Error al conectar con el servidor de búsqueda: ${err?.message || 'Verifica tu conexión a internet o los endpoints configurados.'}`,
      };
    }
  },
};
