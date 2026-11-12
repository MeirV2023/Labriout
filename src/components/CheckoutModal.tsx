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
import { getLocalizedProductName, getLocalizedExtraName } from '../utils/menuTranslations';

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
    language,
    formatMoney,
    t,
  } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bonneuil-sur-Marne');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'satispay' | 'apple_pay'>('cash');
  const [formError, setFormError] = useState('');

  if (!isCheckoutModalOpen) return null;

  const ui = {
    fr: {
      errName: 'Veuillez saisir votre nom et prénom',
      errPhone: 'Veuillez saisir un numéro de téléphone valide',
      errAddress: 'Veuillez saisir votre adresse de livraison à Bonneuil-sur-Marne ou environs',
      waHeader: '*NOUVELLE COMMANDE EN LIGNE - LABRIOUT*',
      waClient: 'Client',
      waPhone: 'Téléphone',
      waMode: 'Mode',
      waPickup: 'À EMPORTER (Retrait)',
      waDelivery: 'LIVRAISON À DOMICILE',
      waAddress: 'Adresse',
      waTime: 'Horaire',
      waPayment: 'Paiement',
      waDetails: 'DÉTAIL DE LA COMMANDE',
      waExtras: 'Extras',
      waNote: 'Note',
      waTotal: 'TOTAL',
      waOrderNotes: 'Notes',
      subPickup: 'Retrait : 64 av. Simone Veil, Bonneuil-sur-Marne',
      subDelivery: 'Livraison rapide à domicile',
      closeAria: 'Fermer',
      orderModeLabel: 'Mode de commande',
      pickupTitle: 'À emporter (Retrait)',
      pickupSub: 'Gratuit • ~15-20 min',
      deliveryTitle: 'Livraison à domicile',
      deliverySub: 'Bonneuil-sur-Marne & environs',
      namePlaceholder: 'David Cohen',
      phonePlaceholder: '+33 6 12 34 56 78',
      addressPlaceholder: 'Ex. 12 Rue Paul Vaillant-Couturier, Bât. B',
      asapValue: 'Le plus vite possible',
      asapLabel: (mins: number) => `Le plus vite possible (~${mins} min)`,
      slotPrefix: "Aujourd'hui à",
      payCash: 'Espèces à la réception',
      payCard: 'Carte bancaire',
      notesLabel: 'Instructions supplémentaires pour la cuisine ou le livreur',
      notesPlaceholder: 'Ex. digicode 1234, 2e étage, sauce à part',
      recapLabel: (n: number) => `Récapitulatif final (${n} articles) :`,
      recapPickup: 'Retrait sur place',
      recapDelivery: (c: string) => `Livraison à ${c}`,
      totalToPay: 'Total à payer',
      waTitle: 'Envoyer le récapitulatif sur WhatsApp au restaurant',
    },
    en: {
      errName: 'Please enter your full name',
      errPhone: 'Please enter a valid phone number',
      errAddress: 'Please enter your delivery address in Bonneuil-sur-Marne or nearby',
      waHeader: '*NEW ONLINE ORDER - LABRIOUT*',
      waClient: 'Customer',
      waPhone: 'Phone',
      waMode: 'Fulfillment',
      waPickup: 'PICKUP AT STORE',
      waDelivery: 'HOME DELIVERY',
      waAddress: 'Address',
      waTime: 'Time',
      waPayment: 'Payment',
      waDetails: 'ORDER DETAILS',
      waExtras: 'Extras',
      waNote: 'Note',
      waTotal: 'TOTAL',
      waOrderNotes: 'Notes',
      subPickup: 'Pickup: 64 av. Simone Veil, Bonneuil-sur-Marne',
      subDelivery: 'Fast home delivery',
      closeAria: 'Close',
      orderModeLabel: 'Order mode',
      pickupTitle: 'Takeaway (Pickup)',
      pickupSub: 'Free • ~15-20 min',
      deliveryTitle: 'Home delivery',
      deliverySub: 'Bonneuil-sur-Marne & nearby',
      namePlaceholder: 'David Cohen',
      phonePlaceholder: '+33 6 12 34 56 78',
      addressPlaceholder: 'e.g. 12 Rue Paul Vaillant-Couturier, Apt 3',
      asapValue: 'As soon as possible',
      asapLabel: (mins: number) => `As soon as possible (~${mins} min)`,
      slotPrefix: 'Today at',
      payCash: 'Cash on delivery / pickup',
      payCard: 'Credit / Debit card',
      notesLabel: 'Additional notes for the kitchen or courier',
      notesPlaceholder: 'e.g. intercom 1234, 2nd floor, sauce on the side',
      recapLabel: (n: number) => `Final summary (${n} items):`,
      recapPickup: 'Store pickup',
      recapDelivery: (c: string) => `Delivery to ${c}`,
      totalToPay: 'Total to pay',
      waTitle: 'Send order summary via WhatsApp to the restaurant',
    },
    de: {
      errName: 'Bitte geben Sie Ihren Vor- und Nachnamen ein',
      errPhone: 'Bitte geben Sie eine gültige Telefonnummer ein',
      errAddress: 'Bitte geben Sie Ihre Lieferadresse in Bonneuil-sur-Marne oder Umgebung ein',
      waHeader: '*NEUE ONLINE-BESTELLUNG - LABRIOUT*',
      waClient: 'Kunde',
      waPhone: 'Telefon',
      waMode: 'Bestellart',
      waPickup: 'ABHOLUNG VOR ORT',
      waDelivery: 'LIEFERUNG NACH HAUSE',
      waAddress: 'Adresse',
      waTime: 'Uhrzeit',
      waPayment: 'Zahlung',
      waDetails: 'BESTELLDETAILS',
      waExtras: 'Extras',
      waNote: 'Hinweis',
      waTotal: 'GESAMT',
      waOrderNotes: 'Hinweise',
      subPickup: 'Abholung: 64 av. Simone Veil, Bonneuil-sur-Marne',
      subDelivery: 'Schnelle Lieferung nach Hause',
      closeAria: 'Schließen',
      orderModeLabel: 'Bestellart',
      pickupTitle: 'Abholung vor Ort',
      pickupSub: 'Kostenlos • ~15-20 Min',
      deliveryTitle: 'Lieferung nach Hause',
      deliverySub: 'Bonneuil-sur-Marne & Umgebung',
      namePlaceholder: 'David Cohen',
      phonePlaceholder: '+33 6 12 34 56 78',
      addressPlaceholder: 'z.B. 12 Rue Paul Vaillant-Couturier, 2. Etage',
      asapValue: 'So schnell wie möglich',
      asapLabel: (mins: number) => `So schnell wie möglich (~${mins} Min)`,
      slotPrefix: 'Heute um',
      payCash: 'Barzahlung bei Erhalt',
      payCard: 'Kredit- / Debitkarte',
      notesLabel: 'Zusätzliche Hinweise für Küche oder Kurier',
      notesPlaceholder: 'z.B. Klingelcode 1234, 2. Stock, Sauce separat',
      recapLabel: (n: number) => `Zusammenfassung (${n} Artikel):`,
      recapPickup: 'Abholung vor Ort',
      recapDelivery: (c: string) => `Lieferung nach ${c}`,
      totalToPay: 'Zu zahlender Betrag',
      waTitle: 'Bestellübersicht per WhatsApp an das Restaurant senden',
    },
    it: {
      errName: 'Inserisci il tuo nome e cognome',
      errPhone: 'Inserisci un numero di telefono valido per la conferma',
      errAddress: "Inserisci l'indirizzo di consegna a Bonneuil-sur-Marne o dintorni",
      waHeader: '*NUOVO ORDINE ONLINE - LABRIOUT*',
      waClient: 'Cliente',
      waPhone: 'Telefono',
      waMode: 'Modalità',
      waPickup: 'RITIRO IN SEDE (Asporto)',
      waDelivery: 'CONSEGNA A DOMICILIO',
      waAddress: 'Indirizzo',
      waTime: 'Orario',
      waPayment: 'Pagamento',
      waDetails: 'DETTAGLIO ORDINE',
      waExtras: 'Extra',
      waNote: 'Nota',
      waTotal: 'TOTALE',
      waOrderNotes: 'Note',
      subPickup: 'Ritiro: 64 av. Simone Veil, Bonneuil-sur-Marne',
      subDelivery: 'Consegna rapida a domicilio',
      closeAria: 'Chiudi',
      orderModeLabel: "Modalità d'ordine",
      pickupTitle: 'Asporto (Ritiro)',
      pickupSub: 'Gratis • ~15-20 min',
      deliveryTitle: 'Consegna a domicilio',
      deliverySub: 'Bonneuil-sur-Marne & dintorni',
      namePlaceholder: 'David Cohen',
      phonePlaceholder: '+33 6 12 34 56 78',
      addressPlaceholder: 'Es. 12 Rue Paul Vaillant-Couturier, int. 3',
      asapValue: 'Il prima possibile',
      asapLabel: (mins: number) => `Il prima possibile (~${mins} min)`,
      slotPrefix: 'Oggi alle',
      payCash: 'Contanti alla consegna',
      payCard: 'Carta di credito',
      notesLabel: 'Note aggiuntive per la cucina o per il corriere',
      notesPlaceholder: 'Es. citofono 1234, secondo piano, salsa a parte',
      recapLabel: (n: number) => `Riepilogo finale (${n} articoli):`,
      recapPickup: 'Ritiro in sede',
      recapDelivery: (c: string) => `Consegna a ${c}`,
      totalToPay: 'Totale da pagare',
      waTitle: 'Invia riepilogo su WhatsApp al ristorante',
    },
    ru: {
      errName: 'Укажите ваше имя и фамилию',
      errPhone: 'Укажите корректный номер телефона для подтверждения',
      errAddress: 'Укажите адрес доставки в Bonneuil-sur-Marne или окрестностях',
      waHeader: '*НОВЫЙ ОНЛАЙН-ЗАКАЗ - LABRIOUT*',
      waClient: 'Клиент',
      waPhone: 'Телефон',
      waMode: 'Способ получения',
      waPickup: 'САМОВЫВОЗ ИЗ РЕСТОРАНА',
      waDelivery: 'ДОСТАВКА НА ДОМ',
      waAddress: 'Адрес',
      waTime: 'Время',
      waPayment: 'Оплата',
      waDetails: 'СОСТАВ ЗАКАЗА',
      waExtras: 'Добавки',
      waNote: 'Комментарий',
      waTotal: 'ИТОГО',
      waOrderNotes: 'Примечания',
      subPickup: 'Самовывоз: 64 av. Simone Veil, Bonneuil-sur-Marne',
      subDelivery: 'Быстрая доставка на дом',
      closeAria: 'Закрыть',
      orderModeLabel: 'Способ получения',
      pickupTitle: 'Самовывоз',
      pickupSub: 'Бесплатно • ~15–20 мин',
      deliveryTitle: 'Доставка на дом',
      deliverySub: 'Bonneuil-sur-Marne и окрестности',
      namePlaceholder: 'Давид Коэн',
      phonePlaceholder: '+33 6 12 34 56 78',
      addressPlaceholder: 'Напр. 12 Rue Paul Vaillant-Couturier, кв. 3',
      asapValue: 'Как можно скорее',
      asapLabel: (mins: number) => `Как можно скорее (~${mins} мин)`,
      slotPrefix: 'Сегодня к',
      payCash: 'Наличными при получении',
      payCard: 'Банковской картой',
      notesLabel: 'Дополнительные пожелания для кухни или курьера',
      notesPlaceholder: 'Напр. код домофона 1234, 2 этаж, соус отдельно',
      recapLabel: (n: number) => `Итоговый заказ (${n} поз.):`,
      recapPickup: 'Самовывоз из ресторана',
      recapDelivery: (c: string) => `Доставка: ${c}`,
      totalToPay: 'К оплате',
      waTitle: 'Отправить заказ в ресторан через WhatsApp',
    },
  }[language];

  const handleClose = () => {
    setIsCheckoutModalOpen(false);
  };

  const validateForm = () => {
    if (!name.trim()) {
      setFormError(ui.errName);
      return false;
    }
    if (!phone.trim() || phone.trim().length < 6) {
      setFormError(ui.errPhone);
      return false;
    }
    if (fulfillmentType === 'consegna' && !address.trim()) {
      setFormError(ui.errAddress);
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
    let message = `${ui.waHeader}%0A`;
    message += `👤 *${ui.waClient}:* ${name}%0A`;
    message += `📞 *${ui.waPhone}:* ${phone}%0A`;
    message += `🛵 *${ui.waMode}:* ${fulfillmentType === 'asporto' ? ui.waPickup : ui.waDelivery}%0A`;
    if (fulfillmentType === 'consegna') {
      message += `📍 *${ui.waAddress}:* ${address}, ${city}%0A`;
    }
    message += `⏰ *${ui.waTime}:* ${selectedTimeSlot}%0A`;
    message += `💳 *${ui.waPayment}:* ${paymentMethod.toUpperCase()}%0A%0A`;
    message += `🛒 *${ui.waDetails}:*%0A`;

    items.forEach((item, idx) => {
      const itemTotal = (Number(item.totalUnitPrice ?? item.product?.price ?? 0)) * (Number(item.quantity) || 1);
      const itemName = getLocalizedProductName(item.product, language);
      message += `${idx + 1}. *${item.quantity}x ${itemName}* (${formatMoney(itemTotal)})%0A`;
      if (item.selectedExtras.length > 0) {
        message += `   + ${ui.waExtras}: ${item.selectedExtras.map(e => getLocalizedExtraName(e, language)).join(', ')}%0A`;
      }
      if (item.specialNotes) {
        message += `   ${ui.waNote}: ${item.specialNotes}%0A`;
      }
    });

    message += `%0A💰 *${ui.waTotal}: ${formatMoney(total)}*%0A`;
    if (notes) {
      message += `📝 *${ui.waOrderNotes}:* ${notes}%0A`;
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
              {fulfillmentType === 'asporto' ? ui.subPickup : ui.subDelivery}
            </p>
          </div>

          <button
            onClick={handleClose}
            aria-label={ui.closeAria}
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
              {ui.orderModeLabel}
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
                  <p className="font-bold text-white leading-tight">{ui.pickupTitle}</p>
                  <p className="text-[11px] text-neutral-400">{ui.pickupSub}</p>
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
                  <p className="font-bold text-white leading-tight">{ui.deliveryTitle}</p>
                  <p className="text-[11px] text-neutral-400">{ui.deliverySub}</p>
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
                  placeholder={ui.namePlaceholder}
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
                  placeholder={ui.phonePlaceholder}
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
                      placeholder={ui.addressPlaceholder}
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
                      <option value="Bonneuil-sur-Marne">Bonneuil-sur-Marne (94380)</option>
                      <option value="Créteil">Créteil (94000)</option>
                      <option value="Saint-Maur-des-Fossés">Saint-Maur-des-Fossés (94100)</option>
                      <option value="Sucy-en-Brie">Sucy-en-Brie (94370)</option>
                      <option value="Maisons-Alfort">Maisons-Alfort (94700)</option>
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
              <option value={ui.asapValue}>
                {ui.asapLabel(fulfillmentType === 'asporto' ? 15 : 30)}
              </option>
              <option value="12:30">{ui.slotPrefix} 12:30</option>
              <option value="13:00">{ui.slotPrefix} 13:00</option>
              <option value="13:30">{ui.slotPrefix} 13:30</option>
              <option value="14:00">{ui.slotPrefix} 14:00</option>
              <option value="19:00">{ui.slotPrefix} 19:00</option>
              <option value="19:30">{ui.slotPrefix} 19:30</option>
              <option value="20:00">{ui.slotPrefix} 20:00</option>
              <option value="20:30">{ui.slotPrefix} 20:30</option>
              <option value="21:00">{ui.slotPrefix} 21:00</option>
              <option value="21:30">{ui.slotPrefix} 21:30</option>
              <option value="22:00">{ui.slotPrefix} 22:00</option>
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
                <span className="text-[11px] block leading-tight">{ui.payCash}</span>
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
                <span className="text-[11px] block leading-tight">{ui.payCard}</span>
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
                <span className="text-[11px] block leading-tight">Ticket Resto</span>
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
              {ui.notesLabel}
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={ui.notesPlaceholder}
              className="w-full bg-[#181b24] border border-[#2a2f3d] rounded-xl px-3.5 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff5500]"
            />
          </div>

          {/* Mini order recap */}
          <div className="bg-[#181b24] border border-[#262b3a] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400">{ui.recapLabel(items.length)}</p>
              <p className="text-sm font-bold text-white">
                {fulfillmentType === 'asporto' ? ui.recapPickup : ui.recapDelivery(city)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-400 block">{ui.totalToPay}</span>
              <span className="font-heading font-black text-xl text-[#ff6611]">
                {formatMoney(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions with 2 buttons */}
        <div className="p-4 sm:p-5 bg-[#151720] border-t border-[#232734] flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleWhatsAppOrder}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            title={ui.waTitle}
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
