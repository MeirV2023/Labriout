import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Clock, X, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { STORE_SCHEDULE, getScheduleDayName } from '../data/menuData';

interface PrenotaTimeDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  align?: 'left' | 'right';
}

export const PrenotaTimeDropdown: React.FC<PrenotaTimeDropdownProps> = ({
  isOpen,
  onClose,
  triggerRef,
  align = 'left',
}) => {
  const {
    language,
    t,
    selectedTimeSlot,
    setSelectedTimeSlot,
    setFulfillmentType,
    selectedDayIndex,
    setSelectedDayIndex,
    selectedSlot,
    setSelectedSlot,
  } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mobile bottom sheet drag state (matching Screenshot 4)
  const sheetPanelRef = useRef<HTMLDivElement>(null);
  const sheetScrollRef = useRef<HTMLDivElement>(null);
  const [sheetDragY, setSheetDragY] = useState(0);
  const [isSheetDragging, setIsSheetDragging] = useState(false);
  const sheetTouchRef = useRef<{
    startY: number;
    startX: number;
    lastY: number;
    lastTime: number;
    velocityY: number;
    isDragging: boolean;
  }>({
    startY: 0,
    startX: 0,
    lastY: 0,
    lastTime: 0,
    velocityY: 0,
    isDragging: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSheetDragY(0);
      setIsSheetDragging(false);
    }
  }, [isOpen]);

  // Lock body scroll on mobile when bottom sheet is open
  useEffect(() => {
    if (typeof window === 'undefined' || !isOpen || window.innerWidth >= 768) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Close on click outside (Desktop popover) and Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) return;
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, triggerRef]);

  // Generate selectable dates (next 6 days)
  const availableDays = useMemo(() => {
    const list = [];
    const todayLabel = t('today') || 'Oggi';
    const tomorrowLabel = t('tomorrow') || 'Domani';

    const now = new Date();

    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      const dayOfWeek = d.getDay(); // 0 = Dom, 1 = Lun, 2 = Mar, etc.
      const sched = STORE_SCHEDULE[dayOfWeek];
      const localizedDayName = getScheduleDayName(dayOfWeek, language);

      const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      const shortLabel = i === 0 ? todayLabel : i === 1 ? tomorrowLabel : localizedDayName;
      const fullLabel =
        i === 0
          ? `${todayLabel}, ${localizedDayName} ${dateStr}`
          : i === 1
          ? `${tomorrowLabel}, ${localizedDayName} ${dateStr}`
          : `${localizedDayName} ${dateStr}`;

      list.push({
        dayIndex: i,
        date: d,
        dayOfWeek,
        dayName: localizedDayName,
        shortLabel,
        fullLabel,
        dateStr,
        isClosed: Boolean(sched.isClosed),
        hours: sched.hours,
        slots: sched.slots || [],
      });
    }

    return list;
  }, [language, t]);

  const currentDayIndex =
    typeof selectedDayIndex === 'number' &&
    selectedDayIndex >= 0 &&
    selectedDayIndex < availableDays.length
      ? selectedDayIndex
      : 0;

  const [browsingDayIndex, setBrowsingDayIndex] = useState<number>(currentDayIndex);
  const [pendingMobileSlot, setPendingMobileSlot] = useState<string>(() => {
    if (selectedSlot && selectedTimeSlot !== 'subito') return selectedSlot;
    return 'subito';
  });

  // Sync browsingDayIndex and pendingMobileSlot with current confirmed state whenever opened
  useEffect(() => {
    if (isOpen) {
      setBrowsingDayIndex(currentDayIndex);
      if (selectedSlot && selectedTimeSlot !== 'subito') {
        setPendingMobileSlot(selectedSlot);
      } else {
        setPendingMobileSlot(currentDayIndex === 0 ? 'subito' : availableDays[currentDayIndex]?.slots[0] || '');
      }
    }
  }, [isOpen, currentDayIndex, selectedSlot, selectedTimeSlot, availableDays]);

  const activeDay = availableDays[browsingDayIndex] || availableDays[0];

  const handleSelectDayMobile = (dayIdx: number) => {
    setBrowsingDayIndex(dayIdx);
    const targetDay = availableDays[dayIdx];
    if (!targetDay || targetDay.isClosed) return;
    if (dayIdx === currentDayIndex && selectedSlot && selectedTimeSlot !== 'subito') {
      setPendingMobileSlot(selectedSlot);
    } else if (dayIdx === 0) {
      setPendingMobileSlot('subito');
    } else {
      setPendingMobileSlot(targetDay.slots[0] || '');
    }
  };

  // Desktop immediate slot selection
  const handleSelectSlot = (slot: string) => {
    setSelectedDayIndex(activeDay.dayIndex);
    setSelectedSlot(slot);
    const formatted = `${activeDay.fullLabel} • ${slot}`;
    setSelectedTimeSlot(formatted);
    onClose();
  };

  // Mobile confirm button handler
  const handleConfirmMobileSlot = () => {
    if (activeDay.isClosed) {
      onClose();
      return;
    }
    if (browsingDayIndex === 0 && pendingMobileSlot === 'subito') {
      setSelectedDayIndex(0);
      setSelectedSlot('');
      setSelectedTimeSlot('subito');
      onClose();
      return;
    }
    const chosenSlot = pendingMobileSlot || activeDay.slots[0];
    if (chosenSlot) {
      setSelectedDayIndex(activeDay.dayIndex);
      setSelectedSlot(chosenSlot);
      const formatted = `${activeDay.fullLabel} • ${chosenSlot}`;
      setSelectedTimeSlot(formatted);
    }
    onClose();
  };

  // Touch drag handlers for mobile bottom sheet
  const handleSheetTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    sheetTouchRef.current = {
      startY: touch.clientY,
      startX: touch.clientX,
      lastY: touch.clientY,
      lastTime: performance.now(),
      velocityY: 0,
      isDragging: false,
    };
  };

  const handleSheetTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const state = sheetTouchRef.current;
    const now = performance.now();
    const dt = Math.max(1, now - state.lastTime);
    const vy = (touch.clientY - state.lastY) / dt;
    state.velocityY = state.velocityY * 0.35 + vy * 0.65;
    state.lastY = touch.clientY;
    state.lastTime = now;

    const deltaY = touch.clientY - state.startY;
    const deltaX = touch.clientX - state.startX;
    const scrollTop = sheetScrollRef.current?.scrollTop ?? 0;

    if (!state.isDragging) {
      if (scrollTop <= 0 && deltaY > 4 && Math.abs(deltaY) > Math.abs(deltaX)) {
        state.isDragging = true;
        state.startY = touch.clientY;
        setIsSheetDragging(true);
      } else {
        return;
      }
    }

    const offset = Math.max(0, touch.clientY - state.startY);
    setSheetDragY(offset);
  };

  const handleSheetTouchEnd = () => {
    const state = sheetTouchRef.current;
    if (!state.isDragging) return;
    state.isDragging = false;
    setIsSheetDragging(false);

    const panelHeight = sheetPanelRef.current?.offsetHeight || 420;
    if (sheetDragY > Math.min(120, panelHeight * 0.28) || (state.velocityY > 0.5 && sheetDragY > 30)) {
      onClose();
    } else {
      setSheetDragY(0);
    }
  };

  const mobileTitle =
    language === 'ru'
      ? 'Выберите время'
      : language === 'it'
      ? "Scegli l'orario"
      : language === 'de'
      ? 'Zeit wählen'
      : language === 'fr'
      ? "Choisir l'heure"
      : 'Choose time';

  const asapLabel =
    language === 'ru'
      ? 'Как можно скорее'
      : language === 'it'
      ? 'Prima possibile'
      : language === 'de'
      ? 'So schnell wie möglich'
      : language === 'fr'
      ? 'Dès que possible'
      : 'As soon as possible';

  const selectBtnLabel =
    language === 'ru'
      ? 'Выбрать'
      : language === 'it'
      ? 'Scegli'
      : language === 'de'
      ? 'Auswählen'
      : language === 'fr'
      ? 'Choisir'
      : 'Select';

  const desktopConfirmLabel =
    language === 'ru'
      ? 'Подтвердить время'
      : language === 'it'
      ? 'Conferma orario di ritiro'
      : language === 'de'
      ? 'Abholzeit bestätigen'
      : language === 'fr'
      ? "Confirmer l'heure de retrait"
      : 'Confirm pickup time';

  const getDesktopDayHeaderLabel = (day: typeof activeDay) => {
    if (!day) return '';
    const months: Record<string, string[]> = {
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      it: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
      ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
      de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    };
    const monthList = months[language] || months.en;
    const monthName = monthList[day.date.getMonth()];
    const dayNum = day.date.getDate();
    return `${day.dayName}, ${dayNum} ${monthName}`;
  };

  const desktopSelectedSlot =
    pendingMobileSlot && pendingMobileSlot !== 'subito' && activeDay.slots.includes(pendingMobileSlot)
      ? pendingMobileSlot
      : activeDay.slots[0] || '19:30';

  const handleSelectDayDesktop = (dayIdx: number) => {
    setBrowsingDayIndex(dayIdx);
    const targetDay = availableDays[dayIdx];
    if (!targetDay || targetDay.isClosed) return;
    if (dayIdx === currentDayIndex && selectedSlot && selectedTimeSlot !== 'subito') {
      setPendingMobileSlot(selectedSlot);
    } else {
      setPendingMobileSlot(targetDay.slots[0] || '19:30');
    }
  };

  return (
    <>
      {/* =================================================================== */}
      {/* MOBILE BOTTOM SHEET (Matches Screenshot 3 & Screenshot 4)           */}
      {/* =================================================================== */}
      {mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            aria-hidden={!isOpen}
            className={`md:hidden fixed inset-0 z-[110] flex flex-col justify-end ${
              isOpen
                ? 'pointer-events-auto visible [transition:visibility_0s_linear_0s]'
                : 'pointer-events-none invisible [transition:visibility_0s_linear_0.34s]'
            }`}
            onClick={onClose}
          >
            {/* Smooth Backdrop Overlay */}
            <div
              style={{
                opacity: isOpen ? Math.max(0, 1 - sheetDragY / 380) : 0,
                transition: isSheetDragging
                  ? 'none'
                  : 'opacity 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
              }}
              className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            />

            {/* Smooth Sliding Sheet Wrapper */}
            <div
              ref={sheetPanelRef}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleSheetTouchStart}
              onTouchMove={handleSheetTouchMove}
              onTouchEnd={handleSheetTouchEnd}
              onTouchCancel={handleSheetTouchEnd}
              style={{
                transform: isOpen
                  ? `translate3d(0, ${sheetDragY}px, 0)`
                  : 'translate3d(0, 105%, 0)',
                transition: isSheetDragging
                  ? 'none'
                  : 'transform 0.34s cubic-bezier(0.32, 0.72, 0, 1)',
                willChange: 'transform',
              }}
              className="relative z-10 w-full flex flex-col justify-end max-h-full"
            >
              {/* Top Drag Pill Indicator (Screenshot 4) */}
              <div
                onClick={onClose}
                className="w-full pt-1.5 pb-1.5 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing select-none"
              >
                <div className="w-10 h-1 rounded-full bg-white/80 shadow-2xs" />
              </div>

              {/* White Sheet Body (Screenshot 3) */}
              <div className="w-full bg-white rounded-t-[28px] pt-5 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.28)] flex flex-col max-h-[82dvh]">
                {/* Header Row: Title on Left + Circular Close Button on Right */}
                <div className="flex items-center justify-between shrink-0">
                  <h2 className="text-[22px] font-bold text-[#21201F] tracking-tight leading-tight">
                    {mobileTitle}
                  </h2>
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="w-9 h-9 rounded-full bg-[#F5F4F2] hover:bg-[#EAE8E4] active:scale-95 flex items-center justify-center text-[#21201F] transition cursor-pointer shrink-0"
                  >
                    <X className="w-5 h-5 stroke-[2.2]" />
                  </button>
                </div>

                {/* Day Selector Pills Row (Screenshot 3: "Сегодня", "Завтра", etc.) */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-4 pb-2 -mx-4 px-4 shrink-0">
                  {availableDays.map((day) => {
                    const isDaySelected = browsingDayIndex === day.dayIndex;
                    const pillText =
                      day.dayIndex <= 1 ? day.shortLabel : `${day.dayName}, ${day.dateStr}`;
                    return (
                      <button
                        key={day.dayIndex}
                        type="button"
                        onClick={() => handleSelectDayMobile(day.dayIndex)}
                        className={`shrink-0 px-5 py-2.5 rounded-full text-[15px] leading-none transition-colors cursor-pointer select-none ${
                          isDaySelected
                            ? 'bg-[#21201F] text-white font-semibold'
                            : 'bg-[#F5F4F2] text-[#21201F] font-medium hover:bg-[#EAE8E4]'
                        }`}
                      >
                        {pillText}
                      </button>
                    );
                  })}
                </div>

                {/* Vertical List of Time Slots with Radio Buttons (Screenshot 3) */}
                <div
                  ref={sheetScrollRef}
                  style={{ overscrollBehaviorY: 'contain', WebkitOverflowScrolling: 'touch' }}
                  className="flex-1 overflow-y-auto divide-y divide-[#F0EFED] my-1 pr-0.5 no-scrollbar"
                >
                  {activeDay.isClosed ? (
                    <div className="py-8 px-4 text-center space-y-3">
                      <div className="w-11 h-11 mx-auto rounded-full bg-[#FF4A00]/10 text-[#FF4A00] flex items-center justify-center">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <p className="text-[14px] text-[#21201F] font-medium leading-relaxed">
                        {t('closedTuesdayNotice')}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleSelectDayMobile(browsingDayIndex === 0 ? 1 : 0)}
                        className="px-5 py-2.5 rounded-full bg-[#21201F] text-white font-semibold text-[13px] transition cursor-pointer active:scale-95"
                      >
                        {t('viewTomorrowHours')}
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* "Как можно скорее" option at the top for Today (Screenshot 3) */}
                      {activeDay.dayIndex === 0 && (
                        <button
                          type="button"
                          onClick={() => setPendingMobileSlot('subito')}
                          className="w-full py-4 flex items-center justify-between text-left cursor-pointer select-none group"
                        >
                          <span
                            className={`text-[16px] text-[#21201F] ${
                              pendingMobileSlot === 'subito' ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {asapLabel}
                          </span>
                          {pendingMobileSlot === 'subito' ? (
                            <span className="w-[22px] h-[22px] rounded-full bg-[#21201F] flex items-center justify-center shrink-0">
                              <span className="w-[8px] h-[8px] rounded-full bg-white" />
                            </span>
                          ) : (
                            <span className="w-[22px] h-[22px] rounded-full border-[1.8px] border-[#D5D3D0] bg-[#F5F4F2]/60 shrink-0" />
                          )}
                        </button>
                      )}

                      {activeDay.slots.map((slot) => {
                        const isSelected = pendingMobileSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setPendingMobileSlot(slot)}
                            className="w-full py-4 flex items-center justify-between text-left cursor-pointer select-none group"
                          >
                            <span
                              className={`text-[16px] text-[#21201F] ${
                                isSelected ? 'font-medium' : 'font-normal'
                              }`}
                            >
                              {slot}
                            </span>
                            {isSelected ? (
                              <span className="w-[22px] h-[22px] rounded-full bg-[#21201F] flex items-center justify-center shrink-0">
                                <span className="w-[8px] h-[8px] rounded-full bg-white" />
                              </span>
                            ) : (
                              <span className="w-[22px] h-[22px] rounded-full border-[1.8px] border-[#D5D3D0] bg-[#F5F4F2]/60 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>

                {/* Bottom Action Button ("Выбрать" / "Scegli", matching Screenshot 3 & 4) */}
                {!activeDay.isClosed && (
                  <button
                    type="button"
                    onClick={handleConfirmMobileSlot}
                    className="w-full h-[52px] rounded-[18px] bg-[#FF4A00] hover:bg-[#ff5500] active:scale-[0.99] text-white font-semibold text-[16px] flex items-center justify-center mt-3 cursor-pointer select-none transition shadow-sm shadow-[#FF4A00]/25 shrink-0"
                  >
                    {selectBtnLabel}
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* =================================================================== */}
      {/* DESKTOP DROPDOWN POPOVER (hidden md:block) - Matches Screenshot 2   */}
      {/* =================================================================== */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`hidden md:block absolute top-full mt-2 z-50 w-[310px] sm:w-[324px] max-w-[calc(100vw-24px)] bg-white border border-[#E5E7EB] rounded-[22px] shadow-[0_20px_48px_-12px_rgba(0,0,0,0.20),0_4px_14px_rgba(0,0,0,0.06)] overflow-hidden animate-fadeIn ${
            align === 'right' ? 'right-0' : 'right-0 lg:left-1/2 lg:-translate-x-1/2'
          }`}
        >
          {/* Header bar */}
          <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#FF4D00] stroke-[2] shrink-0" />
              <span className="font-heading font-extrabold text-[15px] text-[#111827] tracking-tight leading-none">
                {t('chooseTimeSlot')}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-6 h-6 rounded-full hover:bg-neutral-100 text-[#4B5563] hover:text-[#111827] flex items-center justify-center transition cursor-pointer -mr-0.5"
              aria-label="Close"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {/* Top Segmented Day Switcher + Day Pills Row */}
          <div className="px-4 pb-3 space-y-2">
            {/* Primary capsule for Today & Tomorrow */}
            <div className="bg-[#F2F3F5] p-0.5 rounded-full border border-[#E5E7EB] flex items-center">
              <button
                type="button"
                onClick={() => handleSelectDayDesktop(0)}
                className={`flex-1 py-1.5 px-3 rounded-full text-[12px] tracking-tight text-center transition-all cursor-pointer select-none ${
                  browsingDayIndex === 0
                    ? 'bg-[#FF4D00] text-white font-bold shadow-xs'
                    : 'text-[#111827] font-semibold hover:text-[#FF4D00]'
                }`}
              >
                {availableDays[0]?.shortLabel}
              </button>

              <button
                type="button"
                onClick={() => handleSelectDayDesktop(1)}
                className={`flex-1 py-1.5 px-3 rounded-full text-[12px] tracking-tight text-center transition-all cursor-pointer select-none ${
                  browsingDayIndex === 1
                    ? 'bg-[#FF4D00] text-white font-bold shadow-xs'
                    : 'text-[#111827] font-semibold hover:text-[#FF4D00]'
                }`}
              >
                {availableDays[1]?.shortLabel}
              </button>
            </div>

            {/* Horizontal list of days */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 no-scrollbar">
              {availableDays.map((day) => {
                const isSelected = browsingDayIndex === day.dayIndex;
                return (
                  <button
                    key={day.dayIndex}
                    type="button"
                    onClick={() => handleSelectDayDesktop(day.dayIndex)}
                    className={`shrink-0 px-2.5 py-1.5 rounded-[9px] text-[11px] transition-all cursor-pointer select-none flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-[#FF4D00] border-[#FF4D00] text-white font-bold shadow-xs'
                        : 'bg-[#F4F5F7] hover:bg-[#EAECEF] border-[#E5E7EB] text-[#111827] font-semibold'
                    }`}
                  >
                    <span>{day.dayName}</span>
                    <span
                      className={`text-[10.5px] font-normal ${
                        isSelected ? 'text-white/95' : 'text-[#6B7280]'
                      }`}
                    >
                      {day.dateStr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtle horizontal divider */}
          <div className="mx-4 border-t border-[#E5E7EB]" />

          {/* Selected Day & Opening hours summary row */}
          <div className="px-4 pt-2.5 pb-2 flex items-center justify-between text-[11.5px]">
            <span className="text-[#111827] font-bold">
              {getDesktopDayHeaderLabel(activeDay)}
            </span>
            <span
              className={`font-bold ${
                activeDay.isClosed ? 'text-red-500' : 'text-[#FF4D00]'
              }`}
            >
              {activeDay.isClosed
                ? t('closedTuesdayNotice') || 'Chiuso'
                : activeDay.hours}
            </span>
          </div>

          {/* 3-Column Grid of Time Slots */}
          <div className="px-4 pb-3">
            {activeDay.isClosed ? (
              <div className="p-3 text-center space-y-2.5 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <div className="w-8 h-8 mx-auto rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <p className="text-[11px] text-[#4B5563] font-medium leading-relaxed">
                  {t('closedTuesdayNotice')}
                </p>
                <button
                  type="button"
                  onClick={() => handleSelectDayDesktop(browsingDayIndex === 0 ? 1 : 0)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#FF4D00] hover:bg-[#ff5500] text-white font-bold text-[11px] transition cursor-pointer shadow-xs"
                >
                  {t('viewTomorrowHours')}
                </button>
              </div>
            ) : activeDay.slots.length === 0 ? (
              <div className="p-3 text-center text-[11px] text-[#6B7280]">
                {language === 'ru'
                  ? 'На этот день нет доступных интервалов.'
                  : language === 'en'
                  ? 'No time slots available for this day.'
                  : language === 'de'
                  ? 'Keine Zeitfenster für diesen Tag verfügbar.'
                  : language === 'it'
                  ? 'Nessun orario disponibile per questa giornata.'
                  : 'Aucun créneau disponible pour ce jour.'}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5">
                {activeDay.slots.map((slot) => {
                  const isSelected = desktopSelectedSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setPendingMobileSlot(slot)}
                      className={`h-[34px] rounded-[9px] text-[12px] font-bold flex items-center justify-center gap-1 transition-all duration-150 cursor-pointer select-none border ${
                        isSelected
                          ? 'bg-[#FF4D00] border-[#FF4D00] text-white shadow-sm shadow-[#FF4D00]/25'
                          : 'bg-white border-[#E2E4E9] text-[#111827] hover:border-[#FF4D00] hover:text-[#FF4D00]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5] shrink-0" />}
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirm Button & Footer Address Notice */}
          <div className="px-4 pb-3.5 pt-0.5">
            {!activeDay.isClosed && activeDay.slots.length > 0 && (
              <button
                type="button"
                onClick={() => handleSelectSlot(desktopSelectedSlot)}
                className="w-full h-[38px] rounded-[11px] bg-[#FF4D00] hover:bg-[#ff5500] active:scale-[0.99] text-white font-bold text-[12.5px] flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none shadow-sm shadow-[#FF4D00]/25"
              >
                <span>{desktopConfirmLabel}</span>
                <span>•</span>
                <span>{desktopSelectedSlot}</span>
              </button>
            )}

            <div className="mt-2.5 flex items-center justify-center gap-1 text-[10.5px] text-[#6B7280]">
              <svg
                viewBox="0 0 24 24"
                className="w-3.5 h-3.5 text-[#FF4D00] shrink-0 fill-current"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
              </svg>
              <span className="truncate">{t('pickupAddressNotice')}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

