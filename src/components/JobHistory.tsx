import React from 'react';
import { SearchJob } from '../types';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface JobHistoryProps {
  jobs: SearchJob[];
  onSelectJob: (job: SearchJob) => void;
  language: 'es' | 'en';
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export const JobHistory: React.FC<JobHistoryProps> = ({
  jobs,
  onSelectJob,
  language,
  t,
}) => {
  const getStatusBadge = (status: SearchJob['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-500/10 text-[#10B981] border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            {t('status-completed')}
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <RefreshCw className="w-3 h-3 animate-spin" />
            {t('status-processing')}
          </span>
        );
      case 'unconfigured':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {t('status-unconfigured')}
          </span>
        );
      case 'failed':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            {t('status-failed')}
          </span>
        );
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="bg-[#111827] border border-white/[0.08] rounded-xl overflow-hidden shadow-xl mb-12">
      <div className="p-6 border-b border-white/[0.08] bg-[#111827]/80">
        <h3 className="text-base font-semibold text-slate-100">{t('history-title')}</h3>
        <p className="text-xs text-slate-400 mt-1">{t('history-desc')}</p>
      </div>

      {jobs.length === 0 ? (
        <div className="py-16 px-6 text-center text-xs text-slate-500">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>{t('history-empty')}</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm text-slate-200">
                    {job.query.tipo_negocio}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    · {job.query.ubicacion} ({job.query.pais})
                  </span>
                  {getStatusBadge(job.status)}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span>{formatDate(job.createdAt)}</span>
                  <span>·</span>
                  <span>
                    {job.resultsCount} {language === 'es' ? 'prospectos encontrados' : 'leads extracted'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {job.sheetUrl && (
                  <a
                    href={job.sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
                  >
                    <span>Sheets</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {job.results && job.results.length > 0 && (
                  <button
                    onClick={() => onSelectJob(job)}
                    className="px-3 py-1.5 rounded-lg bg-[#1F2937] hover:bg-[#263345] text-slate-200 text-xs font-semibold border border-white/[0.1] transition-all cursor-pointer"
                  >
                    {language === 'es' ? 'Cargar resultados' : 'Load leads'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
