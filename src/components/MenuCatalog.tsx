import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Utensils, ChevronLeft, ChevronRight } from 'lucide-react';
import { MENU_PRODUCTS, CATEGORY_CONFIGS, MenuCategoryConfig } from '../data/menuData';
import { LABRIOUT_CATEGORY_CONFIGS } from '../data/labrioutMenuData';
import { CategoryId } from '../types';
import { ProductCard } from './ProductCard';
import { useCart } from '../context/CartContext';
import { CategoryShowcase } from './CategoryShowcase';
import { SidebarCart } from './SidebarCart';
import {
  getCategoryLabel,
  getSubFilterLabel,
  getLocalizedProductName,
  getLocalizedProductDescription,
} from '../utils/menuTranslations';

export const MenuCatalog: React.FC = () => {
  const {
    t,
    language,
    selectedCategory,
    setSelectedCategory,
    selectedCardKey,
    setSelectedCardKey,
    categorySubFilters,
    setCategorySubFilters,
    pendingScrollCategory,
    setPendingScrollCategory,
    catalogProducts,
    activeTenantId,
  } = useCart();

  const activeCategoryConfigs = useMemo(
    () =>
      (activeTenantId === 'labriout' ? LABRIOUT_CATEGORY_CONFIGS : CATEGORY_CONFIGS).filter(cfg =>
        activeTenantId === 'labriout'
          ? (catalogProducts || []).some(p => p.category === cfg.id)
          : true
      ),
    [activeTenantId, catalogProducts]
  );

  const activeCatalog = useMemo(
    () => (catalogProducts && catalogProducts.length > 0 ? catalogProducts : MENU_PRODUCTS).filter(p => p.isAvailable !== false),
    [catalogProducts]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<CategoryId | 'tutti'>(
    () => pendingScrollCategory || (selectedCategory && selectedCategory !== 'tutti' ? selectedCategory : 'tutti')
  );
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isBarSticky, setIsBarSticky] = useState(false);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isManualScrollingRef = useRef(Boolean(pendingScrollCategory));
  const manualScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect when category navigation bar becomes sticky/pinned
  useEffect(() => {
    const handleScroll = () => {
      if (!sentinelRef.current) return;
      const header = document.querySelector('header');
      const headerBottom = header ? header.getBoundingClientRect().bottom : 110;
      const sentinelRect = sentinelRef.current.getBoundingClientRect();
      setIsBarSticky(sentinelRect.top <= headerBottom + 4);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Check scroll arrows state
  const checkScrollArrows = useCallback(() => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScrollArrows();
    window.addEventListener('resize', checkScrollArrows);
    return () => window.removeEventListener('resize', checkScrollArrows);
  }, [checkScrollArrows]);

  // Scroll category tabs with left / right arrow buttons
  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollOffset = 260;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollOffset : scrollOffset,
        behavior: 'smooth',
      });
      setTimeout(checkScrollArrows, 320);
    }
  };

  // Scroll spy: observe which category section is currently in viewport
  useEffect(() => {
    let isTicking = false;

    const handleScroll = () => {
      if (isManualScrollingRef.current || pendingScrollCategory) return;
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          if (isManualScrollingRef.current || pendingScrollCategory) {
            isTicking = false;
            return;
          }
          const navHeight = parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '110'
          );
          // Threshold just below the sticky category bar
          const triggerY = navHeight + 70;

          // Check if user is scrolled to the top above the first category
          const firstCatEl = document.getElementById(`cat-${activeCategoryConfigs[0]?.id}`);
          if (firstCatEl && firstCatEl.getBoundingClientRect().top > triggerY + 100) {
            setActiveSection('tutti');
            setSelectedCategory('tutti');
            isTicking = false;
            return;
          }

          // Find the active category section closest to top trigger line
          let current: CategoryId | 'tutti' = activeCategoryConfigs[0]?.id || 'friggitoria';
          for (const config of activeCategoryConfigs) {
            const el = document.getElementById(`cat-${config.id}`);
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= triggerY + 15) {
                current = config.id;
              }
            }
          }

          // If reached the bottom of page, highlight the last category
          if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80 && activeCategoryConfigs.length > 0) {
            current = activeCategoryConfigs[activeCategoryConfigs.length - 1].id;
          }

          setActiveSection(current);
          setSelectedCategory(current);
          isTicking = false;
        });
        isTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    if (!pendingScrollCategory && !isManualScrollingRef.current) {
      handleScroll();
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setSelectedCategory, pendingScrollCategory]);

  // Helper to safely center a tab in the horizontal scroll container without affecting window vertical scroll
  const centerCategoryTab = (catId: CategoryId | 'tutti') => {
    const container = categoryScrollRef.current;
    const tabEl = document.getElementById(`category-tab-${catId}`);
    if (container && tabEl) {
      const tabLeft = tabEl.offsetLeft;
      const tabWidth = tabEl.offsetWidth;
      const containerWidth = container.clientWidth;
      container.scrollTo({
        left: Math.max(0, tabLeft - containerWidth / 2 + tabWidth / 2),
        behavior: 'smooth',
      });
    }
  };

  // Keep active tab centered in horizontal scroll container
  useEffect(() => {
    if (!isManualScrollingRef.current) {
      centerCategoryTab(activeSection);
    }
    checkScrollArrows();
  }, [activeSection, checkScrollArrows]);

  const scrollRafRef = useRef<number | null>(null);

  // Yandex Eda / Lavka style category scroll:
  // Starts a brief directional slide (~90ms), then instantly skips intermediate sections
  // and smoothly glides the last ~190px into the target category header so the user never gets dizzy.
  const scrollToYandexStyle = useCallback((getTargetY: () => number | null, onDone?: () => void) => {
    if (scrollRafRef.current !== null) {
      cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = null;
    }

    const initialTargetY = getTargetY();
    if (initialTargetY === null) {
      onDone?.();
      return;
    }

    const startY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const totalDiff = initialTargetY - startY;
    const absDiff = Math.abs(totalDiff);

    if (absDiff < 4) {
      window.scrollTo({ top: initialTargetY, behavior: 'instant' as ScrollBehavior });
      onDone?.();
      return;
    }

    const dir = totalDiff >= 0 ? 1 : -1;
    const startTime = performance.now();

    // Short distance (adjacent category): single fast ease-out glide (230ms)
    if (absDiff <= 580) {
      const duration = 230;
      const stepShort = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const currentTarget = getTargetY() ?? initialTargetY;
        const nextY = startY + (currentTarget - startY) * eased;
        window.scrollTo({ top: Math.round(nextY), behavior: 'instant' as ScrollBehavior });

        if (t < 1) {
          scrollRafRef.current = requestAnimationFrame(stepShort);
        } else {
          scrollRafRef.current = null;
          onDone?.();
        }
      };
      scrollRafRef.current = requestAnimationFrame(stepShort);
      return;
    }

    // Long distance (jumping across multiple categories):
    // Phase 1 (0..85ms): accelerate 120px in scroll direction ("начинается съезд вниз/вверх")
    // Phase 2 (85..275ms): instant warp to 180px before target, then smooth ease-out landing into target
    const phase1Duration = 85;
    const phase2Duration = 190;
    const launchDistance = 120;
    const landingDistance = 180;

    const stepLong = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed < phase1Duration) {
        const t1 = elapsed / phase1Duration;
        // easeInQuad for initial launch feel
        const eased1 = t1 * t1;
        const nextY = startY + dir * launchDistance * eased1;
        window.scrollTo({ top: Math.max(0, Math.round(nextY)), behavior: 'instant' as ScrollBehavior });
        scrollRafRef.current = requestAnimationFrame(stepLong);
      } else {
        const elapsed2 = elapsed - phase1Duration;
        const t2 = Math.min(1, elapsed2 / phase2Duration);
        // easeOutCubic for soft deceleration into the target category
        const eased2 = 1 - Math.pow(1 - t2, 3);
        const currentTarget = getTargetY() ?? initialTargetY;
        const warpOriginY = currentTarget - dir * landingDistance;
        const nextY = warpOriginY + dir * landingDistance * eased2;
        window.scrollTo({ top: Math.max(0, Math.round(nextY)), behavior: 'instant' as ScrollBehavior });

        if (t2 < 1) {
          scrollRafRef.current = requestAnimationFrame(stepLong);
        } else {
          scrollRafRef.current = null;
          onDone?.();
        }
      }
    };

    scrollRafRef.current = requestAnimationFrame(stepLong);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  // Compute exact target scroll Y for a category or 'tutti'
  const computeCategoryTargetY = useCallback((catId: CategoryId | 'tutti'): number | null => {
    const header = document.querySelector('header');
    const navHeight = header
      ? header.getBoundingClientRect().height
      : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height') || '72');
    const offset = navHeight + 54;

    const currentScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;

    if (catId === 'tutti') {
      const el = document.getElementById('menu-categories-nav') || document.getElementById('products-main-layout');
      if (!el) return null;
      return Math.max(0, Math.round(el.getBoundingClientRect().top + currentScroll - (navHeight + 6)));
    } else {
      const el = document.getElementById(`cat-${catId}`);
      if (!el) return null;
      return Math.max(0, Math.round(el.getBoundingClientRect().top + currentScroll - offset));
    }
  }, []);

  // Handle programmatic anchor scrolling (e.g. breadcrumb click -> jump-and-glide scroll to category section)
  useEffect(() => {
    if (!pendingScrollCategory) return;
    const targetCat = pendingScrollCategory;

    setActiveSection(targetCat);
    setSelectedCategory(targetCat);
    setSelectedCardKey(targetCat === 'tutti' ? 'all' : targetCat);
    if (searchQuery) setSearchQuery('');

    isManualScrollingRef.current = true;
    if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);

    const timer = setTimeout(() => {
      centerCategoryTab(targetCat);
      scrollToYandexStyle(
        () => computeCategoryTargetY(targetCat),
        () => {
          isManualScrollingRef.current = false;
          setPendingScrollCategory(null);
          checkScrollArrows();
        }
      );
    }, 30);

    manualScrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
      setPendingScrollCategory(null);
      checkScrollArrows();
    }, 600);

    return () => {
      clearTimeout(timer);
      if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);
    };
  }, [pendingScrollCategory, computeCategoryTargetY, scrollToYandexStyle, checkScrollArrows, setPendingScrollCategory, setSelectedCardKey, setSelectedCategory]);

  // Handle clicking a category tab (Yandex Eda / Lavka jump-and-glide scroll to section)
  const handleCategoryTabClick = (catId: CategoryId | 'tutti') => {
    setActiveSection(catId);
    setSelectedCategory(catId);
    if (searchQuery) setSearchQuery('');

    isManualScrollingRef.current = true;
    if (manualScrollTimeoutRef.current) clearTimeout(manualScrollTimeoutRef.current);

    centerCategoryTab(catId);

    scrollToYandexStyle(
      () => computeCategoryTargetY(catId),
      () => {
        isManualScrollingRef.current = false;
        checkScrollArrows();
      }
    );

    manualScrollTimeoutRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
      checkScrollArrows();
    }, 450);
  };

  const handleSelectCard = (catId: CategoryId, cardKey: string) => {
    setSelectedCardKey(cardKey);
    setSearchQuery('');
    handleCategoryTabClick(catId);
  };

  const handleViewAllMenu = () => {
    setSelectedCardKey('all');
    setSearchQuery('');
    handleCategoryTabClick('tutti');
  };

  const handleSubFilterChange = (categoryId: string, subFilterId: string) => {
    setCategorySubFilters(prev => ({
      ...prev,
      [categoryId]: subFilterId,
    }));
  };

  // Filtered products when searching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return activeCatalog.filter(product => {
      const matchName =
        product.name.toLowerCase().includes(q) ||
        getLocalizedProductName(product, language).toLowerCase().includes(q);
      const matchDesc =
        product.description.toLowerCase().includes(q) ||
        getLocalizedProductDescription(product, language).toLowerCase().includes(q);
      const matchCat =
        product.category.toLowerCase().includes(q) ||
        getCategoryLabel(product.category, language, product.category).toLowerCase().includes(q);
      return matchName || matchDesc || matchCat;
    });
  }, [searchQuery, language, activeCatalog]);

  const renderProductGridForCategory = (config: MenuCategoryConfig) => {
    const currentSubFilter = categorySubFilters[config.id] || 'tutti';
    const localizedCategoryTitle =
      activeTenantId === 'labriout'
        ? config.label
        : getCategoryLabel(config.id, language, config.label);

    const categoryProducts = activeCatalog.filter(product => {
      if (product.category !== config.id) return false;
      if (currentSubFilter !== 'tutti' && product.subCategory !== currentSubFilter) {
        return false;
      }
      return true;
    });

    return (
      <div key={config.id} id={`cat-${config.id}`} className="scroll-mt-32">
        {/* Category Header with Title */}
        <div className="mb-2">
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
            {localizedCategoryTitle}
          </h2>
        </div>

        {/* Secondary Subcategories Row */}
        {config.subFilters && config.subFilters.length > 1 && (
          <div className="mb-4 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 w-full max-w-full overscroll-x-contain touch-pan-x">
            {config.subFilters.map(sub => {
              const isActive = currentSubFilter === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSubFilterChange(config.id, sub.id)}
                  style={{
                    color: '#21201F',
                    borderColor: isActive ? '#F5F4F2' : 'transparent',
                  }}
                  className={`py-1.5 px-3 rounded-xl text-xs sm:text-[13px] whitespace-nowrap cursor-pointer select-none border transition-all ${
                    isActive
                      ? 'font-bold bg-[#F5F4F2]/50 shadow-2xs opacity-100'
                      : 'font-medium opacity-65 hover:opacity-100 hover:bg-[#F5F4F2]/20'
                  }`}
                >
                  <span>{getSubFilterLabel(sub.id, language, sub.label)}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 3-Columns Product Grid (Exact 232.4px columns, 18px horizontal gap on desktop) */}
        {categoryProducts.length === 0 ? (
          <div className="bg-[#f8f9fa] border border-gray-100 rounded-2xl p-8 text-center my-4">
            <p className="text-neutral-500 text-sm">
              {language === 'ru'
                ? 'В этой подкатегории товары не найдены.'
                : language === 'en'
                ? 'No products found in this subcategory.'
                : 'Nessun prodotto trovato in questa sottocategoria.'}
            </p>
            <button
              onClick={() => handleSubFilterChange(config.id, 'tutti')}
              className="mt-3 px-4 py-1.5 rounded-lg bg-[#ff5500] text-white text-xs font-bold cursor-pointer"
            >
              {language === 'ru'
                ? `Показать все: ${localizedCategoryTitle}`
                : language === 'en'
                ? `Show all ${localizedCategoryTitle}`
                : `Mostra tutti i ${localizedCategoryTitle}`}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(2,minmax(0,173.2px))] justify-center sm:justify-start sm:grid-cols-[repeat(3,232.4px)] gap-[8px] sm:gap-x-[18px] sm:gap-y-[24px] w-full sm:w-[733.2px] max-w-full sm:max-w-[733.2px]">
            {categoryProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="menu-catalog-section" className="pt-0.5 pb-6 sm:py-8 bg-white relative overflow-visible max-w-full">
      <div className="max-w-[1280px] mx-auto px-2 sm:px-6 lg:px-8 overflow-visible max-w-full">
        {/* TOP CATEGORY SHOWCASE (5 Core Categories + Banner) */}
        <CategoryShowcase
          selectedCategory={selectedCategory}
          selectedCardKey={selectedCardKey}
          onSelectCard={handleSelectCard}
          onViewAllMenu={handleViewAllMenu}
        />

        {/* MAIN LAYOUT: Products Grid on Left/Center + Sticky Order Sidebar on Right (360px) with 19px gap */}
        <div id="products-main-layout" className="flex flex-col lg:flex-row items-start justify-center gap-[8px] sm:gap-[19px] pt-0 sm:pt-2 w-full max-w-full">
          {/* Left / Center Column: Product Catalog & Category Switcher (816px on desktop, aligned with CategoryShowcase 816px) */}
          <div className="w-full lg:w-[816px] max-w-full lg:max-w-[816px] shrink-0 space-y-6">

            {/* Sentinel to detect sticky state without layout shift */}
            <div ref={sentinelRef} className="w-full h-px -mt-px pointer-events-none opacity-0" />

            {/* CATEGORY TAB BAR: Flat when at top, Rounded floating pill card when sticky scrolled */}
            <div
              id="menu-categories-nav"
              className={`!mt-1 sm:!mt-6 sticky top-[var(--navbar-height,40px)] sm:top-[var(--navbar-height,110px)] z-30 transition-all duration-200 ${
                isBarSticky
                  ? 'bg-white/95 backdrop-blur-md py-1 px-2 sm:px-3 rounded-2xl border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden'
                  : 'bg-white pt-1 pb-0 border-b border-[#F5F4F2] shadow-none rounded-none'
              }`}
            >
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Left Arrow Button (visible when scrolled right) */}
                {canScrollLeft && (
                  <button
                    type="button"
                    onClick={() => scrollCategories('left')}
                    aria-label="Scorri a sinistra"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#21201F] flex items-center justify-center transition cursor-pointer active:scale-95 shrink-0 shadow-2xs mr-1"
                  >
                    <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
                  </button>
                )}

                {/* Clean Text-only Tabs with Active Underline Indicator */}
                <div
                  ref={categoryScrollRef}
                  onScroll={checkScrollArrows}
                  className="flex-1 flex items-center gap-1 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth relative max-w-full overscroll-x-contain touch-pan-x"
                >
                  {/* Tutto il menù */}
                  <button
                    id="category-tab-tutti"
                    onClick={() => handleCategoryTabClick('tutti')}
                    style={{ color: '#21201F' }}
                    className={`py-3 sm:py-3.5 px-3 sm:px-2.5 text-[14px] sm:text-[14.5px] transition-colors whitespace-nowrap cursor-pointer select-none relative ${
                      activeSection === 'tutti'
                        ? 'font-bold opacity-100'
                        : 'font-medium opacity-65 hover:opacity-100'
                    }`}
                  >
                    <span>
                      {language === 'ru'
                        ? 'Всё меню'
                        : language === 'en'
                        ? 'Full menu'
                        : language === 'de'
                        ? 'Gesamtes Menü'
                        : language === 'fr'
                        ? 'Tout le menu'
                        : 'Tutto il menù'}
                    </span>
                    {activeSection === 'tutti' && (
                      <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#21201F] rounded-full" />
                    )}
                  </button>

                  {/* Category Tabs */}
                  {activeCategoryConfigs.map(cat => {
                    const isActive = activeSection === cat.id;
                    return (
                      <button
                        key={cat.id}
                        id={`category-tab-${cat.id}`}
                        onClick={() => handleCategoryTabClick(cat.id)}
                        style={{ color: '#21201F' }}
                        className={`py-3 sm:py-3.5 px-3 sm:px-2.5 text-[14px] sm:text-[14.5px] transition-colors whitespace-nowrap cursor-pointer select-none relative ${
                          isActive
                            ? 'font-bold opacity-100'
                            : 'font-medium opacity-65 hover:opacity-100'
                        }`}
                      >
                        <span>
                          {activeTenantId === 'labriout'
                            ? cat.label
                            : getCategoryLabel(cat.id, language, cat.label)}
                        </span>
                        {isActive && (
                          <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#21201F] rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Arrow Button (visible when scrollable to right) */}
                {canScrollRight && (
                  <button
                    type="button"
                    onClick={() => scrollCategories('right')}
                    aria-label="Scorri a destra"
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#21201F] flex items-center justify-center transition cursor-pointer active:scale-95 shrink-0 shadow-2xs ml-1"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                  </button>
                )}
              </div>
            </div>

            {/* SEARCH ACTIVE STATE OR CONTINUOUS CATALOG */}
            {searchQuery.trim() ? (
              <div>
                <div className="mb-6">
                  <div className="flex items-center justify-between pb-3">
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
                      Risultati ricerca per: <span className="text-[#ff5500]">"{searchQuery}"</span>
                    </h2>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                    >
                      Cancella ricerca
                    </button>
                  </div>
                  <div className="w-full h-[1px] bg-gray-200" />
                </div>

                {searchResults.length === 0 ? (
                  <div className="bg-[#f8f9fa] border border-gray-200 rounded-2xl p-12 text-center">
                    <Utensils className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
                    <p className="text-neutral-700 font-bold">{t('noProductsFound')}</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        handleCategoryTabClick('tutti');
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-[#ff5500] text-white text-xs font-bold cursor-pointer"
                    >
                      Mostra tutto il menù
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-[repeat(2,minmax(0,173.2px))] justify-center sm:justify-start sm:grid-cols-[repeat(3,232.4px)] gap-[8px] sm:gap-x-[18px] sm:gap-y-[24px] w-full sm:w-[733.2px] max-w-full sm:max-w-[733.2px]">
                    {searchResults.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* CONTINUOUS MENU SECTIONS: RENDER ALL CATEGORIES WITH SPY SCROLLING */
              <div className="space-y-12">
                {activeCategoryConfigs.map(config => renderProductGridForCategory(config))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Sidebar with Cart (360px, Desktop Only) */}
          <div className="hidden lg:block w-full lg:w-[360px] shrink-0 self-stretch">
            <div className="sticky top-[calc(var(--navbar-height,70px)+12px)] z-20">
              <SidebarCart />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
