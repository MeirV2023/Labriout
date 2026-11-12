import React from 'react';
import { Home, UtensilsCrossed, ShoppingCart, Bike, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const MobileBottomNav: React.FC = () => {
  const {
    itemsCount,
    subtotal,
    total,
    currentView,
    productDetailSource,
    setCurrentView,
    isCartBouncing,
    cartBounceKey,
    language,
    currency,
    formatMoney,
    t,
  } = useCart();

  const effectiveView = currentView === 'product' ? (productDetailSource || 'home') : currentView;

  const labels = {
    home: t ? t('navHome') : language === 'ru' ? 'Главная' : language === 'fr' ? 'Accueil' : language === 'de' ? 'Startseite' : 'Home',
    menu:
      language === 'ru'
        ? 'Всё Меню'
        : language === 'it'
        ? 'Tutto il Menu'
        : language === 'de'
        ? 'Speisekarte'
        : language === 'fr'
        ? 'Tout le Menu'
        : 'All Menu',
    cart:
      language === 'ru'
        ? 'Корзина'
        : language === 'it'
        ? 'Carrello'
        : language === 'de'
        ? 'Warenkorb'
        : language === 'fr'
        ? 'Panier'
        : 'Cart',
    toPayBtn:
      language === 'ru'
        ? 'К оплате'
        : language === 'it'
        ? 'Al pagamento'
        : language === 'de'
        ? 'Zur Kasse'
        : language === 'fr'
        ? 'Payer'
        : 'To pay',
  };

  const handleTabClick = (view: 'home' | 'menu' | 'cart') => {
    if (currentView === view) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView(view, true, true);
  };

  const isHomeActive = effectiveView === 'home';
  const isMenuActive = effectiveView === 'menu';
  const isCartActive = effectiveView === 'cart';

  const FREE_DELIVERY_THRESHOLD = 25;
  const safeSubtotal = Number(subtotal || 0);
  const safeTotal = Number(total || 0);
  const isFreeDelivery = safeSubtotal >= FREE_DELIVERY_THRESHOLD;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - safeSubtotal);
  const deliveryProgress = Math.min(100, Math.round((safeSubtotal / FREE_DELIVERY_THRESHOLD) * 100));

  const needMoreFormatted = formatMoney(amountToFreeDelivery);
  const freeBaseFormatted = formatMoney(FREE_DELIVERY_THRESHOLD, { decimals: 0 });

  const deliveryLabels = {
    ru: {
      freeDelivery: 'Бесплатная доставка',
      freeUnlocked: 'Бесплатная доставка активна',
      needMore: `Еще ${needMoreFormatted} до бесплатной доставки`,
      base: `Бесплатная доставка от ${freeBaseFormatted}`,
    },
    it: {
      freeDelivery: 'Consegna gratuita',
      freeUnlocked: 'Consegna gratuita attiva',
      needMore: `Mancano ${needMoreFormatted} per la consegna gratis`,
      base: `Consegna gratis da ${freeBaseFormatted}`,
    },
    en: {
      freeDelivery: 'Free delivery',
      freeUnlocked: 'Free delivery unlocked',
      needMore: `Add ${needMoreFormatted} for free delivery`,
      base: `Free delivery from ${freeBaseFormatted}`,
    },
    de: {
      freeDelivery: 'Kostenlose Lieferung',
      freeUnlocked: 'Kostenlose Lieferung aktiv',
      needMore: `Noch ${needMoreFormatted} bis zur kostenlosen Lieferung`,
      base: `Kostenlose Lieferung ab ${freeBaseFormatted}`,
    },
    fr: {
      freeDelivery: 'Livraison gratuite',
      freeUnlocked: 'Livraison gratuite activée',
      needMore: `Encore ${needMoreFormatted} pour la livraison gratuite`,
      base: `Livraison gratuite dès ${freeBaseFormatted}`,
    },
  }[language] || {
    freeDelivery: 'Free delivery',
    freeUnlocked: 'Free delivery unlocked',
    needMore: `Add ${needMoreFormatted} for free delivery`,
    base: `Free delivery from ${freeBaseFormatted}`,
  };

  // Show free delivery counter at the top of the bottom dock ONLY when items are in cart
  const showDeliveryBar = itemsCount > 0;
  const floatingCartBottom = showDeliveryBar
    ? 'bottom-[calc(env(safe-area-inset-bottom,0px)+106px)]'
    : 'bottom-[calc(env(safe-area-inset-bottom,0px)+62px)]';

  return (
    <>
      {/* Floating Cart / Checkout Button above bottom dock (Screens 2 & 3) */}
      {itemsCount > 0 && effectiveView !== 'checkout' && (
        <aside
          aria-label={labels.cart}
          className={`md:hidden fixed ${floatingCartBottom} right-4 z-40 transition-all duration-200`}
        >
          {effectiveView === 'cart' ? (
            <button
              type="button"
              onClick={() => {
                setCurrentView('checkout', true, true);
              }}
              style={{ height: '56px', minWidth: '137.13px' }}
              className="h-[56px] min-h-[56px] max-h-[56px] px-5 flex items-center justify-center gap-2.5 rounded-full bg-[#ff5500] hover:bg-[#ff6a1a] active:scale-95 text-white shadow-[0_6px_22px_rgba(255,85,0,0.45)] border border-white/20 transition-all cursor-pointer select-none group"
              title={labels.toPayBtn}
              aria-label={labels.toPayBtn}
            >
              <span className="text-[16px] font-bold tracking-tight leading-none whitespace-nowrap">
                {labels.toPayBtn}
              </span>
              <span className="w-[22px] h-[22px] rounded-full bg-white text-[#ff5500] flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
                <ChevronRight className="w-3.5 h-3.5 stroke-[3] translate-x-[0.5px]" />
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleTabClick('cart')}
              style={{ width: '137.13px', height: '56px' }}
              className="w-[137.13px] h-[56px] min-w-[137.13px] min-h-[56px] max-w-[137.13px] max-h-[56px] flex items-center justify-center gap-2.5 rounded-full bg-[#ff5500] hover:bg-[#ff6a1a] active:scale-95 text-white shadow-[0_6px_22px_rgba(255,85,0,0.45)] border border-white/20 transition-all cursor-pointer select-none group"
              title={labels.cart}
              aria-label={labels.cart}
            >
              <span className="text-[20px] font-black tracking-tight leading-none">
                {currency === 'USD'
                  ? formatMoney(total)
                  : `€${(Number(total) || 0).toFixed(2).replace('.', ',')}`}
              </span>
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/pastel-glyph/64/shopping-basket-2--v2.png"
                alt="shopping-basket-2--v2"
                className="w-[20px] h-[20px] min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] object-contain shrink-0 brightness-0 invert transition-transform group-hover:scale-110"
                style={{ filter: 'brightness(0) invert(1)' }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/icons/shopping-basket-2--v2.png';
                }}
              />
            </button>
          )}
        </aside>
      )}

      {/* Mobile Bottom Dock: Free Delivery Counter (Screenshot 1) + Navigation Tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-100 shadow-[0_-6px_28px_rgba(0,0,0,0.08)] rounded-t-[20px] overflow-hidden">
        {/* FREE DELIVERY COUNTER WITH PROGRESS BAR (Screenshot 1 & 2, shown only when itemsCount > 0) */}
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            showDeliveryBar
              ? 'grid-rows-[1fr] opacity-100'
              : 'grid-rows-[0fr] opacity-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden">
            <div
              onClick={() => handleTabClick('cart')}
              className="w-full pt-2 pb-1.5 px-4 flex flex-col items-center select-none cursor-pointer border-b border-neutral-100/80 active:bg-neutral-50/80 transition-colors"
              title={deliveryLabels.freeDelivery}
            >
              {/* Pill Badge matching Screenshot 1 */}
              <div className="flex flex-col items-center text-center mb-1">
                {isFreeDelivery ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{deliveryLabels.freeDelivery}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#ff5500] text-xs font-bold">
                    <Bike className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
                    <span>{deliveryLabels.needMore}</span>
                  </div>
                )}
              </div>

              {/* Full-width Progress Bar matching Screenshot 1 */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    isFreeDelivery
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-[#ff7722] to-[#ff5500]'
                  }`}
                  style={{ width: `${Math.max(deliveryProgress, safeTotal > 0 ? 6 : 0)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3 Mobile Navigation Tabs (Compact 50px height, 78x50 buttons per Screenshots 2 & 3) */}
        <nav
          aria-label="Mobile Navigation"
          className="bg-white pb-[env(safe-area-inset-bottom,0px)]"
        >
          <div
            role="tablist"
            className="flex items-center justify-around h-[50px] max-w-md mx-auto px-2"
          >
            {/* Tab 1: Главная */}
            <button
              type="button"
              role="tab"
              aria-selected={isHomeActive}
              onClick={() => handleTabClick('home')}
              className={`w-[78px] h-[50px] pt-[2px] pb-0 px-0 flex flex-col items-center justify-center transition-all cursor-pointer select-none group ${
                isHomeActive ? 'text-[#ff5500]' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <div className="relative flex items-center justify-center w-6 h-6">
                <Home
                  className={`w-5 h-5 transition-transform group-active:scale-90 ${
                    isHomeActive ? 'stroke-[2.5]' : 'stroke-[2]'
                  }`}
                />
              </div>
              <span
                className={`text-[11px] leading-[13px] mt-[2px] tracking-tight transition-colors ${
                  isHomeActive ? 'font-bold text-[#ff5500]' : 'font-medium text-neutral-500'
                }`}
              >
                {labels.home}
              </span>
            </button>

            {/* Tab 2: Все Меню */}
            <button
              type="button"
              role="tab"
              aria-selected={isMenuActive}
              onClick={() => handleTabClick('menu')}
              className={`w-[78px] h-[50px] pt-[2px] pb-0 px-0 flex flex-col items-center justify-center transition-all cursor-pointer select-none group ${
                isMenuActive ? 'text-[#ff5500]' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <div className="relative flex items-center justify-center w-6 h-6">
                <UtensilsCrossed
                  className={`w-5 h-5 transition-transform group-active:scale-90 ${
                    isMenuActive ? 'stroke-[2.5]' : 'stroke-[2]'
                  }`}
                />
              </div>
              <span
                className={`text-[11px] leading-[13px] mt-[2px] tracking-tight transition-colors whitespace-nowrap ${
                  isMenuActive ? 'font-bold text-[#ff5500]' : 'font-medium text-neutral-500'
                }`}
              >
                {labels.menu}
              </span>
            </button>

            {/* Tab 3: Корзина */}
            <button
              type="button"
              role="tab"
              aria-selected={isCartActive}
              onClick={() => handleTabClick('cart')}
              className={`w-[78px] h-[50px] pt-[2px] pb-0 px-0 flex flex-col items-center justify-center transition-all cursor-pointer select-none group ${
                isCartActive ? 'text-[#ff5500]' : 'text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <div className="relative flex items-center justify-center w-6 h-6">
                <div
                  key={`bottom-nav-cart-${cartBounceKey}`}
                  className={isCartBouncing ? 'animate-mario-jump' : ''}
                >
                  <ShoppingCart
                    className={`w-5 h-5 transition-transform group-active:scale-90 ${
                      isCartActive ? 'stroke-[2.5]' : 'stroke-[2]'
                    }`}
                  />
                </div>
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-2.5 bg-[#ff5500] text-white text-[10px] font-black min-w-[16px] h-[16px] rounded-full flex items-center justify-center px-1 shadow-sm leading-none animate-fadeIn">
                    {itemsCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] leading-[13px] mt-[2px] tracking-tight transition-colors ${
                  isCartActive ? 'font-bold text-[#ff5500]' : 'font-medium text-neutral-500'
                }`}
              >
                {labels.cart}
              </span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};
