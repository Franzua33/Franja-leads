import React, { useState } from 'react';
import {
  BookOpen,
  Code2,
  Database,
  Layers,
  Key,
  CheckCircle,
  Copy,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

interface ArchitectureDocsModalProps {
  language: 'es' | 'en';
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ language }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="bg-[#111827] border border-white/[0.08] rounded-xl overflow-hidden shadow-xl mb-12 p-6 sm:p-8">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#10B981] font-mono text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          {language === 'es' ? 'Documentación de Arquitectura & Entregables' : 'Architecture & Deliverables Documentation'}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
          {language === 'es'
            ? 'Especificaciones Técnicas, Contratos n8n & Supabase'
            : 'Technical Specs, n8n Webhook Contracts & Supabase'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          {language === 'es'
            ? 'Guía completa de integración con PostgreSQL, flujos n8n y configuración de credenciales de Franja Leads.'
            : 'Comprehensive integration guide for PostgreSQL, n8n workflows, and Franja Leads credentials.'}
        </p>
      </div>

      <div className="space-y-10 text-xs sm:text-sm text-slate-300">
        {/* 1. Supabase Redirect URL Instructions */}
        <section className="bg-[#0B0F17] p-5 rounded-xl border border-white/[0.08]">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3 text-sm">
            <Key className="w-4 h-4" />
            <h3>1. Configuración de URLs de Redirección en Supabase Auth</h3>
          </div>
          <p className="text-slate-400 mb-3 text-xs leading-relaxed">
            Para que el inicio de sesión con Google OAuth funcione correctamente a través de Supabase:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300 pl-2 mb-4">
            <li>
              Accede al panel de tu proyecto en{' '}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 underline"
              >
                Supabase Dashboard
              </a>{' '}
              → <strong>Authentication</strong> → <strong>URL Configuration</strong>.
            </li>
            <li>
              Configura la <strong>Site URL</strong> con la URL principal de tu app:
              <div className="flex items-center gap-2 mt-1 font-mono bg-[#111827] px-3 py-2 rounded border border-white/[0.08] text-emerald-300">
                <span className="truncate">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com',
                      'site-url'
                    )
                  }
                  className="ml-auto text-slate-400 hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
            <li>
              En <strong>Redirect URLs</strong>, agrega la URL de desarrollo y cualquier subdominio o preview:
              <div className="mt-1 font-mono bg-[#111827] px-3 py-2 rounded border border-white/[0.08] text-slate-300">
                {typeof window !== 'undefined' ? `${window.location.origin}/**` : 'https://your-domain.com/**'}
              </div>
            </li>
            <li>
              En <strong>Authentication</strong> → <strong>Providers</strong> → <strong>Google</strong>, habilita Google y coloca el Client ID y Client Secret de Google Cloud Console.
            </li>
          </ol>
        </section>

        {/* 2. n8n Endpoints & Contracts */}
        <section className="bg-[#0B0F17] p-5 rounded-xl border border-white/[0.08]">
          <div className="flex items-center gap-2 text-sky-400 font-semibold mb-3 text-sm">
            <Layers className="w-4 h-4" />
            <h3>2. Endpoints de n8n y Contrato de Cada Uno</h3>
          </div>

          <div className="space-y-6">
            {/* 2.1 Buscar Negocios */}
            <div className="border border-white/[0.06] rounded-lg p-4 bg-[#111827]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs text-sky-400">
                  POST /webhook/buscar-negocios (01_buscar_negocios.json)
                </span>
                <span className="text-[10px] font-mono bg-sky-950/60 text-sky-300 px-2 py-0.5 rounded border border-sky-800">
                  Auth: Bearer JWT
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2">
                Recibe los parámetros de búsqueda. El backend valida el JWT de Supabase, descuenta o reserva créditos en PostgreSQL, y ejecuta la extracción en Google Places.
              </p>
              <div className="font-mono text-[11px] bg-[#0B0F17] p-3 rounded text-slate-300 mb-2 overflow-x-auto">
                <span className="text-slate-500">// Request Body</span>
                {`\n{\n  "tipo_negocio": "Restaurantes",\n  "ubicacion": "Madrid, España",\n  "pais": "ES",\n  "cantidad": 60\n}`}
              </div>
              <div className="font-mono text-[11px] bg-[#0B0F17] p-3 rounded text-emerald-300 overflow-x-auto">
                <span className="text-slate-500">// Expected Response (200 OK)</span>
                {`\n{\n  "status": "completed",\n  "job_id": "job_948271",\n  "total": 60,\n  "sheet_url": "https://docs.google.com/spreadsheets/d/...",\n  "negocios": [\n    {\n      "nombre": "Restaurante Ejemplo",\n      "telefono_local": "+34 912 345 678",\n      "telefono_internacional": "+34912345678",\n      "whatsapp_numero": "+34912345678",\n      "whatsapp_link": "https://wa.me/34912345678",\n      "website": "https://restaurante.es",\n      "direccion": "Calle Gran Vía 12, Madrid",\n      "google_maps_url": "https://maps.google.com/?cid=...",\n      "email": "contacto@restaurante.es"\n    }\n  ]\n}`}
              </div>
            </div>

            {/* 2.2 Crear Pago */}
            <div className="border border-white/[0.06] rounded-lg p-4 bg-[#111827]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs text-emerald-400">
                  POST /webhook/crear-pago-mercadopago (02_crear_pago_mercadopago.json)
                </span>
                <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                  Auth: Bearer JWT
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2">
                Genera la preferencia oficial de Mercado Pago. El frontend solo envía el código de plan. El backend determina el monto en USD o moneda local.
              </p>
              <div className="font-mono text-[11px] bg-[#0B0F17] p-3 rounded text-slate-300 mb-2 overflow-x-auto">
                <span className="text-slate-500">// Request Body</span>
                {`\n{\n  "plan_id": "starter" | "pro" | "business"\n}`}
              </div>
              <div className="font-mono text-[11px] bg-[#0B0F17] p-3 rounded text-emerald-300 overflow-x-auto">
                <span className="text-slate-500">// Expected Response</span>
                {`\n{\n  "success": true,\n  "payment_id": "pref_12345678",\n  "checkout_url": "https://www.mercadopago.com/checkout/v1/redirect?pref_id=..."\n}`}
              </div>
            </div>

            {/* 2.3 Webhook Mercado Pago */}
            <div className="border border-white/[0.06] rounded-lg p-4 bg-[#111827]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-xs text-amber-400">
                  POST /webhook/mercadopago-webhook (03_webhook_mercadopago.json)
                </span>
                <span className="text-[10px] font-mono bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                  Mercado Pago IPN
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2">
                Llamado exclusivamente por los servidores de Mercado Pago cuando cambia el estado de una orden. Valida el pago mediante la API oficial de Mercado Pago y registra la acreditación en <code className="text-amber-300 font-mono">public.payments</code> y <code className="text-amber-300 font-mono">public.user_credits</code>.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Missing Backend Pieces & PostgreSQL Trigger */}
        <section className="bg-[#0B0F17] p-5 rounded-xl border border-white/[0.08]">
          <div className="flex items-center gap-2 text-rose-400 font-semibold mb-3 text-sm">
            <Database className="w-4 h-4" />
            <h3>3. Mecanismo de Sincronización entre auth.users y public.users</h3>
          </div>
          <p className="text-slate-400 mb-3 text-xs leading-relaxed">
            Como la tabla <code className="text-emerald-400 font-mono">public.users</code> contiene la columna obligatoria <code className="text-emerald-400 font-mono">google_sub</code> y su ID no coincide necesariamente con <code className="text-emerald-400 font-mono">auth.users.id</code>, el cliente frontend jamás debe insertar usuarios directamente. Se debe instalar este trigger seguro en PostgreSQL de Supabase:
          </p>
          <div className="font-mono text-[11px] bg-[#111827] p-4 rounded-lg border border-white/[0.08] text-slate-300 overflow-x-auto relative mb-3">
            <button
              onClick={() =>
                copyToClipboard(
`-- Disparador PostgreSQL en Supabase para sincronizar auth.users -> public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_sub TEXT;
BEGIN
  -- Extraer el google_sub desde raw_user_meta_data o identities
  extracted_sub := COALESCE(
    NEW.raw_user_meta_data->>'sub',
    NEW.raw_app_meta_data->>'provider_id',
    NEW.id::text
  );

  -- Insertar o actualizar en public.users
  INSERT INTO public.users (google_sub, email, name, avatar_url, created_at)
  VALUES (
    extracted_sub,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW()
  )
  ON CONFLICT (google_sub) DO UPDATE
  SET email = EXCLUDED.email,
      name = EXCLUDED.name,
      avatar_url = EXCLUDED.avatar_url;

  -- Crear registro inicial de créditos en public.user_credits si no existe
  INSERT INTO public.user_credits (user_id, plan_id, available_credits, reserved_credits, consumed_credits)
  SELECT u.id, 'free', 20, 0, 0
  FROM public.users u
  WHERE u.google_sub = extracted_sub
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger tras inserción en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();`,
                  'sql-trigger'
                )
              }
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </button>
            <pre className="text-[11px] leading-relaxed text-slate-200">
{`-- Disparador PostgreSQL en Supabase para sincronizar auth.users -> public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_sub TEXT;
BEGIN
  extracted_sub := COALESCE(
    NEW.raw_user_meta_data->>'sub',
    NEW.raw_app_meta_data->>'provider_id',
    NEW.id::text
  );

  INSERT INTO public.users (google_sub, email, name, avatar_url, created_at)
  VALUES (
    extracted_sub,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    NOW()
  )
  ON CONFLICT (google_sub) DO UPDATE
  SET email = EXCLUDED.email;

  -- Registro de créditos iniciales
  INSERT INTO public.user_credits (user_id, plan_id, available_credits, reserved_credits, consumed_credits)
  SELECT u.id, 'free', 20, 0, 0
  FROM public.users u WHERE u.google_sub = extracted_sub
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();`}
            </pre>
          </div>
        </section>

        {/* 4. Verification Testing Steps */}
        <section className="bg-[#0B0F17] p-5 rounded-xl border border-white/[0.08]">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3 text-sm">
            <CheckCircle className="w-4 h-4" />
            <h3>4. Pasos de Verificación y Testing</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 font-bold">1. Google Login:</span>
              <span>Al pulsar "Acceder con Google", Supabase inicia el flujo OAuth y retorna la sesión con el token JWT verificado.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 font-bold">2. Persistencia:</span>
              <span>Al recargar la página, <code className="font-mono text-slate-200">supabase.auth.getSession()</code> restaura la sesión activa sin exigir inicio de nuevo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 font-bold">3. Seguridad:</span>
              <span>El frontend no confía en <code className="font-mono text-slate-200">localStorage</code> para saldos o planes. Los créditos provienen de la base de datos o n8n.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 font-bold">4. Manejo de Errores:</span>
              <span>Si el webhook no está configurado, responde con HTTP 501 ("La búsqueda todavía no está disponible. El servicio está pendiente de configuración").</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-emerald-400 font-bold">5. Mercado Pago:</span>
              <span>El backend genera la preferencia oficial; la acreditación de créditos se realiza únicamente tras la confirmación verificada de Mercado Pago.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};
