import React, { useState } from 'react';
import { ChefHat, Globe2, Store, ChevronUp, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const RoleSwitcherPill: React.FC = () => {
  const { currentView, setCurrentView } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);

  const isStorefront = currentView !== 'owner' && currentView !== 'super-admin';

  return (
    <div className="fixed bottom-16 md:bottom-5 left-3 sm:left-5 z-50 select-none">
      {isExpanded ? (
        <div className="bg-[#11141f]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-2xl flex flex-col gap-1.5 min-w-[235px] animate-fadeIn">
          <div className="px-2.5 py-1 flex items-center justify-between border-b border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
              Переключение микросервисов
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-neutral-400 hover:text-white p-0.5 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setCurrentView('home');
              setIsExpanded(false);
            }}
            className={`w-full px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2.5 transition cursor-pointer ${
              isStorefront
                ? 'bg-[#ff5500] text-white'
                : 'text-neutral-300 hover:bg-white/10'
            }`}
          >
            <Store className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <p className="leading-none">Витрина Ресторана</p>
              <p className="text-[10px] opacity-80 font-normal mt-0.5">Для клиентов из TikTok/Insta</p>
            </div>
          </button>

          <button
            onClick={() => {
              setCurrentView('owner');
              setIsExpanded(false);
            }}
            className={`w-full px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2.5 transition cursor-pointer ${
              currentView === 'owner'
                ? 'bg-[#ff5500] text-white'
                : 'text-neutral-300 hover:bg-white/10'
            }`}
          >
            <ChefHat className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <p className="leading-none">Кухня KDS & Владелец</p>
              <p className="text-[10px] opacity-80 font-normal mt-0.5">Заказы, Сборка, Склад, Stripe</p>
            </div>
          </button>

          <button
            onClick={() => {
              setCurrentView('super-admin');
              setIsExpanded(false);
            }}
            className={`w-full px-3 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2.5 transition cursor-pointer ${
              currentView === 'super-admin'
                ? 'bg-[#ff5500] text-white'
                : 'text-neutral-300 hover:bg-white/10'
            }`}
          >
            <Globe2 className="w-4 h-4 shrink-0" />
            <div className="text-left">
              <p className="leading-none">Супер-Админ SaaS CMS</p>
              <p className="text-[10px] opacity-80 font-normal mt-0.5">Цены, Фото, Рестораны мира</p>
            </div>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="px-3.5 py-2 rounded-full bg-[#11141f]/95 hover:bg-[#191e2e] text-white border border-white/15 shadow-xl flex items-center gap-2 text-xs font-extrabold transition cursor-pointer"
          title="Открыть панель Кухни KDS или Супер-Админа SaaS"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <ChefHat className="w-4 h-4 text-[#ff5500]" />
          <span>
            {currentView === 'owner'
              ? 'Кухня & Владелец'
              : currentView === 'super-admin'
              ? 'Супер-Админ SaaS'
              : 'KDS / Админ-панель'}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
        </button>
      )}
    </div>
  );
};
