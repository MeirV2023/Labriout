import React from 'react';
import { Plus, Minus, Flame } from 'lucide-react';
import { ProductItem } from '../types';
import { useCart } from '../context/CartContext';
import { getLocalizedProductName, getBadgeLabel } from '../utils/menuTranslations';

interface ProductCardProps {
  product: ProductItem;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    openProductDetail,
    addToCart,
    updateQuantity,
    removeItem,
    items,
    language,
    currency,
    formatMoney,
    isItemSoftDeleted,
    t,
  } = useCart();

  const cartItemsForProduct = items.filter(
    (item) => (item.product?.id === product.id || item.productId === product.id) && !isItemSoftDeleted(item.cartItemId)
  );
  const quantityInCart = cartItemsForProduct.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );

  const localizedName = getLocalizedProductName(product, language);
  const localizedBadge = getBadgeLabel(product.badge, language);

  // Weight / Volume display localized by selected language (matches name & weight)
  const getLocalizedWeight = () => {
    const isDrink = product.category === 'bevande';
    if (isDrink) {
      const nameToCheck = `${product.name} ${product.nameEn || ''} ${product.weight || ''}`;

      // Check for Liters (e.g. "1.5 L", "1.5L", "1,5 L", "1.5 Litri")
      const literMatch = nameToCheck.match(/(\d+(?:[.,]\d+)?)\s*(?:l|lt|litr[io]?)\b/i);
      if (literMatch) {
        const val = literMatch[1].replace(',', '.');
        return language === 'ru' ? `${val} л` : `${val} L`;
      }

      // Check for cl (e.g. "66 cl", "50 cl", "33 cl", "65 cl", "75 cl")
      const clMatch = nameToCheck.match(/(\d+)\s*(?:cl|сл)\b/i);
      if (clMatch) {
        return language === 'ru' ? `${clMatch[1]} сл` : `${clMatch[1]} cl`;
      }

      // Check for ml (e.g. "500 ml", "330 ml")
      const mlMatch = nameToCheck.match(/(\d+)\s*(?:ml|мл)\b/i);
      if (mlMatch) {
        return language === 'ru' ? `${mlMatch[1]} мл` : `${mlMatch[1]} ml`;
      }

      // Wine fallback
      if (product.name.toLowerCase().includes('vino') || product.id.includes('vino')) {
        return language === 'ru' ? '75 сл' : '75 cl';
      }

      if (product.weight) {
        return language === 'ru'
          ? product.weight.replace(/\bcl\b/i, 'сл').replace(/\bml\b/i, 'мл').replace(/\bl\b/i, 'л')
          : product.weight.replace(/\bсл\b/i, 'cl').replace(/\bмл\b/i, 'ml').replace(/\bл\b/i, 'L');
      }

      return language === 'ru' ? '33 сл' : '33 cl';
    }

    const defaultGrams = product.category === 'panini' || product.category === 'panini_special' ? 265 : 200;
    const baseWeight = product.weight || `${defaultGrams} g`;

    if (language === 'ru') {
      return baseWeight.replace(/\s*g\b/i, ' г').replace(/\s*gr\b/i, ' г');
    } else {
      return baseWeight.replace(/\s*г\b/i, ' g').replace(/\s*gr\b/i, ' g');
    }
  };

  const displayWeight = getLocalizedWeight();

  const handleCardClick = () => {
    openProductDetail(product, undefined, undefined, 'home');
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItemsForProduct.length > 0) {
      const plainItems = cartItemsForProduct.filter(
        (i) => !i.selectedExtras || i.selectedExtras.length === 0
      );
      const targetItem =
        plainItems.length > 0
          ? plainItems[plainItems.length - 1]
          : cartItemsForProduct[cartItemsForProduct.length - 1];
      updateQuantity(targetItem.cartItemId, -1);
    }
  };

  // Helper for 300x300 intrinsic preview image
  const getPreviewImageUrl = (src: string) => {
    if (!src) return src;
    if (src.includes('images.unsplash.com')) {
      let url = src.replace(/w=\d+/, 'w=300');
      if (url.includes('h=')) {
        url = url.replace(/h=\d+/, 'h=300');
      } else {
        url += '&h=300';
      }
      if (!url.includes('fit=')) {
        url += '&fit=crop';
      }
      return url;
    }
    return src;
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col cursor-pointer select-none w-full max-w-[173.2px] sm:max-w-[232.4px] sm:w-[232.4px] shrink-0"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Container (Mobile exact 173.2x173.2px, Desktop exact 232.4x232.4px) */}
      <div className="relative w-full aspect-square max-w-[173.2px] max-h-[173.2px] sm:max-w-[232.4px] sm:max-h-[232.4px] sm:w-[232.4px] sm:h-[232.4px] sm:min-w-[232.4px] sm:min-h-[232.4px] rounded-[18px] sm:rounded-3xl overflow-hidden bg-neutral-100 border border-gray-100 sm:border-0 sm:ring-1 sm:ring-black/[0.06] shadow-xs transition-transform duration-300 group-hover:-translate-y-1 shrink-0">
        <img
          src={getPreviewImageUrl(product.image)}
          alt={localizedName}
          width={300}
          height={300}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover aspect-square sm:w-[232.4px] sm:h-[232.4px] sm:min-w-[232.4px] sm:min-h-[232.4px] sm:max-w-[232.4px] sm:max-h-[232.4px] block"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 sm:top-2.5 sm:left-2.5 sm:right-2.5 flex items-start justify-between pointer-events-none z-10">
          <div className="flex flex-col items-start gap-1">
            {product.badge === 'PIÙ AMATO' ? (
              <span className="bg-[#00875A] text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider shadow-md flex items-center gap-0.5">
                <span>{localizedBadge}</span>
                <span>👑</span>
              </span>
            ) : localizedBadge ? (
              <span className="bg-[#ff5500] text-white text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider shadow-md">
                {localizedBadge}
              </span>
            ) : null}
          </div>

          {product.isSpicy && (
            <span className="bg-red-600/90 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow">
              <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </span>
          )}
        </div>

        {/* Floating Add / Stepper Button at bottom right of image (Mobile exact 40x40px, Desktop unchanged) */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 z-20"
        >
          <div
            className={`h-10 sm:h-10 rounded-full shadow-md transition-all duration-300 ease-out select-none flex items-center ${
              quantityInCart > 0
                ? 'w-[94px] sm:w-[112px] px-1 justify-between bg-gradient-to-r from-[#ff5500] to-[#ff4400] text-white shadow-[#ff5500]/30 ring-2 ring-black/20'
                : 'w-10 h-10 sm:w-10 sm:h-10 justify-center bg-white text-neutral-900 border border-gray-200/80 hover:bg-[#ff5500] hover:text-white hover:border-[#ff5500] shadow-md hover:scale-105 active:scale-90 cursor-pointer transition-colors'
            }`}
          >
            {quantityInCart > 0 ? (
              <>
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-black/20 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                  aria-label="-"
                >
                  <Minus className="w-3.5 sm:w-3.5 h-3.5 sm:h-3.5 stroke-[2.5]" />
                </button>

                <span className="text-xs sm:text-sm font-black text-white select-none min-w-[16px] sm:min-w-[18px] text-center shrink-0">
                  {quantityInCart}
                </span>

                <button
                  type="button"
                  onClick={handleIncrease}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-black/20 active:scale-90 text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                  aria-label="+"
                >
                  <Plus className="w-3.5 sm:w-3.5 h-3.5 sm:h-3.5 stroke-[2.5]" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleIncrease}
                className="w-full h-full rounded-full flex items-center justify-center cursor-pointer"
                title={t('addToCart')}
                aria-label={`${t('addToCart')} — ${localizedName}`}
              >
                <Plus className="w-5 h-5 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Info below image (Price -> Title -> Weight, matching Screenshot 2) */}
      <div className="pt-2 sm:pt-2.5 px-0.5 flex flex-col min-h-[58px] sm:min-h-[66px]">
        {/* Price */}
        <div className="font-black text-[15px] sm:text-lg text-neutral-900 tracking-tight leading-none">
          {currency === 'USD'
            ? formatMoney(product.price)
            : `€ ${(Number(product.price) || 0).toFixed(2).replace('.', ',')}`}
        </div>

        {/* Title */}
        <h3 className="mt-1 font-bold text-[13px] sm:text-sm text-neutral-800 group-hover:text-[#ff5500] transition-colors line-clamp-2 leading-snug">
          <span>{localizedName}</span>
        </h3>

        {/* Weight / Grams (Screenshot 2: 360 г) */}
        <div className="mt-0.5 text-[11px] sm:text-xs text-neutral-400 font-normal">
          {displayWeight}
        </div>
      </div>
    </div>
  );
};
