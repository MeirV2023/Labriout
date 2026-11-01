import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Sparkles, MessageSquare } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SelectedExtra, ExtraOption } from '../types';

export const ProductModal: React.FC = () => {
  const {
    productModalItem,
    setProductModalItem,
    editingCartItemId,
    setEditingCartItemId,
    items,
    addToCart,
    updateCartItemExtras,
    language,
    t,
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);
  const [specialNotes, setSpecialNotes] = useState('');

  // When opening modal, check if editing an existing cart item
  useEffect(() => {
    if (editingCartItemId) {
      const existing = items.find(i => i.cartItemId === editingCartItemId);
      if (existing) {
        setQuantity(existing.quantity);
        setSelectedExtras(existing.selectedExtras);
        setSpecialNotes(existing.specialNotes || '');
        return;
      }
    }
    // Default fresh
    setQuantity(1);
    setSelectedExtras([]);
    setSpecialNotes('');
  }, [editingCartItemId, productModalItem, items]);

  if (!productModalItem) return null;

  const handleClose = () => {
    setProductModalItem(null);
    setEditingCartItemId(null);
  };

  const toggleExtra = (extra: ExtraOption) => {
    setSelectedExtras(prev => {
      const exists = prev.some(e => e.id === extra.id);
      if (exists) {
        return prev.filter(e => e.id !== extra.id);
      } else {
        const extraName = language === 'en' ? extra.nameEn : language === 'ru' ? extra.nameRu : extra.name;
        return [...prev, { id: extra.id, name: extraName, price: extra.price }];
      }
    });
  };

  const extrasTotal = selectedExtras.reduce((acc, curr) => acc + curr.price, 0);
  const unitPrice = productModalItem.price + extrasTotal;
  const totalPrice = unitPrice * quantity;

  const handleSubmit = () => {
    if (editingCartItemId) {
      updateCartItemExtras(editingCartItemId, selectedExtras, specialNotes);
    } else {
      addToCart(productModalItem, quantity, selectedExtras, specialNotes);
    }
    handleClose();
  };

  const localizedName =
    language === 'en'
      ? productModalItem.nameEn || productModalItem.name
      : language === 'de'
      ? productModalItem.nameDe || productModalItem.nameEn || productModalItem.name
      : language === 'fr'
      ? productModalItem.nameFr || productModalItem.nameEn || productModalItem.name
      : language === 'ru'
      ? productModalItem.nameRu || productModalItem.name
      : productModalItem.name;

  const productDescription =
    language === 'en'
      ? productModalItem.descriptionEn || productModalItem.description
      : language === 'de'
      ? productModalItem.descriptionDe || productModalItem.descriptionEn || productModalItem.description
      : language === 'fr'
      ? productModalItem.descriptionFr || productModalItem.descriptionEn || productModalItem.description
      : language === 'ru'
      ? productModalItem.descriptionRu || productModalItem.description
      : productModalItem.description;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="metallic-border rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
        {/* Header with image */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-neutral-900 shrink-0">
          <img
            src={productModalItem.image}
            alt={productModalItem.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14161d] via-transparent to-black/40" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition cursor-pointer"
            aria-label="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badge */}
          {productModalItem.badge && (
            <span className="absolute top-3 left-3 bg-[#ff5500] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider shadow-md">
              {productModalItem.badge}
            </span>
          )}

          {/* Title overlay */}
          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="text-xl sm:text-2xl font-black text-white">{localizedName}</h3>
            <p className="text-xs text-neutral-300 line-clamp-2 mt-0.5">{productDescription}</p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Extras Section */}
          {productModalItem.availableExtras && productModalItem.availableExtras.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
                  <span>{t('addExtra')} (Opzionale)</span>
                </h4>
                <span className="text-[11px] text-neutral-500">Puoi selezionarne più di uno</span>
              </div>

              <div className="space-y-2">
                {productModalItem.availableExtras.map(extra => {
                  const isSelected = selectedExtras.some(e => e.id === extra.id);
                  const extraLabel =
                    language === 'en'
                      ? extra.nameEn || extra.name
                      : language === 'de'
                      ? extra.nameDe || extra.nameEn || extra.name
                      : language === 'fr'
                      ? extra.nameFr || extra.nameEn || extra.name
                      : language === 'ru'
                      ? extra.nameRu || extra.name
                      : extra.name;

                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-xs sm:text-sm font-medium transition text-left cursor-pointer ${
                        isSelected
                          ? 'bg-[#ff5500]/15 border-[#ff5500] text-white'
                          : 'bg-[#1a1d26] border-[#252936] text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div
                        style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
                        className={`w-[32px] h-[32px] rounded-[10px] flex items-center justify-center border transition shrink-0 ${
                          isSelected ? 'bg-[#ff5500] border-[#ff5500] text-white' : 'border-neutral-600'
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[16px]">{extraLabel}</span>
                        <span className="text-[16px] font-light text-[#908F8F]">+{((Number(extra.price) || 0)).toFixed(2)} €</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div>
            <label className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>{t('specialNotes')}</span>
            </label>
            <textarea
              rows={2}
              value={specialNotes}
              onChange={e => setSpecialNotes(e.target.value)}
              placeholder={t('notesPlaceholder')}
              className="w-full bg-[#1a1d26] border border-[#282d3b] rounded-xl p-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff5500] transition"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0f1116] border-t border-[#232734] flex items-center justify-between gap-3 shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-[#191c25] border border-[#2b3140] rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#252936] disabled:opacity-40 text-neutral-300 transition cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#252936] text-neutral-300 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Submit CTA */}
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff6a00] hover:from-[#e04a00] hover:to-[#ff5500] text-white font-extrabold text-sm flex items-center justify-between shadow-lg shadow-[#ff5500]/25 transition active:scale-98 cursor-pointer"
          >
            <span>{editingCartItemId ? 'Aggiorna Modifiche' : t('addToCart')}</span>
            <span className="text-white/95">€{(Number(totalPrice) || 0).toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
