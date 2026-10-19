import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ConfigBanner } from './components/ConfigBanner';
import { SearchForm } from './components/SearchForm';
import { ResultsTable } from './components/ResultsTable';
import { JobHistory } from './components/JobHistory';
import { PlansModal } from './components/PlansModal';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { authService } from './services/authService';
import { creditsService } from './services/creditsService';
import { searchService } from './services/searchService';
import { TRANSLATIONS } from './i18n/translations';
import {
  BusinessLead,
  Language,
  PlanId,
  SearchFormData,
  SearchJob,
  UserCreditsState,
  UserProfile,
} from './types';
import { isSupabaseConfigured } from './config';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Database,
  Lock,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function App() {
  // Language state (persisted purely for UI preference)
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('franja_lang');
    if (saved === 'en' || saved === 'es') return saved;
    const nav = typeof navigator !== 'undefined' ? navigator.language : 'es';
    return nav.startsWith('en') ? 'en' : 'es';
  });

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('franja_lang', lang);
  };

  const t = useCallback(
    (key: string, vars: Record<string, string | number> = {}): string => {
      let text = (TRANSLATIONS[language] as any)?.[key] || (TRANSLATIONS['es'] as any)?.[key] || key;
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
      return text;
    },
    [language]
  );

  // Authentication State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Credits & Plan State (Derived strictly from backend query, never localStorage)
  const [creditsState, setCreditsState] = useState<UserCreditsState>({
    plan: 'free',
    availableCredits: 20,
    reservedCredits: 0,
    consumedCredits: 0,
    isBackendSource: false,
  });

  // App Navigation
  const [activeTab, setActiveTab] = useState<'search' | 'history' | 'plans' | 'architecture'>('search');
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);

  // Search execution state
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'loading' | 'unconfigured' | null;
    text: string;
  }>({ type: null, text: '' });

  // Current Results & Jobs
  const [currentLeads, setCurrentLeads] = useState<BusinessLead[]>([]);
  const [currentSheetUrl, setCurrentSheetUrl] = useState<string | undefined>(undefined);
  const [currentQuerySummary, setCurrentQuerySummary] = useState<string>('');
  const [jobs, setJobs] = useState<SearchJob[]>([]);

  // Load user credits from backend
  const refreshCredits = useCallback(async (userId: string, googleSub?: string) => {
    const res = await creditsService.getUserCredits(userId, googleSub);
    setCreditsState(res.data);
  }, []);

  // Listen to Supabase Auth state changes
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      setIsAuthLoading(true);
      const { session, error } = await authService.getSession();
      if (!isMounted) return;

      if (session) {
        const profile = authService.extractUserProfile(session);
        setUser(profile);
        if (profile) {
          refreshCredits(profile.id, profile.googleSub);
        }
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
    }

    initAuth();

    // Subscribe to auth state changes
    const { unsubscribe } = authService.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (session) {
        const profile = authService.extractUserProfile(session);
        setUser(profile);
        if (profile) {
          refreshCredits(profile.id, profile.googleSub);
        }
      } else {
        setUser(null);
        setCreditsState({
          plan: 'free',
          availableCredits: 0,
          reservedCredits: 0,
          consumedCredits: 0,
          isBackendSource: false,
        });
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [refreshCredits]);

  // Login specific error & loading
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Check for OAuth errors in URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const err =
        urlParams.get('error_description') ||
        urlParams.get('error') ||
        hashParams.get('error_description') ||
        hashParams.get('error');

      if (err) {
        setLoginError(`Error de autenticación devuelto por el proveedor: ${decodeURIComponent(err)}`);
      }
    }
  }, []);

  // Handle Google Login via Supabase OAuth
  const handleGoogleLogin = async () => {
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const { error } = await authService.signInWithGoogle();
      if (error) {
        setLoginError(error);
        setIsLoggingIn(false);
      }
      // Note: If successful, browser redirects automatically to Google OAuth page
    } catch (err: any) {
      setLoginError(err?.message || 'Error inesperado al conectar con Google OAuth.');
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await authService.signOut();
    setUser(null);
    setCurrentLeads([]);
    setStatusMessage({ type: null, text: '' });
  };

  // Handle Search Execution
  const handleExecuteSearch = async (formData: SearchFormData) => {
    if (!user) {
      setStatusMessage({
        type: 'error',
        text: 'Debes iniciar sesión con Supabase Auth para realizar búsquedas.',
      });
      return;
    }

    setIsSearching(true);
    setStatusMessage({
      type: 'loading',
      text: language === 'es' 
        ? `Consultando Google Places para ${formData.cantidad} negocios en ${formData.ubicacion}...` 
        : `Querying Google Places for ${formData.cantidad} businesses in ${formData.ubicacion}...`,
    });

    const res = await searchService.executeSearch(formData);
    setIsSearching(false);

    if (res.success && res.job) {
      setCurrentLeads(res.results || []);
      setCurrentSheetUrl(res.sheetUrl);
      setCurrentQuerySummary(`${formData.tipo_negocio} · ${formData.ubicacion} (${formData.pais})`);

      setJobs((prev) => [res.job!, ...prev]);
      setStatusMessage({
        type: 'success',
        text: res.message || 'Extracción completada con éxito.',
      });

      // Refresh credits balance from backend
      if (user) {
        refreshCredits(user.id, user.googleSub);
      }
    } else {
      setStatusMessage({
        type: res.isUnconfigured ? 'unconfigured' : 'error',
        text: res.message || 'Error al procesar la búsqueda.',
      });
    }
  };

  // Select job from history
  const handleSelectJob = (job: SearchJob) => {
    if (job.results) {
      setCurrentLeads(job.results);
      setCurrentSheetUrl(job.sheetUrl);
      setCurrentQuerySummary(`${job.query.tipo_negocio} · ${job.query.ubicacion}`);
      setActiveTab('search');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#DFE2EE] flex flex-col font-sans selection:bg-[#10B981]/20 selection:text-[#4EDEA3]">
      {/* Top Header */}
      <Header
        user={user}
        currentPlan={creditsState.plan}
        language={language}
        onLanguageChange={handleLanguageChange}
        onLogout={handleLogout}
        onOpenLogin={() => {
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'plans') {
            setIsPlansModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        t={t}
      />

      {/* Configuration notice if env vars pending */}
      <ConfigBanner onOpenDocs={() => setActiveTab('architecture')} language={language} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#10B981] font-mono text-xs font-semibold uppercase tracking-wider mb-4">
              <Zap className="w-3.5 h-3.5 fill-current" />
              {t('hero-badge')}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-[1.15] mb-4 text-balance">
              {t('hero-title-prefix')}{' '}
              <span className="text-[#10B981] underline decoration-emerald-500/40 underline-offset-8">
                {t('hero-title-highlight')}
              </span>{' '}
              {t('hero-title-suffix')}
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
              {t('hero-subtitle')}
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/[0.08]">
            <div className="bg-[#111827] p-4 rounded-xl border border-white/[0.06]">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-[#10B981] tabular-nums">
                +50,000
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                {t('stat-extractions')}
              </span>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl border border-white/[0.06]">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-sky-400 tabular-nums">
                22
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                {t('stat-countries')}
              </span>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl border border-white/[0.06]">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-emerald-300 tabular-nums">
                99.2%
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                {t('stat-accuracy')}
              </span>
            </div>
            <div className="bg-[#111827] p-4 rounded-xl border border-white/[0.06]">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-amber-400 tabular-nums">
                &lt; 3.5s
              </span>
              <span className="text-xs text-slate-400 mt-1 block">
                {t('stat-speed')}
              </span>
            </div>
          </div>
        </section>

        {/* View Routing */}
        {activeTab === 'architecture' ? (
          <ArchitectureDocsModal language={language} />
        ) : !user ? (
          /* Authentication Required View */
          <div className="max-w-xl mx-auto my-8 bg-[#111827] border border-white/[0.08] rounded-2xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#10B981] font-mono text-xs font-semibold mb-5">
              {t('login-free-badge')}
            </div>

            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              {t('login-card-title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
              {t('login-card-desc')}
            </p>

            {!isSupabaseConfigured() && (
              <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs text-left leading-relaxed">
                <div className="flex items-center gap-2 font-bold text-amber-300 mb-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Configuración de Supabase requerida en tu archivo .env</span>
                </div>
                <p className="text-amber-200/90 mb-2 text-[12px]">
                  Para que el botón de Google funcione en tu computadora local, tu archivo <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-amber-300">.env</code> debe contener las credenciales reales de tu proyecto de Supabase:
                </p>
                <div className="font-mono text-[11px] bg-black/50 p-2.5 rounded border border-white/10 text-slate-300 space-y-1">
                  <div>VITE_SUPABASE_URL="https://[tu-id-de-proyecto].supabase.co"</div>
                  <div>VITE_SUPABASE_ANON_KEY="eyJhbGciOi..."</div>
                </div>
                <p className="mt-2 text-[11px] text-amber-300/90">
                  💡 <em>Importante: Si acabas de editar tu archivo <code>.env</code>, debes reiniciar el servidor Vite en la terminal (presiona <kbd className="px-1 py-0.5 rounded bg-black/40 font-mono">Ctrl + C</kbd> y vuelve a ejecutar <kbd className="px-1 py-0.5 rounded bg-black/40 font-mono">npm run dev</kbd>) para que cargue los cambios.</em>
                </p>
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={isAuthLoading || isLoggingIn}
              className="w-full max-w-sm mx-auto flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 shrink-0 animate-spin text-slate-900" />
                  <span>Conectando con Google OAuth...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                    <path
                      fill="#FFC107"
                      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                    />
                    <path
                      fill="#FF3D00"
                      d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                    />
                  </svg>
                  <span>{t('login-btn-text')}</span>
                </>
              )}
            </button>

            {loginError && (
              <div className="mt-5 p-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-200 text-xs text-left leading-relaxed">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-rose-300 mb-1">Aviso de Autenticación</div>
                    <p className="text-rose-200/90 mb-2">{loginError}</p>
                    <div className="text-[11px] text-rose-300/80 space-y-1">
                      <p>✓ Verifica que en <strong>Supabase Dashboard</strong> → <strong>Authentication</strong> → <strong>Providers</strong> esté activado <strong>Google</strong> con tu Client ID y Client Secret.</p>
                      <p>✓ Verifica que en <strong>URL Configuration</strong> tengas agregada la URL <code className="bg-black/30 px-1 py-0.5 rounded font-mono">http://localhost:3000/**</code> en <strong>Redirect URLs</strong>.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-500/70" />
              <span>{t('login-secure-notice')}</span>
            </div>
          </div>
        ) : activeTab === 'history' ? (
          <JobHistory
            jobs={jobs}
            onSelectJob={handleSelectJob}
            language={language}
            t={t}
          />
        ) : (
          /* Search & Results Tab */
          <div>
            <SearchForm
              currentPlan={creditsState.plan}
              creditsState={creditsState}
              isLoading={isSearching}
              onExecuteSearch={handleExecuteSearch}
              statusMessage={statusMessage}
              onOpenPlans={() => setIsPlansModalOpen(true)}
              language={language}
              t={t}
            />

            <ResultsTable
              leads={currentLeads}
              sheetUrl={currentSheetUrl}
              querySummary={currentQuerySummary}
              language={language}
              t={t}
            />
          </div>
        )}
      </main>

      {/* Plans & Mercado Pago Modal */}
      <PlansModal
        isOpen={isPlansModalOpen}
        onClose={() => setIsPlansModalOpen(false)}
        user={user}
        currentPlan={creditsState.plan}
        onRequireAuth={() => {
          setIsPlansModalOpen(false);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
        onPlanUpdated={() => {
          if (user) refreshCredits(user.id, user.googleSub);
        }}
        language={language}
        t={t}
      />

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#0B0F17] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-400">FRANJA / LEADS</span>
            <span>·</span>
            <span>{t('brand-tagline')}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveTab('architecture')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Especificaciones & API' : 'API & Architecture Specs'}
            </button>
            <span>·</span>
            <span className="font-mono">Supabase Auth · n8n · PostgreSQL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
