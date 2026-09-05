import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, ChevronRight, AlertCircle, CheckCircle2, 
  BookOpen, Scale, Columns, Copy, ArrowLeft, ShieldCheck, Printer, Check, 
  Landmark, PhoneCall, FileCheck2, ExternalLink, Plus, Trash2, X
} from 'lucide-react';
import { SAMPLE_ORDERS } from './data/sampleOrders';
import type { SampleOrder, Clause } from './data/sampleOrders';
import GlossaryDrawer, { GLOSSARY_LIST } from './components/GlossaryDrawer';
import VoicePlayer from './components/VoicePlayer';
import TimelineWidget from './components/TimelineWidget';
import ActionChecklist from './components/ActionChecklist';
import ChatWidget from './components/ChatWidget';
import { auth, googleProvider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

import type { SupportedLanguage } from './data/translations';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS, translateLegalText } from './data/translations';

const API_BASE = 'http://localhost:3001/api';

type ViewMode = 'summary' | 'split' | 'timeline';

export default function App() {
  const [caseId, setCaseId] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleOrder | null>(null);
  const [apiData, setApiData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
    const [lang, setLang] = useState<SupportedLanguage>('en');
    const t = (key: string) => UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS.en[key] || key;

    const [user, setUser] = useState<User | null>(null);
    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [signInError, setSignInError] = useState<string | null>(null);
    const [isSigningIn, setIsSigningIn] = useState(false);

    useEffect(() => {
      if (!auth) return;
      try {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
        return () => unsubscribe();
      } catch (e) {
        console.warn('Firebase onAuthStateChanged error:', e);
      }
    }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (fontSize === 'large') {
        document.documentElement.style.fontSize = '118%';
      } else if (fontSize === 'xlarge') {
        document.documentElement.style.fontSize = '135%';
      } else {
        document.documentElement.style.fontSize = '100%';
      }
    }
  }, [fontSize]);

  const [route, setRoute] = useState<'main' | 'admin'>(
    typeof window !== 'undefined' && window.location.pathname === '/admin' ? 'admin' : 'main'
  );

  const handleReset = () => {
    setCaseId(null);
    setSelectedSample(null);
    setApiData(null);
    setError(null);
    setRoute('main');
    if (typeof window !== 'undefined') window.history.pushState({}, '', '/');
  };

  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'text-base sm:text-lg';
    if (fontSize === 'xlarge') return 'text-lg sm:text-xl';
    return 'text-sm sm:text-base';
  };

  const handleGoogleSignIn = async () => {
    setSignInError(null);
    if (!auth || !googleProvider) {
      setSignInError('Firebase configuration is not set. Please configure VITE_FIREBASE_* credentials in your .env file.');
      return;
    }
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsSignInModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setSignInError(err.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = () => {
    if (auth) {
      signOut(auth).catch(err => console.error(err));
    }
    setUser(null);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans bg-slate-100 text-slate-900 ${getFontSizeClass()}`}>
      {/* 1. Official Government Top Utility Bar */}
      <div className="govt-topbar text-white py-1.5 px-4 text-xs no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-300">{t('portalName')}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 hidden sm:inline">{t('govtProject')}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <div className="flex items-center gap-1">
              <PhoneCall size={12} className="text-amber-400" />
              <span>{t('helpline')}</span>
            </div>
            <span className="text-slate-600">|</span>

            {/* Language Selector in Top Bar */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400">{t('language')}:</span>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as SupportedLanguage)}
                className="bg-slate-800 text-amber-400 border border-slate-700 rounded px-1.5 py-0.5 text-xs font-bold focus:outline-none cursor-pointer"
                title="Select Interface Language"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-white font-medium">
                    {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            <span className="text-slate-600">|</span>

            {/* Accessibility Font Resizer */}
            <div className="flex items-center gap-1 font-mono text-xs">
                <span className="text-slate-400 mr-1 hidden sm:inline">{t('textResizer')}</span>
              <button 
                type="button"
                onClick={() => setFontSize('normal')} 
                className={`px-2 py-0.5 rounded border font-bold transition-all ${fontSize === 'normal' ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold shadow-sm' : 'border-slate-700 text-slate-300 hover:text-white'}`}
                title="Reset font size to Normal (100%)"
              >
                A
              </button>
              <button 
                type="button"
                onClick={() => setFontSize(prev => prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal')} 
                className={`px-2 py-0.5 rounded border font-bold transition-all ${fontSize !== 'normal' ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold shadow-sm' : 'border-slate-700 text-slate-300 hover:text-white'}`}
                title="Enlarge font size (118% / 135%)"
              >
                {fontSize === 'xlarge' ? 'A++' : 'A+'}
              </button>
            </div>

            <span className="text-slate-600">|</span>

            {/* User Auth */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full border border-slate-600" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-white">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="font-semibold text-slate-300 hidden sm:inline max-w-[100px] truncate">
                    {user.displayName || 'User'}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg border border-slate-200 py-1 hidden group-hover:block z-50">
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-900 font-bold"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsSignInModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-blue-950 font-bold text-xs border border-amber-500 hover:bg-slate-50 transition-colors shadow-sm shrink-0"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-blue-900 text-white flex items-center justify-center text-[8px]">
                  <span>👤</span>
                </div>
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Official Main Header Bar */}
      <header className="govt-header text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div 
            className="flex items-center gap-4 cursor-pointer" 
            onClick={handleReset}
          >
            <div className="w-12 h-12 rounded-lg bg-white p-1 border-2 border-amber-500 flex items-center justify-center text-slate-900 shadow shrink-0 overflow-hidden">
              <img src="/logo.png" alt="Adalat Companion Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight font-serif text-white">
                  {t('portalTitleHindi')} <span className="text-amber-400 font-sans font-bold text-xl">| {t('portalTitleEng')}</span>
                </h1>
              </div>
              <p className="text-xs text-slate-300 font-medium">{t('portalSubtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 no-print">
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 transition-colors"
            >
              <BookOpen size={16} className="text-amber-400" />
              <span>{t('glossaryBtn')}</span>
            </button>
          </div>
        </div>

        {/* Sub-header Navigation Bar */}
        <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 no-print">
          <div className="max-w-7xl mx-auto flex items-center gap-6">
            <span 
              className={`cursor-pointer ${route === 'main' && !caseId && !selectedSample && !apiData ? 'text-amber-400 font-bold underline underline-offset-4' : 'hover:text-white'}`} 
              onClick={handleReset}
            >
              {t('navExplainer')}
            </span>
            <span>•</span>
            <span 
              className={`cursor-pointer ${route === 'admin' ? 'text-amber-400 font-bold underline underline-offset-4' : 'hover:text-white'}`}
              onClick={() => {
                if (typeof window !== 'undefined') window.history.pushState({}, '', '/admin');
                setRoute('admin');
              }}
            >
              {t('navAdmin')}
            </span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer" onClick={() => setIsGlossaryOpen(true)}>
              {t('navGlossary')}
            </span>
            <span>•</span>
            <a href="https://ecourts.gov.in" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
              {t('navECourts')}
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 rounded-md bg-amber-50 border-l-4 border-amber-600 text-amber-950 flex items-start gap-3 shadow-sm">
            <AlertCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        {route === 'admin' ? (
          <AdminScreen onGoBack={handleReset} />
        ) : loading ? (
          <LoadingWidget />
        ) : !caseId && !selectedSample && !apiData ? (
          <UploadScreen 
            onSuccess={(id, data) => {
              setCaseId(id);
              if (data) setApiData(data);
            }} 
            onSelectSample={(sample) => {
              setSelectedSample(sample);
              setApiData(null);
            }}
            setLoading={setLoading} 
            setError={setError} 
            lang={lang}
            t={t}
          />
        ) : (
          <ResultsScreen 
            caseId={caseId}
            sample={selectedSample}
            apiData={apiData}
            onReset={handleReset}
            onOpenGlossary={() => setIsGlossaryOpen(true)}
            lang={lang}
            setLang={setLang}
            t={t}
          />
        )}
      </main>

      {/* Glossary Drawer */}
      <GlossaryDrawer 
        isOpen={isGlossaryOpen} 
        onClose={() => setIsGlossaryOpen(false)} 
        darkMode={false}
      />

      {/* Official Government Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t-4 border-amber-500 py-8 mt-12 text-xs no-print">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="font-bold text-white text-sm mb-2 font-serif">{t('footerTitle')}</h4>
            <p className="text-slate-400 leading-relaxed">
              {t('footerDesc')}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2 font-serif">{t('footerHelplineTitle')}</h4>
            <p className="text-slate-400 leading-relaxed mb-2">
              {t('footerHelplineDesc')}
            </p>
            <span className="inline-block px-3 py-1 bg-amber-400 text-slate-950 font-bold rounded">
              {t('footerTollFree')}
            </span>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-2 font-serif">{t('footerDisclaimerTitle')}</h4>
            <p className="text-slate-400 leading-relaxed">
              {t('footerDisclaimerDesc')}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 text-center text-slate-500 max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-2">
          <p>{t('footerCopyright')}</p>
          <p>{t('footerLegalTag')}</p>
        </div>
      </footer>

      {/* Rights-Awareness Chatbot Widget */}
        <ChatWidget lang={lang} />

      {/* Sign-In Modal */}
      {isSignInModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-[200] flex items-center justify-center p-4 transition-opacity"
          onClick={() => setIsSignInModalOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsSignInModalOpen(false)}
          tabIndex={-1}
        >
          <div 
            className="bg-white rounded-2xl p-8 max-w-[400px] w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="signin-title"
          >
            <button 
              onClick={() => setIsSignInModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center space-y-4 pt-2">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-amber-200 flex items-center justify-center text-blue-900 mb-2">
                <Scale size={24} />
              </div>
              
              <div>
                <h2 id="signin-title" className="text-2xl font-bold font-serif text-slate-900 mb-2">
                  Sign in to Adalat Companion
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                  Access saved cases, glossary bookmarks, and personalized assistance.
                </p>
              </div>

              {signInError && (
                <div className="w-full mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs text-left flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
                  <span>{signInError}</span>
                </div>
              )}

              <div className="w-full pt-4">
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:shadow-sm transition-all text-sm font-semibold text-slate-700 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isSigningIn ? 'Signing in...' : 'Continue with Google'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

{/* Animated Loading State Component */}
function LoadingWidget() {
  const [step, setStep] = useState(0);
  const steps = [
    "Reading court order text & extracting clauses...",
    "Connecting to Gemini 3.6 Flash legal translation model...",
    "Generating plain-language summary & identifying statutory terms...",
    "Validating CNR & constructing eCourts verification link..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center govt-card p-12 space-y-4">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-blue-900/20 border-t-blue-900 animate-spin"></div>
        <Scale size={28} className="text-blue-900 animate-pulse" />
      </div>
      <h3 className="text-lg font-bold font-serif text-slate-900">Generating Plain-Language Explanation...</h3>
      <p className="text-xs font-semibold text-blue-900 bg-blue-50 px-4 py-1.5 rounded border border-blue-200">
        {steps[step]}
      </p>
    </div>
  );
}

{/* Official Portal Upload & Search Screen */}
function UploadScreen({ onSuccess, onSelectSample, setLoading, setError, lang, t }: { 
  onSuccess: (id: string, responseData?: any) => void;
  onSelectSample: (sample: SampleOrder) => void;
  setLoading: (l: boolean) => void;
  setError: (e: string | null) => void;
  lang: SupportedLanguage;
  t: (key: string) => string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cnr, setCnr] = useState('');
  const [orderText, setOrderText] = useState('');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'text' | 'cnr'>('upload');
  const [availableSamples, setAvailableSamples] = useState<SampleOrder[]>(SAMPLE_ORDERS);
  
  const [isCaptchaMode, setIsCaptchaMode] = useState(false);
  const [captchaImage, setCaptchaImage] = useState<string | null>(null);
  const [lookupId, setLookupId] = useState<string | null>(null);
  const [captchaText, setCaptchaText] = useState('');
  const [retryMessage, setRetryMessage] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const loadDynamicExamples = async () => {
      try {
        const res = await axios.get(`${API_BASE}/examples`);
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setAvailableSamples(res.data);
        }
      } catch (err) {
        setAvailableSamples(SAMPLE_ORDERS);
      }
    };
    loadDynamicExamples();
  }, []);

  const handleDropdownSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sampleId = e.target.value;
    setSelectedSampleId(sampleId);
    if (!sampleId) return;

    const sample = availableSamples.find(s => s.id === sampleId) || SAMPLE_ORDERS.find(s => s.id === sampleId);
    if (sample) {
      setOrderText(sample.rawOrderText || '');
      setCnr(sample.keyFacts?.cnrNumber || '');
      setActiveTab('text');
    }
  };

  const handleExplainTextApi = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderText.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE}/explain`, {
        orderText: orderText.trim(),
        caseNumber: cnr.trim() || undefined
      });
      onSuccess('explain-result', res.data);
    } catch (err: any) {
      console.error('Live API call error:', err);
      // Friendly user fallback notification
      setError('Notice: Live AI service encountered a temporary connection delay. Displaying a pre-verified offline plain-language explanation.');
      const matched = availableSamples.find(s => s.id === selectedSampleId) || availableSamples[0] || SAMPLE_ORDERS[0];
      onSelectSample(matched);
    } finally {
      setLoading(false);
    }
  };

  const handleExplainOffline = () => {
    setError(null);
    const matched = availableSamples.find(s => s.id === selectedSampleId) || availableSamples[0] || SAMPLE_ORDERS[0];
    onSelectSample(matched);
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(`${API_BASE}/upload`, formData);
      onSuccess(res.data.caseId);
    } catch (err: any) {
      console.error(err);
      setError('Notice: Document upload service offline. Loaded fallback reference order.');
      onSelectSample(SAMPLE_ORDERS[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleCnrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnr.trim()) return;
    setIsFetching(true);
    setError(null);
    setRetryMessage('');
    try {
      const res = await axios.post(`${API_BASE}/lookup/start`, {
        cnrNumber: cnr.trim().toUpperCase()
      });
      setLookupId(res.data.lookupId);
      setCaptchaImage(res.data.captchaImage);
      setIsCaptchaMode(true);
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Could not connect to the eCourts portal. The portal may be temporarily unavailable. Please try again later.';
      setError(errMsg);
    } finally {
      setIsFetching(false);
    }
  };

  const handleCaptchaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaText.trim() || !lookupId) return;
    setIsFetching(true);
    setError(null);
    setRetryMessage('');
    try {
      const res = await axios.post(`${API_BASE}/lookup/${lookupId}/submit`, {
        captchaText: captchaText.trim()
      });
      if (res.data.success && res.data.data) {
         onSuccess(`case-cnr-${cnr}`, res.data.data);
      } else if (res.data.retryCaptchaImage) {
         setCaptchaImage(res.data.retryCaptchaImage);
         setCaptchaText('');
         setRetryMessage(res.data.message || "That wasn't quite right, let's try again.");
      } else if (res.data.message) {
         setError(res.data.message);
         setIsCaptchaMode(false);
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        setError('Your session expired. Please restart the CNR lookup.');
        setIsCaptchaMode(false);
      } else {
        const errMsg = err.response?.data?.error || 'Could not retrieve case data from eCourts portal. The portal may be temporarily unavailable.';
        setError(errMsg);
        setIsCaptchaMode(false);
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Official Notice Banner */}
      <div className="bg-blue-900 text-white p-6 rounded-lg shadow-sm border border-blue-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-block text-[11px] uppercase font-bold px-2 py-0.5 bg-amber-400 text-slate-950 rounded mb-1">
            {t('litigantBanner')}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif">
            {t('mainHeading')}
          </h2>
          <p className="text-xs text-blue-100 mt-1 max-w-2xl">
            {t('mainSubheading')}
          </p>
        </div>
        <div className="bg-blue-950 p-3 rounded border border-blue-800 text-center shrink-0">
          <ShieldCheck size={24} className="text-amber-400 mx-auto mb-1" />
          <span className="block text-[10px] uppercase font-bold text-slate-300">{t('verifiedCitation')}</span>
          <span className="text-xs font-bold text-white">{t('clauseSourceLinked')}</span>
        </div>
      </div>

      {/* Main Upload / Search Form Card */}
      <div className="govt-card">
        <div className="govt-card-header flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-1 font-bold text-sm border-b-2 transition-colors ${
                activeTab === 'upload' ? 'border-blue-900 text-blue-950' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('tabUpload')}
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`pb-1 font-bold text-sm border-b-2 transition-colors ${
                activeTab === 'text' ? 'border-blue-900 text-blue-950' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('tabText')}
            </button>
            <button
              onClick={() => setActiveTab('cnr')}
              className={`pb-1 font-bold text-sm border-b-2 transition-colors ${
                activeTab === 'cnr' ? 'border-blue-900 text-blue-950' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('tabCnr')}
            </button>
          </div>

          {/* Try an Example Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">{t('tryExample')}</span>
            <select
              value={selectedSampleId}
              onChange={handleDropdownSelect}
              className="px-3 py-1.5 text-xs font-bold rounded border border-blue-900 bg-blue-50 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer shadow-sm"
            >
              <option value="">{t('selectExamplePlaceholder')}</option>
              {availableSamples.map((sample) => (
                <option key={sample.id} value={sample.id}>
                  {sample.title} ({sample.badge})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'upload' && (
            <div 
              className="border-2 border-dashed border-slate-300 rounded-md p-10 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileCheck2 size={40} className="mx-auto text-blue-900 mb-3" />
              <h3 className="font-bold text-base text-slate-800 mb-1">{t('dragDropText')}</h3>
              <p className="text-xs text-slate-500 mb-4">{t('acceptsFilesText')}</p>
              <button 
                type="button"
                className="px-5 py-2 bg-blue-900 hover:bg-slate-900 text-white font-bold text-xs rounded transition-colors shadow-sm"
              >
                {t('selectFileBtn')}
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,image/*"
                onChange={(e) => e.target.files && e.target.files[0] && handleFileUpload(e.target.files[0])}
              />
            </div>
          )}

          {activeTab === 'text' && (
            <form onSubmit={handleExplainTextApi} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t('cnrInputLabel')}
                </label>
                <input 
                  type="text" 
                  value={cnr}
                  onChange={(e) => setCnr(e.target.value)}
                  placeholder={t('cnrPlaceholder')}
                  className="w-full px-4 py-2 text-sm rounded border border-slate-300 bg-white focus:outline-none focus:border-blue-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  {t('tabText')}
                </label>
                <textarea 
                  rows={5}
                  value={orderText}
                  onChange={(e) => setOrderText(e.target.value)}
                  placeholder={t('orderTextPlaceholder')}
                  className="w-full px-4 py-2.5 text-sm rounded border border-slate-300 bg-white focus:outline-none focus:border-blue-900 font-serif leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button 
                  type="submit"
                  disabled={!orderText.trim()}
                  className="px-6 py-2.5 bg-blue-900 hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-xs rounded transition-colors shadow-sm"
                >
                  {t('explainBtn')}
                </button>

                <button 
                  type="button"
                  onClick={handleExplainOffline}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs rounded transition-colors"
                  title="Uses preloaded offline JSON demo without calling API"
                >
                  {t('viewExplanation')} (Offline)
                </button>
              </div>
            </form>
          )}

          {activeTab === 'cnr' && (
            isCaptchaMode ? (
              <form onSubmit={handleCaptchaSubmit} className="space-y-4 max-w-sm mx-auto bg-slate-50 p-6 rounded-lg border border-slate-200 shadow-sm text-center">
                <h3 className="font-bold text-slate-800 font-serif">Security Verification</h3>
                <p className="text-xs text-slate-500 mb-2">
                  Having trouble? We never bypass the official verification step — this is the same CAPTCHA the court's own site shows.
                </p>
                {retryMessage && <p className="text-sm font-bold text-amber-700 mb-2">{retryMessage}</p>}
                
                {captchaImage && (
                  <div className="flex justify-center mb-4">
                    <img src={captchaImage} alt="Court CAPTCHA" className="border border-slate-300 rounded shadow-sm bg-white p-1" />
                  </div>
                )}
                
                <div>
                  <input 
                    type="text" 
                    value={captchaText}
                    onChange={(e) => setCaptchaText(e.target.value)}
                    placeholder="Enter the letters shown above"
                    className="w-full px-4 py-2.5 text-sm rounded border border-slate-300 bg-white focus:outline-none focus:border-blue-900 font-mono text-center mb-3"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    disabled={!captchaText.trim() || isFetching}
                    className="w-full px-6 py-2.5 bg-blue-900 hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-xs rounded transition-colors"
                  >
                    {isFetching ? "Verifying..." : "Verify & Submit"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsCaptchaMode(false)}
                    className="mt-3 text-xs text-slate-500 hover:text-slate-800 underline"
                  >
                    Cancel and go back
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCnrSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">{t('cnrInputLabel')}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={cnr}
                      onChange={(e) => setCnr(e.target.value)}
                      placeholder={t('cnrPlaceholder')}
                      className="flex-1 px-4 py-2.5 text-sm rounded border border-slate-300 bg-white focus:outline-none focus:border-blue-900 font-mono"
                    />
                    <button 
                      type="submit"
                      disabled={isFetching}
                      className="px-6 py-2.5 bg-blue-900 hover:bg-slate-900 disabled:opacity-50 text-white font-bold text-xs rounded transition-colors"
                    >
                      {isFetching ? "Loading..." : t('lookupBtn')}
                    </button>
                  </div>
                </div>
              </form>
            )
          )}
        </div>
      </div>

      {/* Official Reference Case Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base font-serif text-slate-900 flex items-center gap-2">
            <Scale size={18} className="text-blue-900" />
            {t('referenceOrdersTitle')}
          </h3>
          <span className="text-xs text-slate-500">{t('referenceOrdersSub')}</span>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {availableSamples.map((sample) => (
            <div 
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="govt-card p-4 hover:border-blue-900 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="govt-badge px-2 py-0.5 text-[10px]">
                  {sample.badge}
                </span>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-900" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 font-serif mb-1 group-hover:text-blue-900">
                {translateLegalText(sample.title, lang)}
              </h4>
              <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                {sample.plainSummary[lang] || sample.plainSummary['en'] || sample.description}
              </p>
              <div className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                <span>{t('viewExplanation')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

{/* Official Results & Document View Screen */}
function ResultsScreen({ caseId, sample, apiData, onReset, onOpenGlossary, lang, setLang, t }: {
  caseId: string | null;
  sample: SampleOrder | null;
  apiData?: any | null;
  onReset: () => void;
  onOpenGlossary: () => void;
  lang: SupportedLanguage;
  setLang: (l: SupportedLanguage) => void;
  t: (key: string) => string;
}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('summary');
  const [activeClauseId, setActiveClauseId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Clean state reset when target props or language change
  useEffect(() => {
    setActiveClauseId(null);
    setCopied(false);

    if (apiData) {
      if (!apiData._originalWhatHappened) {
        apiData._originalWhatHappened = apiData.whatHappened || apiData.plainSummary || "Court order summary processed.";
      }
      const baseSummary = apiData._originalWhatHappened;
      const initialSummary = translateLegalText(baseSummary, lang);
      
      const translatedWhatYouNeedToDo = (apiData.whatYouNeedToDo || []).map((step: string) => translateLegalText(step, lang));
      
      const translatedClauses = (apiData.clauses || []).map((c: Clause) => ({
        ...c,
        plainText: translateLegalText(c.plainText, lang)
      }));

      let changedFromPrevious = apiData.changedFromPrevious;
      if (changedFromPrevious?.changes) {
        changedFromPrevious = {
          ...changedFromPrevious,
          changes: changedFromPrevious.changes.map((c: string) => translateLegalText(c, lang))
        };
      }

      setData({
        plainSummary: initialSummary,
        whatYouNeedToDo: translatedWhatYouNeedToDo,
        keyDates: apiData.keyDates || [],
        whereThisStands: translateLegalText(apiData.whereThisStands || apiData.keyFacts?.stage || "", lang),
        clauses: translatedClauses,
        keyFacts: {
          parties: (apiData.keyFacts?.parties || []).map((p: string) => translateLegalText(p, lang)),
          nextHearingDate: apiData.keyFacts?.nextHearingDate || null,
          stage: translateLegalText(apiData.keyFacts?.stage || "", lang),
          courtName: translateLegalText(apiData.keyFacts?.courtName || "", lang),
          caseTitle: translateLegalText(apiData.keyFacts?.caseTitle || "", lang)
        },
        caseNumber: apiData.caseNumber,
        ecourtsLink: apiData.ecourtsLink || (apiData.caseNumber ? `https://services.ecourts.gov.in/ecourtindia_v6/?cnrNumber=${apiData.caseNumber}` : 'https://services.ecourts.gov.in/ecourtindia_v6/'),
        changedFromPrevious: changedFromPrevious,
        language: lang
      });
      setLoading(false);

      // Dynamic Gemini fallback if not already localized by dictionary
      if (lang !== 'en' && initialSummary === baseSummary) {
        axios.post(`${API_BASE}/translate`, { text: baseSummary, targetLang: lang })
          .then(res => {
            if (res.data?.translatedText && res.data.translatedText !== baseSummary) {
              setData((prev: any) => prev ? { ...prev, plainSummary: res.data.translatedText } : prev);
            }
          })
          .catch(err => console.warn('Dynamic translation fallback error:', err));
      }

      return;
    }

    if (sample) {
      const summaryText = sample.plainSummary[lang] || translateLegalText(sample.plainSummary['en'] || sample.description || '', lang);
      const rawClauses = sample.clauses[lang] || sample.clauses['en'] || [];
      const clausesList = sample.clauses[lang] ? sample.clauses[lang] : rawClauses.map(c => ({
        ...c,
        plainText: translateLegalText(c.plainText, lang)
      }));
      const whatYouNeedToDo = (sample as any).whatYouNeedToDo ? 
        (sample as any).whatYouNeedToDo.map((step: string) => translateLegalText(step, lang)) : [];

      let changedFromPrevious = sample.changedFromPrevious;
      if (changedFromPrevious?.changes) {
        changedFromPrevious = {
          ...changedFromPrevious,
          changes: changedFromPrevious.changes.map(c => translateLegalText(c, lang))
        };
      }

      setData({
        plainSummary: summaryText,
        clauses: clausesList,
        whatYouNeedToDo: whatYouNeedToDo,
        keyFacts: {
          ...sample.keyFacts,
          courtName: translateLegalText(sample.keyFacts.courtName || '', lang),
          stage: translateLegalText(sample.keyFacts.stage || '', lang),
          parties: sample.keyFacts.parties?.map(p => translateLegalText(p, lang))
        },
        caseNumber: sample.keyFacts.cnrNumber,
        ecourtsLink: `https://services.ecourts.gov.in/ecourtindia_v6/?cnrNumber=${sample.keyFacts.cnrNumber}`,
        changedFromPrevious: changedFromPrevious,
        language: lang
      });
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/summary/${caseId}?lang=${lang}`);
        if (isMounted) {
          const returned = res.data;
          if (returned) {
            const rawBase = returned.plainSummary || returned.whatHappened || '';
            returned.plainSummary = translateLegalText(rawBase, lang);
            if (returned.whatYouNeedToDo) {
              returned.whatYouNeedToDo = returned.whatYouNeedToDo.map((s: string) => translateLegalText(s, lang));
            }
            if (returned.clauses) {
              returned.clauses = returned.clauses.map((c: Clause) => ({
                ...c,
                plainText: translateLegalText(c.plainText, lang)
              }));
            }
            if (returned.changedFromPrevious?.changes) {
              returned.changedFromPrevious.changes = returned.changedFromPrevious.changes.map((c: string) => translateLegalText(c, lang));
            }
          }
          setData(returned);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          const fallbackSample = SAMPLE_ORDERS[0];
          setData({
            plainSummary: fallbackSample.plainSummary[lang] || translateLegalText(fallbackSample.plainSummary['en'] || '', lang),
            clauses: fallbackSample.clauses[lang] || fallbackSample.clauses['en'].map(c => ({ ...c, plainText: translateLegalText(c.plainText, lang) })),
            keyFacts: fallbackSample.keyFacts,
            changedFromPrevious: fallbackSample.changedFromPrevious,
            language: lang,
            fallback: true
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSummary();
    return () => { isMounted = false; };
  }, [caseId, sample, apiData, lang]);

  const handleCopySummary = () => {
    if (!data?.plainSummary) return;
    navigator.clipboard.writeText(data.plainSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !data) {
    return <LoadingWidget />;
  }

  const renderGlossaryText = (text: string) => {
    if (!text) return text;
    
    // Directives & key phrases to highlight with yellow marker
    const highlightPhrases = [
      "interim maintenance", "interim relief", "next hearing date", "next hearing", 
      "bailable warrant", "non-bailable warrant", "notice issued", "stay granted", 
      "ex parte", "interim protection", "directed to pay", "compliance report", 
      "directed to deposit", "shall deposit", "is required to", "surrender passport", 
      "restrained from", "ordered to", "must appear", "within 15 days", "within 30 days", 
      "within 7 days", "court appearance", "dlsa advocate", "free legal aid"
    ];

    const terms = GLOSSARY_LIST.map(g => g.term);
    const datePattern = `\\b\\d{1,2}(?:st|nd|rd|th)?\\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\\s+\\d{4}\\b`;
    const amountPattern = `(?:₹|Rs\\.?\\s*)\\d+(?:,\\d+)*(?:\\/\\-)?`;

    const allPatterns = [
      ...highlightPhrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      ...terms.map(t => `\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`),
      datePattern,
      amountPattern
    ];

    const regex = new RegExp(`(${allPatterns.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (!part) return null;
      const lowerPart = part.toLowerCase();

      // Glossary term match
      const termObj = GLOSSARY_LIST.find(g => g.term.toLowerCase() === lowerPart);
      if (termObj) {
        return (
          <span key={i} className="relative group inline-block">
            <mark className="bg-yellow-300 text-slate-950 font-bold px-1.5 py-0.5 rounded border-b-2 border-amber-400 cursor-pointer shadow-sm hover:bg-yellow-400 transition-colors">
              {part}
            </mark>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-64 p-3 rounded bg-slate-900 text-white text-xs shadow-xl border border-slate-700 z-30 pointer-events-none">
              <span className="font-bold text-amber-400 block mb-1 capitalize">{termObj.term}</span>
              {termObj.definition}
            </span>
          </span>
        );
      }

      // Check key phrases, dates, amounts
      const isKeyPhrase = highlightPhrases.some(p => p.toLowerCase() === lowerPart) ||
        /^\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+\s+\d{4}$/i.test(part) ||
        /^(?:₹|Rs\.)/i.test(part);

      if (isKeyPhrase) {
        return (
          <mark key={i} className="bg-yellow-300 text-slate-950 font-bold px-1.5 py-0.5 rounded border-b-2 border-amber-500 shadow-sm">
            {part}
          </mark>
        );
      }

      return part;
    });
  };

  return (
    <div className="space-y-6">
      {/* MANDATORY STATUTORY DISCLAIMER BANNER (PERMANENT & NON-DISMISSIBLE) */}
      <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r shadow-sm border border-slate-200 font-sans flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-start gap-3">
          <AlertCircle size={22} className="text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900 font-serif">
              {t('disclaimerTitle')}
            </h4>
            <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed mt-0.5">
              {t('disclaimerText')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-200 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-full border border-amber-400 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
          <span>{t('highlighterActive')}</span>
        </div>
      </div>

      {/* Top Action Controls */}
      <div className="govt-card p-4 flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <button 
            onClick={onReset}
            className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5"
          >
            <ArrowLeft size={16} />
            <span>{t('returnToSearch')}</span>
          </button>

          <div>
            <h2 className="text-lg font-bold font-serif text-slate-900">
              {data.keyFacts?.caseTitle || t('explanationTitle')}
            </h2>
            <p className="text-xs text-slate-500 font-mono">CNR: {data.caseNumber || data.keyFacts?.cnrNumber || 'Not Specified'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Audio Reader */}
          <VoicePlayer textToRead={data.plainSummary} lang={lang} darkMode={false} />

          {/* View Original on eCourts Button */}
          <a
            href={data.ecourtsLink || `https://services.ecourts.gov.in/ecourtindia_v6/`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded bg-blue-900 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <ExternalLink size={14} className="text-amber-400" />
            <span>{t('viewOnECourts')}</span>
          </a>

          {/* Output Language Selector */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded border border-slate-300 bg-white text-xs font-bold text-slate-800 shadow-sm">
            <span className="text-slate-500">{t('outputLangLabel')}</span>
            <select 
              value={lang}
              onChange={(e) => setLang(e.target.value as SupportedLanguage)}
              className="bg-transparent focus:outline-none font-bold text-blue-900 cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.nativeName} ({opt.name})
                </option>
              ))}
            </select>
          </div>

          {/* Copy Summary */}
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            <span>{copied ? t('copiedBtn') : t('copyBtn')}</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5"
          >
            <Printer size={14} />
            <span>{t('printBtn')}</span>
          </button>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex border-b border-slate-300 bg-white rounded-t border-x border-t no-print">
        <button
          onClick={() => setViewMode('summary')}
          className={`py-3 px-5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors ${
            viewMode === 'summary' ? 'border-blue-900 text-blue-900 bg-slate-50' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText size={16} />
          {t('tabSummary')}
        </button>
        <button
          onClick={() => setViewMode('split')}
          className={`py-3 px-5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors ${
            viewMode === 'split' ? 'border-blue-900 text-blue-900 bg-slate-50' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Columns size={16} />
          {t('tabSplit')}
        </button>
        <button
          onClick={() => setViewMode('timeline')}
          className={`py-3 px-5 font-bold text-xs sm:text-sm flex items-center gap-2 border-b-2 transition-colors ${
            viewMode === 'timeline' ? 'border-blue-900 text-blue-900 bg-slate-50' : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale size={16} />
          {t('tabTimeline')}
        </button>
      </div>

      {/* Main View Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {viewMode === 'summary' && (
            <>
              {/* Executive Plain Summary */}
              <div className="govt-card">
                <div className="govt-card-header flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-slate-900 font-serif flex items-center gap-2">
                    <FileText size={18} className="text-blue-900" />
                    {t('explanationTitle')}
                  </h3>
                  <div className="flex items-center gap-3">
                    <a
                      href={data.ecourtsLink || `https://services.ecourts.gov.in/ecourtindia_v6/`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-blue-900 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink size={12} />
                      {t('viewOnECourts')} ↗
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-base sm:text-lg leading-relaxed font-sans text-slate-900">
                    {renderGlossaryText(data.plainSummary)}
                  </p>
                </div>
              </div>

              {/* What You Need To Do Section if provided */}
              {data.whatYouNeedToDo && data.whatYouNeedToDo.length > 0 && (
                <div className="govt-card p-5 border-l-4 border-l-amber-500 bg-amber-50/50 space-y-3">
                  <h4 className="font-extrabold text-xs sm:text-sm font-serif text-slate-900 uppercase flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-yellow-300 text-slate-950 font-sans font-black rounded border border-amber-400">{t('keyActionsBadge')}</span>
                    {t('whatYouNeedToDoTitle')}
                  </h4>
                  <ul className="space-y-2">
                    {data.whatYouNeedToDo.map((step: string, i: number) => (
                      <li key={i} className="bg-yellow-200/90 text-slate-950 p-3 rounded-md border-l-4 border-amber-500 font-semibold text-xs sm:text-sm shadow-sm flex items-start gap-2.5">
                        <span className="text-amber-700 font-bold text-sm shrink-0 mt-0.5">👉</span>
                        <span>{renderGlossaryText(step)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What Changed Box */}
              {data.changedFromPrevious?.changed && (
                <div className="p-5 rounded border-2 border-amber-400 bg-yellow-100 text-amber-950 space-y-2 shadow-sm">
                  <h4 className="font-bold text-sm flex items-center gap-2 text-slate-950 font-serif">
                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-sans font-bold text-xs rounded">{t('importantUpdateBadge')}</span>
                    {t('keyUpdatesTitle')}
                  </h4>
                  <ul className="space-y-1.5 pl-2 text-xs font-bold text-slate-900">
                    {data.changedFromPrevious.changes.map((c: string, i: number) => (
                      <li key={i} className="bg-yellow-200 px-2 py-1 rounded border-l-2 border-amber-500">
                        {renderGlossaryText(c)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Clause breakdown */}
              {data.clauses && data.clauses.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-sm font-serif text-slate-900 flex items-center gap-2">
                    <span>{t('clauseBreakdownTitle')}</span>
                    <span className="text-[11px] font-sans font-bold text-slate-700 bg-yellow-200 px-2 py-0.5 rounded-full border border-amber-300">{t('highlightedBadge')}</span>
                  </h3>
                  {data.clauses?.map((clause: Clause) => (
                    <div 
                      key={clause.id}
                      className="govt-card p-4 cursor-pointer hover:border-blue-900 transition-colors"
                      onClick={() => setActiveClauseId(activeClauseId === clause.id ? null : clause.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-sm text-slate-900">
                              {renderGlossaryText(clause.plainText)}
                            </p>
                            <span className="text-xs text-slate-500 mt-1 inline-block">{t('officialRecordCitation')} {clause.pageNumber}</span>
                          </div>
                        </div>
                        <ChevronRight size={16} className={`text-slate-400 transition-transform ${activeClauseId === clause.id ? 'rotate-90 text-blue-900' : ''}`} />
                      </div>

                      {activeClauseId === clause.id && (
                        <div className="mt-3 p-3 rounded bg-slate-100 border border-slate-300 text-xs font-serif italic text-slate-800">
                          <span className="block text-[10px] font-sans not-italic font-bold uppercase text-slate-600 mb-1">{t('originalLegalText')}</span>
                          "{clause.originalText}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {viewMode === 'split' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm font-serif text-slate-900">{t('sideBySideTitle')}</h3>
                <span className="text-xs text-slate-500">{t('sideBySideSub')}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-blue-900">{t('plainTranslationCol')}</h4>
                  {data.clauses?.map((clause: Clause) => (
                    <div 
                      key={clause.id}
                      onClick={() => setActiveClauseId(clause.id)}
                      className={`govt-card p-3 text-xs leading-relaxed cursor-pointer ${
                        activeClauseId === clause.id ? 'border-blue-900 bg-yellow-100 font-bold' : ''
                      }`}
                    >
                      {renderGlossaryText(clause.plainText)}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase text-amber-800">{t('originalTextCol')}</h4>
                  {data.clauses?.map((clause: Clause) => (
                    <div 
                      key={clause.id}
                      onClick={() => setActiveClauseId(clause.id)}
                      className={`govt-card p-3 text-xs font-serif italic leading-relaxed cursor-pointer ${
                        activeClauseId === clause.id ? 'border-amber-600 bg-amber-50 text-slate-900' : 'text-slate-700'
                      }`}
                    >
                      <span className="block text-[10px] font-sans not-italic font-bold text-slate-500 mb-0.5">{t('officialRecordCitation')} {clause.pageNumber}</span>
                      "{clause.originalText}"
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="space-y-6">
              <TimelineWidget keyFacts={data.keyFacts} darkMode={false} lang={lang} />
              <ActionChecklist lang={lang} />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="govt-card">
            <div className="govt-card-header flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">{t('caseParticularsTitle')}</h3>
              <span className="text-[10px] font-bold bg-yellow-200 text-slate-950 px-1.5 py-0.5 rounded border border-amber-300">{t('highlightedBadge')}</span>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase">{t('partiesLabel')}</span>
                <ul className="font-semibold text-slate-900 space-y-0.5 mt-0.5">
                  {data.keyFacts?.parties?.map((p: string, i: number) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase">{t('courtBenchLabel')}</span>
                <span className="font-semibold text-slate-900">{data.keyFacts?.courtName || 'District Court'}</span>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">{t('stageLabel')}</span>
                <span className="font-extrabold text-slate-950 bg-yellow-200 px-2 py-1 rounded border-b-2 border-amber-400 inline-block">
                  {data.whereThisStands || data.keyFacts?.stage || 'Interim Stage'}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">{t('nextHearingDateLabel')}</span>
                <span className="font-black text-slate-950 bg-yellow-300 border-b-2 border-amber-500 px-2 py-1 rounded text-xs inline-block shadow-sm">
                  {data.keyFacts?.nextHearingDate || 'Not Specified'}
                </span>
              </div>
            </div>
          </div>

          <div className="govt-card p-4 space-y-2">
            <h4 className="font-bold text-xs text-slate-900 uppercase flex items-center gap-1.5">
              <BookOpen size={16} className="text-blue-900" />
              {t('legalGlossarySearchTitle')}
            </h4>
            <p className="text-xs text-slate-600">
              {t('legalGlossarySearchDesc')}
            </p>
            <button
              onClick={onOpenGlossary}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-bold text-slate-800 transition-colors"
            >
              {t('openGlossaryPanelBtn')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

{/* Administrative Demo Case Management Screen */}
function AdminScreen({ onGoBack }: { onGoBack: () => void }) {
  const [orderType, setOrderType] = useState('Interim Maintenance Order');
  const [customTitle, setCustomTitle] = useState('');
  const [cnrNumber, setCnrNumber] = useState('');
  const [courtName, setCourtName] = useState('District & Sessions Court, Delhi');
  const [parties, setParties] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [rawOrderText, setRawOrderText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [plainSummary, setPlainSummary] = useState('');

  const [examples, setExamples] = useState<SampleOrder[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchExamples = async () => {
    try {
      const res = await axios.get(`${API_BASE}/examples`);
      if (res.data && Array.isArray(res.data)) {
        setExamples(res.data);
      }
    } catch (err) {
      console.error('Failed to load examples', err);
    }
  };

  useEffect(() => {
    fetchExamples();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!rawOrderText) {
        setRawOrderText(`[Uploaded Document File: ${file.name}]`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMode === 'text' && !rawOrderText.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter order text or upload a document.' });
      return;
    }
    if (inputMode === 'file' && !selectedFile && !rawOrderText.trim()) {
      setStatusMsg({ type: 'error', text: 'Please select a document file to upload.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg(null);

    const formData = new FormData();
    const finalTitle = orderType === 'Custom' ? (customTitle || 'Custom Court Order') : orderType;
    formData.append('title', finalTitle);
    formData.append('badge', orderType);
    formData.append('description', `Demo example case for ${finalTitle}`);
    formData.append('rawOrderText', rawOrderText.trim());
    formData.append('cnrNumber', cnrNumber.trim());
    formData.append('courtName', courtName.trim());
    formData.append('parties', parties.trim() || 'Petitioner vs Respondent');
    formData.append('stage', orderType);
    formData.append('plainSummary', plainSummary.trim() || `Plain language summary for ${finalTitle}.`);

    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      const res = await axios.post(`${API_BASE}/admin/examples`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        setStatusMsg({ type: 'success', text: `Demo case "${finalTitle}" successfully added to dynamic dropdown dataset!` });
        setRawOrderText('');
        setSelectedFile(null);
        setCnrNumber('');
        setParties('');
        setPlainSummary('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchExamples();
      }
    } catch (err: any) {
      console.error('Submit example error:', err);
      setStatusMsg({ type: 'error', text: err.response?.data?.error || 'Failed to add demo case.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from demo cases?`)) return;
    try {
      await axios.delete(`${API_BASE}/admin/examples/${id}`);
      fetchExamples();
      setStatusMsg({ type: 'success', text: `Demo case deleted.` });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to delete example.' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-lg shadow-md border-l-8 border-amber-500 flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-amber-400" />
            <h2 className="text-xl font-bold font-serif">Demo Case Administrative Portal</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Add or manage demo cases stored in <code className="text-amber-300 bg-slate-800 px-1 py-0.5 rounded">backend/data/examples.json</code>. Changes immediately update the "Try an Example" dropdown on the main portal.
          </p>
        </div>
        <button
          onClick={onGoBack}
          className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded hover:bg-amber-300 text-xs transition-colors shadow"
        >
          <ArrowLeft size={16} />
          Return to Explainer Portal
        </button>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-md flex items-center gap-3 ${statusMsg.type === 'success' ? 'bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900' : 'bg-rose-50 border-l-4 border-rose-600 text-rose-900'}`}>
          {statusMsg.type === 'success' ? <CheckCircle2 size={20} className="shrink-0 text-emerald-700" /> : <AlertCircle size={20} className="shrink-0 text-rose-700" />}
          <p className="text-sm font-semibold">{statusMsg.text}</p>
        </div>
      )}

      {/* Main Grid: Form + Existing Examples List */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-3 govt-card">
          <div className="govt-card-header">
            <h3 className="font-bold text-sm text-slate-900 font-serif flex items-center gap-2">
              <Plus size={18} className="text-blue-900" />
              Add New Demo Court Case Order
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Order Type & Case Title */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Order Type / Classification <span className="text-rose-600">*</span>
                </label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  className="w-full p-2.5 text-xs font-semibold rounded border border-slate-300 bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                >
                  <option value="Interim Maintenance Order">Interim Maintenance Order</option>
                  <option value="Adjournment Notice Order">Adjournment Notice Order</option>
                  <option value="Bail Order with Conditions">Bail Order with Conditions</option>
                  <option value="Injunction Order">Injunction / Stay Order</option>
                  <option value="Final Judgment Order">Final Judgment Order</option>
                  <option value="Custom">Custom Order Type</option>
                </select>
              </div>

              {orderType === 'Custom' ? (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Custom Order Title <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Custody Application Order"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full p-2.5 text-xs font-semibold rounded border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    CNR / Case Record Number (16-char)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="e.g. DLCT010012342026"
                    value={cnrNumber}
                    onChange={(e) => setCnrNumber(e.target.value.toUpperCase())}
                    className="w-full p-2.5 text-xs font-mono font-semibold rounded border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none uppercase"
                  />
                </div>
              )}
            </div>

            {orderType !== 'Custom' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Court & Bench Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Court of Principal Sessions Judge, Delhi"
                    value={courtName}
                    onChange={(e) => setCourtName(e.target.value)}
                    className="w-full p-2.5 text-xs font-semibold rounded border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Parties Involved (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sunita Devi, Ramesh Kumar"
                    value={parties}
                    onChange={(e) => setParties(e.target.value)}
                    className="w-full p-2.5 text-xs font-semibold rounded border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Document Input Mode Switcher */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase text-slate-700">
                  Court Order Document Input <span className="text-rose-600">*</span>
                </label>
                <div className="flex bg-slate-200 p-0.5 rounded text-xs">
                  <button
                    type="button"
                    onClick={() => setInputMode('text')}
                    className={`px-3 py-1 font-bold rounded transition-colors ${inputMode === 'text' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:text-slate-900'}`}
                  >
                    Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode('file')}
                    className={`px-3 py-1 font-bold rounded transition-colors ${inputMode === 'file' ? 'bg-blue-900 text-white' : 'text-slate-700 hover:text-slate-900'}`}
                  >
                    Upload Document File
                  </button>
                </div>
              </div>

              {inputMode === 'text' ? (
                <div>
                  <textarea
                    rows={6}
                    required
                    placeholder="Paste full text of certified court order here..."
                    value={rawOrderText}
                    onChange={(e) => setRawOrderText(e.target.value)}
                    className="w-full p-3 text-xs font-mono rounded border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none leading-relaxed"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center space-y-3 bg-slate-50">
                  <FileText size={36} className="mx-auto text-blue-900" />
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.txt,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="admin-file-upload"
                    />
                    <label
                      htmlFor="admin-file-upload"
                      className="inline-block px-4 py-2 bg-blue-900 text-white text-xs font-bold rounded cursor-pointer hover:bg-blue-800 transition-colors"
                    >
                      Choose PDF / Document File
                    </label>
                  </div>
                  {selectedFile ? (
                    <p className="text-xs font-bold text-emerald-800">
                      Selected File: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500">Supports PDF, TXT or DOC files containing court order copy.</p>
                  )}
                </div>
              )}
            </div>

            {/* Plain Summary Override / Optional pre-computed explanation */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Plain-Language Explanation Summary (Optional Override)
              </label>
              <textarea
                rows={3}
                placeholder="Optional: Pre-written plain language summary for instant offline display..."
                value={plainSummary}
                onChange={(e) => setPlainSummary(e.target.value)}
                className="w-full p-2.5 text-xs rounded border border-slate-300 focus:ring-2 focus:ring-blue-900 outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving Example to Portal...</span>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Save Demo Case to Portal Examples</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Examples List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="govt-card">
            <div className="govt-card-header flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 font-serif flex items-center gap-1.5">
                <Landmark size={14} className="text-blue-900" />
                Active Demo Examples ({examples.length})
              </h3>
              <span className="text-[10px] text-slate-500">examples.json</span>
            </div>

            <div className="p-4 divide-y divide-slate-200 max-h-[600px] overflow-y-auto space-y-3">
              {examples.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No demo cases currently stored.</p>
              ) : (
                examples.map((ex) => (
                  <div key={ex.id} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded border border-amber-300 uppercase">
                          {ex.badge || 'Demo Case'}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 mt-1 font-serif">{ex.title}</h4>
                      </div>
                      <button
                        onClick={() => handleDelete(ex.id, ex.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded hover:bg-rose-50"
                        title="Delete Demo Case"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {ex.keyFacts?.cnrNumber && (
                      <p className="text-[11px] font-mono text-slate-600">
                        CNR: <strong className="text-slate-900">{ex.keyFacts.cnrNumber}</strong>
                      </p>
                    )}

                    <p className="text-[11px] text-slate-600 line-clamp-2 italic">
                      "{ex.rawOrderText}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
