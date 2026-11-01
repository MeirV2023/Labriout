import React, { useState, useEffect } from 'react';
import { Lock, ChefHat, Globe2, ArrowLeft, KeyRound, CheckCircle2, Sparkles } from 'lucide-react';
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
    login: 'owner@panzarotto.it',
    password: 'pompei2025',
    kitchenPin: '1930',
    title: 'Вход для Владельца Ресторана & Кухни (KDS)',
    subtitle: 'Управление заказами, экран сборщика (Packing), склад и прямые выплаты Stripe',
  },
  'super-admin': {
    login: 'admin@streetfood-saas.com',
    password: 'superadmin2025',
    kitchenPin: '9999',
    title: 'Вход в Центр Управления SaaS-Платформой (Super-Admin)',
    subtitle: 'Управление всеми ресторанами мира (50–100€/мес), удаленное обновление цен, фото и меню',
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

    if (
      loginInput.trim().toLowerCase() === targetCreds.login.toLowerCase() &&
      passwordInput.trim() === targetCreds.password
    ) {
      try {
        localStorage.setItem(STORAGE_KEYS[role], 'authenticated');
      } catch {
        // ignore
      }
      setIsAuthenticated(true);
    } else {
      setErrorMsg('Неверный логин или пароль. Проверьте данные ниже или нажмите «Войти в 1 клик».');
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
    <div className="min-h-screen bg-[#0a0c12] text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#131722] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Top Back Link */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#ff5500]" />
            <span>Вернуться на витрину</span>
          </button>

          <span className="px-2.5 py-1 rounded-full bg-[#ff5500]/15 border border-[#ff5500]/30 text-[#ff7733] text-[11px] font-extrabold uppercase flex items-center gap-1">
            {role === 'owner' ? <ChefHat className="w-3.5 h-3.5" /> : <Globe2 className="w-3.5 h-3.5" />}
            {role === 'owner' ? '/owner' : '/super-admin'}
          </span>
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <h1 className="text-xl font-black text-white tracking-tight">{targetCreds.title}</h1>
          <p className="text-xs text-neutral-400 leading-relaxed">{targetCreds.subtitle}</p>
        </div>

        {/* Mode Switcher (Email/Password vs Kitchen Tablet PIN) */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#0b0e15] border border-white/10">
          <button
            type="button"
            onClick={() => {
              setAuthMode('password');
              setErrorMsg('');
            }}
            className={`py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
              authMode === 'password'
                ? 'bg-[#ff5500] text-white'
                : 'text-neutral-400 hover:text-white'
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
                ? 'bg-[#ff5500] text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Быстрый PIN-код кухни
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {authMode === 'password' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Логин / Email
                </label>
                <input
                  type="text"
                  required
                  value={loginInput}
                  onChange={e => setLoginInput(e.target.value)}
                  placeholder={targetCreds.login}
                  className="w-full bg-[#0b0e15] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Пароль
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-[#0b0e15] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1">
                4-значный PIN-код терминала / планшета повара
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={pinInput}
                onChange={e => setPinInput(e.target.value.replace(/\D/g, ''))}
                placeholder={targetCreds.kitchenPin}
                className="w-full bg-[#0b0e15] border border-white/15 rounded-xl px-3.5 py-3 text-center text-2xl font-mono font-black tracking-[0.5em] text-[#ff7733] focus:outline-none focus:border-[#ff5500]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#ff5500] hover:bg-[#e04a00] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#ff5500]/25 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>Войти в систему</span>
          </button>
        </form>

        {/* Credentials Reference Box + 1-Click Auto-Login */}
        <div className="p-4 rounded-2xl bg-[#0c0f17] border border-white/10 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-emerald-400 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4" />
              Доступы для входа ({role === 'owner' ? 'Владелец / Кухня' : 'Супер-Админ SaaS'}):
            </span>
          </div>
          <div className="space-y-1 font-mono text-[11px] text-neutral-300">
            <p>
              Логин: <strong className="text-white select-all">{targetCreds.login}</strong>
            </p>
            <p>
              Пароль: <strong className="text-white select-all">{targetCreds.password}</strong>
            </p>
            <p>
              PIN-код планшета: <strong className="text-[#ff7733] select-all">{targetCreds.kitchenPin}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Войти в 1 клик (Автозаполнение)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
