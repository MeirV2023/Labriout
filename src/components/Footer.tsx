import React, { useState } from 'react';
import { MapPin, Instagram, ArrowRight } from 'lucide-react';
import { STORE_DETAILS, CATEGORY_CONFIGS } from '../data/menuData';
import { useCart } from '../context/CartContext';
import { CategoryId } from '../types';
import logoImg from '../assets/panzarotto-logo.png';

export const Footer: React.FC = () => {
  const {
    setIsStoreInfoOpen,
    setCurrentView,
    currentView,
    navigateToCategory,
    setSelectedCategory,
    setSelectedCardKey,
    setCategorySubFilters,
    language,
    t,
  } = useCart();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const resolveCategoryAndSubfilter = (key: string): { categoryId: CategoryId; subFilter?: string } => {
    if (key === 'panzerotti') return { categoryId: 'friggitoria', subFilter: 'panzarotto' };
    if (key === 'sfizi') return { categoryId: 'friggitoria', subFilter: 'sfizi_fritti' };
    if (key === 'arancini') return { categoryId: 'friggitoria', subFilter: 'arancini' };
    if (key === 'patatine') return { categoryId: 'patate', subFilter: 'classiche' };
    return { categoryId: key as CategoryId };
  };

  const handleCategoryClick = (catId: CategoryId | string) => {
    const { categoryId, subFilter } = resolveCategoryAndSubfilter(catId);

    // If currently on home or menu and element is in DOM, start smooth scroll immediately
    if (currentView === 'home' || currentView === 'menu') {
      const el = document.getElementById(`cat-${categoryId}`);
      if (el) {
        const header = document.querySelector('header');
        const navHeight = header ? header.getBoundingClientRect().height : 80;
        const offset = currentView === 'home' ? navHeight + 54 : navHeight + 20;
        const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        const targetTop = el.getBoundingClientRect().top + currentScroll - offset;
        window.scrollTo({
          top: Math.max(0, Math.round(targetTop)),
          behavior: 'smooth',
        });
        setSelectedCategory(categoryId);
        setSelectedCardKey(categoryId);
        if (subFilter) {
          setCategorySubFilters((prev) => ({ ...prev, [categoryId]: subFilter }));
        }
        return;
      }
    }

    // Otherwise navigate to home and scroll to target category
    navigateToCategory(categoryId, subFilter, currentView === 'menu' ? 'menu' : 'home');
  };

  return (
    <footer
      id="main-footer"
      className="bg-[#090a0d] border-t border-[#1a1c24] text-neutral-400 text-xs overflow-hidden"
    >
      {/* Top section bounded by bottom divider line, with illustration fitting right screen edge & top-to-bottom line */}
      <div className="relative border-b border-white/10">
        {/* Background artwork: reaches right edge of screen and top to bottom line */}
        <div
          className="absolute top-0 bottom-0 right-0 w-full sm:w-[520px] md:w-[600px] lg:w-[680px] xl:w-[760px] 2xl:w-[820px] pointer-events-none select-none z-0"
          style={{
            backgroundImage: 'url(https://i.imgur.com/tdcSw9D.jpeg), url(/footer-bg.png)',
            backgroundSize: 'auto 100%',
            backgroundPosition: 'right bottom',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Soft fade-out on the left edge so it blends into the solid dark footer */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090a0d] via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-start">
            {/* Col 1: Brand & Address */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-4">
              <div className="flex items-center">
                <img
                  src="/logo-labriur-dark.png"
                  onError={(e) => {
                    e.currentTarget.src = '/logo-labriur.png';
                  }}
                  alt="LABRIOUT"
                  className="h-16 sm:h-20 w-auto object-contain select-none"
                  loading="lazy"
                />
              </div>

              <div className="space-y-1.5 pt-1 text-xs">
                <button
                  onClick={() => setIsStoreInfoOpen(true)}
                  className="flex items-start gap-2.5 text-left text-neutral-300 hover:text-white transition cursor-pointer group"
                >
                  <MapPin className="w-5 h-5 text-[#ff5500] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div className="leading-snug">
                    <p className="font-semibold text-white">64 av. Simone Veil</p>
                    <p className="text-neutral-400">Bonneuil-sur-Marne</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Col 2: Menù */}
            <div className="lg:col-span-3 xl:col-span-3 space-y-3">
              <button
                type="button"
                onClick={() => {
                  if (currentView === 'home') {
                    const el = document.getElementById('menu-categories-nav') || document.getElementById('cat-panini');
                    if (el) {
                      const header = document.querySelector('header');
                      const navHeight = header ? header.getBoundingClientRect().height : 80;
                      const targetTop = el.getBoundingClientRect().top + window.pageYOffset - (navHeight + 20);
                      window.scrollTo({ top: Math.max(0, Math.round(targetTop)), behavior: 'smooth' });
                    }
                  } else {
                    navigateToCategory('tutti', undefined, 'home');
                  }
                }}
                className="font-extrabold text-white text-sm uppercase tracking-wider hover:text-[#ff5500] transition cursor-pointer text-left block"
              >
                {t('navMenu') || 'Menù'}
              </button>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-2 text-neutral-300">
                {CATEGORY_CONFIGS.map((cat) => {
                  const label = t(cat.id) || cat.label;
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(cat.id)}
                        className="hover:text-[#ff5500] hover:translate-x-1 transition-all duration-150 cursor-pointer text-left text-xs sm:text-[13px] text-neutral-300 block"
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Col 3: Informazioni */}
            <div className="lg:col-span-2 xl:col-span-2 space-y-3">
              <h4 className="font-extrabold text-white text-sm uppercase tracking-wider">
                {language === 'ru' ? 'Информация' : language === 'en' ? 'Information' : 'Informazioni'}
              </h4>
              <ul className="space-y-2 text-neutral-300">
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('chi-siamo');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#ff5500] hover:translate-x-0.5 transition-all duration-150 cursor-pointer text-left text-xs sm:text-[13px]"
                  >
                    {t('navAbout') || 'Chi siamo'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setCurrentView('contatti');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-[#ff5500] hover:translate-x-0.5 transition-all duration-150 cursor-pointer text-left text-xs sm:text-[13px]"
                  >
                    {t('navContact') || 'Contatti'}
                  </button>
                </li>
                <li>
                  <span className="text-neutral-400 hover:text-white transition cursor-pointer text-xs sm:text-[13px]">
                    Privacy Policy
                  </span>
                </li>
                <li>
                  <span className="text-neutral-400 hover:text-white transition cursor-pointer text-xs sm:text-[13px]">
                    Termini e Condizioni
                  </span>
                </li>
              </ul>
            </div>

            {/* Col 4: Socials & Newsletter (Screen 2) */}
            <div className="lg:col-span-4 xl:col-span-4 space-y-3.5 max-w-sm">
              {/* Socials */}
              <div className="flex items-center gap-3">
                <a
                  href={STORE_DETAILS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-neutral-900/80 border border-neutral-700/60 hover:bg-[#ff5500] text-white flex items-center justify-center transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4.5 h-4.5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-neutral-900/80 border border-neutral-700/60 hover:bg-[#ff5500] text-white flex items-center justify-center transition"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-neutral-900/80 border border-neutral-700/60 hover:bg-[#ff5500] text-white flex items-center justify-center transition"
                  aria-label="TikTok"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.47a8.28 8.28 0 0 0 4.84 1.54V6.69h-.92z" />
                  </svg>
                </a>
              </div>

              {/* Newsletter input */}
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-white leading-tight">
                  Iscriviti alla nostra newsletter
                </p>
                <p className="text-xs text-neutral-300">
                  Per offerte e novità!
                </p>
                {subscribed ? (
                  <p className="text-xs text-emerald-400 font-semibold py-2">
                    ✓ Grazie per esserti iscritto! Ti invieremo coupon speciali.
                  </p>
                ) : (
                  <form onSubmit={handleSubscribe} className="pt-1">
                    <div className="relative flex items-center w-full max-w-[280px] sm:max-w-xs bg-black/75 backdrop-blur-md border border-neutral-600 rounded-xl overflow-hidden shadow-lg focus-within:border-[#ff5500] transition">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="La tua email"
                        className="bg-transparent px-3.5 py-2 text-xs text-white placeholder-neutral-400 flex-1 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-[#ff5500] hover:bg-[#ff6a1a] text-white px-3.5 py-2 flex items-center justify-center transition cursor-pointer shrink-0"
                        aria-label="Iscriviti"
                      >
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright line */}
      <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 sm:pb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
        <p>© 2025 LABRIOUT. Tous droits réservés.</p>
        <p className="flex items-center gap-1.5">
          <span>Street food &amp; spécialités maison • 100% Casher • Bonneuil-sur-Marne</span>
          <span
            className="inline-flex items-center justify-center overflow-hidden rounded-[2px] border border-white/25 shadow-sm shrink-0"
            title="France"
            aria-label="France"
          >
            <svg
              className="w-4.5 h-3 block"
              viewBox="0 0 3 2"
              preserveAspectRatio="none"
            >
              <rect width="1" height="2" x="0" fill="#002395" />
              <rect width="1" height="2" x="1" fill="#ffffff" />
              <rect width="1" height="2" x="2" fill="#ed2939" />
            </svg>
          </span>
        </p>
      </div>
    </footer>
  );
};
