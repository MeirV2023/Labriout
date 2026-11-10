import React from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  Bike,
  Store,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_DETAILS } from '../data/menuData';
import { getLabrioutTagline, getLabrioutKosherBadge } from '../data/labrioutMenuData';

export const StoreInfoModal: React.FC = () => {
  const { isStoreInfoOpen, setIsStoreInfoOpen, language } = useCart();

  if (!isStoreInfoOpen) return null;

  const ui = {
    fr: {
      closeAria: 'Fermer',
      hoursTitle: "⏰ Horaires d'ouverture",
      lunchDinnerLabel: 'Service Midi & Soir :',
      sundayLabel: 'Dimanche :',
      sundayHours: '18h30 – 22h15',
      fridayLabel: 'Vendredi :',
      fridayHours: '12h00 – 15h00',
      saturdayLabel: 'Samedi (Chabbat) :',
      saturdayHours: 'Fermé',
      zonesTitle: 'Zones de livraison à domicile',
      zonesSub: 'Nous livrons chaud et préparé minute dans les communes suivantes :',
      zones: [
        'Bonneuil-sur-Marne (94380)',
        'Créteil (94000)',
        'Saint-Maur-des-Fossés (94100)',
        'Sucy-en-Brie & Maisons-Alfort',
      ],
      whatsappBtn: 'WhatsApp Direct',
    },
    en: {
      closeAria: 'Close',
      hoursTitle: '⏰ Opening Hours',
      lunchDinnerLabel: 'Mon–Thu (Lunch & Dinner):',
      sundayLabel: 'Sunday:',
      sundayHours: '18:30 – 22:15',
      fridayLabel: 'Friday:',
      fridayHours: '12:00 – 15:00',
      saturdayLabel: 'Saturday (Shabbat):',
      saturdayHours: 'Closed',
      zonesTitle: 'Home Delivery Coverage Areas',
      zonesSub: 'We deliver hot, freshly prepared orders to the following areas:',
      zones: [
        'Bonneuil-sur-Marne (94380)',
        'Créteil (94000)',
        'Saint-Maur-des-Fossés (94100)',
        'Sucy-en-Brie & Maisons-Alfort',
      ],
      whatsappBtn: 'Direct WhatsApp',
    },
    de: {
      closeAria: 'Schließen',
      hoursTitle: '⏰ Öffnungszeiten',
      lunchDinnerLabel: 'Mo–Do (Mittag & Abend):',
      sundayLabel: 'Sonntag:',
      sundayHours: '18:30 – 22:15',
      fridayLabel: 'Freitag:',
      fridayHours: '12:00 – 15:00',
      saturdayLabel: 'Samstag (Schabbat):',
      saturdayHours: 'Geschlossen',
      zonesTitle: 'Liefergebiete nach Hause',
      zonesSub: 'Wir liefern heiß und frisch zubereitet in folgende Städte:',
      zones: [
        'Bonneuil-sur-Marne (94380)',
        'Créteil (94000)',
        'Saint-Maur-des-Fossés (94100)',
        'Sucy-en-Brie & Maisons-Alfort',
      ],
      whatsappBtn: 'WhatsApp Direkt',
    },
    it: {
      closeAria: 'Chiudi',
      hoursTitle: '⏰ Orari di apertura',
      lunchDinnerLabel: 'Lun–Gio (Pranzo & Cena):',
      sundayLabel: 'Domenica:',
      sundayHours: '18:30 – 22:15',
      fridayLabel: 'Venerdì:',
      fridayHours: '12:00 – 15:00',
      saturdayLabel: 'Sabato (Shabbat):',
      saturdayHours: 'Chiuso',
      zonesTitle: 'Zone coperte per la consegna a domicilio',
      zonesSub: 'Consegniamo caldo e preparato al momento nei seguenti comuni:',
      zones: [
        'Bonneuil-sur-Marne (94380)',
        'Créteil (94000)',
        'Saint-Maur-des-Fossés (94100)',
        'Sucy-en-Brie & Maisons-Alfort',
      ],
      whatsappBtn: 'WhatsApp Diretto',
    },
    ru: {
      closeAria: 'Закрыть',
      hoursTitle: '⏰ Часы работы',
      lunchDinnerLabel: 'Пн–Чт (Обед и ужин):',
      sundayLabel: 'Воскресенье:',
      sundayHours: '18:30 – 22:15',
      fridayLabel: 'Пятница:',
      fridayHours: '12:00 – 15:00',
      saturdayLabel: 'Суббота (Шаббат):',
      saturdayHours: 'Закрыто',
      zonesTitle: 'Зоны доставки на дом',
      zonesSub: 'Доставляем горячие блюда прямо с гриля в следующие города:',
      zones: [
        'Bonneuil-sur-Marne (94380)',
        'Créteil (94000)',
        'Saint-Maur-des-Fossés (94100)',
        'Sucy-en-Brie и Maisons-Alfort',
      ],
      whatsappBtn: 'Написать в WhatsApp',
    },
  }[language];

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'LABRIOUT 64 av. Simone Veil Bonneuil-sur-Marne'
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="bg-[#12141a] border border-[#272b38] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#171a23] border-b border-[#242834] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo-labriur-dark.png"
              alt="LABRIOUT"
              className="h-10 w-auto object-contain"
            />
            <div>
              <h3 className="font-heading font-black text-lg text-white uppercase tracking-tight">
                LABRIOUT
              </h3>
              <p className="text-xs text-[#ff7722]">{getLabrioutTagline(language)}</p>
            </div>
          </div>

          <button
            onClick={() => setIsStoreInfoOpen(false)}
            aria-label={ui.closeAria}
            className="p-2 rounded-full bg-[#20232c] hover:bg-[#2c313e] text-neutral-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
          {/* Address & Navigation */}
          <div className="bg-[#181b24] border border-[#272c3a] rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#ff5500] shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-white text-sm">📍 64 av. Simone Veil, Bonneuil-sur-Marne</p>
                <p className="text-xs text-neutral-300 mt-0.5">📞 0769774086 • labriout@eat-view.local.</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{getLabrioutKosherBadge(language)}</p>
              </div>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#202532] hover:bg-[#ff5500] text-neutral-200 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Hours */}
          <div className="bg-[#181b24] border border-[#272c3a] rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <Clock className="w-4 h-4 text-[#ff5500]" />
              <span>{ui.hoursTitle}</span>
            </div>
            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span>{ui.lunchDinnerLabel}</span>
                <span className="font-semibold text-white">12h-15h • 18h-22h15</span>
              </div>
              <div className="flex justify-between">
                <span>{ui.fridayLabel}</span>
                <span className="font-semibold text-white">{ui.fridayHours}</span>
              </div>
              <div className="flex justify-between">
                <span>{ui.saturdayLabel}</span>
                <span className="font-semibold text-neutral-400">{ui.saturdayHours}</span>
              </div>
              <div className="flex justify-between">
                <span>{ui.sundayLabel}</span>
                <span className="font-semibold text-white">{ui.sundayHours}</span>
              </div>
            </div>
          </div>

          {/* Delivery Coverage Areas */}
          <div className="bg-[#181b24] border border-[#272c3a] rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <Bike className="w-4 h-4 text-[#ff5500]" />
              <span>{ui.zonesTitle}</span>
            </div>
            <p className="text-xs text-neutral-400">{ui.zonesSub}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-200">
              {ui.zones.map(zone => (
                <div key={zone} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{zone}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <a
              href={`tel:${STORE_DETAILS.phone}`}
              className="p-3 rounded-xl bg-[#202532] hover:bg-[#282e3e] border border-[#2e3445] text-white flex items-center justify-center gap-2 font-bold text-xs transition"
            >
              <Phone className="w-4 h-4 text-[#ff5500]" />
              <span>{STORE_DETAILS.phone}</span>
            </a>

            <a
              href={`https://wa.me/${STORE_DETAILS.whatsappClean}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] border border-[#25D366]/40 text-[#25D366] hover:text-white flex items-center justify-center gap-2 font-bold text-xs transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{ui.whatsappBtn}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
