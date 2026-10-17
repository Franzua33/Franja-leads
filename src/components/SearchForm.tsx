import React, { useState } from 'react';
import { COUNTRIES_LIST, PLANS_CATALOG } from '../config';
import { PlanId, SearchFormData, UserCreditsState } from '../types';
import { Zap, Loader2, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SearchFormProps {
  currentPlan: PlanId;
  creditsState: UserCreditsState;
  isLoading: boolean;
  onExecuteSearch: (formData: SearchFormData) => Promise<void>;
  statusMessage: {
    type: 'success' | 'error' | 'loading' | 'unconfigured' | null;
    text: string;
  };
  onOpenPlans: () => void;
  language: 'es' | 'en';
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  currentPlan,
  creditsState,
  isLoading,
  onExecuteSearch,
  statusMessage,
  onOpenPlans,
  language,
  t,
}) => {
  const planInfo = PLANS_CATALOG[currentPlan] || PLANS_CATALOG.free;

  const [formData, setFormData] = useState<SearchFormData>({
    tipo_negocio: '',
    ubicacion: '',
    pais: 'ES',
    cantidad: currentPlan === 'free' ? 20 : currentPlan === 'starter' ? 60 : currentPlan === 'pro' ? 200 : 500,
  });

  const getQuantityOptions = () => {
    switch (currentPlan) {
      case 'starter':
        return [
          { value: 20, label: language === 'es' ? '20 prospectos' : '20 leads' },
          { value: 40, label: language === 'es' ? '40 prospectos' : '40 leads' },
          { value: 60, label: language === 'es' ? '60 prospectos (máx. plan)' : '60 leads (plan max)' },
        ];
      case 'pro':
        return [
          { value: 60, label: language === 'es' ? '60 prospectos' : '60 leads' },
          { value: 100, label: language === 'es' ? '100 prospectos' : '100 leads' },
          { value: 150, label: language === 'es' ? '150 prospectos' : '150 leads' },
          { value: 200, label: language === 'es' ? '200 prospectos (máx. plan)' : '200 leads (plan max)' },
        ];
      case 'business':
        return [
          { value: 100, label: language === 'es' ? '100 prospectos' : '100 leads' },
          { value: 200, label: language === 'es' ? '200 prospectos' : '200 leads' },
          { value: 350, label: language === 'es' ? '350 prospectos' : '350 leads' },
          { value: 500, label: language === 'es' ? '500 prospectos (máx. plan)' : '500 leads (plan max)' },
        ];
      default:
        return [
          { value: 20, label: language === 'es' ? '20 prospectos (prueba inicial)' : '20 leads (initial trial)' },
        ];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    await onExecuteSearch(formData);
  };

  return (
    <div className="bg-[#111827] border border-white/[0.08] rounded-xl overflow-hidden shadow-xl mb-8">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111827]/70">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold tracking-wide text-slate-200">
            {t('search-title')}
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            · {planInfo.badgeLabel} ({planInfo.maxSubzones} {language === 'es' ? 'sub-zona' : 'sub-zone'}{planInfo.maxSubzones > 1 ? 's' : ''})
          </span>
        </div>

        {/* Credit metrics display */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 bg-[#0B0F17] px-3 py-1.5 rounded-lg border border-white/[0.06] font-mono tabular-nums">
            <span className="text-slate-400">{t('credits-available')}:</span>
            <span className={`font-bold ${creditsState.availableCredits > 0 ? 'text-[#10B981]' : 'text-rose-400'}`}>
              {creditsState.availableCredits}
            </span>
            {creditsState.reservedCredits > 0 && (
              <span className="text-amber-400 text-[11px]">
                ({creditsState.reservedCredits} {t('credits-reserved')})
              </span>
            )}
          </div>
          {currentPlan === 'free' && (
            <button
              type="button"
              onClick={onOpenPlans}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors hover:underline"
            >
              {language === 'es' ? '+ Obtener más' : '+ Get more'}
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Business Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400 font-mono tracking-wider uppercase">
              {t('label-business-type')}
            </label>
            <input
              type="text"
              required
              value={formData.tipo_negocio}
              onChange={(e) => setFormData({ ...formData, tipo_negocio: e.target.value })}
              placeholder={t('placeholder-business-type')}
              disabled={isLoading}
              className="w-full bg-[#0B0F17] border border-white/[0.12] rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all disabled:opacity-50"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400 font-mono tracking-wider uppercase">
              {t('label-location')}
            </label>
            <input
              type="text"
              required
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
              placeholder={t('placeholder-location')}
              disabled={isLoading}
              className="w-full bg-[#0B0F17] border border-white/[0.12] rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all disabled:opacity-50"
            />
          </div>

          {/* Country */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400 font-mono tracking-wider uppercase">
              {t('label-country')}
            </label>
            <select
              value={formData.pais}
              onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
              disabled={isLoading}
              className="w-full bg-[#0B0F17] border border-white/[0.12] rounded-lg px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all disabled:opacity-50"
            >
              {COUNTRIES_LIST.map((c) => (
                <option key={c.code} value={c.code} className="bg-[#111827] text-slate-200">
                  {c.flag} {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-400 font-mono tracking-wider uppercase">
                {t('label-quantity')}
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {planInfo.credits} {language === 'es' ? 'máx en este plan' : 'max in this plan'}
              </span>
            </div>
            <select
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: Number(e.target.value) })}
              disabled={isLoading}
              className="w-full bg-[#0B0F17] border border-white/[0.12] rounded-lg px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all disabled:opacity-50 font-mono"
            >
              {getQuantityOptions().map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#111827] text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#0B0F17] font-semibold text-sm transition-all shadow-[0_0_16px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0B0F17]" />
              <span className="font-mono tracking-wider text-xs uppercase">{t('btn-running')}</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current text-[#0B0F17]" />
              <span className="font-mono tracking-wider text-xs uppercase">{t('btn-run-search')}</span>
            </>
          )}
        </button>

        {/* Status Message Display */}
        {statusMessage.type && (
          <div
            className={`mt-4 p-4 rounded-lg text-xs leading-relaxed flex items-start gap-3 border transition-all ${
              statusMessage.type === 'loading'
                ? 'bg-sky-950/40 border-sky-500/30 text-sky-300'
                : statusMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : statusMessage.type === 'unconfigured'
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'loading' && <Loader2 className="w-4 h-4 shrink-0 animate-spin mt-0.5" />}
            {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />}
            {statusMessage.type === 'unconfigured' && <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />}
            {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />}
            <div className="flex-1">
              <p className="font-medium">{statusMessage.text}</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
