import React, { useState, useEffect } from 'react';
import { Lock, ChefHat, Globe2, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface PortalAuthGateProps {
  role: 'owner' | 'super-admin';
  children: (onLogout: () => void) => React.ReactNode;
}

const STORAGE_KEYS = {
  owner: 'panzarotto_owner_session_v1',
  'super-admin': 'panzarotto_superadmin_session_v1',
};

export const CREDENTIALS = {
  owner: {
    login: 'labriout@eat-view.local',
    altLogin: 'owner@panzarotto.it',
    password: 'pompei2025',
    kitchenPin: '1930',
    title: 'Панель Кухни & Владельца (KDS)',
    subtitle: 'Экран повара с живым таймером блюд, список заказов, стоп-лист (86) и касса Stripe',
  },
  'super-admin': {
    login: 'admin@streetfood-saas.com',
    altLogin: 'labriout@eat-view.local',
    password: 'superadmin2025',
    kitchenPin: '9999',
    title: 'Панель Супер-Админа (CMS Меню)',
    subtitle: 'Управление блюдами, ценами, фотографиями, добавками и промокодами',
  },
};

export const PortalAuthGate: React.FC<PortalAuthGateProps> = ({ role, children }) => {
  const { setCurrentView } = useCart();
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

  useEffect(() => {
    try {
      setIsAuthenticated(localStorage.getItem(STORAGE_KEYS[role]) === 'authenticated');
    } catch {
      setIsAuthenticated(false);
    }
    setErrorMsg('');
  }, [role]);

  const targetCreds = CREDENTIALS[role];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMode === 'pin') {
      if (pinInput.trim() === targetCreds.kitchenPin) {
        try {
          localStorage.setItem(STORAGE_KEYS[role], 'authenticated');
        } catch {
          // ignore
        }
        setIsAuthenticated(true);
        return;
      }
      setErrorMsg(`Неверный PIN-код. Используйте PIN: ${targetCreds.kitchenPin}`);
      return;
    }

    const cleanLogin = loginInput.trim().toLowerCase().replace(/\.$/, '');
    if (
      (cleanLogin === targetCreds.login.toLowerCase() ||
        cleanLogin === targetCreds.altLogin.toLowerCase()) &&
      passwordInput.trim() === targetCreds.password
    ) {
      try {
        localStorage.setItem(STORAGE_KEYS[role], 'authenticated');
      } catch {
        // ignore
      }
      setIsAuthenticated(true);
    } else {
      setErrorMsg('Неверный логин или пароль. Нажмите «Войти в 1 клик» ниже.');
    }
  };

  const handleQuickDemoLogin = () => {
    setLoginInput(targetCreds.login);
    setPasswordInput(targetCreds.password);
    try {
      localStorage.setItem(STORAGE_KEYS[role], 'authenticated');
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
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#e66430]" />
            <span>На витрину</span>
          </button>

          <span className="px-3 py-1 rounded-full bg-[#d6e6ff] text-[#3b76ef] text-[11px] font-extrabold uppercase flex items-center gap-1.5">
            {role === 'owner' ? <ChefHat className="w-3.5 h-3.5" /> : <Globe2 className="w-3.5 h-3.5" />}
            {role === 'owner' ? 'Kitchen KDS' : 'Super-Admin'}
          </span>
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
              {targetCreds.title}
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{targetCreds.subtitle}</p>
          </div>
        </div>

        {/* Mode Switcher */}
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
            Логин и Пароль
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
            Быстрый PIN кухни
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {authMode === 'password' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Логин / Email</label>
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={e => setLoginInput(e.target.value)}
                  placeholder={targetCreds.login}
                  className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#4c84ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Пароль</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#4c84ff]"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                4-значный PIN-код терминала кухни
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={pinInput}
                onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder={targetCreds.kitchenPin}
                className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3.5 py-3 text-center text-2xl font-mono font-black tracking-[0.5em] text-[#e66430] focus:outline-none focus:border-[#4c84ff]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#e66430] hover:bg-[#d45625] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-[#e66430]/20 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Войти в панель</span>
          </button>
        </form>

        {/* Credentials Reference + 1-Click Auto-Login */}
        <div className="p-4 rounded-2xl bg-[#f8f9fc] border border-slate-200/80 space-y-3 text-xs">
          <span className="font-extrabold text-emerald-700 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4" />
            Быстрый вход ({role === 'owner' ? 'Кухня KDS' : 'Супер-Админ'}):
          </span>
          <div className="space-y-1 font-mono text-[11px] text-slate-600">
            <p>
              Логин: <strong className="text-slate-900 select-all">{targetCreds.login}</strong>
            </p>
            <p>
              Пароль: <strong className="text-slate-900 select-all">{targetCreds.password}</strong>
            </p>
            <p>
              PIN-код: <strong className="text-[#e66430] select-all">{targetCreds.kitchenPin}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Войти в 1 клик</span>
          </button>
        </div>
      </div>
    </div>
  );
};
