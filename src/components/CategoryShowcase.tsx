import React, { useRef } from 'react';
import { ArrowRight, Smartphone, Globe, Zap } from 'lucide-react';
import { CategoryId } from '../types';
import { SHOWCASE_CATEGORIES } from '../data/menuData';
import { LABRIOUT_CATEGORY_CONFIGS } from '../data/labrioutMenuData';
import { useCart } from '../context/CartContext';
import { getCategoryLabel } from '../utils/menuTranslations';
import phoneImage from '../assets/phone.png';
import appBgImage from '../assets/app-bg.png';

interface CategoryShowcaseProps {
  selectedCategory: CategoryId;
  selectedCardKey?: string;
  onSelectCard: (category: CategoryId, cardKey: string) => void;
  onViewAllMenu: () => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  selectedCategory,
  selectedCardKey = 'friggitoria',
  onSelectCard,
  onViewAllMenu,
}) => {
  const { language, activeTenantId } = useCart();
  const showcaseCategories =
    activeTenantId === 'labriout' ? LABRIOUT_CATEGORY_CONFIGS.slice(0, 4) : SHOWCASE_CATEGORIES;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 640) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    startXRef.current = e.pageX;
    scrollLeftRef.current = container.scrollLeft;
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || (typeof window !== 'undefined' && window.innerWidth >= 640)) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const dx = e.pageX - startXRef.current;
    if (Math.abs(dx) > 6) {
      hasDraggedRef.current = true;
    }
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 10) {
      velocityRef.current = (e.pageX - lastXRef.current) / dt;
      lastXRef.current = e.pageX;
      lastTimeRef.current = now;
    }
    container.scrollLeft = scrollLeftRef.current - dx;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDraggingRef.current || (typeof window !== 'undefined' && window.innerWidth >= 640)) return;
    isDraggingRef.current = false;
    const container = scrollContainerRef.current;
    if (!container) return;
    if (hasDraggedRef.current) {
      // 208px card width + 12px gap = 220px step per card
      const step = 220;
      const momentumOffset = velocityRef.current * 180;
      const projected = container.scrollLeft - momentumOffset;
      const nearestCardIndex = Math.round(projected / step);
      const clampedIndex = Math.max(0, Math.min(showcaseCategories.length - 1, nearestCardIndex));
      container.scrollTo({
        left: clampedIndex * step,
        behavior: 'smooth',
      });
    }
  };

  const handleCardClick = (catId: CategoryId, cardKey: string, index: number) => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    onSelectCard(catId, cardKey);
    if (typeof window !== 'undefined' && window.innerWidth < 640 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: index * 220,
        behavior: 'smooth',
      });
    }
  };

  const webAppInfo: Record<string, {
    titleLine1: string;
    titleLine2: string;
    titleLine3: string;
    subtitle: string;
    badge1Sub: string;
    badge1Title: string;
    badge2Sub: string;
    badge2Title: string;
    cta: string;
  }> = {
    it: {
      titleLine1: "LA NOSTRA",
      titleLine2: "WEB APP",
      titleLine3: "COMODA & VELOCE",
      subtitle: "Nessun download né installazione! Apri il sito dallo smartphone o PC e ordina in pochi secondi.",
      badge1Sub: "TUTTI I DISPOSITIVI",
      badge1Title: "iOS & Android",
      badge2Sub: "SENZA SCARICARE",
      badge2Title: "Nel tuo Browser",
      cta: "Ordina via Web App",
    },
    ru: {
      titleLine1: "УДОБНАЯ",
      titleLine2: "ВЕБ-ВЕРСИЯ",
      titleLine3: "ПРЯМО В БРАУЗЕРЕ",
      subtitle: "Без скачивания и установки! Заказывайте прямо с любого смартфона или компьютера в один клик.",
      badge1Sub: "ДЛЯ ВСЕХ УСТРОЙСТВ",
      badge1Title: "iOS и Android",
      badge2Sub: "БЕЗ ПАМЯТИ И УСТАНОВКИ",
      badge2Title: "Прямо на сайте",
      cta: "Заказать через веб-версию",
    },
    en: {
      titleLine1: "FAST & EASY",
      titleLine2: "WEB APP",
      titleLine3: "IN YOUR BROWSER",
      subtitle: "No app store download needed! Order directly from your mobile browser on any device in seconds.",
      badge1Sub: "ALL DEVICES",
      badge1Title: "iOS & Android",
      badge2Sub: "NO APP INSTALL",
      badge2Title: "In your Browser",
      cta: "Order via Web App",
    },
    de: {
      titleLine1: "PRAKTISCHE",
      titleLine2: "WEB-APP",
      titleLine3: "DIREKT IM BROWSER",
      subtitle: "Kein Download erforderlich! Bestellen Sie direkt im Browser auf jedem Smartphone oder PC.",
      badge1Sub: "ALLE GERÄTE",
      badge1Title: "iOS & Android",
      badge2Sub: "OHNE INSTALLATION",
      badge2Title: "Direkt im Browser",
      cta: "Über Web-App bestellen",
    },
    fr: {
      titleLine1: "NOTRE",
      titleLine2: "WEB APP",
      titleLine3: "PRATIQUE & RAPIDE",
      subtitle: "Aucun téléchargement requis ! Commandez directement depuis votre navigateur sur smartphone ou PC.",
      badge1Sub: "TOUS APPAREILS",
      badge1Title: "iOS & Android",
      badge2Sub: "SANS INSTALLATION",
      badge2Title: "Dans le navigateur",
      cta: "Commander via Web App",
    },
  };
  const webContent = webAppInfo[language] || webAppInfo.it;

  return (
    <div className="relative mb-2 sm:mb-10 w-full overflow-hidden sm:overflow-visible">
      {/* Side-by-side layout: Left (I NOSTRI PRODOTTI + 4 Cards, 816px) + Right (Web App Banner 360px) with 19px gap (reduced by 3px) */}
      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-[8px] sm:gap-[19px] w-full">
        {/* LEFT SECTION: I NOSTRI PRODOTTI Header + 4 Cards Grid (Exactly 816px: 4 * 186px + 3 * 24px) */}
        <div className="w-full lg:w-[816px] lg:max-w-[816px] shrink-0 flex flex-col justify-between items-start">
          <div className="w-full flex flex-col justify-between h-full">
            {/* Section Header: Hidden on mobile, visible on desktop */}
            <div className="hidden sm:flex items-center justify-between gap-3 sm:mb-3.5 w-full">
              <div className="relative">
                <h2
                  style={{
                    fontFamily: 'YSText, sans-serif',
                    fontWeight: 700,
                    color: '#21201f',
                    fontSize: '32px',
                    lineHeight: '36px',
                  }}
                  className="tracking-tight"
                >
                  {language === 'ru'
                    ? 'НАШИ БЛЮДА'
                    : language === 'en'
                    ? 'OUR SPECIALTIES'
                    : language === 'de'
                    ? 'UNSERE PRODUKTE'
                    : language === 'fr'
                    ? 'NOS PRODUITS'
                    : 'I NOSTRI PRODOTTI'}
                </h2>
                {/* Orange brush underline */}
                <div className="w-36 sm:w-48 lg:w-52 h-1.5 sm:h-2 bg-[#ff5500] rounded-full mt-1.5 -rotate-1 origin-left shadow-sm shadow-[#ff5500]/40" />
              </div>

              {/* "Vedi tutto il menu ->" button */}
              <button
                onClick={onViewAllMenu}
                className="text-xs sm:text-sm font-bold text-neutral-600 hover:text-[#ff5500] flex items-center gap-1.5 transition-colors group cursor-pointer select-none"
              >
                <span>
                  {language === 'ru'
                    ? 'Смотреть всё меню'
                    : language === 'en'
                    ? 'View full menu'
                    : language === 'de'
                    ? 'Gesamtes Menü ansehen'
                    : language === 'fr'
                    ? 'Voir tout le menu'
                    : 'Vedi tutto il menu'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff5500] transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Category Cards: Horizontal scroll in one single row on mobile with Samokat-style smooth momentum & magnetic docking, Grid on desktop */}
            <div
              ref={scrollContainerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              style={{
                scrollPaddingLeft: '12px',
                scrollPaddingRight: '12px',
                WebkitOverflowScrolling: 'touch',
                overscrollBehaviorX: 'contain',
              }}
              className="flex sm:grid overflow-x-auto sm:overflow-visible no-scrollbar sm:grid-cols-[repeat(4,186px)] gap-3 sm:gap-[24px] w-[calc(100%+1.5rem)] sm:w-full pb-1 sm:pb-2 pt-0.5 -mx-3 px-3 sm:mx-0 sm:px-0 select-none scroll-smooth snap-x snap-mandatory sm:snap-none scroll-pl-3 scroll-pr-3 after:content-[''] after:w-3 after:shrink-0 sm:after:hidden cursor-grab active:cursor-grabbing sm:cursor-default"
            >
            {showcaseCategories.map((cat, idx) => {
              const isSelected = selectedCardKey === cat.key || selectedCategory === cat.id;

              return (
                <button
                  key={cat.key}
                  onClick={() => handleCardClick(cat.id, cat.key, idx)}
                  style={{
                    boxSizing: 'border-box',
                    border: isSelected ? '1px solid #ff5500' : '1px solid rgba(0, 0, 0, 0.08)',
                    padding: 0,
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'normal',
                  }}
                  className="group relative w-[208px] min-w-[208px] max-w-[208px] h-[276px] shrink-0 snap-start sm:w-[186px] sm:min-w-[186px] sm:max-w-[186px] sm:h-[240px] sm:min-h-[240px] sm:max-h-[240px] rounded-[18px] overflow-hidden p-0 transition-all duration-200 active:scale-[0.98] sm:active:scale-100 cursor-pointer text-left select-none shadow-sm hover:shadow-md"
                >
                  {/* Category Image - Static without scale/zoom */}
                  <img
                    src={cat.image}
                    alt={cat.label}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const fallbacks: Record<string, string> = {
                        friggitoria: '/categories/friggitoria.jpg',
                        panini: '/categories/panini.webp',
                        panini_special: '/categories/panini-special.jpg',
                        girarrosto: '/categories/girarrosto.jpg',
                      };
                      const fallbackSrc = fallbacks[cat.id];
                      if (fallbackSrc && e.currentTarget.src !== window.location.origin + fallbackSrc) {
                        e.currentTarget.src = fallbackSrc;
                      }
                    }}
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    loading="lazy"
                  />

                  {/* Bottom Pill Badge: Name + Orange Arrow Button */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 bg-black/85 backdrop-blur-md border border-white/10 px-2 sm:px-2.5 py-1.5 rounded-full flex items-center justify-between gap-1 shadow-lg">
                    <span
                      style={{ fontFamily: 'YSText, sans-serif' }}
                      className="text-[11px] sm:text-xs font-bold text-white tracking-wider uppercase truncate"
                    >
                      {activeTenantId === 'labriout'
                        ? cat.label
                        : getCategoryLabel(cat.id, language, cat.label)}
                    </span>
                    <div className="w-5 h-5 rounded-full bg-[#ff5500] text-white flex items-center justify-center shrink-0 shadow-md transition-all duration-300">
                      <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5] transition-transform duration-300 ease-out group-hover:rotate-90" />
                    </div>
                  </div>
                </button>
              );
            })}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: App Promo Banner with Smartphone (Desktop only, hidden on mobile) */}
        <div className="hidden lg:flex w-full lg:w-[360px] shrink-0 relative mt-6 lg:mt-0 overflow-visible items-stretch">
          {/* Card Container with user background image (app-bg.png) */}
          <div
            className="relative w-full rounded-2xl sm:rounded-3xl overflow-visible metallic-border shadow-2xl p-4 sm:p-5 flex flex-col justify-between min-h-[220px]"
            style={{
              backgroundImage: `url(${appBgImage}), url(/app-bg.png), url(https://i.imgur.com/FdHmsaO.png)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark gradient overlay for text readability on the left */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-black/95 via-black/85 to-black/30 pointer-events-none" />

            {/* Left Content */}
            <div className="relative z-10 max-w-[62%] sm:max-w-[66%] lg:max-w-[63%] xl:max-w-[65%] flex flex-col justify-between h-full space-y-2 sm:space-y-2.5">
              {/* Title: LA NOSTRA WEB APP COMODA & VELOCE */}
              <div>
                <h3 className="font-brush text-base sm:text-lg lg:text-xl font-black text-white uppercase leading-[1.1] tracking-wide drop-shadow-md">
                  {webContent.titleLine1}<br />
                  {webContent.titleLine2}<br />
                  {webContent.titleLine3}
                </h3>
                {/* Orange brush underline */}
                <div className="w-28 sm:w-32 h-1.5 bg-[#ff5500] rounded-full mt-1 -rotate-1 origin-left shadow-sm shadow-[#ff5500]/40" />
              </div>

              {/* Subtitle with browser / globe icon */}
              <div className="flex items-start gap-1.5 sm:gap-2">
                <div className="shrink-0 text-[#ff5500] mt-0.5">
                  <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <p className="text-[10px] sm:text-xs text-neutral-200 font-medium leading-snug">
                  {webContent.subtitle}
                </p>
              </div>

              {/* Web App Badges / Buttons (Replaced App Store & Google Play buttons) */}
              <div className="space-y-2 pt-0.5">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  {/* Badge 1: iOS & Android */}
                  <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-black/85 text-white border border-neutral-700/80 shadow-md">
                    <Smartphone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff5500] shrink-0" />
                    <div className="flex flex-col text-left leading-none">
                      <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-neutral-400 font-semibold">
                        {webContent.badge1Sub}
                      </span>
                      <span className="text-[9px] sm:text-[11px] font-bold tracking-tight text-white mt-0.5">
                        {webContent.badge1Title}
                      </span>
                    </div>
                  </div>

                  {/* Badge 2: In Browser */}
                  <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl bg-black/85 text-white border border-neutral-700/80 shadow-md">
                    <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0 fill-amber-400" />
                    <div className="flex flex-col text-left leading-none">
                      <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-neutral-400 font-semibold">
                        {webContent.badge2Sub}
                      </span>
                      <span className="text-[9px] sm:text-[11px] font-bold tracking-tight text-white mt-0.5">
                        {webContent.badge2Title}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct CTA button to order via web app */}
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('menu-catalog-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff3300] hover:from-[#ff6611] hover:to-[#ff4400] text-white text-[11px] sm:text-xs font-black shadow-md shadow-[#ff5500]/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  <span>{webContent.cta}</span>
                  <ArrowRight className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Right: 3D Smartphone Image - scaled down and barely protruding beyond the banner area */}
            <div className="absolute right-0 sm:right-1 md:right-2 lg:right-1 xl:right-2 -top-2 sm:-top-2.5 md:-top-3 lg:-top-3 xl:-top-3.5 bottom-0 z-30 pointer-events-none flex items-end">
              <img
                src={phoneImage}
                onError={(e) => {
                  e.currentTarget.src = 'https://i.imgur.com/r0eRxW8.png';
                }}
                alt="Panzarotto Web App Smartphone"
                className="w-28 sm:w-34 md:w-38 lg:w-40 xl:w-44 h-auto max-h-[108%] object-contain select-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.75)]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

