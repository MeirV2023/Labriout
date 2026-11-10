import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Printer,
  Sparkles,
  ShoppingBag,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { MENU_PRODUCTS, CATEGORY_CONFIGS } from '../data/menuData';
import { ProductItem, CategoryId } from '../types';
import {
  getCategoryLabel,
  getLocalizedProductName,
  getLocalizedProductDescription,
} from '../utils/menuTranslations';

export const MenuPage: React.FC = () => {
  const {
    setCurrentView,
    openProductDetail,
    language,
    pendingScrollCategory,
    setPendingScrollCategory,
    navigateToCategory,
  } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  useEffect(() => {
    if (pendingScrollCategory && pendingScrollCategory !== 'tutti') {
      const targetCat = pendingScrollCategory;
      setSelectedFilter('all');
      setSearchQuery('');
      setPendingScrollCategory(null);
      const scrollMenu = () => {
        const el = document.getElementById(`cat-${targetCat}`);
        if (el) {
          const header = document.querySelector('header');
          const headerHeight = header ? header.getBoundingClientRect().height : 80;
          const top = el.getBoundingClientRect().top + window.pageYOffset - (headerHeight + 20);
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
      };
      setTimeout(scrollMenu, 50);
      setTimeout(scrollMenu, 200);
    }
  }, [pendingScrollCategory, setPendingScrollCategory]);

  const isRu = language === 'ru';
  const isEn = language === 'en';
  const isDe = language === 'de';
  const isFr = language === 'fr';
  const isIt = language === 'it';

  // Format price matching the user specification: "4,50 EURO"
  const formatPrice = (price: number) => `${price.toFixed(2).replace('.', ',')} EURO`;

  const handlePrint = () => {
    window.print();
  };

  // Signature item from the main page MENU_PRODUCTS for the featured hero card
  const signatureProduct = useMemo(
    () => MENU_PRODUCTS.find((p) => p.id === 'lab-burger-double-smash') || MENU_PRODUCTS[0],
    []
  );

  // Group products by category id
  const productsByCategory = useMemo(() => {
    const map = new Map<CategoryId, ProductItem[]>();
    for (const cat of CATEGORY_CONFIGS) {
      map.set(cat.id, []);
    }
    for (const prod of MENU_PRODUCTS) {
      const list = map.get(prod.category);
      if (list) {
        list.push(prod);
      }
    }
    return map;
  }, []);

  // Filter products by search query
  const getFilteredItems = (items: ProductItem[]) => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        getLocalizedProductName(p, language).toLowerCase().includes(q) ||
        (p.badge && p.badge.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q) ||
        getLocalizedProductDescription(p, language).toLowerCase().includes(q)
    );
  };

  // Two-column layout split for Labriout Kosher Menu:
  const LEFT_CATEGORIES: CategoryId[] = ['panini', 'panini_special', 'girarrosto'];
  const RIGHT_CATEGORIES: CategoryId[] = [
    'gastronomia',
    'friggitoria',
    'pranzo',
    'patate',
    'bevande',
  ];

  // Helper to render an individual product row
  const renderProductRow = (item: ProductItem) => {
    const itemName = getLocalizedProductName(item, language);
    return (
      <div
        key={item.id}
        className="flex items-baseline justify-between py-1 gap-2 sm:gap-0"
      >
        {/* Name - Clicking opens product detail page */}
        <button
          type="button"
          onClick={() => openProductDetail(item, undefined, undefined, 'menu')}
          className="group/btn flex items-center gap-2 min-w-0 pr-1 text-left cursor-pointer border-none bg-transparent p-0 focus:outline-none"
          title={
            isRu
              ? `Подробнее: ${itemName}`
              : isEn
              ? `Details: ${itemName}`
              : isDe
              ? `Details: ${itemName}`
              : isIt
              ? `Dettagli: ${itemName}`
              : `Détails : ${itemName}`
          }
        >
          <span className="font-semibold text-[16px] text-[#1f2024] group-hover/btn:text-[#ff5500] transition-colors uppercase tracking-tight">
            {itemName}
          </span>
        </button>

        {/* Dotted Leader Line (hidden on mobile, visible on desktop) */}
        <div className="hidden sm:block flex-1 border-b-2 border-dotted border-neutral-300 mx-2 mb-1.5" />

        {/* Price Pill: EXACT 94.99px x 28.8px, font 16px, format "4,50 EURO", clicking opens product detail */}
        <button
          type="button"
          onClick={() => openProductDetail(item, undefined, undefined, 'menu')}
          className="shrink-0 rounded-full font-bold text-[16px] w-[94.99px] h-[28.8px] border border-[#ff5500]/50 text-[#ff5500] bg-white hover:bg-[#ff5500] hover:text-white hover:border-[#ff5500] transition-all duration-200 select-none flex items-center justify-center whitespace-nowrap tracking-tight cursor-pointer"
          title={
            isRu
              ? `Подробнее: ${itemName}`
              : isEn
              ? `Details: ${itemName}`
              : isDe
              ? `Details: ${itemName}`
              : isIt
              ? `Dettagli: ${itemName}`
              : `Détails : ${itemName}`
          }
        >
          <span>{formatPrice(item.price)}</span>
        </button>
      </div>
    );
  };

  // Helper to render a category section
  const renderCategorySection = (catId: CategoryId) => {
    const config = CATEGORY_CONFIGS.find((c) => c.id === catId);
    if (!config) return null;

    const allCatItems = productsByCategory.get(catId) || [];
    const items = getFilteredItems(allCatItems);

    if (items.length === 0) return null;
    const catLabel = getCategoryLabel(config.id, language, config.label);

    return (
      <div key={config.id} id={`cat-${config.id}`} className="space-y-3 sm:space-y-3.5 scroll-mt-28">
        <button
          type="button"
          onClick={() => navigateToCategory(config.id, undefined, 'home')}
          className="flex flex-col items-start gap-1 mb-3 text-left cursor-pointer group border-none bg-transparent p-0 focus:outline-none"
          title={
            isRu
              ? `Перейти к «${catLabel}» в каталоге`
              : isEn
              ? `Go to ${catLabel} in catalog`
              : isDe
              ? `Zu ${catLabel} im Katalog`
              : isIt
              ? `Vai a ${catLabel} nel catalogo`
              : `Voir ${catLabel} dans le catalogue`
          }
        >
          <span className="text-3xl select-none leading-none mb-1">{config.icon}</span>
          <h2
            style={{
              fontFamily: '"Instrument Serif Italic", "Instrument Serif", sans-serif',
              fontSize: '48px',
              lineHeight: '1.1',
              fontStyle: 'italic',
            }}
            className="text-[#1f2024] group-hover:text-[#ff5500] transition-colors tracking-tight font-normal text-left"
          >
            {catLabel}
          </h2>
        </button>

        <div className="space-y-2.5">
          {items.map(renderProductRow)}
        </div>
      </div>
    );
  };

  // Check if search yields any results
  const totalFilteredCount = useMemo(() => {
    let count = 0;
    for (const cat of CATEGORY_CONFIGS) {
      if (selectedFilter !== 'all' && selectedFilter !== cat.id) continue;
      const allCatItems = productsByCategory.get(cat.id) || [];
      count += getFilteredItems(allCatItems).length;
    }
    return count;
  }, [selectedFilter, searchQuery, productsByCategory]);

  return (
    <div
      style={{ fontFamily: "'YSText', sans-serif" }}
      className="min-h-screen bg-[#faf8f5] py-8 sm:py-12 px-3 sm:px-6 lg:px-8 selection:bg-[#ff5500] selection:text-white"
    >
      {/* Top Controls Bar */}
      <div className="max-w-[1500px] mx-auto mb-6 flex items-center justify-end gap-4">
        {/* Search input + Print + Switch to interactive catalog */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isRu
                  ? 'Поиск в меню...'
                  : isEn
                  ? 'Search menu...'
                  : isDe
                  ? 'Im Menü suchen...'
                  : isIt
                  ? 'Cerca nel menu...'
                  : 'Rechercher dans le menu...'
              }
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 text-xs sm:text-sm bg-white border border-neutral-200 rounded-full focus:outline-none focus:border-[#ff5500] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Print button */}
          <button
            onClick={handlePrint}
            title={
              isRu
                ? 'Распечатать меню'
                : isEn
                ? 'Print menu'
                : isDe
                ? 'Speisekarte drucken'
                : isIt
                ? 'Stampa menu'
                : 'Imprimer le menu'
            }
            className="p-2 sm:px-3 sm:py-2 rounded-full bg-white hover:bg-neutral-100 text-neutral-700 text-xs sm:text-sm font-semibold border border-neutral-200 shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden md:inline">
              {isRu ? 'Печать' : isEn ? 'Print' : isDe ? 'Drucken' : isIt ? 'Stampa' : 'Imprimer'}
            </span>
          </button>

          {/* Quick switch to digital interactive catalog */}
          <button
            onClick={() => {
              navigateToCategory('tutti', undefined, 'home');
            }}
            className="px-3.5 sm:px-4 py-2 rounded-full bg-[#ff5500] hover:bg-[#ff6611] text-white text-xs sm:text-sm font-black shadow-md shadow-[#ff5500]/25 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {isRu
                ? 'Каталог с фото'
                : isEn
                ? 'Visual Catalog'
                : isDe
                ? 'Foto-Katalog'
                : isIt
                ? 'Catalogo con foto'
                : 'Catalogue photos'}
            </span>
          </button>
        </div>
      </div>

      {/* MAIN RESTAURANT MENU CARD CONTAINER */}
      <div
        id="printable-restaurant-menu"
        className="max-w-[1500px] mx-auto bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-[#ece7de] p-6 sm:p-10 md:p-14 relative"
      >
        {/* CARD TOP HEADER */}
        <div className="flex items-start justify-between gap-4 mb-8 sm:mb-12 relative z-10">
          <div>
            <h1
              className="text-6xl sm:text-7xl md:text-8xl text-[#1f2024] tracking-tight leading-none select-none italic"
              style={{ fontFamily: '"Instrument Serif Italic", "Instrument Serif", sans-serif' }}
            >
              {isRu ? 'Меню' : isDe ? 'Speisekarte' : 'Menu'}
            </h1>
            {selectedFilter !== 'all' && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs sm:text-sm font-semibold text-[#ff5500] uppercase tracking-wide">
                  {getCategoryLabel(
                    selectedFilter as CategoryId,
                    language,
                    CATEGORY_CONFIGS.find((c) => c.id === selectedFilter)?.label
                  )}
                </span>
                <button
                  onClick={() => setSelectedFilter('all')}
                  className="text-xs text-neutral-400 hover:text-neutral-700 underline cursor-pointer"
                >
                  {isRu
                    ? 'Показать всё меню'
                    : isEn
                    ? 'Show full menu'
                    : isDe
                    ? 'Gesamtes Menü anzeigen'
                    : isIt
                    ? 'Mostra tutto il menu'
                    : 'Afficher tout le menu'}
                </button>
              </div>
            )}
          </div>

          {/* Stamp / Logo Emblem */}
          <div className="text-right shrink-0">
            <div className="inline-flex flex-col items-center border-2 border-dashed border-[#ff5500]/50 rounded-2xl p-2.5 sm:p-3 bg-orange-50/50 transform rotate-1 shadow-xs">
              <img
                src="/logo-labriur.png"
                onError={(e) => {
                  e.currentTarget.src = '/logo-custom.png';
                }}
                alt="LABRIOUT"
                className="h-11 sm:h-13 w-auto object-contain"
              />
              <span className="text-[9px] uppercase tracking-widest text-[#ff5500] font-bold mt-1">
                {isRu
                  ? '100% КОШЕР • БАДАЦ ДЕ БРЮНУА'
                  : isEn || isIt
                  ? '100% KOSHER • BADATZ DE BRUNOY'
                  : isDe
                  ? '100% KOSCHER • BADATZ DE BRUNOY'
                  : '100% CASHER • BADATZ DE BRUNOY'}
              </span>
            </div>
          </div>
        </div>

        {/* If no search results found */}
        {totalFilteredCount === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-neutral-500 font-semibold mb-3">
              {isRu
                ? `Ничего не найдено по запросу «${searchQuery}»`
                : isEn
                ? `No products found for "${searchQuery}"`
                : isDe
                ? `Keine Produkte gefunden für „${searchQuery}“`
                : isIt
                ? `Nessun prodotto trovato per "${searchQuery}"`
                : `Aucun produit trouvé pour « ${searchQuery} »`}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="px-4 py-2 rounded-full bg-[#ff5500] text-white text-xs font-bold uppercase tracking-wider"
            >
              {isRu
                ? 'Сбросить фильтры'
                : isEn
                ? 'Reset filters'
                : isDe
                ? 'Filter zurücksetzen'
                : isIt
                ? 'Azzera filtri'
                : 'Réinitialiser les filtres'}
            </button>
          </div>
        )}

        {/* When a specific single category is selected */}
        {selectedFilter !== 'all' && totalFilteredCount > 0 && (
          <div className="max-w-3xl mx-auto py-2">
            {renderCategorySection(selectedFilter as CategoryId)}
          </div>
        )}

        {/* 2-COLUMN MAIN CONTENT (When viewing all categories) */}
        {selectedFilter === 'all' && totalFilteredCount > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 relative z-10">
            {/* ======================================================== */}
            {/* LEFT COLUMN: Featured Star Dish + Burgers + Pitas/Laffas + Assiettes */}
            {/* ======================================================== */}
            <div className="space-y-8 sm:space-y-10">
              {/* 1. HIGHLIGHTED SIGNATURE DISH: DOUBLE SMASH BURGER */}
              {!searchQuery && (
                <div className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-[#cb683c] to-[#af4d26] text-white shadow-md shadow-neutral-900/10 overflow-hidden group">
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3 h-3 text-amber-200" />
                      {isRu
                        ? 'ФИРМЕННОЕ БЛЮДО LABRIOUT • 100% КОШЕР'
                        : isEn
                        ? 'HOUSE SPECIALTY • 100% KOSHER'
                        : isDe
                        ? 'HAUSSPEZIALITÄT • 100% KOSCHER'
                        : isIt
                        ? 'SPECIALITÀ DELLA CASA • 100% KOSHER'
                        : 'SPÉCIALITÉ DE LA MAISON • 100% CASHER'}
                    </span>

                    <h3 className="font-heading font-black text-xl sm:text-2xl text-white tracking-wide uppercase mt-1 mb-2">
                      {isRu
                        ? 'ДВОЙНОЙ СМЭШ БУРГЕР (DOUBLE SMASH)'
                        : isEn
                        ? 'DOUBLE SMASH BURGER'
                        : isDe
                        ? 'DOUBLE SMASH BURGER HAUSGEMACHT'
                        : isIt
                        ? 'DOUBLE SMASH BURGER DELLA CASA'
                        : 'DOUBLE SMASH BURGER MAISON'}
                    </h3>

                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium mb-4">
                      {isRu
                        ? 'Двойная сочная смэш-котлета из отборной кошерной говядины с хрустящей карамелизированной корочкой на раскаленной плите, домашний секретный бургер-соус, свежие томаты, хрустящий салат, корнишоны и красный лук в мягкой булочке.'
                        : isEn
                        ? 'Double smashed kosher beef patties seared on a hot griddle with crispy caramelized edges, house secret burger sauce, fresh tomato, crisp lettuce, pickles and red onion in a soft toasted bun.'
                        : isDe
                        ? 'Doppelte saftige koschere Smash-Rindfleisch-Patties frisch auf der heißen Platte gebraten mit knusprig karamellisierten Rändern, geheime Haus-Burger-Sauce, frische Tomaten, knackiger Salat, Gewürzgurken und rote Zwiebeln im weichen Bun.'
                        : isIt
                        ? 'Doppio hamburger smash di manzo kosher piastrato al momento con bordi croccanti e caramellati, salsa burger segreta della casa, lattuga croccante, pomodori freschi, cetriolini e cipolla rossa in un morbido bun.'
                        : 'Double steak haché de bœuf casher smashé minute sur la plaque brûlante aux bords croustillants et caramélisés, sauce burger secrète maison, salade croquante, tomates fraîches, cornichons et oignons rouges dans un bun moelleux.'}
                    </p>

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => openProductDetail(signatureProduct, undefined, undefined, 'menu')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-[16px] tracking-tight shadow-md transition-transform transform active:scale-95 cursor-pointer bg-white text-[#af4d26] hover:bg-neutral-100"
                        title={
                          isRu
                            ? `Подробнее: ${getLocalizedProductName(signatureProduct, language)}`
                            : isEn
                            ? `Details: ${getLocalizedProductName(signatureProduct, language)}`
                            : isDe
                            ? `Details: ${getLocalizedProductName(signatureProduct, language)}`
                            : isIt
                            ? `Dettagli: ${getLocalizedProductName(signatureProduct, language)}`
                            : `Détails : ${getLocalizedProductName(signatureProduct, language)}`
                        }
                      >
                        <span>{formatPrice(signatureProduct.price)}</span>
                      </button>

                      <span className="text-[11px] text-white/80 font-medium">
                        {isRu
                          ? 'Нажмите, чтобы посмотреть'
                          : isEn
                          ? 'Click to view details'
                          : isDe
                          ? 'Klicken für Details'
                          : isIt
                          ? 'Clicca per scoprire'
                          : 'Cliquez pour découvrir'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Render left column categories */}
              {LEFT_CATEGORIES.map(renderCategorySection)}
            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: Salades + Entrées + Menu Enfants + Extras + Boissons */}
            {/* ======================================================== */}
            <div className="space-y-8 sm:space-y-10">
              {/* Render right column categories */}
              {RIGHT_CATEGORIES.map(renderCategorySection)}

              {/* BOTTOM CALL-TO-ACTION CARD */}
              <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-orange-50/40 p-5 rounded-2xl border border-orange-100/80">
                <div className="text-left">
                  <h4 className="font-bold text-xs sm:text-sm text-[#1f2024] uppercase tracking-wide">
                    {isRu
                      ? 'УЖЕ ПРОГОЛОДАЛИСЬ?'
                      : isEn
                      ? 'ALREADY HUNGRY?'
                      : isDe
                      ? 'SCHON HUNGRIG?'
                      : isIt
                      ? 'HAI GIÀ FAME?'
                      : 'DÉJÀ FAIM ?'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-neutral-500 leading-snug mt-0.5">
                    {isRu
                      ? 'Заходите к нам в Бонёй-сюр-Марн (64 av. Simone Veil) или заказывайте онлайн прямо сейчас!'
                      : isEn
                      ? 'Visit us in Bonneuil-sur-Marne (64 av. Simone Veil) or order online right now!'
                      : isDe
                      ? 'Besuchen Sie uns in Bonneuil-sur-Marne (64 av. Simone Veil) oder bestellen Sie jetzt online!'
                      : isIt
                      ? 'Vieni a trovarci a Bonneuil-sur-Marne (64 av. Simone Veil) o ordina online adesso!'
                      : 'Passez nous voir à Bonneuil-sur-Marne (64 av. Simone Veil) ou commandez en ligne dès maintenant !'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <a
                    href="https://maps.google.com/?q=64+av.+Simone+Veil+Bonneuil-sur-Marne"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none text-center px-4 py-2 rounded-full border border-[#ff5500] text-[#ff5500] hover:bg-[#ff5500] hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-2xs"
                  >
                    {isRu
                      ? 'КАК ДОБРАТЬСЯ'
                      : isEn
                      ? 'DIRECTIONS'
                      : isDe
                      ? 'ANFAHRT'
                      : isIt
                      ? 'INDICAZIONI'
                      : 'ITINÉRAIRE'}
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      navigateToCategory('tutti', undefined, 'home');
                    }}
                    className="flex-1 sm:flex-none text-center px-4 py-2 rounded-full bg-[#ff5500] text-white hover:bg-[#ff6611] transition-all text-xs font-bold uppercase tracking-wider shadow-sm shadow-[#ff5500]/25"
                  >
                    {isRu
                      ? 'ЗАКАЗАТЬ'
                      : isEn
                      ? 'ORDER'
                      : isDe
                      ? 'BESTELLEN'
                      : isIt
                      ? 'ORDINA'
                      : 'COMMANDER'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
