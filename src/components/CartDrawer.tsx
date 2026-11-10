import React, { useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, Bike, CheckCircle2, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getAvailableExtrasForProduct } from '../data/menuData';
import { getLocalizedProductName, getLocalizedExtraName } from '../utils/menuTranslations';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeItem,
    softDeleteItem,
    restoreItem,
    isItemSoftDeleted,
    clearCart,
    total,
    itemsCount,
    openProductDetail,
    setCurrentView,
    fulfillmentType,
    setFulfillmentType,
    language,
    t,
  } = useCart();

  // Close drawer on "Escape" key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        setIsCartDrawerOpen(false);
      }
    };

    if (isCartDrawerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartDrawerOpen, setIsCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  const handleProceedCheckout = () => {
    setIsCartDrawerOpen(false);
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const FREE_DELIVERY_THRESHOLD = 25;
  const safeTotal = Number(total || 0);
  const isFreeDelivery = safeTotal >= FREE_DELIVERY_THRESHOLD;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - safeTotal);
  const deliveryProgress = Math.min(100, Math.round((safeTotal / FREE_DELIVERY_THRESHOLD) * 100));

  // Localized Labels
  const labels = {
    fr: {
      title: 'Panier',
      clear: 'Vider',
      delivery: 'Livraison',
      pickup: 'À emporter',
      pickupPrefix: 'Retrait :',
      pickupAddress: '64 av. Simone Veil, Bonneuil-sur-Marne',
      freeDeliveryNeed: `Encore €${amountToFreeDelivery.toFixed(2)} pour la livraison gratuite`,
      freeDeliveryUnlocked: 'Livraison gratuite activée !',
      checkout: 'COMMANDER',
      emptyTitle: 'Votre panier est vide',
      emptySub: 'Découvrez notre carte street food maison et ajoutez vos plats préférés !',
      browseMenu: 'Voir la carte',
      each: 'unité',
      undo: 'Restaurer',
      unitPiece: '1 pce',
      closeAria: 'Fermer le panier',
      closeTitle: 'Fermer (Échap)',
      removeAria: 'Retirer le produit',
      removeTitle: 'Retirer',
      decAria: 'Diminuer la quantité',
      incAria: 'Augmenter la quantité',
    },
    en: {
      title: 'Cart',
      clear: 'Clear',
      delivery: 'Delivery',
      pickup: 'Pickup',
      pickupPrefix: 'Pickup at:',
      pickupAddress: '64 av. Simone Veil, Bonneuil-sur-Marne',
      freeDeliveryNeed: `Add €${amountToFreeDelivery.toFixed(2)} for free delivery`,
      freeDeliveryUnlocked: 'Free delivery unlocked!',
      checkout: 'CHECKOUT',
      emptyTitle: 'Your cart is empty',
      emptySub: 'Explore our delicious street food menu and add your favorites!',
      browseMenu: 'Browse Menu',
      each: 'each',
      undo: 'Undo',
      unitPiece: '1 pc.',
      closeAria: 'Close cart',
      closeTitle: 'Close (Esc)',
      removeAria: 'Remove item',
      removeTitle: 'Remove',
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
      freeDeliveryNeed: `Noch €${amountToFreeDelivery.toFixed(2)} für Gratis-Lieferung`,
      freeDeliveryUnlocked: 'Kostenlose Lieferung aktiviert!',
      checkout: 'ZUR KASSE',
      emptyTitle: 'Ihr Warenkorb ist leer',
      emptySub: 'Entdecken Sie unsere Speisekarte und fügen Sie Ihre Favoriten hinzu!',
      browseMenu: 'Zur Speisekarte',
      each: 'Stk.',
      undo: 'Wiederherstellen',
      unitPiece: '1 Stk.',
      closeAria: 'Warenkorb schließen',
      closeTitle: 'Schließen (Esc)',
      removeAria: 'Artikel entfernen',
      removeTitle: 'Entfernen',
      decAria: 'Menge verringern',
      incAria: 'Menge erhöhen',
    },
    it: {
      title: 'Carrello',
      clear: 'Svuota',
      delivery: 'Consegna',
      pickup: 'Asporto',
      pickupPrefix: 'Ritiro presso:',
      pickupAddress: '64 av. Simone Veil, Bonneuil-sur-Marne',
      freeDeliveryNeed: `Mancano €${amountToFreeDelivery.toFixed(2)} per la consegna gratuita`,
      freeDeliveryUnlocked: 'Consegna gratuita sbloccata!',
      checkout: 'ORDINA ORA',
      emptyTitle: 'Il tuo carrello è vuoto',
      emptySub: 'Esplora il nostro menù e aggiungi le tue specialità preferite!',
      browseMenu: 'Esplora il Menù',
      each: 'cad.',
      undo: 'Ripristina',
      unitPiece: '1 pz.',
      closeAria: 'Chiudi carrello',
      closeTitle: 'Chiudi (Esc)',
      removeAria: 'Rimuovi prodotto',
      removeTitle: 'Rimuovi',
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
      freeDeliveryNeed: `Ещё €${amountToFreeDelivery.toFixed(2)} до бесплатной доставки`,
      freeDeliveryUnlocked: 'Бесплатная доставка активна!',
      checkout: 'ОФОРМИТЬ',
      emptyTitle: 'Ваша корзина пуста',
      emptySub: 'Выберите блюда из меню и добавьте их в заказ!',
      browseMenu: 'Открыть меню',
      each: 'шт.',
      undo: 'Вернуть',
      unitPiece: '1 шт.',
      closeAria: 'Закрыть корзину',
      closeTitle: 'Закрыть (Esc)',
      removeAria: 'Удалить блюдо',
      removeTitle: 'Удалить',
      decAria: 'Уменьшить количество',
      incAria: 'Увеличить количество',
    },
  }[language];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs animate-fadeIn">
      {/* Click outside to close */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setIsCartDrawerOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-4 sm:pl-6 pointer-events-none w-full sm:max-w-[420px]">
        <div className="pointer-events-auto w-full bg-white sm:rounded-l-[28px] border-l border-neutral-100 flex flex-col shadow-[0_12px_48px_rgba(0,0,0,0.18)] overflow-hidden">
          
          {/* Header matching Screenshot 2: "Cart (12)", "Clear", and close "X" */}
          <div className="px-5 sm:px-6 pt-5 pb-3.5 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight font-heading">
                {labels.title}
              </h2>
              {itemsCount > 0 && (
                <span className="text-xs font-bold text-[#ff5500] bg-orange-50 border border-orange-200/80 px-2 py-0.5 rounded-full">
                  {itemsCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="text-xs font-semibold text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                  title={labels.clear}
                >
                  {labels.clear}
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-1.5 sm:p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 transition cursor-pointer"
                aria-label={labels.closeAria}
                title={labels.closeTitle}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Pickup / Delivery Switcher */}
          <div className="px-5 sm:px-6 pb-2 shrink-0">
            <div className="bg-[#f2f2f2] p-1 rounded-2xl flex items-center">
              <button
                type="button"
                onClick={() => setFulfillmentType('asporto')}
                className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer text-center ${
                  fulfillmentType === 'asporto'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {labels.pickup}
              </button>
              <button
                type="button"
                onClick={() => setFulfillmentType('consegna')}
                className={`flex-1 py-2 px-3 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer text-center ${
                  fulfillmentType === 'consegna'
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {labels.delivery}
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#ff5500] mb-4 shadow-sm">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-1.5">{labels.emptyTitle}</h3>
              <p className="text-xs text-neutral-500 max-w-xs mb-6 leading-relaxed">
                {labels.emptySub}
              </p>
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#e04a00] text-white font-bold text-xs uppercase tracking-wider transition active:scale-95 cursor-pointer shadow-md shadow-[#ff5500]/20"
              >
                {labels.browseMenu}
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-2 divide-y divide-neutral-100 cart-scrollbar bg-white">
              {items.map(item => {
                const itemUnitPrice = Number(item.totalUnitPrice ?? item.product?.price ?? 0);
                const itemTotalPrice = itemUnitPrice * (Number(item.quantity) || 1);
                const isSoftDeleted = isItemSoftDeleted(item.cartItemId);

                return (
                  <div
                    key={item.cartItemId}
                    className="py-3.5 sm:py-4 flex items-center gap-3.5 group transition-all duration-200"
                  >
                    {/* Thumbnail Image */}
                    <div
                      onClick={() => {
                        if (!isSoftDeleted) {
                          setIsCartDrawerOpen(false);
                          openProductDetail(item.product, item.quantity, item.cartItemId);
                        }
                      }}
                      className={`relative w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-2xl overflow-hidden shrink-0 border transition-all ${
                        isSoftDeleted
                          ? 'border-neutral-200/50 bg-neutral-100 cursor-default'
                          : 'border-neutral-100 bg-neutral-100 cursor-pointer shadow-xs'
                      }`}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        width={56}
                        height={56}
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          isSoftDeleted
                            ? 'opacity-30 grayscale-[35%] contrast-[85%] brightness-[105%]'
                            : 'opacity-100'
                        }`}
                      />
                      {isSoftDeleted && (
                        <div className="absolute inset-0 bg-white/40 pointer-events-none rounded-2xl" />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 pr-1">
                      <h4
                        onClick={() => {
                          if (!isSoftDeleted) {
                            setIsCartDrawerOpen(false);
                            openProductDetail(item.product, item.quantity, item.cartItemId);
                          }
                        }}
                        className={`text-xs sm:text-sm leading-snug line-clamp-2 transition-colors ${
                          isSoftDeleted
                            ? 'font-semibold text-neutral-400 cursor-default'
                            : 'font-bold text-neutral-900 cursor-pointer hover:text-[#ff5500]'
                        }`}
                      >
                        {getLocalizedProductName(item.product, language)}
                      </h4>

                      {isSoftDeleted ? (
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          {item.product.weight || labels.unitPiece}
                        </div>
                      ) : (
                        <>
                          {/* Extras summary if any */}
                          {item.selectedExtras && item.selectedExtras.length > 0 && (
                            <div className="mt-0.5 flex flex-wrap gap-1">
                              {item.selectedExtras.map(extra => {
                                const avail = getAvailableExtrasForProduct(item.product);
                                const found = avail.find(opt => opt.id === extra.id);
                                const extraLabel = getLocalizedExtraName(found || extra, language);
                                return (
                                  <span
                                    key={extra.id}
                                    className="text-[10px] text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded leading-none"
                                  >
                                    +{extraLabel}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {/* Price Row: €2.00 (€1.00 cad.) */}
                          <div className="mt-1 flex items-baseline gap-1.5">
                            <span className="font-extrabold text-xs sm:text-sm text-neutral-900">
                              €{itemTotalPrice.toFixed(2)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[11px] text-neutral-400 font-medium">
                                (€{itemUnitPrice.toFixed(2)} {labels.each})
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
                        className="shrink-0 bg-[#e7e8ec] hover:bg-[#dbdce1] active:scale-95 text-[#21201F] text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs select-none"
                      >
                        {labels.undo}
                      </button>
                    ) : (
                      <div className="shrink-0 flex items-center gap-1.5 sm:gap-2 bg-neutral-50/80 border border-neutral-200/70 rounded-full px-1.5 sm:px-2 py-1">
                        {item.quantity === 1 ? (
                          <button
                            type="button"
                            onClick={() => removeItem(item.cartItemId)}
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 shadow-2xs transition cursor-pointer"
                            aria-label={labels.removeAria}
                            title={labels.removeTitle}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, -1)}
                            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white flex items-center justify-center text-neutral-600 hover:text-neutral-900 shadow-2xs transition cursor-pointer"
                            aria-label={labels.decAria}
                          >
                            <Minus className="w-3 h-3 stroke-[2.5]" />
                          </button>
                        )}

                        <span className="font-bold text-xs sm:text-sm text-neutral-900 min-w-4 text-center select-none">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#ff5500] hover:bg-[#e04a00] active:scale-95 text-white flex items-center justify-center font-bold shadow-2xs transition cursor-pointer"
                          aria-label={labels.incAria}
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Sticky Bottom Footer matching Screenshot 2: Free Delivery Pill + Progress Bar + Orange CHECKOUT Button with Price */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-neutral-100 space-y-3.5 shrink-0 shadow-lg">
              
              {/* Delivery Progress Bar (for Delivery) OR Pickup Address Pill (for Pickup, matching Screenshot 2) */}
              {fulfillmentType === 'consegna' ? (
                <div className="space-y-2">
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff5500] text-xs font-bold">
                      {isFreeDelivery ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">{labels.freeDeliveryUnlocked}</span>
                        </>
                      ) : (
                        <>
                          <Bike className="w-3.5 h-3.5" />
                          <span>{labels.freeDeliveryNeed}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden w-full">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFreeDelivery ? 'bg-emerald-500' : 'bg-[#ff5500]'
                      }`}
                      style={{ width: `${deliveryProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full bg-[#f8f9fa] border border-neutral-200/80 text-xs text-neutral-600 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
                  <span className="truncate">
                    <span className="text-neutral-500 font-normal">{labels.pickupPrefix} </span>
                    <strong className="text-neutral-900 font-semibold">{labels.pickupAddress}</strong>
                  </span>
                </div>
              )}

              {/* Big Checkout Pill Button (Left: CHECKOUT, Right: €15.50) */}
              <button
                type="button"
                onClick={handleProceedCheckout}
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-[#ff5500] hover:bg-[#e04a00] active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider flex items-center justify-between shadow-lg shadow-[#ff5500]/25 transition cursor-pointer"
              >
                <span className="font-heading tracking-wide">
                  {labels.checkout}
                </span>
                <span className="font-heading font-black text-base sm:text-lg">
                  €{safeTotal.toFixed(2)}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
