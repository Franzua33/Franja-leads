import { ENV, isN8nPaymentConfigured } from '../config';
import { authService } from './authService';
import { CreatePaymentResponse, PlanId, VerifyPaymentResponse } from '../types';

export const paymentService = {
  isConfigured(): boolean {
    return isN8nPaymentConfigured();
  },

  /**
   * Requests the backend (workflow 02_crear_pago_mercadopago.json) to generate a Mercado Pago payment preference.
   * Only the plan code is sent. The backend is the sole authority on the price and currency.
   */
  async createPaymentPreference(planId: PlanId): Promise<CreatePaymentResponse> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'El servicio de pagos de Mercado Pago todavía no está configurado. Requiere definir VITE_N8N_CREATE_PAYMENT_URL con el webhook 02_crear_pago_mercadopago.json.',
      };
    }

    const token = await authService.getAccessToken();
    if (!token) {
      return {
        success: false,
        message: 'Debes iniciar sesión con tu cuenta para comprar créditos.',
      };
    }

    try {
      const response = await fetch(ENV.N8N_CREATE_PAYMENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan_id: planId,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return {
          success: false,
          message: `Error al generar orden de pago (${response.status}): ${errText || 'Respuesta inválida del servidor.'}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        paymentId: data.payment_id || data.id,
        checkoutUrl: data.checkout_url || data.init_point || data.url,
        message: data.message,
      };
    } catch (err: any) {
      console.error('[PaymentService createPayment Error]', err);
      return {
        success: false,
        message: `Error de red al conectar con el servicio de pagos: ${err?.message || 'Revisa tu conexión.'}`,
      };
    }
  },

  /**
   * Checks payment status with backend (workflow 03_webhook_mercadopago.json / payment status endpoint).
   * Note: The frontend NEVER marks payment approved unilaterally or trusts local input codes.
   */
  async checkPaymentStatus(paymentId?: string): Promise<VerifyPaymentResponse> {
    if (!ENV.N8N_PAYMENT_STATUS_URL || ENV.N8N_PAYMENT_STATUS_URL.includes('your-n8n-instance')) {
      return {
        success: false,
        message: 'Endpoint de verificación de estado de pago (VITE_N8N_PAYMENT_STATUS_URL) pendiente de implementación en el backend.',
      };
    }

    const token = await authService.getAccessToken();
    if (!token) {
      return {
        success: false,
        message: 'Sesión no válida.',
      };
    }

    try {
      const response = await fetch(ENV.N8N_PAYMENT_STATUS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_id: paymentId,
        }),
      });

      if (!response.ok) {
        return {
          success: false,
          message: `No se pudo comprobar el estado del pago (HTTP ${response.status}).`,
        };
      }

      const data = await response.json();
      return {
        success: Boolean(data.success && data.status === 'approved'),
        plan: data.plan_id,
        creditsAdded: data.credits_added,
        message: data.message || (data.status === 'approved' ? '¡Pago acreditado con éxito!' : 'Pago pendiente de confirmación bancaria.'),
      };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || 'Error de comunicación al verificar estado de pago.',
      };
    }
  },
};
