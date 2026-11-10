import React, { useState, useEffect } from 'react';
import { Lock, ChefHat, ShieldCheck, ArrowLeft, KeyRound, Sparkles, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Language } from '../types';

interface PortalAuthGateProps {
  role: 'owner' | 'super-admin';
  children: (onLogout: () => void) => React.ReactNode;
}

const STORAGE_KEYS = {
  owner: 'panzarotto_owner_session_v1',
  'super-admin': 'labriout_superadmin_session_v2',
};

// Default SHA-256(login + ':' + password) for private Super-Admin access.
// Can also be overridden in Vercel via VITE_SUPERADMIN_LOGIN and VITE_SUPERADMIN_PASSWORD.
const SUPERADMIN_CREDENTIAL_SHA256 =
  'd31657967fc799f0ee605d518b6dbcd8b4cf0a3ff0afe7e68e527879da1f2fde';

async function sha256Hex(input: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoded = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return '';
}

export const OWNER_CREDENTIALS = {
  login: 'labriout@eat-view.local',
  altLogin: 'owner@panzarotto.it',
  password: 'pompei2025',
  kitchenPin: '1930',
};

const LANG_OPTIONS: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'de', label: 'DE', flag: '🇩🇪' },
  { code: 'it', label: 'IT', flag: '🇮🇹' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
];

const AUTH_COPY: Record<
  Language,
  {
    backToStore: string;
    badgeOwner: string;
    badgeSuper: string;
    ownerTitle: string;
    ownerSubtitle: string;
    superTitle: string;
    superSubtitle: string;
    modePassword: string;
    modePin: string;
    loginLabel: string;
    passwordLabel: string;
    pinLabel: string;
    submitBtn: string;
    errInvalidPin: string;
    errInvalidLogin: string;
    errInvalidSuper: string;
    quickAccessTitle: string;
    quickLoginLabel: string;
    quickPassLabel: string;
    quickPinLabel: string;
    quickOneClick: string;
    privateNotice: string;
  }
