import React from 'react';
import { Plus, Minus, Trash2, Bike, CheckCircle2, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getAvailableExtrasForProduct } from '../data/menuData';
import { getLocalizedProductName, getLocalizedExtraName } from '../utils/menuTranslations';

interface SidebarCartProps {
  onOpenCheckout?: () => void;
}

export const SidebarCart: React.FC<SidebarCartProps> = ({ onOpenCheckout }) => {
  const cartRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const {
    items,
    itemsCount,
    subtotal,
    total,
    updateQuantity,
    removeItem,
    softDeleteItem,
    restoreItem,
    isItemSoftDeleted,
    clearCart,
    openProductDetail,
    setCurrentView,
    setIsCartDrawerOpen,
    language,
    fulfillmentType,
    setFulfillmentType,
  } = useCart();

  // Allow normal page scrolling when mouse wheel is over the cart and cart has no scrollable overflow
  React.useEffect(() => {
    const cartEl = cartRef.current;
    if (!cartEl) return;

    const handleWheel = (e: WheelEvent) => {
      const listEl = listRef.current;
      // If there is no list or cart is empty, let the page scroll naturally
      if (!listEl) return;

      const { scrollTop, scrollHeight, clientHeight } = listEl;
      const isScrollable = scrollHeight > clientHeight + 2;

      // If there is no scrollbar in the cart, let page scroll freely
      if (!isScrollable) return;

      const deltaY = e.deltaY;
      const isAtTop = scrollTop <= 0 && deltaY < 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 2 && deltaY > 0;

      // If mouse is inside the scrollable list
      if (listEl.contains(e.target as Node)) {
        // Only block page scroll chaining if the list can still scroll in this direction
        if (!isAtTop && !isAtBottom) {
          // Native scrolling handles this smoothly
          e.stopPropagation();
        }
        return;
      }

      // If mouse is on cart header/padding and list can scroll in this direction:
      if (!isAtTop && !isAtBottom) {
        listEl.scrollTop += deltaY;
        e.preventDefault();
      }
    };

    cartEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      cartEl.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const FREE_DELIVERY_THRESHOLD = 25;
  const safeSubtotal = Number(subtotal || 0);
  const safeTotal = Number(total || 0);
  const isFreeDelivery = safeSubtotal >= FREE_DELIVERY_THRESHOLD;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - safeSubtotal);
  const safeAmountToFreeDelivery = Number(amountToFreeDelivery || 0);
  const deliveryProgress = Math.min(100, Math.round((safeSubtotal / FREE_DELIVERY_THRESHOLD) * 100));

  const handleCheckoutClick = () => {
    setIsCartDrawerOpen(false);
    if (onOpenCheckout) {
      onOpenCheckout();
    } else {
      setCurrentView('cart');
    }
  };

  // Translations localized
  const labels = {
    it: {
      title: 'Carrello',
      clear: 'Svuota',
      delivery: 'Consegna',
      pickup: 'Asporto',
      pickupPrefix: 'Ritiro in sede:',
      pickupAddress: '64 av. Simone Veil, Bonneuil-sur-Marne',
      emptyTitle: 'Vuoto, come il frigo di notte',
      emptySub: 'Ma non per molto — aggiungi qualcosa di delizioso!',
      freeDeliveryBadge: 'Consegna gratuita',
      freeDeliverySub: 'Ordine qualificato per spedizione gratis',
      freeDeliveryNeed: `Mancano €${safeAmountToFreeDelivery.toFixed(2)} per la consegna gratis`,
      freeDeliveryBase: 'Consegna gratis da €25',
      proceed: 'Avanti',
      currency: '€',
      each: 'cad.',
      undo: 'Ripristina',
      unitPiece: '1 pz.',
      removeTitle: 'Rimuovi dal carrello',
      decTitle: 'Diminuisci',
      incTitle: 'Aumenta',
      decAria: 'Diminuisci quantità',
      incAria: 'Aumenta quantità',
    },
    ru: {
      title: 'Корзина',
      clear: 'Очистить',
      delivery: 'Доставка',
      pickup: 'Самовывоз',
      pickupPrefix: 'Самовывоз:',
      pickupAddress: '64 av. Simone Veil, Bonneuil-sur-Marne',
      emptyTitle: 'Пусто, как ночью в холодильнике',
      emptySub: 'Но это ненадолго — добавьте что-нибудь вкусное',
      freeDeliveryBadge: 'Бесплатная доставка',
      freeDeliverySub: 'Бесплатная доставка активирована',
      freeDeliveryNeed: `Ещё €${safeAmountToFreeDelivery.toFixed(2)} до бесплатной доставки`,
      freeDeliveryBase: 'Бесплатная доставка от €25',
      proceed: 'Далее',
      currency: '€',
      each: 'шт.',
      undo: 'Вернуть',
      unitPiece: '1 шт.',
      removeTitle: 'Удалить из корзины',
      decTitle: 'Уменьшить',
      incTitle: 'Увеличить',
      decAria: 'Уменьшить количество',
      incAria: 'Увеличить количество',
    },
    en: {
      title: 'Cart',
      clear: 'Clear',
      delivery: 'Delivery',
      pickup: 'Pickup',
      pickupPrefix: 'Pickup at:',
      pickupAddress: '64 av. Simone Veil, Bonneuil-sur-Marne',
      emptyTitle: 'Empty, like the fridge at night',
      emptySub: 'Not for long — add something delicious!',
      freeDeliveryBadge: 'Free Delivery',
      freeDeliverySub: 'Order qualifies for free delivery',
      freeDeliveryNeed: `Add €${safeAmountToFreeDelivery.toFixed(2)} for free delivery`,
      freeDeliveryBase: 'Free delivery from €25',
      proceed: 'Checkout',
      currency: '€',
      each: 'each',
      undo: 'Undo',
      unitPiece: '1 pc.',
      removeTitle: 'Remove from cart',
      decTitle: 'Decrease',
      incTitle: 'Increase',
      decAria: 'Decrease quantity',
      incAria: 'Increase quantity',
    },
    de: {
      title: 'Warenkorb',
      clear: 'Leeren',
      delivery: 'Lieferung',
      pickup: 'Abholung',
      pickupPrefix: 'Abholung in:',
      pickupAddress: '64 av. Simone Veil, Bonneuil-sur-Marne',
      emptyTitle: 'Leer wie der Kühlschrank nachts',
      emptySub: 'Fügen Sie etwas Leckeres hinzu!',
      freeDeliveryBadge: 'Kostenlose Lieferung',
      freeDeliverySub: 'Qualifiziert für Gratis-Lieferung',
      freeDeliveryNeed: `Noch €${safeAmountToFreeDelivery.toFixed(2)} für Gratis-Lieferung`,
      freeDeliveryBase: 'Gratis-Lieferung ab €25',
      proceed: 'Weiter',
      currency: '€',
      each: 'Stk.',
      undo: 'Wiederherstellen',
      unitPiece: '1 Stk.',
      removeTitle: 'Aus dem Warenkorb entfernen',
      decTitle: 'Verringern',
      incTitle: 'Erhöhen',
      decAria: 'Menge verringern',
      incAria: 'Menge erhöhen',
    },
    fr: {
      title: 'Panier',
      clear: 'Vider',
      delivery: 'Livraison',
      pickup: 'À emporter',
      pickupPrefix: 'Retrait sur place :',
      pickupAddress: '64 av. Simone Veil, Bonneuil-sur-Marne',
      emptyTitle: 'Vide, comme le frigo la nuit',
      emptySub: 'Ajoutez quelque chose de délicieux !',
      freeDeliveryBadge: 'Livraison gratuite',
      freeDeliverySub: 'Qualifié pour la livraison gratuite',
      freeDeliveryNeed: `Encore €${safeAmountToFreeDelivery.toFixed(2)} pour la livraison gratuite`,
      freeDeliveryBase: 'Livraison gratuite dès €25',
      proceed: 'Commander',
      currency: '€',
      each: 'unité',
      undo: 'Restaurer',
      unitPiece: '1 pce',
      removeTitle: 'Retirer du panier',
      decTitle: 'Diminuer',
      incTitle: 'Augmenter',
      decAria: 'Diminuer la quantité',
      incAria: 'Augmenter la quantité',
    },
  }[language];

  return (
    <div
      ref={cartRef}
      className="bg-white border border-gray-100 rounded-[28px] p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.06)] relative overflow-hidden flex flex-col transition-all max-h-[calc(100vh-var(--navbar-height,70px)-32px)]"
    >
      {/* HEADER: Title ("Корзина" / "Carrello") & Clear Button ("Очистить" / "Svuota") */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-black text-xl text-neutral-900 tracking-tight">
            {labels.title}
          </h3>
          {itemsCount > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-50 text-[#ff5500] border border-orange-100">
              {itemsCount}
            </span>
          )}
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              clearCart();
            }}
            className="text-xs text-neutral-400 hover:text-red-500 transition-colors font-medium cursor-pointer"
            title={labels.clear}
          >
            {labels.clear}
          </button>
        )}
      </div>

      {/* PICKUP / DELIVERY SWITCHER (Segmented control) */}
      <div className="mb-3 bg-[#f0f0f2] p-1 rounded-2xl grid grid-cols-2 gap-1 select-none shrink-0">
        <button
          type="button"
          onClick={() => setFulfillmentType('asporto')}
          className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
            fulfillmentType === 'asporto'
              ? 'bg-white text-[#21201f] shadow-xs'
              : 'bg-transparent text-[#737373] hover:text-neutral-900'
          }`}
          style={{ fontFamily: 'YSText, sans-serif' }}
        >
          {labels.pickup}
        </button>
        <button
          type="button"
          onClick={() => setFulfillmentType('consegna')}
          className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
            fulfillmentType === 'consegna'
              ? 'bg-white text-[#21201f] shadow-xs'
              : 'bg-transparent text-[#737373] hover:text-neutral-900'
          }`}
          style={{ fontFamily: 'YSText, sans-serif' }}
        >
          {labels.delivery}
        </button>
      </div>

      {/* BODY: EMPTY STATE OR POPULATED LIST */}
      {items.length === 0 ? (
        <div className="py-8 px-2 flex flex-col items-center text-center">
          {/* Cute Street Food Character */}
          <div className="w-28 h-28 mb-4 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-[#ff5500]/10 rounded-full blur-xl pointer-events-none" />
            <svg
              className="w-full h-full drop-shadow-md"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 70C22 36 50 18 85 24C102 27 108 38 106 52C103 70 82 96 46 94C30 93 20 84 20 70Z"
                fill="url(#panzarottoGrad)"
                stroke="#d97706"
                strokeWidth="2.5"
              />
              <path
                d="M23 72C28 78 38 88 56 89C76 90 95 76 102 54"
                stroke="#b45309"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />
              <circle cx="55" cy="46" r="4.5" fill="#18181b" />
              <circle cx="53.5" cy="44.5" r="1.5" fill="#ffffff" />
              <circle cx="75" cy="49" r="4.5" fill="#18181b" />
              <circle cx="73.5" cy="47.5" r="1.5" fill="#ffffff" />
              <path
                d="M60 58C64 63 70 63 73 59"
                stroke="#18181b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="49" cy="53" r="3" fill="#ff4d4d" opacity="0.6" />
              <circle cx="81" cy="56" r="3" fill="#ff4d4d" opacity="0.6" />
              <defs>
                <linearGradient id="panzarottoGrad" x1="20" y1="20" x2="100" y2="90" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f59e0b" />
                  <stop offset="0.5" stopColor="#fbbf24" />
                  <stop offset="1" stopColor="#ea580c" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h4 className="font-heading font-black text-lg text-neutral-900 mb-2 leading-snug">
            {labels.emptyTitle}
          </h4>

          <p className="text-xs text-neutral-500 max-w-[220px] leading-relaxed mb-6">
            {labels.emptySub}
          </p>

          <div className="w-full pt-4 border-t border-gray-100">
            {fulfillmentType === 'consegna' ? (
              <>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-2">
                  <span className="flex items-center gap-1.5 text-neutral-700 font-medium">
                    <Bike className="w-3.5 h-3.5 text-[#ff5500]" />
                    {labels.freeDeliveryBase}
                  </span>
                  <span className="text-[#ff5500] font-bold">€0.00</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-[#ff5500] rounded-full" />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-600 bg-[#f8f9fa] py-2 px-3 rounded-xl border border-gray-200/80">
                <MapPin className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
                <span className="truncate">
                  <span className="text-neutral-500 font-normal">{labels.pickupPrefix} </span>
                  <strong className="text-neutral-900 font-semibold">{labels.pickupAddress}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Items Scrollable List: flexibly consumes available space and scrolls internally */}
          <div
            ref={listRef}
            style={{ overscrollBehavior: 'contain' }}
            className="flex-1 min-h-0 overflow-y-auto pr-2.5 mb-2 cart-scrollbar overscroll-contain flex flex-col gap-3.5"
          >
            {items.map((item, index) => {
              const productName = getLocalizedProductName(item.product, language);

              const availExtras = getAvailableExtrasForProduct(item.product);
              const extrasText = item.selectedExtras
                .map((e) => {
                  const found = availExtras.find((opt) => opt.id === e.id);
                  return getLocalizedExtraName(found || e, language);
                })
                .join(', ');
              const subtitle = extrasText || item.product.weight || item.product.ingredients || '';

              const itemUnitPrice = Number(item.totalUnitPrice ?? item.product?.price ?? 0);
              const itemQty = Number(item.quantity ?? 1);
              const itemTotalPrice = (isNaN(itemUnitPrice) ? 0 : itemUnitPrice) * (isNaN(itemQty) ? 1 : itemQty);
              const isSoftDeleted = isItemSoftDeleted(item.cartItemId);
              const undoText = labels.undo;

              return (
                <div
                  key={item.cartItemId}
                  className="relative flex items-center gap-3 transition-colors py-0 shrink-0"
                >
                  {/* Square Product Image (69x69px preview) - clickable without hover border/zoom */}
                  <div
                    onClick={() => {
                      if (!isSoftDeleted) {
                        openProductDetail(item.product, item.quantity, item.cartItemId);
                      }
                    }}
                    className={`relative w-[69px] h-[69px] rounded-xl overflow-hidden border shrink-0 transition-all ${
                      isSoftDeleted
                        ? 'bg-neutral-100/90 border-gray-200/50 cursor-default'
                        : 'bg-neutral-100 border-gray-200/80 cursor-pointer shadow-2xs'
                    }`}
                    title={productName}
                  >
                    <img
                      src={item.product?.image || ''}
                      alt={productName}
                      width={69}
                      height={69}
                      className={`w-[69px] h-[69px] object-cover aspect-square transition-all duration-300 ${
                        isSoftDeleted
                          ? 'opacity-30 grayscale-[35%] contrast-[85%] brightness-[105%]'
                          : 'opacity-100'
                      }`}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {isSoftDeleted && (
                      <div className="absolute inset-0 bg-white/40 pointer-events-none rounded-xl" />
                    )}
                  </div>

                  {/* Title & Details */}
                  <div
                    onClick={() => {
                      if (!isSoftDeleted) {
                        openProductDetail(item.product, item.quantity, item.cartItemId);
                      }
                    }}
                    className={`flex-1 min-w-0 ${isSoftDeleted ? 'cursor-default' : 'cursor-pointer group/title'}`}
                    title={productName}
                  >
                    <h5
                      className={`text-[13px] leading-[1.25] transition-colors line-clamp-2 ${
                        isSoftDeleted
                          ? 'font-semibold text-neutral-400'
                          : 'font-normal text-[#21201F] group-hover/title:text-[#ff5500]'
                      }`}
                    >
                      {productName}
                    </h5>

                    {isSoftDeleted ? (
                      <p className="text-[10px] sm:text-[11px] text-neutral-400 line-clamp-1 leading-tight mt-0.5">
                        {item.product?.weight || labels.unitPiece}
                      </p>
                    ) : (
                      <>
                        {subtitle && (
                          <p className="text-[10px] sm:text-[11px] text-neutral-500 line-clamp-1 leading-tight mt-0.5">
                            {subtitle}
                          </p>
                        )}

                        <div className="text-xs font-black text-neutral-900 mt-1">
                          €{(itemTotalPrice || 0).toFixed(2)}
                          {itemQty > 1 && (
                            <span className="text-[10px] text-neutral-400 font-normal ml-1">
                              (€{(itemUnitPrice || 0).toFixed(2)} {labels.each})
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Stepper OR [ Вернуть ] Button */}
                  {isSoftDeleted ? (
                    <button
                      type="button"
                      onClick={() => restoreItem(item.cartItemId)}
                      className="shrink-0 bg-[#e7e8ec] hover:bg-[#dbdce1] active:scale-95 text-[#21201F] text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs select-none"
                    >
                      {undoText}
                    </button>
                  ) : (
                    <div className="flex items-center bg-white rounded-full border border-gray-200 p-1 gap-1 shrink-0 shadow-xs">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (item.quantity <= 1) {
                            softDeleteItem(item.cartItemId);
                          } else {
                            updateQuantity(item.cartItemId, -1);
                          }
                        }}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-neutral-700 flex items-center justify-center transition-all cursor-pointer active:scale-90"
                        aria-label={labels.decAria}
                        title={item.quantity === 1 ? labels.removeTitle : labels.decTitle}
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3.5 h-3.5 text-red-500 hover:text-red-600" />
                        ) : (
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                      </button>

                      <span className="text-xs font-bold text-neutral-900 min-w-[18px] text-center select-none">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          updateQuantity(item.cartItemId, 1);
                        }}
                        className="w-7 h-7 rounded-full bg-[#ff5500] hover:bg-[#ff6611] text-white flex items-center justify-center transition-all cursor-pointer active:scale-90 shadow-sm shadow-[#ff5500]/25"
                        aria-label={labels.incAria}
                        title={labels.incTitle}
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  )}

                  {/* Divider line starting from text column, strictly 1px height, color #D0CFCE */}
                  {index < items.length - 1 && (
                    <div
                      className="absolute left-[81px] right-0 pointer-events-none"
                      style={{
                        bottom: '-7px',
                        height: '0px',
                        borderBottom: '1px solid #D0CFCE',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Grey divider line */}
          <div className="-mx-4 sm:-mx-5 border-t border-[#D0CFCE] h-0 shrink-0 my-1" />

          {/* FULFILLMENT INFO: Delivery Progress Bar OR Pickup Address */}
          {fulfillmentType === 'consegna' ? (
            <div className="mt-2 mb-2.5 shrink-0">
              <div className="flex flex-col items-center text-center gap-1 mb-1.5">
                {isFreeDelivery ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{labels.freeDeliveryBadge}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#ff5500] text-xs font-bold">
                    <Bike className="w-3.5 h-3.5" />
                    <span>{labels.freeDeliveryNeed}</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isFreeDelivery
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-[#ff7722] to-[#ff5500]'
                  }`}
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="mt-2 mb-2.5 flex items-center justify-center shrink-0">
              <div className="w-full flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f8f9fa] border border-neutral-200/80 text-xs text-neutral-600 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
                <span className="truncate leading-tight">
                  <span className="text-neutral-500 font-normal">{labels.pickupPrefix} </span>
                  <strong className="text-neutral-900 font-semibold">{labels.pickupAddress}</strong>
                </span>
              </div>
            </div>
          )}

          {/* CHECKOUT BUTTON: Guaranteed shrink-0 and mt-auto so it is always fully visible on screen */}
          <button
            onClick={handleCheckoutClick}
            className="w-full py-3 sm:py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#ff5500] to-[#ff3300] hover:from-[#ff6611] hover:to-[#ff4400] text-white font-black text-sm tracking-wide shadow-lg shadow-[#ff5500]/25 transition-all transform active:scale-[0.98] flex items-center justify-between cursor-pointer shrink-0 mt-auto"
          >
            <span className="uppercase">{labels.proceed}</span>
            <span className="text-base font-black">€{(safeTotal || 0).toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
};
