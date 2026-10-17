import React from 'react';
import { Language, PlanId, UserProfile } from '../types';
import { PLANS_CATALOG } from '../config';
import { LogOut, Globe, ShieldCheck, Database, Layers } from 'lucide-react';

interface HeaderProps {
  user: UserProfile | null;
  currentPlan: PlanId;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  onOpenLogin: () => void;
  activeTab: 'search' | 'history' | 'plans' | 'architecture';
  onTabChange: (tab: 'search' | 'history' | 'plans' | 'architecture') => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentPlan,
  language,
  onLanguageChange,
  onLogout,
  onOpenLogin,
  activeTab,
  onTabChange,
  t,
}) => {
  const planInfo = PLANS_CATALOG[currentPlan] || PLANS_CATALOG.free;

  const getPlanBadgeClass = (plan: PlanId) => {
    switch (plan) {
      case 'starter':
        return 'bg-sky-950/60 text-sky-400 border-sky-500/30';
      case 'pro':
        return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30';
      case 'business':
        return 'bg-amber-950/60 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0B0F17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onTabChange('search')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#10B981] font-mono font-bold text-sm group-hover:border-emerald-500/60 transition-colors">
              F
            </div>
            <div>
              <div className="font-mono text-sm tracking-[0.2em] font-bold text-[#10B981] leading-none">
                FRANJA<span className="text-slate-500">/</span>LEADS
              </div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
                Precision B2B
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#111827] p-1 rounded-lg border border-white/[0.06]">
          <button
            onClick={() => onTabChange('search')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'search'
                ? 'bg-[#1F2937] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('nav-search')}
          </button>
          <button
            onClick={() => onTabChange('history')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'history'
                ? 'bg-[#1F2937] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('nav-history')}
          </button>
          <button
            onClick={() => onTabChange('plans')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'plans'
                ? 'bg-[#1F2937] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t('nav-plans')}
          </button>
          <button
            onClick={() => onTabChange('architecture')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
              activeTab === 'architecture'
                ? 'bg-[#1F2937] text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            {t('nav-architecture')}
          </button>
        </nav>

        {/* Right Zone: Language + User Pill */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#111827] border border-white/[0.08] rounded-full p-1 text-xs">
            <button
              onClick={() => onLanguageChange('es')}
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                language === 'es'
                  ? 'bg-emerald-500/20 text-[#10B981]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Español"
            >
              ES
            </button>
            <span className="text-slate-600 px-0.5">/</span>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
                language === 'en'
                  ? 'bg-emerald-500/20 text-[#10B981]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          {/* User profile / Login CTA */}
          {user ? (
            <div className="flex items-center gap-2.5 bg-[#111827] border border-white/[0.08] rounded-full pl-2 pr-3 py-1">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || 'User'}
                  className="w-6 h-6 rounded-full object-cover border border-white/10"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-medium text-slate-200 max-w-[120px] truncate leading-tight">
                  {user.name}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-semibold ${getPlanBadgeClass(
                  currentPlan
                )}`}
              >
                {planInfo.badgeLabel}
              </span>
              <button
                onClick={onLogout}
                className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                title={t('btn-logout')}
                aria-label={t('btn-logout')}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#0B0F17] bg-[#10B981] rounded-lg hover:bg-[#059669] transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] whitespace-nowrap shrink-0"
            >
              {t('btn-login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
