import React, { useState, useRef } from 'react';
import { Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PrenotaTimeDropdown } from './PrenotaTimeDropdown';
import iconScegli from '../assets/icons/scegli.png';
import iconAsporto from '../assets/icons/asporto.png';
import iconConsegna from '../assets/icons/consegna.png';
import iconPrenota from '../assets/icons/prenota.png';

export const FulfillmentBar: React.FC = () => {
  const { fulfillmentType, setFulfillmentType, selectedTimeSlot, setSelectedTimeSlot, language, t } = useCart();
  const [isPrenotaDropdownOpen, setIsPrenotaDropdownOpen] = useState<boolean>(false);
  const prenotaButtonRef = useRef<HTMLButtonElement>(null);

  const handleSelectAsporto = () => {
    setFulfillmentType('asporto');
    setIsPrenotaDropdownOpen(false);
  };

  const handleSelectConsegna = () => {
    setFulfillmentType('consegna');
    setIsPrenotaDropdownOpen(false);
  };

  const handleTogglePrenota = () => {
    setFulfillmentType('prenota');
    setIsPrenotaDropdownOpen(prev => !prev);
  };

  const hasSelectedCustomSlot =
    selectedTimeSlot &&
    selectedTimeSlot !== 'subito' &&
    selectedTimeSlot !== 'Subito (15-25 min)';

  return (
    <section
      id="fulfillment-bar-container"
      className="bg-[#ffffff] pt-1 sm:pt-2 pb-6 sm:pb-8 px-4 sm:px-8 lg:px-12 relative overflow-visible z-20"
    >
      {/* Container aligned with the 1200px floating gallery banner */}
      <div className="w-full max-w-[1200px] mx-auto overflow-visible relative">
        {/* Main Floating Card matching Screenshot 2 & placed seamlessly on white canvas */}
        <div className="w-full bg-[#ffffff] border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.03)] relative overflow-visible">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 relative overflow-visible">
            {/* Left: 56x56px Scegli Come Ordinare Icon + "Scegli come ordinare" */}
            <div className="flex items-center gap-3 sm:gap-4 pl-1 sm:pl-2">
              <div className="shrink-0 flex items-center justify-center">
                <img
                  src="/icons/scegli.svg"
                  onError={(e) => {
                    e.currentTarget.src = iconScegli;
                  }}
                  alt={t('chooseHowToOrder')}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-[56px] md:h-[56px] object-contain select-none pointer-events-none"
                  width={56}
                  height={56}
                />
              </div>

              {/* Title Text */}
              <div className="flex flex-col select-none">
                <span className="text-base sm:text-lg md:text-xl font-black text-[#1a1c23] tracking-tight leading-tight font-heading">
                  {t('chooseHowToOrder')}
                </span>
              </div>
            </div>

            {/* Right: 3 Order Mode Option Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 flex-1 md:max-w-xl lg:max-w-2xl relative overflow-visible">
              {/* Option 1: ASPORTO */}
              <button
                id="fulfillment-btn-asporto"
                type="button"
                onClick={handleSelectAsporto}
                className={`flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer text-left select-none ${
                  fulfillmentType === 'asporto'
                    ? 'bg-[#ff5500] text-white shadow-md shadow-[#ff5500]/30 ring-2 ring-[#ff5500]/40'
                    : 'bg-[#f8f9fa] hover:bg-[#f1f3f5] text-[#1c1f26] border border-gray-200/70'
                }`}
              >
                {/* 56x56 Takeaway Shopping Bag Icon */}
                <div className="shrink-0 flex items-center justify-center">
                  <img
                    src={iconAsporto}
                    onError={(e) => {
                      e.currentTarget.src = '/icons/asporto.png';
                    }}
                    alt="Asporto"
                    className={`w-11 h-11 sm:w-13 sm:h-13 md:w-[56px] md:h-[56px] object-contain transition-all ${
                      fulfillmentType === 'asporto' ? 'brightness-0 invert drop-shadow-sm' : ''
                    }`}
                    width={56}
                    height={56}
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs sm:text-sm font-black uppercase tracking-wider leading-tight font-heading ${
                      fulfillmentType === 'asporto' ? 'text-white' : 'text-[#1c1f26]'
                    }`}
                  >
                    {t('asportoTitle')}
                  </span>
                  <span
                    className={`text-[11px] sm:text-xs font-medium leading-tight mt-0.5 whitespace-nowrap ${
                      fulfillmentType === 'asporto' ? 'text-white/90' : 'text-neutral-500'
                    }`}
                  >
                    {t('asportoSub')}
                  </span>
                </div>
              </button>

              {/* Option 2: CONSEGNA */}
              <button
                id="fulfillment-btn-consegna"
                type="button"
                onClick={handleSelectConsegna}
                className={`relative flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer text-left select-none ${
                  fulfillmentType === 'consegna'
                    ? 'bg-[#ff5500] text-white shadow-md shadow-[#ff5500]/30 ring-2 ring-[#ff5500]/40'
                    : 'bg-[#f8f9fa] hover:bg-[#f1f3f5] text-[#1c1f26] border border-gray-200/70'
                }`}
              >
                {/* 56x56 Delivery Scooter Icon */}
                <div className="shrink-0 flex items-center justify-center">
                  <img
                    src={iconConsegna}
                    onError={(e) => {
                      e.currentTarget.src = '/icons/consegna.png';
                    }}
                    alt="Consegna"
                    className={`w-11 h-11 sm:w-13 sm:h-13 md:w-[56px] md:h-[56px] object-contain transition-all ${
                      fulfillmentType === 'consegna' ? 'brightness-0 invert drop-shadow-sm' : ''
                    }`}
                    width={56}
                    height={56}
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-xs sm:text-sm font-black uppercase tracking-wider leading-tight font-heading ${
                      fulfillmentType === 'consegna' ? 'text-white' : 'text-[#1c1f26]'
                    }`}
                  >
                    {t('consegnaTitle')}
                  </span>
                  <span
                    className={`text-[11px] sm:text-xs font-medium leading-tight mt-0.5 whitespace-nowrap ${
                      fulfillmentType === 'consegna' ? 'text-white/90' : 'text-neutral-500'
                    }`}
                  >
                    {t('consegnaSub')}
                  </span>

                  {/* COMING SOON pill badge */}
                  <span
                    className={`inline-block w-fit mt-1 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-black tracking-wider uppercase rounded-full ${
                      fulfillmentType === 'consegna'
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-neutral-600'
                    }`}
                  >
                    {language === 'ru'
                      ? 'СКОРО'
                      : language === 'fr'
                      ? 'BIENTÔT'
                      : language === 'de'
                      ? 'DEMNÄCHST'
                      : language === 'it'
                      ? 'PROSSIMAMENTE'
                      : 'COMING SOON'}
                  </span>
                </div>
              </button>

              {/* Option 3: PRENOTA with Dropdown */}
              <div className="relative overflow-visible">
                <button
                  ref={prenotaButtonRef}
                  id="fulfillment-btn-prenota"
                  type="button"
                  onClick={handleTogglePrenota}
                  aria-expanded={isPrenotaDropdownOpen}
                  className={`w-full relative flex items-center justify-between gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer text-left select-none ${
                    fulfillmentType === 'prenota'
                      ? 'bg-[#ff5500] text-white shadow-md shadow-[#ff5500]/30 ring-2 ring-[#ff5500]/40'
                      : 'bg-[#f8f9fa] hover:bg-[#f1f3f5] text-[#1c1f26] border border-gray-200/70'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* 56x56 Calendar Icon */}
                    <div className="shrink-0 flex items-center justify-center">
                      <img
                        src={iconPrenota}
                        onError={(e) => {
                          e.currentTarget.src = '/icons/prenota.png';
                        }}
                        alt="Prenota"
                        className={`w-11 h-11 sm:w-13 sm:h-13 md:w-[56px] md:h-[56px] object-contain transition-all ${
                          fulfillmentType === 'prenota' ? 'brightness-0 invert drop-shadow-sm' : ''
                        }`}
                        width={56}
                        height={56}
                      />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs sm:text-sm font-black uppercase tracking-wider leading-tight font-heading ${
                            fulfillmentType === 'prenota' ? 'text-white' : 'text-[#1c1f26]'
                          }`}
                        >
                          {t('prenotaTitle')}
                        </span>
                      </div>

                      {hasSelectedCustomSlot && fulfillmentType === 'prenota' ? (
                        <span className="text-[11px] sm:text-xs font-bold leading-tight mt-0.5 text-white flex items-center gap-1 truncate max-w-[150px] sm:max-w-[170px]">
                          <Clock className="w-3 h-3 text-white/90 shrink-0" />
                          <span className="truncate">{selectedTimeSlot}</span>
                        </span>
                      ) : (
                        <span
                          className={`text-[11px] sm:text-xs font-medium leading-tight mt-0.5 whitespace-nowrap ${
                            fulfillmentType === 'prenota' ? 'text-white/90' : 'text-neutral-500'
                          }`}
                        >
                          {t('prenotaSub')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dropdown Chevron indicator */}
                  <div className="shrink-0 pl-1">
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isPrenotaDropdownOpen ? 'rotate-180' : ''
                      } ${fulfillmentType === 'prenota' ? 'text-white' : 'text-neutral-400'}`}
                    />
                  </div>
                </button>

                {/* Dropdown Popover attached directly below PRENOTA button */}
                <PrenotaTimeDropdown
                  isOpen={isPrenotaDropdownOpen}
                  onClose={() => setIsPrenotaDropdownOpen(false)}
                  triggerRef={prenotaButtonRef}
                />
              </div>
            </div>
          </div>

          {/* Selected Booking Time confirmation bar */}
          {fulfillmentType === 'prenota' && hasSelectedCustomSlot && (
            <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between gap-3 text-xs animate-fadeIn">
              <div className="flex items-center gap-2 text-neutral-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#ff5500] shrink-0" />
                <span>
                  {t('timeSlotBooked')}:{' '}
                  <strong className="text-[#ff5500] font-black">{selectedTimeSlot}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPrenotaDropdownOpen(true)}
                className="text-xs text-[#ff5500] hover:text-[#e04a00] font-bold underline cursor-pointer"
              >
                {language === 'ru'
                  ? 'Изменить время'
                  : language === 'en'
                  ? 'Change time'
                  : language === 'de'
                  ? 'Uhrzeit ändern'
                  : language === 'it'
                  ? 'Cambia orario'
                  : "Modifier l'horaire"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
