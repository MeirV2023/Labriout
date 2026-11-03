import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { LABRIOUT_STORE_DETAILS } from '../data/labrioutMenuData';
import bannerImg from '../assets/banner-hero-3x1.jpg';
import bannerMobileImg from '../assets/banner-mobile-370x220.png';
import bannerMobileImg2x from '../assets/banner-mobile@2x.png';
import bannerMobileImg3x from '../assets/banner-mobile@3x.png';

interface Slide {
  id: number;
  image: string;
  mobileImage?: string;
  mobileImage2x?: string;
  mobileImage3x?: string;
  fallbackImage: string;
  mobileFallbackImage?: string;
  alt: string;
  showButtons?: boolean;
}

export const Hero: React.FC = () => {
  const { t, activeTenantId } = useCart();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const touchStartXRef = useRef<number | null>(null);

  const isLabriout = activeTenantId === 'labriout';

  // Keep ONLY this primary picture on the slider as requested (or Labriout hero when tenant is labriout)
  const slides: Slide[] = isLabriout
    ? [
        {
          id: 1,
          image: 'https://i.imgur.com/tdcSw9D.jpeg',
          mobileImage: 'https://i.imgur.com/tdcSw9D.jpeg',
          mobileImage2x: 'https://i.imgur.com/tdcSw9D.jpeg',
          mobileImage3x: 'https://i.imgur.com/tdcSw9D.jpeg',
          fallbackImage: bannerImg,
          mobileFallbackImage: bannerImg,
          alt: 'La Briout Ristorante — Bonneuil-sur-Marne',
          showButtons: true,
        },
      ]
    : [
        {
          id: 1,
          image: 'https://i.imgur.com/tdcSw9D.jpeg',
          mobileImage: 'https://i.imgur.com/tdcSw9D.jpeg',
          mobileImage2x: 'https://i.imgur.com/tdcSw9D.jpeg',
          mobileImage3x: 'https://i.imgur.com/tdcSw9D.jpeg',
          fallbackImage: bannerImg,
          mobileFallbackImage: bannerImg,
          alt: 'La Briout Ristorante',
          showButtons: true,
        },
      ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (totalSlides <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  // Autoplay functionality - only runs when there are multiple slides
  useEffect(() => {
    if (isHovered || totalSlides <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isHovered, totalSlides]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || totalSlides <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartXRef.current = null;
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFulfillment = () => {
    const el = document.getElementById('fulfillment-bar-container');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      scrollToMenu();
    }
  };

  return (
    <section
      id="hero-section"
      className="sticky top-[var(--navbar-height,40px)] md:static z-0 w-full max-w-full bg-[#ffffff] pt-0 md:pt-[22px] pb-0 md:pb-5 px-0 md:px-8 lg:px-12 flex flex-col justify-center items-center overflow-hidden md:overflow-visible select-none"
    >
      {/* 
        FLOATING GALLERY BLOCK:
        - Mobile: edge-to-edge banner header without margins or rounded corners (Screen 2)
        - Desktop: 1200 x 400 px (3:1 aspect ratio) floating card with soft 3D shadow and rounded-[28px]
      */}
      <div className="relative w-full max-w-[1200px] mx-auto flex justify-center overflow-hidden md:overflow-visible">
        {/* Banner Card Container */}
        <div
          className="relative w-full h-auto aspect-[370/220] md:aspect-[3/1] md:min-w-0 md:w-full rounded-none md:rounded-[28px] overflow-hidden shadow-none md:shadow-[0_20px_50px_rgba(0,0,0,0.16),0_6px_18px_rgba(0,0,0,0.08)] bg-black group select-none border-0 md:border md:border-neutral-100 mx-auto shrink-0 md:shrink"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides Track */}
          <div
            className="w-full h-full flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div
                key={slide.id}
                className="relative w-full h-full shrink-0 flex items-center justify-center overflow-hidden"
              >
                {/* Responsive banner: Desktop uses high-res 3:1 banner; Mobile uses custom 370x220 banner with 2x/3x Retina srcset */}
                <picture className="w-full h-full block">
                  <source media="(min-width: 768px)" srcSet={slide.image} />
                  <source
                    media="(max-width: 767px)"
                    srcSet={`${slide.mobileImage || ''} 1x, ${slide.mobileImage2x || slide.mobileImage || ''} 2x, ${slide.mobileImage3x || slide.mobileImage || ''} 3x`}
                  />
                  <img
                    src={slide.mobileImage || slide.image}
                    srcSet={`${slide.mobileImage || ''} 1x, ${slide.mobileImage2x || slide.mobileImage || ''} 2x, ${slide.mobileImage3x || slide.mobileImage || ''} 3x`}
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (slide.mobileFallbackImage && !target.src.includes(slide.mobileFallbackImage)) {
                        target.src = slide.mobileFallbackImage;
                      } else if (slide.fallbackImage && !target.src.includes(slide.fallbackImage)) {
                        target.src = slide.fallbackImage;
                      } else if (!target.src.includes('5hYpdmB') && !target.src.includes('YGftWqc')) {
                        target.src = 'https://i.imgur.com/5hYpdmB.png';
                      }
                    }}
                    alt={slide.alt}
                    width={1200}
                    height={400}
                    className="w-full h-full object-cover block select-none pointer-events-none"
                    style={{
                      imageRendering: '-webkit-optimize-contrast',
                    }}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </picture>

                {/* Action Buttons: ORDINA ORA & SCOPRI IL MENU (Slide 1) */}
                {slide.showButtons && (
                  <>
                    {/* Desktop CTA buttons - identical to original, unchanged */}
                    <div className="hidden md:flex absolute md:left-9 lg:left-12 md:bottom-7 items-center gap-2 sm:gap-3 z-20 pointer-events-auto">
                      {/* Primary Orange CTA */}
                      <button
                        id="hero-btn-ordina-ora"
                        onClick={scrollToFulfillment}
                        className="bg-[#ff5500] hover:bg-[#ff6a1a] active:scale-95 text-white font-extrabold text-sm px-6 py-3 rounded-full shadow-[0_4px_20px_rgba(255,85,0,0.5)] hover:shadow-[0_6px_25px_rgba(255,85,0,0.7)] flex items-center gap-2 transition-all cursor-pointer uppercase tracking-wider shrink-0"
                      >
                        <span>{t('orderNow')}</span>
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>

                      {/* Secondary Outlined CTA */}
                      <button
                        id="hero-btn-scopri-menu"
                        onClick={scrollToMenu}
                        className="bg-black/60 hover:bg-black/90 active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-full border border-[#ff5500] hover:border-white backdrop-blur-md transition-all cursor-pointer uppercase tracking-wider shrink-0"
                      >
                        {t('discoverMenu')}
                      </button>
                    </div>

                    {/* Mobile interactive tap areas over the buttons baked into the banner image */}
                    <div className="md:hidden absolute inset-0 z-20 pointer-events-auto">
                      {/* ORDINA ORA tap zone */}
                      <button
                        onClick={scrollToFulfillment}
                        aria-label={t('orderNow')}
                        className="absolute left-[3.8%] bottom-[16.4%] w-[33.5%] h-[16.4%] rounded-full active:opacity-60 cursor-pointer bg-transparent"
                      />
                      {/* SCOPRI IL MENU tap zone */}
                      <button
                        onClick={scrollToMenu}
                        aria-label={t('discoverMenu')}
                        className="absolute left-[38.9%] bottom-[16.4%] w-[34.1%] h-[16.4%] rounded-full active:opacity-60 cursor-pointer bg-transparent"
                      />
                    </div>
                  </>
                )}

                {/* Hotspot over the 'ORDER NOW' badge on the right of Slide 1 */}
                {slide.id === 1 && (
                  <button
                    onClick={scrollToMenu}
                    aria-label="Ordina Ora"
                    title="Ordina Ora"
                    className="absolute right-[2%] sm:right-[3%] top-[38%] sm:top-[40%] w-[16%] sm:w-[14%] md:w-[12%] h-[38%] sm:h-[36%] md:h-[34%] z-20 cursor-pointer rounded-2xl transition-transform hover:scale-105 active:scale-95"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Carousel Pagination Dots - only when multiple slides exist */}
          {totalSlides > 1 && (
            <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 bg-black/40 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/10 pointer-events-auto">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentSlide === idx
                      ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-[#ff5500] shadow-[0_0_8px_rgba(255,85,0,0.8)]'
                      : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/40 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 
          WHITE CIRCULAR ARROW BUTTONS FLOATING ON THE EDGES:
          - Only rendered if there is more than one slide (totalSlides > 1)
        */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Precedente"
              className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-white hover:bg-neutral-50 active:scale-95 text-neutral-700 hover:text-black shadow-[0_6px_22px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.22)] border border-neutral-200/80 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Successivo"
              className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-full bg-white hover:bg-neutral-50 active:scale-95 text-neutral-700 hover:text-black shadow-[0_6px_22px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.22)] border border-neutral-200/80 flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};
