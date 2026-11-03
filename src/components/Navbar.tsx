import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, MapPin, Globe, ChevronDown, Clock, Check, X, Home, Utensils, Info, Phone, Instagram, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Language } from '../types';
import { PrenotaTimeDropdown } from './PrenotaTimeDropdown';
import { STORE_SCHEDULE, STORE_DETAILS } from '../data/menuData';
import { LABRIOUT_STORE_DETAILS } from '../data/labrioutMenuData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    itemsCount,
    currentView,
    setCurrentView,
    setIsCartDrawerOpen,
    isCartBouncing,
    cartBounceKey,
    language,
    setLanguage,
    fulfillmentType,
    selectedTimeSlot,
    selectedSlot,
    selectedDayIndex,
    productDetailSource,
    activeTenantId,
    t
  } = useCart();
  const isLabriout = activeTenantId === 'labriout';
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isPrenotaOpen, setIsPrenotaOpen] = useState(false);
  const prenotaTriggerRef = useRef<HTMLButtonElement>(null);
  const [isMobilePrenotaOpen, setIsMobilePrenotaOpen] = useState(false);
  const mobilePrenotaTriggerRef = useRef<HTMLButtonElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileLangDropdownOpen, setMobileLangDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Sync activeTab prop with currentView
  useEffect(() => {
    if (['home', 'menu', 'chi-siamo', 'contatti'].includes(currentView)) {
      setActiveTab(currentView);
    }
  }, [currentView, setActiveTab]);

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    const addressToCopy = '64 av. Simone Veil, Bonneuil-sur-Marne';
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(addressToCopy).catch(() => {
        fallbackCopyText(addressToCopy);
      });
    } else {
      fallbackCopyText(addressToCopy);
    }
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
  };

  const hasCustomTimeSelected = Boolean(
    selectedSlot && selectedTimeSlot && selectedTimeSlot !== 'subito'
  );

  const getTimeDisplay = () => {
    if (hasCustomTimeSelected) {
      if (selectedDayIndex === 0) {
        if (language === 'ru') return `Сегодня ${selectedSlot}`;
        if (language === 'it') return `Oggi ${selectedSlot}`;
        if (language === 'de') return `Heute ${selectedSlot}`;
        if (language === 'fr') return `Aujourd'hui ${selectedSlot}`;
        return `Today ${selectedSlot}`;
      }

      if (selectedDayIndex === 1) {
        if (language === 'ru') return `Завтра ${selectedSlot}`;
        if (language === 'it') return `Domani ${selectedSlot}`;
        if (language === 'de') return `Morgen ${selectedSlot}`;
        if (language === 'fr') return `Demain ${selectedSlot}`;
        return `Tomorrow ${selectedSlot}`;
      }

      if (selectedDayIndex >= 2) {
        const d = new Date();
        d.setDate(d.getDate() + selectedDayIndex);
        const dayOfWeek = d.getDay();
        const sched = STORE_SCHEDULE[dayOfWeek];
        let dayName = sched?.name || '';
        if (language === 'ru') dayName = sched?.nameRu || dayName;
        else if (language === 'en') dayName = sched?.nameEn || dayName;
        else if (language === 'de') dayName = sched?.nameDe || dayName;
        else if (language === 'fr') dayName = sched?.nameFr || dayName;
        return `${dayName} ${selectedSlot}`;
      }

      return selectedSlot;
    }

    if (selectedTimeSlot && selectedTimeSlot !== 'subito') {
      const parts = selectedTimeSlot.split('•');
      if (parts.length > 1) {
        return parts[1].trim();
      }
      return selectedTimeSlot;
    }

    if (language === 'ru') return 'Сейчас';
    if (language === 'it') return 'Adesso';
    if (language === 'de') return 'Jetzt';
    if (language === 'fr') return 'Maintenant';
    return 'Now';
  };

  const getOperatingHoursText = () => {
    if (language === 'ru') return '⏰ 12h-15h 18h-22h15';
    if (language === 'it') return '⏰ 12h-15h 18h-22h15';
    if (language === 'de') return '⏰ 12h-15h 18h-22h15';
    if (language === 'fr') return '⏰ 12h-15h 18h-22h15';
    return '⏰ 12h-15h 18h-22h15';
  };

  const getMobileHeaderTimeText = () => {
    if (!hasCustomTimeSelected) {
      return getOperatingHoursText();
    }

    const isPickup = fulfillmentType === 'asporto';

    if (selectedDayIndex === 0) {
      if (language === 'ru') {
        return `${isPickup ? 'Самовывоз' : 'Доставка'} сегодня к ${selectedSlot}`;
      }
      if (language === 'it') {
        return `${isPickup ? 'Ritiro' : 'Consegna'} oggi alle ${selectedSlot}`;
      }
      if (language === 'de') {
        return `${isPickup ? 'Abholung' : 'Lieferung'} heute um ${selectedSlot}`;
      }
      if (language === 'fr') {
        return `${isPickup ? 'Retrait' : 'Livraison'} aujourd'hui à ${selectedSlot}`;
      }
      return `${isPickup ? 'Pickup' : 'Delivery'} today at ${selectedSlot}`;
    }

    if (selectedDayIndex === 1) {
      if (language === 'ru') {
        return `${isPickup ? 'Самовывоз' : 'Доставка'} завтра к ${selectedSlot}`;
      }
      if (language === 'it') {
        return `${isPickup ? 'Ritiro' : 'Consegna'} domani alle ${selectedSlot}`;
      }
      if (language === 'de') {
        return `${isPickup ? 'Abholung' : 'Lieferung'} morgen um ${selectedSlot}`;
      }
      if (language === 'fr') {
        return `${isPickup ? 'Retrait' : 'Livraison'} demain à ${selectedSlot}`;
      }
      return `${isPickup ? 'Pickup' : 'Delivery'} tomorrow at ${selectedSlot}`;
    }

    const d = new Date();
    d.setDate(d.getDate() + selectedDayIndex);
    const dayOfWeek = d.getDay();
    const sched = STORE_SCHEDULE[dayOfWeek];
    let dayName = sched?.name || '';
    if (language === 'ru') dayName = sched?.nameRu || dayName;
    else if (language === 'en') dayName = sched?.nameEn || dayName;
    else if (language === 'de') dayName = sched?.nameDe || dayName;
    else if (language === 'fr') dayName = sched?.nameFr || dayName;
    const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    if (language === 'ru') {
      return `${isPickup ? 'Самовывоз' : 'Доставка'} ${dayName} (${dateStr}) к ${selectedSlot}`;
    }
    if (language === 'it') {
      return `${isPickup ? 'Ritiro' : 'Consegna'} ${dayName} (${dateStr}) alle ${selectedSlot}`;
    }
    if (language === 'de') {
      return `${isPickup ? 'Abholung' : 'Lieferung'} ${dayName} (${dateStr}) um ${selectedSlot}`;
    }
    if (language === 'fr') {
      return `${isPickup ? 'Retrait' : 'Livraison'} ${dayName} (${dateStr}) à ${selectedSlot}`;
    }
    return `${isPickup ? 'Pickup' : 'Delivery'} ${dayName} (${dateStr}) at ${selectedSlot}`;
  };

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
      }
    };
    updateNavbarHeight();
    window.addEventListener('resize', updateNavbarHeight);
    return () => window.removeEventListener('resize', updateNavbarHeight);
  }, [isScrolled]);

  const navItems = [
    { id: 'home', label: t('navHome') || 'Home' },
    { id: 'menu', label: t('navMenu') || 'Menu' },
    { id: 'chi-siamo', label: t('navAbout') || 'Chi siamo' },
    { id: 'contatti', label: t('navContact') || 'Contatti' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);

    if (id === 'carrello') {
      setIsCartDrawerOpen(true);
      return;
    }

    if (id === 'chi-siamo') {
      setCurrentView('chi-siamo', true, true);
      return;
    }

    if (id === 'contatti') {
      setCurrentView('contatti', true, true);
      return;
    }

    if (id === 'home') {
      if (currentView !== 'home') {
        setCurrentView('home', true, true);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (id === 'menu') {
      if (currentView !== 'menu') {
        setCurrentView('menu', true, true);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 bg-white md:bg-white/98 backdrop-blur-md border-b transition-all duration-300 relative ${
        isScrolled
          ? 'border-neutral-200/80 shadow-[0_2px_8px_-1px_rgba(0,0,0,0.04)]'
          : 'border-neutral-100 shadow-none'
      }`}
    >
      {/* Mobile Header: Operating hours / Selected time bar on white background, strictly 40px height */}
      <div className="md:hidden w-full h-[40px] px-3 flex items-center justify-center bg-white text-neutral-900 relative">
        {/* Left: Mobile Menu Hamburger Button (Screen 1 & 2) */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#21201f] hover:text-[#ff5500] active:scale-95 transition-colors cursor-pointer select-none rounded-lg z-10"
          aria-label="Apri menu di navigazione"
          title="Menu"
        >
          {/* 3 crisp horizontal bars matching Screenshot 2 */}
          <div className="flex flex-col justify-between w-[18px] h-[13px] py-[0.5px]">
            <span className="w-full h-[2px] bg-current rounded-full" />
            <span className="w-full h-[2px] bg-current rounded-full" />
            <span className="w-full h-[2px] bg-current rounded-full" />
          </div>
        </button>

        <div className="relative flex items-center h-full">
          <button
            ref={mobilePrenotaTriggerRef}
            type="button"
            onClick={() => setIsMobilePrenotaOpen(!isMobilePrenotaOpen)}
            className="flex items-center justify-center gap-2 py-0 transition cursor-pointer select-none group"
            title="Scegli orario di prenotazione"
          >
            <span className="text-sm select-none leading-none">
              {hasCustomTimeSelected ? '🕒' : '🌙'}
            </span>
            <span className="font-heading font-bold text-xs sm:text-sm text-[#21201f] group-hover:text-[#ff5500] transition-colors whitespace-nowrap leading-none">
              {getMobileHeaderTimeText()}
            </span>
          </button>

          <PrenotaTimeDropdown
            isOpen={isMobilePrenotaOpen}
            onClose={() => setIsMobilePrenotaOpen(false)}
            triggerRef={mobilePrenotaTriggerRef}
            align="left"
          />
        </div>
      </div>

      {/* Desktop Single Level Header: Logo on the left, Menu items on the same level, Actions on the right */}
      <div className="hidden md:block w-full md:px-8 lg:px-12 py-3 sm:py-3.5">
        <div className="w-full max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo + Menu Items on the same row */}
          <div className="flex items-center gap-6 sm:gap-8 lg:gap-10 shrink-0">
            {/* Brand Logo on the left */}
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center cursor-pointer select-none group shrink-0"
              id="navbar-brand-logo"
            >
              <img
                src="/logo-labriur.png"
                onError={(e) => {
                  e.currentTarget.src = '/logo-custom.png';
                }}
                alt="LABRIOUT"
                className="h-11 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                style={{ imageRendering: '-webkit-optimize-contrast' }}
                loading="eager"
              />
            </div>

            {/* Desktop Navigation Menu (on the same level) */}
            <nav className="hidden sm:flex items-center gap-5 sm:gap-6 lg:gap-8">
              {navItems.map(item => {
                const isActive =
                  currentView === item.id ||
                  (currentView === 'product' &&
                    ((productDetailSource === 'menu' && item.id === 'menu') ||
                      (productDetailSource !== 'menu' && item.id === 'home')));
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-xs sm:text-sm font-bold transition-colors relative py-1 cursor-pointer whitespace-nowrap ${
                      isActive ? 'text-[#ff5500]' : 'text-neutral-700 hover:text-[#ff5500]'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ff5500] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Action Controls (Address, Cart, Language Switcher) */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
          {/* Dual Pill Capsule: [📍 Address (Click to copy) | 🕒 Time (Static)] */}
          <div className="hidden md:flex items-center bg-[#f4f5f7] border border-neutral-200/90 rounded-full p-1 shadow-xs mr-1 select-none">
            {/* Left part: Address (Copies address on click) */}
            <button
              type="button"
              onClick={handleCopyAddress}
              className={`flex items-center gap-2 pl-2 sm:pl-3 pr-2.5 sm:pr-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none group ${
                copiedAddress
                  ? 'bg-emerald-100/90 text-emerald-800'
                  : 'text-neutral-800 hover:bg-neutral-200/60'
              }`}
              title={copiedAddress ? 'Indirizzo copiato!' : 'Clicca per copiare l\'indirizzo'}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                  copiedAddress
                    ? 'bg-emerald-600 text-white scale-110 shadow-xs'
                    : 'bg-neutral-900 text-white group-hover:bg-[#ff5500]'
                }`}
              >
                {copiedAddress ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : (
                  <MapPin className="w-3 h-3 stroke-[2.5]" />
                )}
              </span>
              <span
                className={`truncate max-w-[130px] lg:max-w-[170px] xl:max-w-[210px] text-xs transition-colors ${
                  copiedAddress ? 'font-bold text-emerald-800' : 'font-semibold text-neutral-900'
                }`}
              >
                {copiedAddress
                  ? language === 'ru'
                    ? 'Скопировано!'
                    : 'Copiato!'
                  : '64 av. Simone Veil, Bonneuil-sur-Marne'}
              </span>
            </button>

            {/* Vertical Divider Line */}
            <div className="h-4 w-px bg-neutral-300 mx-0.5 shrink-0" />

            {/* Right part: Time / Working hours with dropdown */}
            <div className="relative">
              <button
                ref={prenotaTriggerRef}
                type="button"
                onClick={() => setIsPrenotaOpen(!isPrenotaOpen)}
                className="flex items-center gap-2 pl-2.5 pr-3 py-1 rounded-full text-xs font-bold text-neutral-800 hover:text-[#ff5500] hover:bg-neutral-200/60 transition-colors cursor-pointer group select-none"
                title="Scegli orario di apertura / prenotazione"
              >
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0 group-hover:bg-[#ff5500] transition-colors">
                  <Clock className="w-3 h-3 stroke-[2.5]" />
                </span>
                <span className="whitespace-nowrap text-xs font-semibold text-neutral-900 group-hover:text-[#ff5500] transition-colors min-w-[76px]">
                  {getTimeDisplay()}
                </span>
              </button>

              <PrenotaTimeDropdown
                isOpen={isPrenotaOpen}
                onClose={() => setIsPrenotaOpen(false)}
                triggerRef={prenotaTriggerRef}
                align="left"
              />
            </div>
          </div>

          {/* Cart button (Desktop only, mobile has bottom bar) */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className={`hidden md:flex relative p-2 rounded-xl transition cursor-pointer overflow-visible ${
              currentView === 'cart'
                ? 'text-[#ff5500] bg-orange-50'
                : 'text-neutral-800 hover:text-[#ff5500] hover:bg-neutral-100/80'
            }`}
            id="navbar-cart-button"
            aria-label="Carrello"
            title="Carrello"
          >
            {/* Floating Mario-style +1 indicator */}
            {isCartBouncing && (
              <span
                key={`coin-${cartBounceKey}`}
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-black text-[#ff5500] pointer-events-none drop-shadow-[0_2px_8px_rgba(255,85,0,0.8)] animate-coin-float z-30 select-none"
              >
                +1
              </span>
            )}

            {/* Jumping cart & count */}
            <div
              key={`cart-${cartBounceKey}`}
              className={`relative flex items-center justify-center ${
                isCartBouncing ? 'animate-mario-jump' : ''
              }`}
            >
              <ShoppingCart className="w-6 h-6 stroke-[2]" />
              {itemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#ff5500] text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {itemsCount}
                </span>
              )}
            </div>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              id="navbar-language-button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className={`p-2 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                langDropdownOpen
                  ? 'text-[#ff5500] bg-orange-50'
                  : 'text-neutral-800 hover:text-[#ff5500] hover:bg-neutral-100/80'
              }`}
              aria-label="Cambia lingua"
              title="Cambia lingua"
            >
              <Globe className="w-6 h-6 stroke-[2]" />
              <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
                {language}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180 text-[#ff5500]' : ''}`} />
            </button>

            {/* Backdrop for click outside */}
            {langDropdownOpen && (
              <div
                className="fixed inset-0 z-40 bg-transparent"
                onClick={() => setLangDropdownOpen(false)}
              />
            )}

            {/* Language Dropdown Menu */}
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white/98 backdrop-blur-xl border border-gray-100 rounded-xl shadow-2xl py-1.5 z-50 animate-fadeIn text-neutral-800">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#ff5500]/10 hover:text-[#ff5500] transition cursor-pointer ${
                      language === l.code ? 'text-[#ff5500] font-bold bg-orange-50' : 'text-neutral-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm">{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono text-neutral-400">
                      {l.code}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Mobile Drawer (Modern Laconic Design matching Screenshot 2, Mobile Only) */}
      {mounted && typeof document !== 'undefined' && createPortal(
        <div
          className={`md:hidden fixed inset-0 z-[100] ${
            isMobileMenuOpen
              ? 'pointer-events-auto visible [transition:visibility_0s_linear_0s]'
              : 'pointer-events-none invisible [transition:visibility_0s_linear_0.34s]'
          }`}
        >
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className={`absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Drawer Panel */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-[78vw] max-w-[330px] bg-[#FAF8F6] text-[#171717] rounded-r-[24px] shadow-[12px_0_40px_rgba(0,0,0,0.22)] flex flex-col justify-between overflow-hidden z-10 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform ${
              isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            {/* Top Content Area (scrollable if screen is very short) */}
            <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-5 pt-6 pb-4 flex flex-col">
              {/* Drawer Header: Large Brand Logo + Clean X Close Button */}
              <div className="flex items-start justify-between mb-6">
                <div
                  onClick={() => {
                    handleNavClick('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="cursor-pointer select-none pt-0.5"
                >
                  <img
                    src="/logo-labriur.png"
                    onError={(e) => {
                      e.currentTarget.src = '/logo-custom.png';
                    }}
                    alt="LABRIOUT"
                    className="h-[62px] w-auto object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 -mr-1.5 -mt-0.5 flex items-center justify-center text-[#171717] hover:text-[#ff5500] active:scale-90 transition cursor-pointer"
                  aria-label="Chiudi menu"
                >
                  <X className="w-5 h-5 stroke-[2]" />
                </button>
              </div>

              {/* Primary Navigation: Menu, Contact, About Us */}
              <div className="space-y-1.5">
                {[
                  { id: 'menu', label: t('navMenu') || 'Menu', icon: Utensils },
                  { id: 'contatti', label: t('navContact') || (language === 'ru' ? 'Контакты' : 'Contact'), icon: Phone },
                  { id: 'chi-siamo', label: t('navAbout') || (language === 'ru' ? 'О нас' : 'About Us'), icon: Info },
                ].map((item, idx) => {
                  const IconComponent = item.icon;
                  // Highlight active item (or Menu when on home/menu matching Screenshot 2)
                  const isActive =
                    currentView === item.id || (idx === 0 && (currentView === 'home' || currentView === 'menu'));
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        handleNavClick(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[16px] transition-all cursor-pointer select-none group ${
                        isActive
                          ? 'bg-[#FCEEE5] text-[#171717]'
                          : 'bg-transparent text-[#171717] hover:bg-[#FCEEE5]/50 active:bg-[#FCEEE5]/80'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <IconComponent
                          className={`w-[22px] h-[22px] shrink-0 transition-colors ${
                            isActive
                              ? 'text-[#ff5500] stroke-[2]'
                              : 'text-[#171717] stroke-[1.8] group-hover:text-[#ff5500]'
                          }`}
                        />
                        <span
                          className={`text-[16px] tracking-tight ${
                            isActive ? 'font-bold text-[#171717]' : 'font-medium text-[#171717]'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                          isActive ? 'text-[#ff5500] stroke-[2.2]' : 'text-neutral-500 stroke-[1.8]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Language Switcher */}
              <div className="mt-2">
                <button
                  type="button"
                  aria-expanded={mobileLangDropdownOpen}
                  onClick={() => setMobileLangDropdownOpen(!mobileLangDropdownOpen)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 rounded-[16px] text-[#171717] hover:bg-[#FCEEE5]/40 active:bg-[#FCEEE5]/70 transition-colors cursor-pointer select-none"
                >
                  <Globe className="w-[22px] h-[22px] text-[#171717] stroke-[1.8] shrink-0" />
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-medium text-[#171717] tracking-tight">
                      {languages.find(l => l.code === language)?.label || 'English'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 stroke-[1.8] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                        mobileLangDropdownOpen ? 'rotate-180 text-[#ff5500]' : 'rotate-0'
                      }`}
                    />
                  </div>
                </button>

                {/* Smooth CSS Grid Dropdown Options */}
                <div
                  className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    mobileLangDropdownOpen
                      ? 'grid-rows-[1fr] opacity-100 mt-1'
                      : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="ml-5 pl-3 border-l-2 border-[#FCEEE5] space-y-0.5 py-0.5">
                      {languages.map(l => {
                        const isSelected = language === l.code;
                        return (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => {
                              setLanguage(l.code);
                              setMobileLangDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-[14px] transition cursor-pointer ${
                              isSelected
                                ? 'font-bold text-[#ff5500] bg-[#FCEEE5]/70'
                                : 'text-neutral-700 hover:bg-neutral-100/70'
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="text-base">{l.flag}</span>
                              <span>{l.label}</span>
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-[#ff5500] stroke-[2.5]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle Horizontal Divider */}
              <div className="mx-3 my-4 h-px bg-neutral-200/70 shrink-0" />

              {/* Social Media Links in Soft Circular Badges matching Screenshot 2 */}
              <div className="grid grid-cols-3 gap-2 pt-2 px-1">
                {/* Instagram */}
                <a
                  href={STORE_DETAILS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center py-1.5 rounded-xl transition active:scale-95 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F1EFEA] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <defs>
                        <linearGradient id="ig-grad-drawer" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#FD5949" />
                          <stop offset="50%" stopColor="#D6249F" />
                          <stop offset="100%" stopColor="#285AEB" />
                        </linearGradient>
                      </defs>
                      <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" fill="none" stroke="url(#ig-grad-drawer)" strokeWidth="2.1" />
                      <circle cx="12" cy="12" r="4.2" fill="none" stroke="url(#ig-grad-drawer)" strokeWidth="2.1" />
                      <circle cx="17.5" cy="6.5" r="1.2" fill="#D6249F" />
                    </svg>
                  </div>
                  <span className="text-[12px] font-normal mt-2 text-neutral-600 group-hover:text-[#171717]">
                    Instagram
                  </span>
                </a>

                {/* Facebook */}
                <a
                  href={STORE_DETAILS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center py-1.5 rounded-xl transition active:scale-95 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F1EFEA] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#1877F2]">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-[12px] font-normal mt-2 text-neutral-600 group-hover:text-[#171717]">
                    Facebook
                  </span>
                </a>

                {/* TikTok */}
                <a
                  href={STORE_DETAILS.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center py-1.5 rounded-xl transition active:scale-95 group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F1EFEA] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] group-hover:scale-105 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-[#000000]">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.68 6.34 6.34 0 0 0 9.33 22a6.34 6.34 0 0 0 6.34-6.32V8.47a8.28 8.28 0 0 0 4.84 1.54V6.69h-.92z" />
                    </svg>
                  </div>
                  <span className="text-[12px] font-normal mt-2 text-neutral-600 group-hover:text-[#171717]">
                    TikTok
                  </span>
                </a>
              </div>
            </div>

            {/* Bottom Decorative Brush Watermark & Tagline matching Screenshot 2 */}
            <div className="relative pt-14 pb-7 px-6 shrink-0 select-none pointer-events-none overflow-hidden">
              {/* Soft peach brush-stroke arcs watermark */}
              <svg
                viewBox="0 0 260 130"
                fill="none"
                className="absolute -left-6 bottom-6 w-[230px] h-auto text-[#FCE8DC] opacity-85"
                aria-hidden="true"
              >
                <path
                  d="M-10 58C28 22 86 12 146 28C178 36 206 54 222 76C202 62 170 46 132 40C78 31 24 44 -10 76Z"
                  fill="currentColor"
                />
                <path
                  d="M4 92C42 58 98 50 154 68C184 78 208 96 220 116C198 100 168 86 134 78C86 68 38 78 4 108Z"
                  fill="currentColor"
                />
              </svg>

              <div className="relative z-10">
                <div className="w-24 h-px bg-neutral-200/90 mb-3" />
                <p className="text-[9px] font-semibold tracking-[0.18em] text-neutral-400 uppercase leading-[1.6]">
                  GOOD FOOD
                  <br />
                  BRINGS PEOPLE TOGETHER
                </p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
};
