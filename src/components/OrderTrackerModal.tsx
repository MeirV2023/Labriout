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

  const step1Title = language === 'ru' ? 'Принят' : language === 'en' ? 'Received' : language === 'de' ? 'Erhalten' : language === 'fr' ? 'Reçu' : 'Ricevuto';
  const step1Desc = language === 'ru' ? 'Заказ передан на кухню в Помпеях' : language === 'en' ? 'Order received in the kitchen in Pompeii' : language === 'de' ? 'Bestellung in der Küche in Pompeji eingegangen' : language === 'fr' ? 'Commande reçue en cuisine à Pompéi' : 'La comanda è in cucina a Pompei';

  const step2Title = language === 'ru' ? 'Готовится' : language === 'en' ? 'Preparing' : language === 'de' ? 'In Vorbereitung' : language === 'fr' ? 'En préparation' : 'In Preparazione';
  const step2Desc = language === 'ru' ? 'Раскатка теста и начинка свежей моцареллой' : language === 'en' ? 'Dough stretching and fior di latte filling' : language === 'de' ? 'Teigbereitung und Füllung mit Fior di Latte' : language === 'fr' ? 'Étirement de la pâte et garniture fior di latte' : 'Stenditura impasto e farcitura fior di latte';

  const step3Title = language === 'ru' ? 'Обжарка' : language === 'en' ? 'Frying' : language === 'de' ? 'Wird frittiert' : language === 'fr' ? 'En friture' : 'In Frittura';
  const step3Desc = language === 'ru' ? 'Обжаривание до золотистой корочки' : language === 'en' ? 'Golden crispy frying at optimal temperature' : language === 'de' ? 'Goldbraun frittiert bei optimaler Temperatur' : language === 'fr' ? 'Dorure express à température optimale' : 'Doratura espressa a temperatura ottimale';

  const step4Title = isAsporto
    ? (language === 'ru' ? 'Готов к выдаче' : language === 'en' ? 'Ready for Pickup' : language === 'de' ? 'Abholbereit' : language === 'fr' ? 'Prêt à emporter' : 'Pronto al Ritiro')
    : (language === 'ru' ? 'Курьер в пути' : language === 'en' ? 'Out for Delivery' : language === 'de' ? 'In Zustellung' : language === 'fr' ? 'En livraison' : 'In Consegna');
  const step4Desc = isAsporto
    ? (language === 'ru' ? 'Ждем вас у стойки выдачи горячих блюд' : language === 'en' ? 'Collect at our hot takeaway counter' : language === 'de' ? 'Abholung an der warmen Theke' : language === 'fr' ? 'Venez récupérer au comptoir chaud' : 'Vieni a ritirare al bancone caldo')
    : (language === 'ru' ? 'Курьер уже направляется по вашему адресу' : language === 'en' ? 'The courier is heading to your address' : language === 'de' ? 'Der Kurier ist auf dem Weg zu Ihrer Adresse' : language === 'fr' ? 'Le livreur arrive à votre adresse' : 'Il rider sta arrivando al tuo indirizzo');

  const steps = [
    {
      step: 1,
      title: step1Title,
      desc: step1Desc,
      icon: CheckCircle2,
    },
    {
      step: 2,
      title: step2Title,
      desc: step2Desc,
      icon: Sparkles,
    },
    {
      step: 3,
      title: step3Title,
      desc: step3Desc,
      icon: Flame,
    },
    {
      step: 4,
      title: step4Title,
      desc: step4Desc,
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
              <span>
                ●{' '}
                {language === 'ru'
                  ? 'Заказ подтвержден'
                  : language === 'en'
                  ? 'Order Confirmed'
                  : 'Ordine Confermato'}
              </span>
            </div>
            <h3 className="font-heading font-black text-xl text-white uppercase tracking-tight">
              {t('orderNumber')} #{activePlacedOrder.id}
            </h3>
            <p className="text-xs text-neutral-400">
              {language === 'ru' ? 'Заказ оформлен в' : language === 'en' ? 'Placed at' : language === 'de' ? 'Registriert um' : language === 'fr' ? 'Enregistré à' : 'Registrato alle'} {activePlacedOrder.createdAt}
            </p>
          </div>

          <button
            onClick={() => setActivePlacedOrder(null)}
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
                {language === 'ru' ? 'Ожидаемое время' : language === 'en' ? 'Estimated wait time' : language === 'de' ? 'Geschätzte Wartezeit' : language === 'fr' ? "Temps d'attente estimé" : 'Tempo stimato di attesa'}
              </p>
              <h4 className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">
                ~{minutesRemaining} min
              </h4>
              <p className="text-xs text-[#ff7722] mt-0.5">
                {isAsporto
                  ? (language === 'ru' ? 'Самовывоз: 64 av. Simone Veil, Bonneuil-sur-Marne' : 'Retrait : 64 av. Simone Veil, Bonneuil-sur-Marne')
                  : (language === 'ru' ? `Доставка: ${activePlacedOrder.customer.deliveryCity || 'Bonneuil-sur-Marne'}` : `Livraison : ${activePlacedOrder.customer.deliveryCity || 'Bonneuil-sur-Marne'}`)}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-[#ff5500] text-white flex items-center justify-center shadow-lg shadow-[#ff5500]/30 animate-pulse">
              <Clock className="w-7 h-7" />
            </div>
          </div>

          {/* Stepper Progress Visualizer */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">
              {language === 'ru' ? 'Отслеживание в реальном времени' : language === 'en' ? 'Live order progress' : language === 'de' ? 'Live-Status' : language === 'fr' ? 'Suivi en direct' : 'Avanzamento in Tempo Reale'}
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
                            {language === 'ru' ? 'Выполняется' : language === 'en' ? 'In progress' : language === 'de' ? 'In Bearbeitung' : language === 'fr' ? 'En cours' : 'In corso'}
                          </span>
                        )}
                        {isPassed && !isCurrent && (
                          <span className="text-[10px] font-bold text-emerald-400">
                            {language === 'ru' ? 'Готово' : language === 'en' ? 'Completed' : language === 'de' ? 'Abgeschlossen' : language === 'fr' ? 'Terminé' : 'Completato'}
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
                  {language === 'ru'
                    ? 'Контроль сборки заказа (Packing Check)'
                    : 'Controllo Qualità & Confezionamento'}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Live KDS
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className={`p-2 rounded-xl border ${activePlacedOrder.packingChecklist.napkinsIncluded ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#101218] border-[#222634] text-neutral-500'}`}>
                  {activePlacedOrder.packingChecklist.napkinsIncluded ? '✓' : '○'}{' '}
                  {language === 'ru' ? 'Салфетки и приборы' : 'Tovaglioli & Kit'}
                </div>
                <div className={`p-2 rounded-xl border ${activePlacedOrder.packingChecklist.saucesVerified ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#101218] border-[#222634] text-neutral-500'}`}>
                  {activePlacedOrder.packingChecklist.saucesVerified ? '✓' : '○'}{' '}
                  {language === 'ru' ? 'Соусы и добавки' : 'Salse & Extra'}
                </div>
                <div className={`p-2 rounded-xl border ${activePlacedOrder.packingChecklist.receiptAttached ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#101218] border-[#222634] text-neutral-500'}`}>
                  {activePlacedOrder.packingChecklist.receiptAttached ? '✓' : '○'}{' '}
                  {language === 'ru' ? 'Чек прикреплен' : 'Scontrino Fiscale'}
                </div>
                <div className={`p-2 rounded-xl border ${activePlacedOrder.packingChecklist.thermalBagSealed ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'bg-[#101218] border-[#222634] text-neutral-500'}`}>
                  {activePlacedOrder.packingChecklist.thermalBagSealed ? '✓' : '○'}{' '}
                  {language === 'ru' ? 'Термопакет запечатан' : 'Sacchetto Sigillato'}
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
              const p = item.product;
              const localizedName =
                (language === 'de' && (p as any).nameDe) ||
                (language === 'fr' && (p as any).nameFr) ||
                (language === 'en' && p.nameEn) ||
                (language === 'ru' && p.nameRu) ||
                p.name;

              return (
                <div key={item.cartItemId} className="flex justify-between py-1 border-b border-[#1c1f28]">
                  <span>
                    {item.quantity}x {localizedName}
                  </span>
                  <span className="font-bold text-white">
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
            <span>
              {language === 'ru'
                ? 'Позвонить'
                : language === 'en'
                ? 'Call Store'
                : 'Chiama Locale'}
            </span>
          </a>

          <button
            onClick={() => {
              setActivePlacedOrder(null);
              setCurrentView('owner');
            }}
            className="flex-1 py-3 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold uppercase transition cursor-pointer"
          >
            👨‍🍳 KDS Кухня (/owner)
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
