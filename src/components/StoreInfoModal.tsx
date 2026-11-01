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

export const StoreInfoModal: React.FC = () => {
  const { isStoreInfoOpen, setIsStoreInfoOpen } = useCart();

  if (!isStoreInfoOpen) return null;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Panzarotto Via Provinciale Ripuaria 133 Pompei'
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-fadeIn">
      <div className="bg-[#12141a] border border-[#272b38] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#171a23] border-b border-[#242834] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#ff5500] flex items-center justify-center text-white">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white uppercase tracking-tight">
                Panzarotto Pompei
              </h3>
              <p className="text-xs text-[#ff7722]">Street Food Autentico</p>
            </div>
          </div>

          <button
            onClick={() => setIsStoreInfoOpen(false)}
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
                <p className="font-extrabold text-white text-sm">Dove Trovarci</p>
                <p className="text-xs text-neutral-300 mt-0.5">{STORE_DETAILS.address}</p>
                <p className="text-[11px] text-neutral-500 mt-0.5">A pochi minuti dagli Scavi di Pompei e dal Santuario</p>
              </div>
            </div>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#202532] hover:bg-[#ff5500] text-neutral-200 hover:text-white text-xs font-bold transition cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Apri indicazioni stradali su Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Hours */}
          <div className="bg-[#181b24] border border-[#272c3a] rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <Clock className="w-4 h-4 text-[#ff5500]" />
              <span>Orari di Apertura</span>
            </div>
            <div className="space-y-1.5 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span>Lunedì – Sabato:</span>
                <span className="font-semibold text-white">19:30 – 23:00</span>
              </div>
              <div className="flex justify-between">
                <span>Domenica:</span>
                <span className="font-semibold text-white">10:00 – 14:30</span>
              </div>
            </div>
          </div>

          {/* Delivery Coverage Areas */}
          <div className="bg-[#181b24] border border-[#272c3a] rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2.5 text-white font-bold text-sm">
              <Bike className="w-4 h-4 text-[#ff5500]" />
              <span>Zone Coperte per la Consegna a Domicilio</span>
            </div>
            <p className="text-xs text-neutral-400">
              Consegniamo caldo e croccante nei seguenti comuni:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-200">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pompei Centro & Scavi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Scafati</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Torre Annunziata</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Castellammare di Stabia</span>
              </div>
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
              <span>WhatsApp Diretto</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
