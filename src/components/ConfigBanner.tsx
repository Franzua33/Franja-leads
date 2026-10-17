import React from 'react';
import { AlertTriangle, ExternalLink, Settings } from 'lucide-react';
import { isN8nSearchConfigured, isSupabaseConfigured } from '../config';

interface ConfigBannerProps {
  onOpenDocs: () => void;
  language: 'es' | 'en';
}

export const ConfigBanner: React.FC<ConfigBannerProps> = ({ onOpenDocs, language }) => {
  const supabaseReady = isSupabaseConfigured();
  const n8nReady = isN8nSearchConfigured();

  if (supabaseReady && n8nReady) {
    return null;
  }

  return (
    <div className="bg-amber-950/40 border-b border-amber-500/20 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            {language === 'es' ? (
              <>
                <strong>Estado de Integración:</strong> {!supabaseReady && 'Supabase Auth'}{' '}
                {!supabaseReady && !n8nReady && 'y '}{!n8nReady && 'Webhooks de n8n'} pendientes de configuración en variables de entorno.
              </>
            ) : (
              <>
                <strong>Integration Status:</strong> {!supabaseReady && 'Supabase Auth'}{' '}
                {!supabaseReady && !n8nReady && 'and '}{!n8nReady && 'n8n Webhooks'} pending setup in environment variables.
              </>
            )}
          </span>
        </div>
        <button
          onClick={onOpenDocs}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/30 font-medium transition-colors cursor-pointer shrink-0"
        >
          <Settings className="w-3.5 h-3.5" />
          {language === 'es' ? 'Ver guía y contratos API' : 'View setup guide & API contracts'}
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