> = {
  fr: {
    backToStore: 'Vitrine',
    badgeOwner: 'Cuisine KDS',
    badgeSuper: 'Accès Privé',
    ownerTitle: 'Panneau Cuisine & Gestion (KDS)',
    ownerSubtitle: 'Écran chef en direct, liste des commandes, ruptures (86) et caisse Stripe',
    superTitle: 'Administration Privée (CMS)',
    superSubtitle: 'Accès réservé au propriétaire — gestion des menus, prix, photos et codes promo',
    modePassword: 'Identifiant & Mot de passe',
    modePin: 'Code PIN Cuisine',
    loginLabel: 'Identifiant / E-mail',
    passwordLabel: 'Mot de passe',
    pinLabel: 'Code PIN terminal cuisine (4 chiffres)',
    submitBtn: 'Se connecter',
    errInvalidPin: 'Code PIN incorrect.',
    errInvalidLogin: 'Identifiant ou mot de passe incorrect.',
    errInvalidSuper: 'Accès refusé : identifiant ou mot de passe administrateur invalide.',
    quickAccessTitle: 'Accès rapide (Cuisine KDS) :',
    quickLoginLabel: 'Identifiant :',
    quickPassLabel: 'Mot de passe :',
    quickPinLabel: 'Code PIN :',
    quickOneClick: 'Connexion en 1 clic (Cuisine)',
    privateNotice: 'Zone sécurisée réservée uniquement au propriétaire.',
  },
  en: {
    backToStore: 'Storefront',
    badgeOwner: 'Kitchen KDS',
    badgeSuper: 'Private Access',
    ownerTitle: 'Kitchen & Admin Panel (KDS)',
    ownerSubtitle: 'Live chef timer screen, order list, 86 stop-list, stock & Stripe POS',
    superTitle: 'Private Super-Admin (CMS)',
    superSubtitle: 'Owner-only access — manage dishes, prices, photos, extras & promo codes',
    modePassword: 'Login & Password',
    modePin: 'Kitchen Quick PIN',
    loginLabel: 'Login / Email',
    passwordLabel: 'Password',
    pinLabel: '4-digit Kitchen Terminal PIN',
    submitBtn: 'Sign in to panel',
    errInvalidPin: 'Incorrect PIN code.',
    errInvalidLogin: 'Invalid login or password.',
    errInvalidSuper: 'Access denied: invalid administrator login or password.',
    quickAccessTitle: 'Quick Access (Kitchen KDS):',
    quickLoginLabel: 'Login:',
    quickPassLabel: 'Password:',
    quickPinLabel: 'PIN code:',
    quickOneClick: '1-Click Sign In (Kitchen)',
    privateNotice: 'Protected area strictly restricted to the owner.',
  },
  de: {
    backToStore: 'Zum Shop',
    badgeOwner: 'Küche KDS',
    badgeSuper: 'Privater Zugang',
    ownerTitle: 'Küche & Verwaltungspanel (KDS)',
    ownerSubtitle: 'Live-Küchenbildschirm mit Timer, Bestellliste, 86-Stoppliste & Stripe-Kasse',
    superTitle: 'Privates Super-Admin (CMS)',
    superSubtitle: 'Nur für den Inhaber — Gerichte, Preise, Fotos, Extras & Promo-Codes verwalten',
    modePassword: 'Login & Passwort',
    modePin: 'Küchen-Schnell-PIN',
    loginLabel: 'Login / E-Mail',
    passwordLabel: 'Passwort',
    pinLabel: '4-stelliger Küchenterminal-PIN',
    submitBtn: 'Anmelden',
    errInvalidPin: 'Falscher PIN-Code.',
    errInvalidLogin: 'Ungültiger Login oder falsches Passwort.',
    errInvalidSuper: 'Zugriff verweigert: ungültige Administrator-Zugangsdaten.',
    quickAccessTitle: 'Schnellzugang (Küche KDS):',
    quickLoginLabel: 'Login:',
    quickPassLabel: 'Passwort:',
    quickPinLabel: 'PIN-Code:',
    quickOneClick: '1-Klick-Anmeldung (Küche)',
    privateNotice: 'Geschützter Bereich — ausschließlich für den Inhaber.',
  },
  it: {
    backToStore: 'Vetrina',
    badgeOwner: 'Cucina KDS',
    badgeSuper: 'Accesso Privato',
    ownerTitle: 'Pannello Cucina & Gestione (KDS)',
    ownerSubtitle: 'Schermo cucina con timer live, lista ordini, stop-list (86) e cassa Stripe',
    superTitle: 'Super-Admin Privato (CMS)',
    superSubtitle: 'Accesso riservato al titolare — gestione piatti, prezzi, foto e codici promo',
    modePassword: 'Login e Password',
    modePin: 'PIN Rapido Cucina',
    loginLabel: 'Login / Email',
    passwordLabel: 'Password',
    pinLabel: 'PIN terminale cucina a 4 cifre',
    submitBtn: 'Accedi al pannello',
    errInvalidPin: 'Codice PIN non valido.',
    errInvalidLogin: 'Login o password non validi.',
    errInvalidSuper: 'Accesso negato: credenziali amministratore non valide.',
    quickAccessTitle: 'Accesso rapido (Cucina KDS):',
    quickLoginLabel: 'Login:',
    quickPassLabel: 'Password:',
    quickPinLabel: 'Codice PIN:',
    quickOneClick: 'Accesso in 1 clic (Cucina)',
    privateNotice: 'Area protetta riservata esclusivamente al titolare.',
  },
  ru: {
    backToStore: 'На витрину',
    badgeOwner: 'Кухня KDS',
    badgeSuper: 'Приватный доступ',
    ownerTitle: 'Панель Кухни & Владельца (KDS)',
    ownerSubtitle: 'Экран повара с живым таймером блюд, список заказов, стоп-лист (86) и касса Stripe',
    superTitle: 'Приватная Панель Супер-Админа (CMS)',
    superSubtitle: 'Доступ только для владельца — управление блюдами, ценами, фото и промокодами',
    modePassword: 'Логин и Пароль',
    modePin: 'Быстрый PIN кухни',
    loginLabel: 'Логин / Email',
    passwordLabel: 'Пароль',
    pinLabel: '4-значный PIN-код терминала кухни',
    submitBtn: 'Войти в панель',
    errInvalidPin: 'Неверный PIN-код.',
    errInvalidLogin: 'Неверный логин или пароль.',
    errInvalidSuper: 'Доступ запрещён: неверный логин или пароль администратора.',
    quickAccessTitle: 'Быстрый вход (Кухня KDS):',
    quickLoginLabel: 'Логин:',
    quickPassLabel: 'Пароль:',
    quickPinLabel: 'PIN-код:',
    quickOneClick: 'Войти в 1 клик (Кухня)',
    privateNotice: 'Защищённый раздел — доступ открыт только владельцу.',
  },
};

