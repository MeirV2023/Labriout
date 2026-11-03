import React from 'react';
import { MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const StoreAndAppBanner: React.FC = () => {
  const { language, setCurrentView } = useCart();

  const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent('LABRIOUT, 64 av. Simone Veil, Bonneuil-sur-Marne')}`;

  const handleOpenStore = () => {
    // Navigate cleanly to the Contact & Store page without opening any pop-up modal
    setCurrentView('contatti', true, true);
  };

  const handleDownloadApp = () => {
    // Smoothly scroll to menu catalog so user can order immediately in the web app
    const menuEl = document.getElementById('menu-catalog-section');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentView('menu', true, true);
    }
  };

  // Translations
  const isRu = language === 'ru';
  const isIt = language === 'it';
  const isFr = language === 'fr';
  const isDe = language === 'de';

  const headingText = isRu ? 'Приходи к нам!' : isIt ? 'Vieni a trovarci!' : 'Come visit us!';
  const storeSubtitle = '🥩 Street food & spécialités maison • ✡️ 100% Casher';
  const storeAddress = '64 av. Simone Veil, Bonneuil-sur-Marne';
  const otherButtonText = isRu ? 'Подробнее' : isIt ? 'Dettagli' : 'Details';
  const downloadButtonText = isRu
    ? 'В веб-приложение'
    : isIt
    ? 'Ordina via Web App'
    : isFr
    ? 'Via Web App'
    : isDe
    ? 'Zur Web-App'
    : 'Order via Web App';

  return (
    <section
      id="store-and-app-banner"
      className="bg-white pt-2 md:pt-3 pb-0 md:pb-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden md:overflow-visible z-10 rounded-t-[32px] md:rounded-none max-w-full"
    >
      <div className="w-full max-w-[1170px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-center gap-4 lg:gap-[30px] w-full">
          {/* 
            BLOCK 1 (LEFT): Exactly 460x72px on desktop
            With "Приходи к нам!" header on top
          */}
          <div className="w-full lg:w-[460px] shrink-0">
            {/* Header: Icon + "Приходи к нам!" (Desktop only) */}
            <div className="hidden md:flex items-center gap-2.5 mb-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1c1f26] text-[#ff5500] flex items-center justify-center shadow-xs shrink-0">
                <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
              </div>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-neutral-900 tracking-tight leading-none">
                {headingText}
              </h3>
            </div>

            {/* Mobile Address Line: Immediately redirects into Google Maps app on mobile phone */}
            <div className="md:hidden flex items-center justify-center h-[30px]">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-full bg-transparent hover:bg-transparent active:bg-transparent active:opacity-70 transition-opacity cursor-pointer select-none group border-0 outline-none shadow-none text-inherit no-underline"
                style={{ WebkitTapHighlightColor: 'transparent' }}
                title={storeAddress}
              >
                <img
                  width="16"
                  height="16"
                  src="https://img.icons8.com/ios-glyphs/30/marker--v1.png"
                  alt="marker--v1"
                  className="w-4 h-4 shrink-0 object-contain"
                />
                <span className="font-sans font-normal text-[14px] text-neutral-800 whitespace-nowrap">
                  {storeAddress}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#0B0907] stroke-[1.8] shrink-0 group-hover:translate-x-0.5 transition-all" style={{ color: '#0B0907' }} />
              </a>
            </div>

            {/* Block 1 Card: 460 x 72px (Desktop only) */}
            <div
              className="hidden md:flex w-full lg:w-[460px] h-[72px] bg-[#f4f5f7] border border-neutral-200/80 rounded-2xl px-4 sm:px-5 items-center justify-between shadow-xs hover:border-neutral-300 transition-colors"
            >
              <div className="min-w-0 pr-2">
                <p className="text-[11px] sm:text-xs text-neutral-500 font-medium leading-tight truncate">
                  {storeSubtitle}
                </p>
                <p className="text-xs sm:text-[13px] font-bold text-neutral-900 leading-snug truncate mt-0.5">
                  {storeAddress}
                </p>
              </div>

              {/* "Другое" / "Dettagli" Button */}
              <button
                type="button"
                onClick={handleOpenStore}
                className="shrink-0 bg-white hover:bg-neutral-50 active:scale-95 text-neutral-800 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl border border-neutral-200 shadow-xs cursor-pointer transition-all"
              >
                {otherButtonText}
              </button>
            </div>
          </div>

          {/* 
            BLOCK 2 (RIGHT): Exactly 680x72px on desktop
            App promo with illustration, text and orange button (Desktop only)
          */}
          <div className="hidden md:block w-full lg:w-[680px] shrink-0">
            {/* Block 2 Card: 680 x 72px */}
            <div
              className="w-full lg:w-[680px] h-[72px] bg-gradient-to-r from-[#e7eff5] via-[#ebf3f8] to-[#dbeef7] border border-sky-100/90 rounded-2xl px-3 sm:px-4 flex items-center justify-between gap-2.5 sm:gap-3.5 shadow-xs overflow-hidden"
            >
              {/* Left: Vector Illustration (Table, Chairs, Burger, Fries, Drink) matching Screenshot 1 */}
              <div className="shrink-0 flex items-center justify-center">
                <svg
                  viewBox="0 0 90 60"
                  className="w-[66px] sm:w-[74px] h-[48px] sm:h-[54px] object-contain select-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  {/* Table stand & base */}
                  <path d="M45 35 V52" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                  <ellipse cx="45" cy="52" rx="14" ry="2.5" fill="#cbd5e1" />

                  {/* Table top */}
                  <ellipse cx="45" cy="35" rx="28" ry="5.5" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />

                  {/* Left Chair */}
                  <path d="M18 28 C18 22 22 20 25 20 C28 20 28 24 28 28" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="17" y="28" width="12" height="4" rx="2" fill="#ea580c" />
                  <path d="M19 32 L16 52 M27 32 L29 52" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                  {/* Right Chair */}
                  <path d="M62 28 C62 22 62 20 65 20 C68 20 72 22 72 28" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                  <rect x="61" y="28" width="12" height="4" rx="2" fill="#ea580c" />
                  <path d="M63 32 L61 52 M71 32 L74 52" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                  {/* Serving Tray */}
                  <rect x="30" y="30" width="30" height="3" rx="1.5" fill="#334155" />

                  {/* Drink cup with red band & straw */}
                  <path d="M33 30 L35 18 H41 L43 30 Z" fill="#ffffff" stroke="#ef4444" strokeWidth="1" />
                  <rect x="34" y="22" width="8" height="4" fill="#ef4444" />
                  <line x1="38" y1="18" x2="35" y2="10" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />

                  {/* French Fries box */}
                  <path d="M44 30 L46 20 H52 L54 30 Z" fill="#ef4444" />
                  <line x1="47" y1="20" x2="46" y2="13" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
                  <line x1="49" y1="20" x2="49" y2="11" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
                  <line x1="51" y1="20" x2="52" y2="13" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />

                  {/* Burger */}
                  <path d="M52 29 H58 C58.5 29 59 29.5 58.5 30 H51.5 C51 29.5 51.5 29 52 29 Z" fill="#d97706" />
                  <rect x="52" y="27.5" width="6.5" height="1.5" rx="0.5" fill="#78350f" />
                  <rect x="51.5" y="26.5" width="7.5" height="1" rx="0.5" fill="#22c55e" />
                  <path d="M51.5 26 C51.5 23.5 59 23.5 59 26 Z" fill="#f59e0b" />
                </svg>
              </div>

              {/* Center: Promo slogan matching Screenshot 1 */}
              <div className="flex-1 min-w-0 pr-1">
                {isRu ? (
                  <p className="text-[11px] sm:text-xs md:text-[13px] text-neutral-800 leading-snug">
                    <strong className="font-extrabold text-neutral-900">Не жди в очереди —</strong>{' '}
                    <span>заказывай через веб-приложение. Забирай заказ, где удобно!</span>
                  </p>
                ) : isIt ? (
                  <p className="text-[11px] sm:text-xs md:text-[13px] text-neutral-800 leading-snug">
                    <strong className="font-extrabold text-neutral-900">Non fare la fila —</strong>{' '}
                    <span>ordina tramite la nostra web app. Ritira il tuo ordine dove vuoi!</span>
                  </p>
                ) : (
                  <p className="text-[11px] sm:text-xs md:text-[13px] text-neutral-800 leading-snug">
                    <strong className="font-extrabold text-neutral-900">Skip the line —</strong>{' '}
                    <span>order via our web app. Pick up wherever is convenient!</span>
                  </p>
                )}
              </div>

              {/* Right: Orange "Скачать приложение" Button */}
              <button
                type="button"
                onClick={handleDownloadApp}
                className="shrink-0 bg-[#ff5500] hover:bg-[#e64d00] active:scale-95 text-white font-bold text-xs sm:text-[13px] px-3.5 sm:px-5 py-2.5 rounded-xl whitespace-nowrap shadow-sm shadow-[#ff5500]/30 transition-all cursor-pointer"
              >
                {downloadButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
