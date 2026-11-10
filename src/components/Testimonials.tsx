import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Star, Heart } from 'lucide-react';
import { REVIEWS_DATA, getLocalizedReviewText } from '../data/menuData';
import { getLabrioutKosherBadge } from '../data/labrioutMenuData';
import { useCart } from '../context/CartContext';

export const Testimonials: React.FC = () => {
  const { t, language } = useCart();

  // Mobile infinite circular horizontal carousel refs & state
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const isAdjustingScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollLeftRef = useRef(0);

  // 5 sets of REVIEWS_DATA (15 items total) for seamless circular scrolling in both directions
  const repeatedReviews = [
    ...REVIEWS_DATA,
    ...REVIEWS_DATA,
    ...REVIEWS_DATA,
    ...REVIEWS_DATA,
    ...REVIEWS_DATA,
  ];
  const middleSetStartIndex = REVIEWS_DATA.length * 2; // index 6

  const centerSlideAtIndex = useCallback((slideIndex: number, smooth = false) => {
    const container = mobileCarouselRef.current;
    if (!container) return;
    const slideEl = container.children[slideIndex] as HTMLElement | undefined;
    if (!slideEl) return;
    const targetLeft = slideEl.offsetLeft - (container.clientWidth - slideEl.offsetWidth) / 2;
    if (smooth) {
      container.scrollTo({ left: targetLeft, behavior: 'smooth' });
    } else {
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = targetLeft;
      container.style.scrollBehavior = '';
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      centerSlideAtIndex(middleSetStartIndex, false);
    }, 20);
    return () => window.clearTimeout(timer);
  }, [centerSlideAtIndex, middleSetStartIndex]);

  const handleMobileCarouselScroll = () => {
    const container = mobileCarouselRef.current;
    if (!container || isAdjustingScrollRef.current) return;

    const children = Array.from(container.children) as HTMLElement[];
    if (children.length < repeatedReviews.length) return;

    const viewportCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIdx = middleSetStartIndex;
    let minDistance = Infinity;

    children.forEach((child, idx) => {
      const childCenter = child.offsetLeft + child.offsetWidth / 2;
      const dist = Math.abs(childCenter - viewportCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setActiveReviewIndex(closestIdx % REVIEWS_DATA.length);

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      if (isDraggingRef.current) return;
      const singleSetWidth = children[REVIEWS_DATA.length].offsetLeft - children[0].offsetLeft;
      if (singleSetWidth <= 0) return;

      // If scrolled outside the middle set (sets 0, 1 or sets 3, 4), silently shift back to set 2
      if (closestIdx < REVIEWS_DATA.length * 2 || closestIdx >= REVIEWS_DATA.length * 3) {
        const offsetSets = Math.floor(closestIdx / REVIEWS_DATA.length) - 2;
        isAdjustingScrollRef.current = true;
        container.style.scrollBehavior = 'auto';
        container.scrollLeft -= offsetSets * singleSetWidth;
        container.style.scrollBehavior = '';
        window.requestAnimationFrame(() => {
          isAdjustingScrollRef.current = false;
        });
      }
    }, 140);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = mobileCarouselRef.current;
    if (!container) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX;
    startScrollLeftRef.current = container.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const container = mobileCarouselRef.current;
    if (!container) return;
    const dx = e.pageX - startXRef.current;
    container.scrollLeft = startScrollLeftRef.current - dx;
  };

  const handleMouseUpOrLeave = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    handleMobileCarouselScroll();
  };

  const getReviewText = (review: typeof REVIEWS_DATA[number]) =>
    getLocalizedReviewText(review, language);

  return (
    <section className="py-12 bg-[#0c0d10] border-t border-[#1c1f28] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5500]" />
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
              {t('testimonialsTitle')}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400">
            {t('testimonialsSub')}
          </p>
        </div>

        {/* Content Row: Review Cards & Promo Block perfectly aligned */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* MOBILE ONLY: Horizontal infinite circular carousel of Review Cards */}
          <div className="sm:hidden">
            <div
              ref={mobileCarouselRef}
              onScroll={handleMobileCarouselScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehaviorX: 'contain',
              }}
              className="flex flex-row items-stretch gap-3.5 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth select-none cursor-grab active:cursor-grabbing -mx-4 px-4"
            >
              {repeatedReviews.map((review, idx) => (
                <div
                  key={`${review.id}-${idx}`}
                  className="w-[82vw] max-w-[320px] shrink-0 snap-center metallic-card p-4 rounded-2xl flex flex-col justify-between"
                >
                  <div>
                    {/* 5 Stars */}
                    <div className="flex items-center gap-1 mb-2.5 text-[#ffaa00]">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#ffaa00]" />
                      ))}
                    </div>

                    <p className="text-xs text-neutral-300 italic leading-relaxed">
                      &quot;{getReviewText(review)}&quot;
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#202430] flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{review.name}</span>
                    <span className="text-[11px] text-neutral-400">{review.city}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Carousel Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-3.5">
              {REVIEWS_DATA.map((review, idx) => (
                <button
                  key={review.id}
                  type="button"
                  aria-label={review.name}
                  onClick={() => centerSlideAtIndex(middleSetStartIndex + idx, true)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeReviewIndex === idx
                      ? 'w-5 bg-[#ff5500]'
                      : 'w-1.5 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* DESKTOP / TABLET ONLY: Unchanged 3-column grid of Testimonials Cards */}
          <div className="hidden sm:grid lg:col-span-8 sm:grid-cols-3 gap-4">
            {REVIEWS_DATA.map(review => (
              <div
                key={review.id}
                className="metallic-card p-4 sm:p-5 rounded-2xl flex flex-col justify-between h-full"
              >
                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 mb-2.5 text-[#ffaa00]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#ffaa00]" />
                    ))}
                  </div>

                  <p className="text-xs text-neutral-300 italic leading-relaxed">
                    &quot;{getReviewText(review)}&quot;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#202430] flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{review.name}</span>
                  <span className="text-[11px] text-neutral-400">{review.city}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Signature Labriout Kosher Street Food Badge on the same level */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#1c1512] to-[#14161f] border border-[#ff5500]/30 rounded-3xl p-5 sm:p-6 text-center relative overflow-hidden flex flex-col justify-center h-full">
            <div className="relative z-10 space-y-2.5">
              <span className="text-[11px] font-black tracking-widest text-[#ff7722] uppercase">
                {getLabrioutKosherBadge(language)}
              </span>
              <h4 className="font-heading font-black text-xl lg:text-2xl text-white uppercase tracking-tight leading-tight">
                {language === 'ru'
                  ? 'НАСТОЯЩИЙ КОШЕРНЫЙ ВКУС LABRIOUT'
                  : language === 'en'
                  ? 'AUTHENTIC KOSHER TASTE AT LABRIOUT'
                  : language === 'de'
                  ? 'AUTHENTISCHER KOSCHERER GESCHMACK BEI LABRIOUT'
                  : language === 'it'
                  ? 'IL GUSTO KOSHER AUTENTICO DI LABRIOUT'
                  : 'LE GOÛT AUTHENTIQUE DE LABRIOUT'}
              </h4>
              <p className="font-handwriting text-xl text-[#ff8833] flex items-center justify-center gap-1">
                {language === 'ru'
                  ? 'Готовим с душой — Лабриут! '
                  : language === 'en'
                  ? 'Homemade with passion — Labriout! '
                  : language === 'de'
                  ? 'Hausgemacht mit Leidenschaft — Labriout! '
                  : language === 'it'
                  ? 'Fatto in casa con passione — Labriout! '
                  : 'Fait maison avec générosité '}
                <Heart className="w-4 h-4 text-red-500 fill-red-500 inline" />
              </p>
              <div className="pt-1 text-[11px] text-neutral-400">
                {language === 'ru'
                  ? 'Мясо Халак на гриле • Горячие Лаффы и Питы • Смэш Бургеры'
                  : language === 'en'
                  ? 'Flame-grilled Halak meats • Warm Laffas & Pitas • Smash Burgers'
                  : language === 'de'
                  ? 'Flammgegrilltes Halak-Fleisch • Hausgemachte Pitas & Laffas • Smash Burger'
                  : language === 'it'
                  ? 'Carni Halak alla brace • Pita & Laffa fatte in casa • Smash Burger'
                  : 'Viandes grillées à la flamme • Pitas & Laffas maison • Smash Burgers'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