export const PortalAuthGate: React.FC<PortalAuthGateProps> = ({ role, children }) => {
  const { setCurrentView, language, setLanguage } = useCart();
  const copy = AUTH_COPY[language] || AUTH_COPY.fr;
  const isSuperAdmin = role === 'super-admin';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS[role]) === 'authenticated';
    } catch {
      return false;
    }
  });

  const [authMode, setAuthMode] = useState<'password' | 'pin'>('password');
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    try {
      setIsAuthenticated(localStorage.getItem(STORAGE_KEYS[role]) === 'authenticated');
    } catch {
      setIsAuthenticated(false);
    }
    setErrorMsg('');
    if (role === 'super-admin') {
      setAuthMode('password');
    }
  }, [role]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Private Super-Admin authentication: strict Login + Password only
    if (isSuperAdmin) {
      setIsChecking(true);
      try {
        const cleanLogin = loginInput.trim().toLowerCase().replace(/\.$/, '');
        const rawPassword = passwordInput.trim();

        const envLogin = (import.meta.env.VITE_SUPERADMIN_LOGIN || '').trim().toLowerCase();
        const envPassword = (import.meta.env.VITE_SUPERADMIN_PASSWORD || '').trim();

        let matched = false;
        if (envLogin && envPassword) {
          matched = cleanLogin === envLogin && rawPassword === envPassword;
        } else {
          const candidateHash = await sha256Hex(`${cleanLogin}:${rawPassword}`);
          matched = candidateHash === SUPERADMIN_CREDENTIAL_SHA256;
        }

        if (matched) {
          try {
            localStorage.setItem(STORAGE_KEYS['super-admin'], 'authenticated');
          } catch {
            // ignore
          }
          setIsAuthenticated(true);
        } else {
          setErrorMsg(copy.errInvalidSuper);
        }
      } finally {
        setIsChecking(false);
      }
      return;
    }

    // Kitchen / Owner KDS authentication
    if (authMode === 'pin') {
      if (pinInput.trim() === OWNER_CREDENTIALS.kitchenPin) {
        try {
          localStorage.setItem(STORAGE_KEYS.owner, 'authenticated');
        } catch {
          // ignore
        }
        setIsAuthenticated(true);
        return;
      }
      setErrorMsg(copy.errInvalidPin);
      return;
    }

    const cleanLogin = loginInput.trim().toLowerCase().replace(/\.$/, '');
    if (
      (cleanLogin === OWNER_CREDENTIALS.login.toLowerCase() ||
        cleanLogin === OWNER_CREDENTIALS.altLogin.toLowerCase()) &&
      passwordInput.trim() === OWNER_CREDENTIALS.password
    ) {
      try {
        localStorage.setItem(STORAGE_KEYS.owner, 'authenticated');
      } catch {
        // ignore
      }
      setIsAuthenticated(true);
    } else {
      setErrorMsg(copy.errInvalidLogin);
    }
  };

  const handleQuickDemoLogin = () => {
    if (isSuperAdmin) return;
    setLoginInput(OWNER_CREDENTIALS.login);
    setPasswordInput(OWNER_CREDENTIALS.password);
    try {
      localStorage.setItem(STORAGE_KEYS.owner, 'authenticated');
    } catch {
      // ignore
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS[role]);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return <>{children(handleLogout)}</>;
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-slate-800 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.06)] space-y-6">
        {/* Top Back Link + Language Switcher + Role Badge */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#e66430]" />
            <span>{copy.backToStore}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 bg-slate-100 rounded-xl p-0.5 border border-slate-200/70">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
              {LANG_OPTIONS.map(opt => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => setLanguage(opt.code)}
                  className={`px-1.5 py-1 rounded-lg text-[10px] font-extrabold transition cursor-pointer ${
                    language === opt.code
                      ? 'bg-white text-[#e66430] shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title={opt.label}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <span
              className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase flex items-center gap-1 ${
                isSuperAdmin
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-[#d6e6ff] text-[#3b76ef]'
              }`}
            >
              {isSuperAdmin ? (
                <ShieldCheck className="w-3.5 h-3.5" />
              ) : (
                <ChefHat className="w-3.5 h-3.5" />
              )}
              {isSuperAdmin ? copy.badgeSuper : copy.badgeOwner}
            </span>
          </div>
        </div>

        {/* Logo & Header */}
        <div className="flex items-center gap-3">
          <img
            src="/logo-labriur.png"
            onError={e => {
              e.currentTarget.src = '/logo-custom.png';
            }}
            alt="La Briout"
            className="h-12 w-auto object-contain"
          />
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {isSuperAdmin ? copy.superTitle : copy.ownerTitle}
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
              {isSuperAdmin ? copy.superSubtitle : copy.ownerSubtitle}
            </p>
          </div>
        </div>

        {/* Mode Switcher — ONLY for Kitchen/Owner, never for Super-Admin */}
        {!isSuperAdmin ? (
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#f5f6fa] border border-slate-200/70">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setErrorMsg('');
              }}
              className={`py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                authMode === 'password'
                  ? 'bg-[#4c84ff] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {copy.modePassword}
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('pin');
                setErrorMsg('');
              }}
              className={`py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                authMode === 'pin'
                  ? 'bg-[#4c84ff] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {copy.modePin}
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600" />
            <span>{copy.privateNotice}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {isSuperAdmin || authMode === 'password' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {copy.loginLabel}
                </label>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={loginInput}
                  onChange={e => setLoginInput(e.target.value)}
                  placeholder={isSuperAdmin ? 'admin@...' : OWNER_CREDENTIALS.login}
                  className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#4c84ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  {copy.passwordLabel}
                </label>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#4c84ff]"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                {copy.pinLabel}
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={pinInput}
                onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3.5 py-3 text-center text-2xl font-mono font-black tracking-[0.5em] text-[#e66430] focus:outline-none focus:border-[#4c84ff]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isChecking}
            className="w-full py-3.5 rounded-2xl bg-[#e66430] hover:bg-[#d45625] disabled:opacity-60 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#e66430]/20 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{copy.submitBtn}</span>
          </button>
        </form>

        {/* Quick Kitchen Demo Access — ONLY shown for Kitchen/Owner, NEVER for Super-Admin */}
        {!isSuperAdmin && (
          <div className="p-4 rounded-2xl bg-[#f8f9fc] border border-slate-200/80 space-y-3 text-xs">
            <span className="font-extrabold text-emerald-700 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" />
              {copy.quickAccessTitle}
            </span>
            <div className="space-y-1 font-mono text-[11px] text-slate-600">
              <p>
                {copy.quickLoginLabel}{' '}
                <strong className="text-slate-900 select-all">{OWNER_CREDENTIALS.login}</strong>
              </p>
              <p>
                {copy.quickPassLabel}{' '}
                <strong className="text-slate-900 select-all">{OWNER_CREDENTIALS.password}</strong>
              </p>
              <p>
                {copy.quickPinLabel}{' '}
                <strong className="text-[#e66430] select-all">
                  {OWNER_CREDENTIALS.kitchenPin}
                </strong>
              </p>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>{copy.quickOneClick}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
