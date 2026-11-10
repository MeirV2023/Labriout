import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  Flame,
  Bike,
  Store,
  Phone,
  MessageCircle,
  X,
  Sparkles,
  MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_DETAILS } from '../data/menuData';
import { getLocalizedProductName, getLocalizedExtraName } from '../utils/menuTranslations';

export const OrderTrackerModal: React.FC = () => {
  const { activePlacedOrder, setActivePlacedOrder, setCurrentView, t, language } = useCart();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [minutesRemaining, setMinutesRemaining] = useState<number>(20);

  useEffect(() => {
    if (!activePlacedOrder) return;
    setMinutesRemaining(activePlacedOrder.estimatedMinutes);

    const status = activePlacedOrder.status;
    if (status === 'received') setCurrentStep(1);
    else if (status === 'preparing') setCurrentStep(2);
    else if (status === 'frying' || status === 'packing') setCurrentStep(3);
    else if (status === 'ready' || status === 'delivering' || status === 'completed') setCurrentStep(4);

    const interval = setInterval(() => {
      setMinutesRemaining(prev => Math.max(1, prev - 1));
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [activePlacedOrder?.id, activePlacedOrder?.status]);

  if (!activePlacedOrder) return null;

  const isAsporto = activePlacedOrder.customer.fulfillmentType === 'asporto';

  const ui = {
    fr: {
      step1Title: 'Reçu',
      step1Desc: 'Commande transmise en cuisine à Bonneuil-sur-Marne',
      step2Title: 'En préparation',
      step2Desc: 'Préparation minute des ingrédients frais et sauces maison',
      step3Title: 'Cuisson & Grill',
      step3Desc: 'Cuisson express sur la plancha et fritures croustillantes',
      step4TitlePickup: 'Prêt à emporter',
      step4TitleDelivery: 'En livraison',
      step4DescPickup: 'Venez récupérer votre commande chaude au comptoir',
      step4DescDelivery: 'Le livreur est en route vers votre adresse',
      confirmedBadge: 'Commande confirmée',
      placedAt: 'Enregistrée à',
      closeAria: 'Fermer',
      estimatedWait: "Temps d'attente estimé",
      pickupLine: 'Retrait : 64 av. Simone Veil, Bonneuil-sur-Marne',
      deliveryLine: (c: string) => `Livraison : ${c}`,
      liveProgress: 'Suivi en direct',
      inProgress: 'En cours',
      completed: 'Terminé',
      packingTitle: "Contrôle qualité & emballage",
      packNapkins: 'Serviettes & couverts',
      packSauces: 'Sauces & suppléments',
      packReceipt: 'Ticket de caisse joint',
      packThermal: 'Sac isotherme scellé',
      callStore: 'Appeler le restaurant',
      kdsBtn: '👨‍🍳 Cuisine KDS (/owner)',
    },
    en: {
      step1Title: 'Received',
      step1Desc: 'Order received in the kitchen at Bonneuil-sur-Marne',
      step2Title: 'Preparing',
      step2Desc: 'Fresh homemade preparation and signature sauces',
      step3Title: 'Grill & Cooking',
      step3Desc: 'Searing on the hot grill and crispy golden sides',
      step4TitlePickup: 'Ready for Pickup',
      step4TitleDelivery: 'Out for Delivery',
      step4DescPickup: 'Collect your hot order at our takeaway counter',
      step4DescDelivery: 'The courier is heading to your address',
      confirmedBadge: 'Order Confirmed',
      placedAt: 'Placed at',
      closeAria: 'Close',
      estimatedWait: 'Estimated wait time',
      pickupLine: 'Pickup: 64 av. Simone Veil, Bonneuil-sur-Marne',
      deliveryLine: (c: string) => `Delivery: ${c}`,
      liveProgress: 'Live order progress',
      inProgress: 'In progress',
      completed: 'Completed',
      packingTitle: 'Quality & Packing Check',
      packNapkins: 'Napkins & cutlery',
      packSauces: 'Sauces & extras',
      packReceipt: 'Receipt attached',
      packThermal: 'Thermal bag sealed',
      callStore: 'Call Store',
      kdsBtn: '👨‍🍳 Kitchen KDS (/owner)',
    },
    de: {
      step1Title: 'Erhalten',
      step1Desc: 'Bestellung in der Küche in Bonneuil-sur-Marne eingegangen',
      step2Title: 'In Vorbereitung',
      step2Desc: 'Frische Zubereitung mit hausgemachten Zutaten und Saucen',
      step3Title: 'Grill & Küche',
      step3Desc: 'Frisch vom heißen Grill und knusprige Beilagen',
      step4TitlePickup: 'Abholbereit',
      step4TitleDelivery: 'In Zustellung',
      step4DescPickup: 'Abholung an unserer warmen Theke bereit',
      step4DescDelivery: 'Der Kurier ist auf dem Weg zu Ihrer Adresse',
      confirmedBadge: 'Bestellung bestätigt',
      placedAt: 'Aufgegeben um',
      closeAria: 'Schließen',
      estimatedWait: 'Geschätzte Wartezeit',
      pickupLine: 'Abholung: 64 av. Simone Veil, Bonneuil-sur-Marne',
      deliveryLine: (c: string) => `Lieferung: ${c}`,
      liveProgress: 'Live-Status',
      inProgress: 'In Bearbeitung',
      completed: 'Abgeschlossen',
      packingTitle: 'Qualitäts- & Verpackungskontrolle',
      packNapkins: 'Servietten & Besteck',
      packSauces: 'Saucen & Extras',
      packReceipt: 'Kassenbon beigefügt',
      packThermal: 'Thermobeutel versiegelt',
      callStore: 'Restaurant anrufen',
      kdsBtn: '👨‍🍳 Küche KDS (/owner)',
    },
    it: {
      step1Title: 'Ricevuto',
      step1Desc: 'La comanda è in cucina a Bonneuil-sur-Marne',
      step2Title: 'In Preparazione',
      step2Desc: 'Preparazione espressa con ingredienti freschi e salse fatte in casa',
      step3Title: 'Cottura & Grill',
      step3Desc: 'Cottura espressa sulla piastra e contorni croccanti',
      step4TitlePickup: 'Pronto al Ritiro',
      step4TitleDelivery: 'In Consegna',
      step4DescPickup: 'Vieni a ritirare il tuo ordine caldo al bancone',
      step4DescDelivery: 'Il corriere sta arrivando al tuo indirizzo',
      confirmedBadge: 'Ordine Confermato',
      placedAt: 'Registrato alle',
      closeAria: 'Chiudi',
      estimatedWait: 'Tempo stimato di attesa',
      pickupLine: 'Ritiro: 64 av. Simone Veil, Bonneuil-sur-Marne',
      deliveryLine: (c: string) => `Consegna: ${c}`,
      liveProgress: 'Avanzamento in Tempo Reale',
      inProgress: 'In corso',
      completed: 'Completato',
      packingTitle: 'Controllo Qualità & Confezionamento',
      packNapkins: 'Tovaglioli & posate',
      packSauces: 'Salse & extra',
      packReceipt: 'Scontrino allegato',
      packThermal: 'Sacchetto termico sigillato',
      callStore: 'Chiama Locale',
      kdsBtn: '👨‍🍳 Cucina KDS (/owner)',
    },
    ru: {
      step1Title: 'Принят',
      step1Desc: 'Заказ передан на кухню в Bonneuil-sur-Marne',
      step2Title: 'Готовится',
      step2Desc: 'Подготовка свежих ингредиентов и домашних соусов',
      step3Title: 'Гриль и жарка',
      step3Desc: 'Обжарка на горячем гриле и хрустящие гарниры',
      step4TitlePickup: 'Готов к выдаче',
      step4TitleDelivery: 'Курьер в пути',
      step4DescPickup: 'Ждём вас у стойки выдачи горячих блюд',
      step4DescDelivery: 'Курьер уже направляется по вашему адресу',
      confirmedBadge: 'Заказ подтверждён',
      placedAt: 'Заказ оформлен в',
      closeAria: 'Закрыть',
      estimatedWait: 'Ожидаемое время',
      pickupLine: 'Самовывоз: 64 av. Simone Veil, Bonneuil-sur-Marne',
      deliveryLine: (c: string) => `Доставка: ${c}`,
      liveProgress: 'Отслеживание в реальном времени',
      inProgress: 'Выполняется',
      completed: 'Готово',
      packingTitle: 'Контроль сборки заказа',
      packNapkins: 'Салфетки и приборы',
      packSauces: 'Соусы и добавки',
      packReceipt: 'Чек прикреплён',
      packThermal: 'Термопакет запечатан',
      callStore: 'Позвонить',
      kdsBtn: '👨‍🍳 KDS Кухня (/owner)',
    },
  }[language];

  const steps = [
    {
      step: 1,
      title: ui.step1Title,
      desc: ui.step1Desc,
      icon: CheckCircle2,
    },
    {
      step: 2,
      title: ui.step2Title,
      desc: ui.step2Desc,
      icon: Sparkles,
    },
    {
      step: 3,
      title: ui.step3Title,
      desc: ui.step3Desc,
      icon: Flame,
    },
    {
      step: 4,
      title: isAsporto ? ui.step4TitlePickup : ui.step4TitleDelivery,
      desc: isAsporto ? ui.step4DescPickup : ui.step4DescDelivery,
      icon: isAsporto ? Store : Bike,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="bg-[#12141a] border border-[#272b38] rounded-3xl w-full max-w-xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl relative my-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-[#161821] border-b border-[#232733] flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-1">
              <span>● {ui.confirmedBadge}</span>
            </div>
            <h3 className="font-heading font-black text-xl text-white uppercase tracking-tight">
              {t('orderNumber')} #{activePlacedOrder.id}
            </h3>
            <p className="text-xs text-neutral-400">
              {ui.placedAt} {activePlacedOrder.createdAt}
            </p>
          </div>

          <button
            onClick={() => setActivePlacedOrder(null)}
            aria-label={ui.closeAria}
            className="p-2.5 rounded-full bg-[#20232c] hover:bg-[#2c313e] text-neutral-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Tracker Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Estimated countdown card */}
          <div className="bg-gradient-to-br from-[#1d1614] to-[#161822] border-2 border-[#ff5500]/40 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                {ui.estimatedWait}
              </p>
              <h4 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
                ~{minutesRemaining} min
              </h4>
              <p className="text-xs text-[#ff7722] mt-0.5">
                {isAsporto
                  ? ui.pickupLine
                  : ui.deliveryLine(activePlacedOrder.customer.deliveryCity || 'Bonneuil-sur-Marne')}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#ff5500] text-white flex items-center justify-center shadow-lg shadow-[#ff5500]/30 animate-pulse">
              <Clock className="w-7 h-7" />
            </div>
          </div>

          {/* Stepper Progress Visualizer */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">
              {ui.liveProgress}
            </h4>

            <div className="space-y-3">
              {steps.map(s => {
                const isPassed = currentStep >= s.step;
                const isCurrent = currentStep === s.step;
                const Icon = s.icon;

                return (
                  <div
                    key={s.step}
                    className={`flex items-start gap-3.5 p-3 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-[#ff5500]/15 border-[#ff5500] text-white shadow-md'
                        : isPassed
                        ? 'bg-[#161822] border-[#292e3d] text-neutral-300'
                        : 'bg-[#101217] border-[#1f222c] opacity-50 text-neutral-500'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                        isCurrent
                          ? 'bg-[#ff5500] text-white animate-bounce'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#222530] text-neutral-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm uppercase">{s.title}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff7722] bg-[#ff5500]/10 px-2 py-0.5 rounded">
                            {ui.inProgress}
                          </span>
                        )}
                        {isPassed && !isCurrent && (
                          <span className="text-[10px] font-bold text-emerald-400">
                            {ui.completed}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Toast POS Live Packing Verification Badge */}
          {activePlacedOrder.packingChecklist && (
            <div className="bg-[#151822] border border-[#282d3e] rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold uppercase tracking-wider text-neutral-300 text-[11px]">
                  {ui.packingTitle}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Live KDS
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className={`p-2 rounded-xl border ${activePlacedOrder.packingChecklist.napkinsIncluded ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#101218] border-[#222634] text-neutral-500'}`}>
                  {activePlacedOrder.packingChecklist.napkinsIncluded ? '✓' : '○'} {ui.packNapkins}
                </div>
                <div className={`p-2 rounded-xl border ${activePlacedOrder.packingChecklist.saucesVerified ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#101218] border-[#222634] text-neutral-500'}`}>
                  {activePlacedOrder.packingChecklist.saucesVerified ? '✓' : '○'} {ui.packSauces}
                </div>
                <div className={`p-2 rounded-xl border ${activePlacedOrder.packingChecklist.receiptAttached ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#101218] border-[#222634] text-neutral-500'}`}>
                  {activePlacedOrder.packingChecklist.receiptAttached ? '✓' : '○'} {ui.packReceipt}
                </div>
                <div className={`p-2 rounded-xl border ${activePlacedOrder.packingChecklist.thermalBagSealed ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#101218] border-[#222634] text-neutral-500'}`}>
                  {activePlacedOrder.packingChecklist.thermalBagSealed ? '✓' : '○'} {ui.packThermal}
                </div>
              </div>
            </div>
          )}

          {/* Delivery destination or store location info */}
          <div className="bg-[#151720] border border-[#232732] rounded-2xl p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <MapPin className="w-4 h-4 text-[#ff5500] shrink-0" />
              <span className="font-bold">
                {isAsporto
                  ? STORE_DETAILS.address
                  : `${activePlacedOrder.customer.deliveryAddress}, ${activePlacedOrder.customer.deliveryCity}`}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 pl-6">
              {t('recipient')}: {activePlacedOrder.customer.name} ({activePlacedOrder.customer.phone})
            </p>
          </div>

          {/* Items Summary list */}
          <div className="bg-[#14161e] border border-[#222632] rounded-2xl p-4 space-y-2 text-xs">
            <div className="font-bold text-white uppercase text-[11px] tracking-wider mb-2">
              {t('orderSummary')}:
            </div>
            {activePlacedOrder.items.map(item => {
              const localizedName = getLocalizedProductName(item.product, language);
              const extrasStr =
                item.selectedExtras && item.selectedExtras.length > 0
                  ? item.selectedExtras.map(e => `+${getLocalizedExtraName(e, language)}`).join(', ')
                  : '';

              return (
                <div key={item.cartItemId} className="flex justify-between py-1 border-b border-[#1c1f28] gap-2">
                  <div>
                    <span>
                      {item.quantity}x {localizedName}
                    </span>
                    {extrasStr && (
                      <div className="text-[10.5px] text-neutral-400">{extrasStr}</div>
                    )}
                  </div>
                  <span className="font-bold text-white shrink-0">
                    {((Number(item.totalUnitPrice ?? item.product?.price ?? 0)) * (Number(item.quantity) || 1)).toFixed(2).replace('.', ',')} €
                  </span>
                </div>
              );
            })}
            <div className="pt-2 flex justify-between font-black text-sm text-[#ff6611]">
              <span>{t('total')}</span>
              <span>{(Number(activePlacedOrder.total) || 0).toFixed(2).replace('.', ',')} €</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-[#161821] border-t border-[#232733] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <a
            href={`tel:${STORE_DETAILS.phone}`}
            className="flex-1 py-3 px-3 rounded-xl bg-[#202430] hover:bg-[#2a2f3f] text-neutral-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Phone className="w-4 h-4 text-[#ff5500]" />
            <span>{ui.callStore}</span>
          </a>

          <button
            onClick={() => {
              setActivePlacedOrder(null);
              setCurrentView('owner');
            }}
            className="flex-1 py-3 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold uppercase transition cursor-pointer"
          >
            {ui.kdsBtn}
          </button>

          <button
            onClick={() => setActivePlacedOrder(null)}
            className="flex-1 py-3 px-3 rounded-xl bg-[#ff5500] hover:bg-[#e04a00] text-white text-xs font-extrabold uppercase transition cursor-pointer"
          >
            {t('backToMenu')}
          </button>
        </div>
      </div>
    </div>
  );
};
