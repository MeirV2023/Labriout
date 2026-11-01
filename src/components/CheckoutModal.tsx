import React, { useState } from 'react';
import {
  X,
  MapPin,
  Phone,
  User,
  Clock,
  CreditCard,
  Banknote,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Building,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CustomerOrderInfo } from '../types';
import { STORE_DETAILS } from '../data/menuData';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    items,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    fulfillmentType,
    setFulfillmentType,
    selectedTimeSlot,
    setSelectedTimeSlot,
    submitOrder,
    t,
  } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Pompei');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'satispay' | 'apple_pay'>('cash');
  const [formError, setFormError] = useState('');

  if (!isCheckoutModalOpen) return null;

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
  };

  const validateForm = () => {
    if (!name.trim()) {
      setFormError('Inserisci il tuo nome e cognome');
      return false;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setFormError('Inserisci un numero di telefono valido per la conferma');
      return false;
    }
    if (fulfillmentType === 'consegna' && !address.trim()) {
      setFormError('Inserisci l’indirizzo di consegna a Pompei o dintorni');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const customerInfo: CustomerOrderInfo = {
      name,
      phone,
      fulfillmentType,
      deliveryAddress: fulfillmentType === 'consegna' ? address : undefined,
      deliveryCity: fulfillmentType === 'consegna' ? city : undefined,
      timeSlot: selectedTimeSlot,
      paymentMethod,
      notes,
    };

    submitOrder(customerInfo);
  };

  const handleWhatsAppOrder = () => {
    if (!validateForm()) return;

    // Construct formatted message
    let message = `*NUOVO ORDINE ONLINE - PANZAROTTO POMPEI*%0A`;
    message += `👤 *Cliente:* ${name}%0A`;
    message += `📞 *Telefono:* ${phone}%0A`;
    message += `🛵 *Modalità:* ${fulfillmentType === 'asporto' ? 'RITIRO IN SEDE (Asporto)' : 'CONSEGNA A DOMICILIO'}%0A`;
    if (fulfillmentType === 'consegna') {
      message += `📍 *Indirizzo:* ${address}, ${city}%0A`;
    }
    message += `⏰ *Orario:* ${selectedTimeSlot}%0A`;
    message += `💳 *Pagamento:* ${paymentMethod.toUpperCase()}%0A%0A`;
    message += `🛒 *DETTAGLIO ORDINE:*%0A`;

    items.forEach((item, idx) => {
      const itemTotal = (Number(item.totalUnitPrice ?? item.product?.price ?? 0)) * (Number(item.quantity) || 1);
      message += `${idx + 1}. *${item.quantity}x ${item.product.name}* (€${itemTotal.toFixed(2)})%0A`;
      if (item.selectedExtras.length > 0) {
        message += `   + Extras: ${item.selectedExtras.map(e => e.name).join(', ')}%0A`;
      }
      if (item.specialNotes) {
        message += `   Nota: ${item.specialNotes}%0A`;
      }
    });

    message += `%0A💰 *TOTALE: €${(Number(total) || 0).toFixed(2)}*%0A`;
    if (notes) {
      message += `📝 *Note:* ${notes}%0A`;
    }

    const customerInfo: CustomerOrderInfo = {
      name,
      phone,
      fulfillmentType,
      deliveryAddress: fulfillmentType === 'consegna' ? address : undefined,
      deliveryCity: fulfillmentType === 'consegna' ? city : undefined,
      timeSlot: selectedTimeSlot,
      paymentMethod,
      notes,
    };

    submitOrder(customerInfo);

    const whatsappUrl = `https://wa.me/${STORE_DETAILS.whatsappClean}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="bg-[#12141a] border border-[#262a36] rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#171a22] border-b border-[#242834] flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-heading font-black text-lg sm:text-xl text-white uppercase tracking-tight">
              {t('checkoutTitle')}
            </h3>
            <p className="text-xs text-neutral-400">
              {fulfillmentType === 'asporto' ? 'Ritiro presso Via Provinciale Ripuaria, 133 Pompei' : 'Consegna a domicilio rapida'}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-[#20232d] hover:bg-[#2c313f] text-neutral-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {formError && (
            <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-xs font-semibold">
              ⚠️ {formError}
            </div>
          )}

          {/* Fulfillment Switcher */}
          <div>
            <label className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 block mb-2">
              Modalità d&apos;ordine
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillmentType('asporto')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition cursor-pointer ${
                  fulfillmentType === 'asporto'
                    ? 'bg-[#ff5500]/15 border-[#ff5500] text-white'
                    : 'bg-[#181a22] border-[#252834] text-neutral-400 hover:border-neutral-600'
                }`}
              >
                <Building className="w-5 h-5 text-[#ff5500]" />
                <div className="text-left">
                  <p className="font-bold text-white leading-tight">Asporto (Ritiro)</p>
                  <p className="text-[11px] text-neutral-400">Gratis • ~15-20 min</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillmentType('consegna')}
                className={`p-3 rounded-xl border flex items-center gap-3 transition cursor-pointer ${
                  fulfillmentType === 'consegna'
                    ? 'bg-[#ff5500]/15 border-[#ff5500] text-white'
                    : 'bg-[#181a22] border-[#252834] text-neutral-400 hover:border-neutral-600'
                }`}
              >
                <MapPin className="w-5 h-5 text-[#ff5500]" />
                <div className="text-left">
                  <p className="font-bold text-white leading-tight">Consegna a domicilio</p>
                  <p className="text-[11px] text-neutral-400">Pompei & dintorni</p>
                </div>
              </button>
            </div>
          </div>

          {/* Customer info */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#ff5500]" />
              <span>{t('customerData')}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Mario Rossi"
                  className="w-full bg-[#181b24] border border-[#2a2f3d] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff5500]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                  {t('phoneNumber')} *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+39 340 123 4567"
                  className="w-full bg-[#181b24] border border-[#2a2f3d] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>

            {/* Delivery fields if Consegna */}
            {fulfillmentType === 'consegna' && (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      {t('deliveryAddressField')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Es. Via Plinio 45, int. 3 / Hotel Forum"
                      className="w-full bg-[#181b24] border border-[#2a2f3d] rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff5500]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      {t('cityField')}
                    </label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#181b24] border border-[#2a2f3d] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#ff5500]"
                    >
                      <option value="Pompei">Pompei (80045)</option>
                      <option value="Scafati">Scafati (84018)</option>
                      <option value="Torre Annunziata">Torre Annunziata</option>
                      <option value="Castellammare">Castellammare di Stabia</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2">
              <Clock className="w-4 h-4 text-[#ff5500]" />
              <span>{t('selectTimeSlot')}</span>
            </label>
            <select
              value={selectedTimeSlot}
              onChange={e => setSelectedTimeSlot(e.target.value)}
              className="w-full bg-[#181b24] border border-[#2a2f3d] rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-[#ff5500]"
            >
              <option value="Il prima possibile">
                Il prima possibile (~{fulfillmentType === 'asporto' ? 15 : 35} min)
              </option>
              <option value="19:30">Stasera alle 19:30</option>
              <option value="20:00">Stasera alle 20:00</option>
              <option value="20:30">Stasera alle 20:30</option>
              <option value="21:00">Stasera alle 21:00</option>
              <option value="21:30">Stasera alle 21:30</option>
              <option value="22:00">Stasera alle 22:00</option>
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs uppercase font-extrabold tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2.5">
              <CreditCard className="w-4 h-4 text-[#ff5500]" />
              <span>{t('paymentMethod')}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'bg-[#ff5500]/15 border-[#ff5500] text-white font-bold'
                    : 'bg-[#181a22] border-[#252834] text-neutral-400 hover:text-white'
                }`}
              >
                <Banknote className="w-5 h-5 mx-auto mb-1 text-[#ff5500]" />
                <span className="text-[11px] block leading-tight">Contanti alla consegna</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'bg-[#ff5500]/15 border-[#ff5500] text-white font-bold'
                    : 'bg-[#181a22] border-[#252834] text-neutral-400 hover:text-white'
                }`}
              >
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#ff5500]" />
                <span className="text-[11px] block leading-tight">Carta di credito</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('satispay')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  paymentMethod === 'satispay'
                    ? 'bg-[#ff5500]/15 border-[#ff5500] text-white font-bold'
                    : 'bg-[#181a22] border-[#252834] text-neutral-400 hover:text-white'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-red-600 text-white font-black text-[10px] mx-auto mb-1 flex items-center justify-center">
                  S
                </div>
                <span className="text-[11px] block leading-tight">Satispay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                  paymentMethod === 'apple_pay'
                    ? 'bg-[#ff5500]/15 border-[#ff5500] text-white font-bold'
                    : 'bg-[#181a22] border-[#252834] text-neutral-400 hover:text-white'
                }`}
              >
                <div className="w-5 h-5 rounded-md bg-neutral-200 text-black font-black text-[9px] mx-auto mb-1 flex items-center justify-center">
                  Pay
                </div>
                <span className="text-[11px] block leading-tight">Apple / Google Pay</span>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
              Note aggiuntive per la cucina o per il rider
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Es. citofono Rossi, secondo piano, oppure salsa a parte"
              className="w-full bg-[#181b24] border border-[#2a2f3d] rounded-xl px-3.5 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff5500]"
            />
          </div>

          {/* Mini order recap */}
          <div className="bg-[#181b24] border border-[#262b3a] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">Riepilogo finale ({items.length} articoli):</p>
              <p className="text-sm font-bold text-white">
                {fulfillmentType === 'asporto' ? 'Ritiro in sede' : `Consegna a ${city}`}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400 block">Totale da pagare</span>
              <span className="font-heading font-black text-xl text-[#ff6611]">
                €{(Number(total) || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions with 2 buttons */}
        <div className="p-4 sm:p-5 bg-[#151720] border-t border-[#232734] flex flex-col sm:flex-row items-center gap-3 shrink-0">
          {/* WhatsApp Direct Option (Extremely popular in Italy/Pompei) */}
          <button
            type="button"
            onClick={handleWhatsAppOrder}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            title="Invia riepilogo su WhatsApp al ristorante"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('orderViaWhatsApp')}</span>
          </button>

          {/* Primary Confirmation Button */}
          <button
            type="button"
            onClick={handleFormSubmit}
            className="w-full flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff6611] hover:from-[#e04a00] hover:to-[#ff5500] text-white font-extrabold text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#ff5500]/30 transition active:scale-98 cursor-pointer"
            id="confirm-order-submit-btn"
          >
            <span>{t('placeOrder')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
