import React, { useState } from 'react';
import { PLANS_CATALOG } from '../config';
import { PlanId, UserProfile } from '../types';
import { paymentService } from '../services/paymentService';
import {
  X,
  Check,
  CreditCard,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  currentPlan: PlanId;
  onRequireAuth: () => void;
  onPlanUpdated: () => void;
  language: 'es' | 'en';
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export const PlansModal: React.FC<PlansModalProps> = ({
  isOpen,
  onClose,
  user,
  currentPlan,
  onRequireAuth,
  onPlanUpdated,
  language,
  t,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = async (planId: PlanId) => {
    if (planId === 'free') return;

    if (!user) {
      onRequireAuth();
      return;
    }

    setSelectedPlan(planId);
    setPaymentMessage(null);
    setCheckoutUrl(null);
    setIsCreatingPayment(true);

    const res = await paymentService.createPaymentPreference(planId);
    setIsCreatingPayment(false);

    if (res.success && res.checkoutUrl) {
      setCheckoutUrl(res.checkoutUrl);
      setPaymentId(res.paymentId || null);
    } else {
      setPaymentMessage({
        type: 'error',
        text: res.message || 'Error al generar la preferencia de pago en Mercado Pago.',
      });
    }
  };

  const handleCheckStatus = async () => {
    if (!user) return;
    setIsVerifying(true);
    setPaymentMessage(null);

    const res = await paymentService.checkPaymentStatus(paymentId || undefined);
    setIsVerifying(false);

    if (res.success) {
      setPaymentMessage({
        type: 'success',
        text: res.message || '¡Pago confirmado! Tus nuevos créditos ya están disponibles.',
      });
      onPlanUpdated();
    } else {
      setPaymentMessage({
        type: 'info',
        text: res.message || 'El pago aún se encuentra en procesamiento o pendiente de acreditación.',
      });
    }
  };

  const planList: PlanId[] = ['starter', 'pro', 'business'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111827] border border-white/[0.1] rounded-2xl shadow-2xl p-6 sm:p-8 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#10B981] font-mono text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            {t('plans-section-title')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
            {language === 'es' ? 'Desbloquea mayor volumen de prospección' : 'Unlock Higher Prospecting Volume'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            {t('plans-section-subtitle')}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {planList.map((pId) => {
            const plan = PLANS_CATALOG[pId];
            const isPopular = plan.popular;
            const isCurrent = currentPlan === pId;

            return (
              <div
                key={pId}
                className={`relative flex flex-col justify-between p-6 rounded-xl border transition-all ${
                  isPopular
                    ? 'bg-[#182030] border-emerald-500/40 shadow-[0_0_24px_rgba(16,185,129,0.15)]'
                    : 'bg-[#0B0F17] border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#10B981] text-[#0B0F17] font-mono text-[10px] font-bold tracking-wider uppercase">
                    {language === 'es' ? 'MÁS POPULAR' : 'MOST POPULAR'}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-slate-400 tracking-widest uppercase">
                      {plan.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {plan.maxSubzones} {language === 'es' ? 'sub-zonas' : 'sub-zones'}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-extrabold text-slate-100 font-mono">
                      ${plan.priceUsd.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">USD</span>
                  </div>

                  <div className="text-xs font-mono font-semibold text-[#10B981] mb-5">
                    ↑ {language === 'es' ? 'hasta' : 'up to'} {plan.credits} {language === 'es' ? 'negocios' : 'leads'}
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                    {plan.features[language].map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectPlan(pId)}
                  disabled={isCreatingPayment}
                  className={`w-full py-2.5 px-4 rounded-lg font-mono text-xs font-bold tracking-wider transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : isPopular
                      ? 'bg-[#10B981] hover:bg-[#059669] text-[#0B0F17] shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'bg-[#1F2937] hover:bg-[#2c394d] text-slate-100 border border-white/[0.08]'
                  }`}
                >
                  {isCurrent ? t('plan-current') : t('plan-btn-buy')}
                </button>
              </div>
            );
          })}
        </div>

        {/* Mercado Pago Payment Action Area */}
        {selectedPlan && (
          <div className="p-5 rounded-xl bg-[#0B0F17] border border-white/[0.1] text-xs">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-sky-400" />
              <h4 className="font-semibold text-slate-200 text-sm">
                {t('modal-mp-title')} · {PLANS_CATALOG[selectedPlan].name}
              </h4>
            </div>

            <div className="space-y-1.5 text-slate-400 mb-4 pl-1">
              <p>① {t('mp-step-1')}</p>
              <p>② {t('mp-step-2')}</p>
              <p>③ {t('mp-step-3')}</p>
            </div>

            {checkoutUrl ? (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#009EE3] hover:bg-[#0086C3] text-white font-mono font-bold text-xs transition-all shadow-md"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{t('btn-pay-mp')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={handleCheckStatus}
                  disabled={isVerifying}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-[#1F2937] hover:bg-[#283548] text-slate-200 border border-white/[0.1] font-mono text-xs transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{t('btn-check-mp-status')}</span>
                </button>
              </div>
            ) : isCreatingPayment ? (
              <div className="flex items-center gap-2 text-sky-400 font-mono py-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generando orden de pago en Mercado Pago...</span>
              </div>
            ) : null}

            {paymentMessage && (
              <div
                className={`mt-4 p-3 rounded-lg flex items-start gap-2 border ${
                  paymentMessage.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : paymentMessage.type === 'error'
                    ? 'bg-rose-950/40 border-rose-500/30 text-rose-300'
                    : 'bg-sky-950/40 border-sky-500/30 text-sky-300'
                }`}
              >
                {paymentMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />}
                {paymentMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />}
                {paymentMessage.type === 'info' && <RefreshCw className="w-4 h-4 shrink-0 text-sky-400 mt-0.5" />}
                <p>{paymentMessage.text}</p>
              </div>
            )}

            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
              <span>{t('mp-security-note')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
