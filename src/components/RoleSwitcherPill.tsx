import React, { useState } from 'react';
import { ChefHat, Store, ChevronUp, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Language } from '../types';

const PILL_TEXT: Record<
  Language,
  {
    header: string;
    storeTitle: string;
    storeSub: string;
    kitchenTitle: string;
    kitchenSub: string;
    pillActiveKitchen: string;
    pillStorefront: string;
    pillTooltip: string;
  }
> = {
  fr: {
    header: 'Accès rapide',
    storeTitle: 'Vitrine du Restaurant',
    storeSub: 'Menu & commandes clients',
    kitchenTitle: 'Cuisine KDS & Gestion',
    kitchenSub: 'Commandes, Préparation, Stock',
    pillActiveKitchen: 'Cuisine & Gestion',
    pillStorefront: 'Cuisine / KDS',
    pillTooltip: 'Ouvrir le panneau Cuisine KDS',
  },
  en: {
    header: 'Quick Switch',
    storeTitle: 'Restaurant Storefront',
    storeSub: 'Customer menu & ordering',
    kitchenTitle: 'Kitchen KDS & Admin',
    kitchenSub: 'Orders, Prep, Stock, Stripe',
    pillActiveKitchen: 'Kitchen & Admin',
    pillStorefront: 'Kitchen / KDS',
    pillTooltip: 'Open Kitchen KDS panel',
  },
  de: {
    header: 'Schnellzugriff',
    storeTitle: 'Restaurant-Shop',
    storeSub: 'Speisekarte & Bestellungen',
    kitchenTitle: 'Küche KDS & Verwaltung',
    kitchenSub: 'Bestellungen, Zubereitung, Lager',
    pillActiveKitchen: 'Küche & Verwaltung',
    pillStorefront: 'Küche / KDS',
    pillTooltip: 'Küche KDS-Panel öffnen',
  },
  it: {
    header: 'Accesso rapido',
    storeTitle: 'Vetrina Ristorante',
    storeSub: 'Menù e ordini clienti',
    kitchenTitle: 'Cucina KDS & Gestione',
    kitchenSub: 'Ordini, Preparazione, Magazzino',
    pillActiveKitchen: 'Cucina & Gestione',
    pillStorefront: 'Cucina / KDS',
    pillTooltip: 'Apri pannello Cucina KDS',
  },
  ru: {
    header: 'Переключение режима',
    storeTitle: 'Витрина Ресторана',
    storeSub: 'Меню и заказы клиентов',
    kitchenTitle: 'Кухня KDS & Панель',
    kitchenSub: 'Заказы, Сборка, Склад, Stripe',
    pillActiveKitchen: 'Кухня & Панель',
    pillStorefront: 'Кухня / KDS',
    pillTooltip: 'Открыть панель Кухни KDS',
  },
};

export const RoleSwitcherPill: React.FC = () => {
  const { currentView, setCurrentView, language } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);

  // Hide switcher completely inside private Super-Admin view
  if (currentView === 'super-admin') {
    return null;
  }

  const isStorefront = currentView !== 'owner';
  const copy = PILL_TEXT[language] || PILL_TEXT.fr;

  return (
    <div className="fixed bottom-16 md:bottom-5 left-3 sm:left-5 z-50 select-none">
      {isExpanded ? (
        <div className="bg-[#11141f]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-2 shadow-2xl flex flex-col gap-1.5 min-w-[235px] animate-fadeIn">
          <div className="px-2.5 py-1 flex items-center justify-between border-b border-white/10">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
              {copy.header}
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-neutral-400 hover:text-white p-0.5 cursor-pointer"
              aria-label="Close"
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
              <p className="leading-none">{copy.storeTitle}</p>
              <p className="text-[10px] opacity-80 font-normal mt-0.5">{copy.storeSub}</p>
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
              <p className="leading-none">{copy.kitchenTitle}</p>
              <p className="text-[10px] opacity-80 font-normal mt-0.5">{copy.kitchenSub}</p>
            </div>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="px-3.5 py-2 rounded-full bg-[#11141f]/95 hover:bg-[#191e2e] text-white border border-white/15 shadow-xl flex items-center gap-2 text-xs font-extrabold transition cursor-pointer"
          title={copy.pillTooltip}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <ChefHat className="w-4 h-4 text-[#ff5500]" />
          <span>
            {currentView === 'owner' ? copy.pillActiveKitchen : copy.pillStorefront}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
        </button>
      )}
    </div>
  );
};
