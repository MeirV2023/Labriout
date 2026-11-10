import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Info,
  Check,
  Tag,
  ShoppingBag,
  PlusCircle,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Utensils,
  Car,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import {
  MENU_PRODUCTS,
  INITIAL_SAMPLE_CART_ITEMS,
  STORE_DETAILS,
  STORE_SCHEDULE,
  getAvailableExtrasForProduct,
  getScheduleDayName,
} from '../data/menuData';
import { getLabrioutTagline } from '../data/labrioutMenuData';
import { ExtraOption, ProductItem, SelectedExtra } from '../types';
import { ProductCard } from './ProductCard';
import {
  getLocalizedProductName,
  getLocalizedExtraName as translateExtraName,
} from '../utils/menuTranslations';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    softDeleteItem,
    restoreItem,
    isItemSoftDeleted,
    clearCart,
    updateCartItemExtras,
    subtotal,
    deliveryFee,
    discountAmount,
    total,
    itemsCount,
    fulfillmentType,
    setFulfillmentType,
    selectedTimeSlot,
    selectedSlot,
    selectedDayIndex,
    openProductDetail,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setCurrentView,
    addToCart,
    language,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; error?: boolean } | null>(null);
  const [expandedExtras, setExpandedExtras] = useState<Record<string, boolean>>({});

  // Mobile-specific states (Screen 2, 6, 7, 8)
  const [isDeliverySheetOpen, setIsDeliverySheetOpen] = useState(false);
  const [isStoreInfoExpanded, setIsStoreInfoExpanded] = useState(false);
  const [isDesktopInfoHovered, setIsDesktopInfoHovered] = useState(false);
  const [isDesktopStoreInfoExpanded, setIsDesktopStoreInfoExpanded] = useState(true);
  const [cutleryCount, setCutleryCount] = useState(0);
  const [isMobilePromoOpen, setIsMobilePromoOpen] = useState(false);

  // Smooth touch drag-to-close state for mobile delivery/pickup info sheet
  const deliverySheetPanelRef = useRef<HTMLDivElement>(null);
  const deliverySheetScrollRef = useRef<HTMLDivElement>(null);
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
    if (!isDeliverySheetOpen) {
      setSheetDragY(0);
      setIsSheetDragging(false);
    }
  }, [isDeliverySheetOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isDeliverySheetOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDeliverySheetOpen) {
        setIsDeliverySheetOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isDeliverySheetOpen]);

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
    const scrollTop = deliverySheetScrollRef.current?.scrollTop ?? 0;

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

    const panelHeight = deliverySheetPanelRef.current?.offsetHeight || 420;
    if (sheetDragY > Math.min(120, panelHeight * 0.28) || (state.velocityY > 0.5 && sheetDragY > 30)) {
      setIsDeliverySheetOpen(false);
    } else {
      setSheetDragY(0);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponFeedback({ msg: res.message, error: !res.success });
    if (res.success) {
      setInputCoupon('');
    }
  };

  const toggleExtraDropdown = (cartItemId: string) => {
    setExpandedExtras(prev => ({
      ...prev,
      [cartItemId]: !prev[cartItemId],
    }));
  };

  const getLocalizedExtraName = (prod: ProductItem, extra: SelectedExtra | ExtraOption): string => {
    const avail = getAvailableExtrasForProduct(prod);
    const match = avail.find(e => e.id === extra.id) || (extra as ExtraOption);
    return translateExtraName(match, language);
  };

  const handleToggleExtra = (item: typeof items[0], extra: ExtraOption) => {
    const currentExtras = item.selectedExtras || [];
    const exists = currentExtras.some(e => e.id === extra.id);
    let nextExtras: SelectedExtra[];
    if (exists) {
      nextExtras = currentExtras.filter(e => e.id !== extra.id);
    } else {
      nextExtras = [
        ...currentExtras,
        {
          id: extra.id,
          name: getLocalizedExtraName(item.product, extra),
          price: extra.price,
        },
      ];
    }
    updateCartItemExtras(item.cartItemId, nextExtras, item.specialNotes);
  };

  const handleRestoreSample = () => {
    INITIAL_SAMPLE_CART_ITEMS.forEach(sample => {
      addToCart(sample.product, sample.quantity, sample.selectedExtras, sample.specialNotes);
    });
  };

  // Recommended products for Desktop (4 items) and Mobile (6 items = 2 rows of 3)
  const allRecommendedProducts = useMemo(() => {
    const inCartIds = new Set(items.map(i => i.product?.id || i.productId));
    const candidates = MENU_PRODUCTS.filter(p => !inCartIds.has(p.id));
    const pool = candidates.length >= 6 ? candidates : MENU_PRODUCTS;
    const drinks = pool.filter(p => p.category === 'bevande');
    const others = pool.filter(p => p.category !== 'bevande');

    const firstDrink = drinks.length > 0 ? drinks[0] : pool[0];
    const otherCandidates = others.filter(p => p.id !== firstDrink?.id);
    const chosenOthers = [...otherCandidates].slice(0, 5);

    return firstDrink ? [firstDrink, ...chosenOthers] : pool.slice(0, 6);
  }, [items.length]);

  const recommendedProducts = useMemo(() => allRecommendedProducts.slice(0, 4), [allRecommendedProducts]);
  const mobileRecommendedProducts = useMemo(() => allRecommendedProducts.slice(0, 6), [allRecommendedProducts]);

  // Helper for localized weight on mobile
  const getLocalizedWeight = (prod?: ProductItem) => {
    if (!prod) return '200 g';
    const isDrink = prod.category === 'bevande';
    if (isDrink) {
      const nameToCheck = `${prod.name} ${prod.nameEn || ''} ${prod.weight || ''}`;
      const literMatch = nameToCheck.match(/(\d+(?:[.,]\d+)?)\s*(?:l|lt|litr[io]?)\b/i);
      if (literMatch) {
        const val = literMatch[1].replace(',', '.');
        return language === 'ru' ? `${val} л` : `${val} L`;
      }
      const clMatch = nameToCheck.match(/(\d+)\s*(?:cl|сл)\b/i);
      if (clMatch) {
        return language === 'ru' ? `${clMatch[1]} сл` : `${clMatch[1]} cl`;
      }
      const mlMatch = nameToCheck.match(/(\d+)\s*(?:ml|мл)\b/i);
      if (mlMatch) {
        return language === 'ru' ? `${mlMatch[1]} мл` : `${mlMatch[1]} ml`;
      }
      if (prod.weight) {
        return language === 'ru'
          ? prod.weight.replace(/\bcl\b/i, 'сл').replace(/\bml\b/i, 'мл').replace(/\bl\b/i, 'л')
          : prod.weight;
      }
      return language === 'ru' ? '33 сл' : '33 cl';
    }

    const defaultGrams = prod.category === 'panini' || prod.category === 'panini_special' ? 265 : 200;
    const baseWeight = prod.weight || `${defaultGrams} g`;
    if (language === 'ru') {
      return baseWeight.replace(/\s*g\b/i, ' г').replace(/\s*gr\b/i, ' г');
    }
    return baseWeight.replace(/\s*г\b/i, ' g').replace(/\s*gr\b/i, ' g');
  };

  // Operating hours for today from STORE_SCHEDULE
  const getTodayHours = () => {
    const dayOfWeek = new Date().getDay();
    const sched = STORE_SCHEDULE[dayOfWeek];
    const rawHours = sched?.hours || '19:30 – 23:00';
    const parts = rawHours.split(/[–-]/).map(s => s.trim());
    return {
      start: parts[0] || '19:30',
      end: parts[1] || '23:00',
    };
  };
  const todayHours = getTodayHours();

  // Multilingual UI texts matching Screenshot 2 design
  const labels = {
    ru: {
      back: 'Вернуться в каталог',
      title: 'Корзина',
      clear: 'Очистить корзину',
      deliveryFreeTitle: 'Доставка 0 €',
      pickupFreeTitle: 'Самовывоз 0 €',
      deliveryOldFee: '5,00 €',
      deliverySub: 'А это всегда приятно',
      emptyTitle: 'Корзина пуста',
      emptySub: 'Добавьте фирменные бургеры, сэндвичи и блюда из нашего меню!',
      browseMenu: 'Перейти в меню',
      loadSample: 'Загрузить пример заказа',
      addExtra: '+ Добавить добавку',
      closeExtra: 'Скрыть добавки',
      summaryTitle: 'Итого',
      deliveryTab: 'Доставка',
      pickupTab: 'Самовывоз',
      summaryDeliveryTime: 'Доставка 20–35 мин',
      summaryPickupTime: 'Готово через 15–20 мин',
      shortDeliveryMins: '20–35 мин',
      productsTotal: (count: number) => `Товары (${count})`,
      discount: 'Скидки',
      delivery: 'Доставка',
      free: '0 €',
      toPay: 'К оплате',
      checkoutBtn: 'Перейти к оплате',
      promoQuestion: 'Есть промокод?',
      promoBanner: 'У вас 1 промокод',
      promoPlaceholder: 'Введите промокод',
      apply: 'Применить',
      removePromo: 'Удалить',
      recommendedTitle: 'Подобрали для вас',
      mobileRecommendedTitle: 'Порадовать себя',
      seeAll: 'Все ›',
      trust1Title: 'Быстрая доставка',
      trust1Sub: 'Прямо к вашей двери в Бонёй-сюр-Марн и окрестностях.',
      trust2Title: 'Безопасная оплата',
      trust2Sub: 'Все платежи защищены и зашифрованы.',
      trust3Title: 'Служба заботы',
      trust3Sub: 'Всегда готовы ответить на любые вопросы.',
      currency: '€',
      undo: 'Вернуть',
      unitPiece: '1 шт.',
      notePrefix: 'Комментарий:',
      decAria: 'Уменьшить количество',
      incAria: 'Увеличить количество',
      removeTitle: 'Удалить',
      addCutlery: 'Добавить приборы',
      mobileDeliveryFreeSub: 'Доставка бесплатно',
      mobileDeliveryPaidSub: `Бесплатная доставка от ${STORE_DETAILS.freeDeliveryThreshold} €`,
      sheetDeliveryTitle: 'Доставка',
      sheetCourierTime: 'Курьер приедет за 20–35 мин',
      sheetWorkingHours: `Режим работы: с ${todayHours.start} до ${todayHours.end}`,
      sheetConditions: 'Условия',
      sheetCart: 'Корзина',
      sheetFreeDeliveryRow: 'Доставка 0 €',
      sheetStoreInfoTitle: 'Информация о ресторане',
      sheetOkBtn: 'Хорошо',
    },
    it: {
      back: 'Torna al catalogo',
      title: 'Carrello',
      clear: 'Svuota carrello',
      deliveryFreeTitle: 'Consegna 0 €',
      pickupFreeTitle: 'Ritiro in sede 0 €',
      deliveryOldFee: '5,00 €',
      deliverySub: 'Ed è sempre un piacere',
      emptyTitle: 'Il tuo carrello è vuoto',
      emptySub: "Aggiungi i nostri smash burger, panini e specialità fatte in casa per completare l'ordine!",
      browseMenu: 'Scopri il Menù',
      loadSample: 'Carica Esempio',
      addExtra: '+ Aggiungi extra',
      closeExtra: 'Chiudi opzioni extra',
      summaryTitle: 'Riepilogo Ordine',
      deliveryTab: 'Consegna',
      pickupTab: 'Asporto',
      summaryDeliveryTime: 'Consegna in 20–35 min',
      summaryPickupTime: 'Pronto in 15–20 min',
      shortDeliveryMins: '20–35 min',
      productsTotal: (count: number) => `Totale prodotti (${count})`,
      discount: 'Sconti',
      delivery: 'Spedizione',
      free: 'Gratis',
      toPay: 'Totale',
      checkoutBtn: 'Procedi al pagamento',
      promoQuestion: 'Hai un codice sconto?',
      promoBanner: 'Hai 1 codice promo',
      promoPlaceholder: 'Inserisci il codice',
      apply: 'Applica',
      removePromo: 'Rimuovi',
      recommendedTitle: 'Consigliati per te',
      mobileRecommendedTitle: 'Consigliati per te',
      seeAll: 'Vedi tutti ›',
      trust1Title: 'Consegna a domicilio',
      trust1Sub: 'Rapida e sicura, direttamente a casa tua.',
      trust2Title: 'Pagamento sicuro',
      trust2Sub: 'Tutti i pagamenti sono protetti e crittografati.',
      trust3Title: 'Assistenza sempre attiva',
      trust3Sub: 'Per qualsiasi dubbio o richiesta, siamo qui per te.',
      currency: '€',
      undo: 'Ripristina',
      unitPiece: '1 pz.',
      notePrefix: 'Nota:',
      decAria: 'Diminuisci quantità',
      incAria: 'Aumenta quantità',
      removeTitle: 'Rimuovi',
      addCutlery: 'Aggiungi posate',
      mobileDeliveryFreeSub: 'Consegna gratuita',
      mobileDeliveryPaidSub: `Consegna gratuita da ${STORE_DETAILS.freeDeliveryThreshold} €`,
      sheetDeliveryTitle: 'Consegna',
      sheetCourierTime: 'Il corriere arriva in 20–35 min',
      sheetWorkingHours: `Orari di apertura: dalle ${todayHours.start} alle ${todayHours.end}`,
      sheetConditions: 'Condizioni',
      sheetCart: 'Carrello',
      sheetFreeDeliveryRow: 'Consegna 0 €',
      sheetStoreInfoTitle: 'Informazioni sul locale',
      sheetOkBtn: 'Ho capito',
    },
    en: {
      back: 'Back to catalog',
      title: 'Cart',
      clear: 'Clear cart',
      deliveryFreeTitle: 'Delivery 0 €',
      pickupFreeTitle: 'Pickup 0 €',
      deliveryOldFee: '€5.00',
      deliverySub: 'Always a pleasure',
      emptyTitle: 'Your cart is empty',
      emptySub: 'Add our homemade smash burgers, sandwiches, plates and drinks to start your order!',
      browseMenu: 'Browse Menu',
      loadSample: 'Load Sample Items',
      addExtra: '+ Add extras',
      closeExtra: 'Close extras',
      summaryTitle: 'Summary',
      deliveryTab: 'Delivery',
      pickupTab: 'Pickup',
      summaryDeliveryTime: 'Delivery in 20–35 min',
      summaryPickupTime: 'Ready in 15–20 min',
      shortDeliveryMins: '20–35 min',
      productsTotal: (count: number) => `Items (${count})`,
      discount: 'Discounts',
      delivery: 'Delivery',
      free: 'Free',
      toPay: 'Total',
      checkoutBtn: 'Proceed to checkout',
      promoQuestion: 'Have a promo code?',
      promoBanner: 'You have 1 promo code',
      promoPlaceholder: 'Enter code',
      apply: 'Apply',
      removePromo: 'Remove',
      recommendedTitle: 'You might also like',
      mobileRecommendedTitle: 'You might also like',
      seeAll: 'All ›',
      trust1Title: 'Home delivery',
      trust1Sub: 'Fast and safe, directly to your door.',
      trust2Title: 'Secure payment',
      trust2Sub: 'All payments are encrypted and secure.',
      trust3Title: 'Customer support',
      trust3Sub: 'Always ready to help with any questions.',
      currency: '€',
      undo: 'Undo',
      unitPiece: '1 pc.',
      notePrefix: 'Note:',
      decAria: 'Decrease quantity',
      incAria: 'Increase quantity',
      removeTitle: 'Remove',
      addCutlery: 'Add cutlery',
      mobileDeliveryFreeSub: 'Free delivery',
      mobileDeliveryPaidSub: `Free delivery from €${STORE_DETAILS.freeDeliveryThreshold}`,
      sheetDeliveryTitle: 'Delivery',
      sheetCourierTime: 'Courier arrives in 20–35 min',
      sheetWorkingHours: `Opening hours: ${todayHours.start} – ${todayHours.end}`,
      sheetConditions: 'Conditions',
      sheetCart: 'Cart',
      sheetFreeDeliveryRow: 'Delivery 0 €',
      sheetStoreInfoTitle: 'Store information',
      sheetOkBtn: 'Got it',
    },
    de: {
      back: 'Zurück zum Menü',
      title: 'Warenkorb',
      clear: 'Warenkorb leeren',
      deliveryFreeTitle: 'Lieferung 0 €',
      pickupFreeTitle: 'Abholung 0 €',
      deliveryOldFee: '€5.00',
      deliverySub: 'Immer ein Vergnügen',
      emptyTitle: 'Ihr Warenkorb ist leer',
      emptySub: 'Fügen Sie etwas Leckeres aus unserer Speisekarte hinzu!',
      browseMenu: 'Menü entdecken',
      loadSample: 'Beispiel laden',
      addExtra: '+ Extras hinzufügen',
      closeExtra: 'Extras schließen',
      summaryTitle: 'Übersicht',
      deliveryTab: 'Lieferung',
      pickupTab: 'Abholung',
      summaryDeliveryTime: 'Lieferung in 20–35 Min',
      summaryPickupTime: 'Fertig in 15–20 Min',
      shortDeliveryMins: '20–35 Min',
      productsTotal: (count: number) => `Artikel (${count})`,
      discount: 'Rabatte',
      delivery: 'Lieferung',
      free: 'Kostenlos',
      toPay: 'Gesamtbetrag',
      checkoutBtn: 'Zur Kasse',
      promoQuestion: 'Gutscheincode?',
      promoBanner: 'Sie haben 1 Gutscheincode',
      promoPlaceholder: 'Code eingeben',
      apply: 'Einlösen',
      removePromo: 'Entfernen',
      recommendedTitle: 'Für Sie ausgewählt',
      mobileRecommendedTitle: 'Für Sie ausgewählt',
      seeAll: 'Alle ›',
      trust1Title: 'Lieferung nach Hause',
      trust1Sub: 'Schnell und sicher direkt zu Ihnen.',
      trust2Title: 'Sichere Zahlung',
      trust2Sub: 'Alle Zahlungen sind geschützt.',
      trust3Title: 'Kundenservice',
      trust3Sub: 'Wir sind jederzeit für Sie da.',
      currency: '€',
      undo: 'Wiederherstellen',
      unitPiece: '1 Stk.',
      notePrefix: 'Hinweis:',
      decAria: 'Menge verringern',
      incAria: 'Menge erhöhen',
      removeTitle: 'Entfernen',
      addCutlery: 'Besteck hinzufügen',
      mobileDeliveryFreeSub: 'Kostenlose Lieferung',
      mobileDeliveryPaidSub: `Kostenlose Lieferung ab ${STORE_DETAILS.freeDeliveryThreshold} €`,
      sheetDeliveryTitle: 'Lieferung',
      sheetCourierTime: 'Kurier kommt in 20–35 Min',
      sheetWorkingHours: `Öffnungszeiten: ${todayHours.start} – ${todayHours.end}`,
      sheetConditions: 'Bedingungen',
      sheetCart: 'Warenkorb',
      sheetFreeDeliveryRow: 'Lieferung 0 €',
      sheetStoreInfoTitle: 'Restaurant-Informationen',
      sheetOkBtn: 'Verstanden',
    },
    fr: {
      back: 'Retour au catalogue',
      title: 'Panier',
      clear: 'Vider le panier',
      deliveryFreeTitle: 'Livraison 0 €',
      pickupFreeTitle: 'Retrait sur place 0 €',
      deliveryOldFee: '5,00 €',
      deliverySub: "C'est toujours un plaisir",
      emptyTitle: 'Votre panier est vide',
      emptySub: 'Ajoutez nos smash burgers, sandwichs et spécialités maison pour commencer !',
      browseMenu: 'Explorer le Menu',
      loadSample: "Charger l'exemple",
      addExtra: '+ Ajouter des extras',
      closeExtra: 'Fermer les extras',
      summaryTitle: 'Récapitulatif',
      deliveryTab: 'Livraison',
      pickupTab: 'À emporter',
      summaryDeliveryTime: 'Livraison en 20–35 min',
      summaryPickupTime: 'Prêt en 15–20 min',
      shortDeliveryMins: '20–35 min',
      productsTotal: (count: number) => `Articles (${count})`,
      discount: 'Réductions',
      delivery: 'Livraison',
      free: 'Gratuit',
      toPay: 'Total',
      checkoutBtn: 'Passer la commande',
      promoQuestion: 'Vous avez un code promo ?',
      promoBanner: 'Vous avez 1 code promo',
      promoPlaceholder: 'Entrez le code',
      apply: 'Appliquer',
      removePromo: 'Supprimer',
      recommendedTitle: 'Sélectionné pour vous',
      mobileRecommendedTitle: 'Sélectionné pour vous',
      seeAll: 'Tout voir ›',
      trust1Title: 'Livraison à domicile',
      trust1Sub: 'Rapide et sûre, directement chez vous.',
      trust2Title: 'Paiement sécurisé',
      trust2Sub: 'Tous les paiements sont cryptés et sécurisés.',
      trust3Title: 'Service client',
      trust3Sub: 'Nous sommes à votre écoute pour toute question.',
      currency: '€',
      undo: 'Restaurer',
      unitPiece: '1 pce',
      notePrefix: 'Note :',
      decAria: 'Diminuer la quantité',
      incAria: 'Augmenter la quantité',
      removeTitle: 'Retirer',
      addCutlery: 'Ajouter des couverts',
      mobileDeliveryFreeSub: 'Livraison gratuite',
      mobileDeliveryPaidSub: `Livraison gratuite dès ${STORE_DETAILS.freeDeliveryThreshold} €`,
      sheetDeliveryTitle: 'Livraison',
      sheetCourierTime: 'Le livreur arrive en 20–35 min',
      sheetWorkingHours: `Horaires d'ouverture : ${todayHours.start} – ${todayHours.end}`,
      sheetConditions: 'Conditions',
      sheetCart: 'Panier',
      sheetFreeDeliveryRow: 'Livraison 0 €',
      sheetStoreInfoTitle: 'Informations sur le restaurant',
      sheetOkBtn: 'Compris',
    },
  }[language];

  const hasCustomTimeSelected = Boolean(
    selectedSlot && selectedTimeSlot && selectedTimeSlot !== 'subito'
  );

  const getScheduledCartTimeText = (shortForHeadline = false) => {
    const isPickup = fulfillmentType === 'asporto';

    if (selectedDayIndex === 0) {
      if (shortForHeadline) {
        if (language === 'ru') return `К ${selectedSlot}`;
        if (language === 'it') return `Entro le ${selectedSlot}`;
        if (language === 'de') return `Bis ${selectedSlot}`;
        if (language === 'fr') return `Pour ${selectedSlot}`;
        return `By ${selectedSlot}`;
      }
      if (language === 'ru') return `${isPickup ? 'Самовывоз' : 'Доставка'} сегодня к ${selectedSlot}`;
      if (language === 'it') return `${isPickup ? 'Ritiro' : 'Consegna'} oggi alle ${selectedSlot}`;
      if (language === 'de') return `${isPickup ? 'Abholung' : 'Lieferung'} heute um ${selectedSlot}`;
      if (language === 'fr') return `${isPickup ? 'Retrait' : 'Livraison'} aujourd'hui à ${selectedSlot}`;
      return `${isPickup ? 'Pickup' : 'Delivery'} today at ${selectedSlot}`;
    }

    if (selectedDayIndex === 1) {
      if (shortForHeadline) {
        if (language === 'ru') return `Завтра к ${selectedSlot}`;
        if (language === 'it') return `Domani alle ${selectedSlot}`;
        if (language === 'de') return `Morgen um ${selectedSlot}`;
        if (language === 'fr') return `Demain à ${selectedSlot}`;
        return `Tomorrow at ${selectedSlot}`;
      }
      if (language === 'ru') return `${isPickup ? 'Самовывоз' : 'Доставка'} завтра к ${selectedSlot}`;
      if (language === 'it') return `${isPickup ? 'Ritiro' : 'Consegna'} domani alle ${selectedSlot}`;
      if (language === 'de') return `${isPickup ? 'Abholung' : 'Lieferung'} morgen um ${selectedSlot}`;
      if (language === 'fr') return `${isPickup ? 'Retrait' : 'Livraison'} demain à ${selectedSlot}`;
      return `${isPickup ? 'Pickup' : 'Delivery'} tomorrow at ${selectedSlot}`;
    }

    const d = new Date();
    d.setDate(d.getDate() + selectedDayIndex);
    const dayOfWeek = d.getDay();
    const dayName = getScheduleDayName(dayOfWeek, language);

    if (shortForHeadline) {
      if (language === 'ru') return `${dayName} к ${selectedSlot}`;
      if (language === 'it') return `${dayName} alle ${selectedSlot}`;
      if (language === 'de') return `${dayName} um ${selectedSlot}`;
      if (language === 'fr') return `${dayName} à ${selectedSlot}`;
      return `${dayName} at ${selectedSlot}`;
    }
    if (language === 'ru') return `${isPickup ? 'Самовывоз' : 'Доставка'} ${dayName} к ${selectedSlot}`;
    if (language === 'it') return `${isPickup ? 'Ritiro' : 'Consegna'} ${dayName} alle ${selectedSlot}`;
    if (language === 'de') return `${isPickup ? 'Abholung' : 'Lieferung'} ${dayName} um ${selectedSlot}`;
    if (language === 'fr') return `${isPickup ? 'Retrait' : 'Livraison'} ${dayName} à ${selectedSlot}`;
    return `${isPickup ? 'Pickup' : 'Delivery'} ${dayName} at ${selectedSlot}`;
  };

  // Mobile headline string: matches Screen 1 ("Ritiro in sede 0 €") when Pickup is active, or shows scheduled time
  const mobileDeliveryHeadline = useMemo(() => {
    if (fulfillmentType === 'asporto') {
      if (hasCustomTimeSelected) {
        return `${getScheduledCartTimeText(true)}, 0 €`;
      }
      return labels.pickupFreeTitle;
    }
    const timeText = hasCustomTimeSelected
      ? getScheduledCartTimeText(true)
      : labels.shortDeliveryMins;
    const feeText =
      deliveryFee === 0
        ? '0 €'
        : `${(Number(deliveryFee) || 0).toFixed(2).replace('.', ',')} €`;
    return `${timeText}, ${feeText}`;
  }, [fulfillmentType, deliveryFee, language, hasCustomTimeSelected, selectedDayIndex, selectedSlot, labels]);

  return (
    <div className="bg-[#F5F4F2] md:bg-white text-[#21201F] md:min-h-screen">
      {/* ===================================================================== */}
      {/* MOBILE CART VIEW (md:hidden) - Matches Screenshots 2, 6, 7, 8         */}
      {/* ===================================================================== */}
      <div className="md:hidden">
        {/* TOP WHITE ROUNDED SECTION: Header + Delivery Row + Items + Cutlery */}
        <div className="bg-white rounded-b-[28px] px-4 pt-3 pb-4">
          {/* 1. Left Back Arrow + Centered Header "Корзина / Cart" + Right Trash Icon ONLY */}
          <div className="relative flex items-center justify-center h-[44px] mb-2">
            <button
              type="button"
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              title={labels.back}
              aria-label={labels.back}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#21201F] active:scale-90 transition cursor-pointer select-none"
            >
              <ArrowLeft className="w-[22px] h-[22px] stroke-[2]" />
            </button>

            <h1 className="text-[18px] font-semibold text-[#21201F] tracking-tight">
              {labels.title}
            </h1>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                title={labels.clear}
                aria-label={labels.clear}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#21201F] active:scale-90 transition cursor-pointer select-none"
              >
                <Trash2 className="w-[22px] h-[22px] stroke-[1.9]" />
              </button>
            )}
          </div>

          {/* 1B. Segmented Pickup / Delivery Switcher */}
          <div className="mb-1.5 bg-[#F5F4F2] p-1 rounded-[16px] grid grid-cols-2 gap-1 select-none">
            <button
              type="button"
              onClick={() => setFulfillmentType('asporto')}
              className={`py-2 px-3 rounded-[12px] text-[13px] font-semibold transition-all duration-200 cursor-pointer text-center ${
                fulfillmentType === 'asporto'
                  ? 'bg-white text-[#21201F] shadow-2xs'
                  : 'bg-transparent text-[#8A8784] hover:text-[#21201F]'
              }`}
            >
              {labels.pickupTab}
            </button>
            <button
              type="button"
              onClick={() => setFulfillmentType('consegna')}
              className={`py-2 px-3 rounded-[12px] text-[13px] font-semibold transition-all duration-200 cursor-pointer text-center ${
                fulfillmentType === 'consegna'
                  ? 'bg-white text-[#21201F] shadow-2xs'
                  : 'bg-transparent text-[#8A8784] hover:text-[#21201F]'
              }`}
            >
              {labels.deliveryTab}
            </button>
          </div>

          {/* 2. Delivery / Pickup Row on clean white background (Screens 1, 2, 3) */}
          <div
            onClick={() => setIsDeliverySheetOpen(true)}
            className="flex items-center justify-between py-3 border-b border-[#F0EFED] cursor-pointer select-none active:opacity-80 transition"
          >
            <div>
              <div className="text-[22px] font-bold text-[#21201F] leading-[1.15] tracking-tight">
                {mobileDeliveryHeadline}
              </div>
              <div className="text-[14px] text-[#9E9B98] leading-snug mt-0.5">
                {fulfillmentType === 'asporto'
                  ? labels.deliverySub
                  : deliveryFee === 0
                  ? labels.mobileDeliveryFreeSub
                  : labels.mobileDeliveryPaidSub}
              </div>
            </div>

            <div className="w-9 h-9 rounded-full bg-[#F5F4F2] flex items-center justify-center text-[#21201F] shrink-0">
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>

          {/* 3. Cart Items or Empty State */}
          {items.length === 0 ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#FF4A00]/10 border border-[#FF4A00]/20 flex items-center justify-center text-[#FF4A00] mx-auto mb-2">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#21201F]">
                {labels.emptyTitle}
              </h3>
              <p className="text-xs text-[#9E9B98] max-w-xs mx-auto leading-relaxed">
                {labels.emptySub}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-5 py-3 rounded-2xl bg-[#FF4A00] text-white text-xs font-semibold transition active:scale-95 cursor-pointer"
                >
                  {labels.browseMenu}
                </button>
                <button
                  type="button"
                  onClick={handleRestoreSample}
                  className="px-4 py-3 rounded-2xl bg-[#F5F4F2] text-[#21201F] text-xs font-medium transition cursor-pointer"
                >
                  {labels.loadSample}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="divide-y divide-[#F0EFED]">
                {items.map(item => {
                  const localizedName = getLocalizedProductName(item.product, language);

                  const itemUnitPrice = Number(item.totalUnitPrice ?? item.product?.price ?? 0);
                  const itemQty = Number(item.quantity ?? 1);
                  const itemTotalPrice =
                    (isNaN(itemUnitPrice) ? 0 : itemUnitPrice) * (isNaN(itemQty) ? 1 : itemQty);
                  const oldItemPrice = (itemTotalPrice * 1.18).toFixed(2).replace('.', ',');
                  const isSoftDeleted = isItemSoftDeleted(item.cartItemId);
                  const itemWeight = getLocalizedWeight(item.product);

                  return (
                    <div
                      key={item.cartItemId}
                      className="py-3.5 flex items-center justify-between gap-3"
                    >
                      {/* Left: 68x68 Rounded Thumbnail + 2-Line Title + Orange Price & Crossed Old Price & Weight */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          onClick={() => {
                            if (!isSoftDeleted) {
                              openProductDetail(item.product, item.quantity, item.cartItemId, 'cart');
                            }
                          }}
                          className={`w-[68px] h-[68px] rounded-[16px] overflow-hidden shrink-0 relative bg-[#F5F4F2] ${
                            isSoftDeleted ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          <img
                            src={item.product?.image || ''}
                            alt={localizedName}
                            className={`w-full h-full object-cover aspect-square transition-all duration-300 ${
                              isSoftDeleted ? 'opacity-30 grayscale-[35%]' : 'opacity-100'
                            }`}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3
                            onClick={() => {
                              if (!isSoftDeleted) {
                                openProductDetail(item.product, item.quantity, item.cartItemId, 'cart');
                              }
                            }}
                            className={`text-[15px] leading-[1.24] line-clamp-2 ${
                              isSoftDeleted
                                ? 'text-[#9E9B98] font-normal'
                                : 'text-[#21201F] font-normal cursor-pointer'
                            }`}
                          >
                            {localizedName}
                          </h3>

                          {isSoftDeleted ? (
                            <div className="text-[13px] text-[#9E9B98] mt-1">
                              {itemWeight}
                            </div>
                          ) : (
                            <>
                              <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                                <span className="text-[14px] font-medium text-[#FF4A00] leading-none">
                                  {itemTotalPrice.toFixed(2).replace('.', ',')} €
                                </span>
                                <span className="text-[13px] text-[#9E9B98] line-through decoration-[#FF4A00] leading-none">
                                  {oldItemPrice} €
                                </span>
                                <span className="text-[13px] text-[#9E9B98] leading-none">
                                  · {itemWeight}
                                </span>
                              </div>

                              {item.selectedExtras && item.selectedExtras.length > 0 && (
                                <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                                  {item.selectedExtras.map((extra, idx) => (
                                    <span
                                      key={`${extra.id}-${idx}`}
                                      className="text-[#9E9B98] text-[12px] leading-tight"
                                    >
                                      +{getLocalizedExtraName(item.product, extra)}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Right: Stepper [ —  1  + ] (Screen 2 uses Minus icon, not Trash icon) */}
                      {isSoftDeleted ? (
                        <button
                          type="button"
                          onClick={() => restoreItem(item.cartItemId)}
                          className="shrink-0 bg-[#F5F4F2] active:scale-95 text-[#21201F] text-[13px] font-medium px-4 py-2 rounded-[14px] cursor-pointer select-none"
                        >
                          {labels.undo}
                        </button>
                      ) : (
                        <div className="shrink-0 h-[38px] bg-[#F5F4F2] rounded-[14px] px-2.5 flex items-center gap-3 select-none">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                softDeleteItem(item.cartItemId);
                              } else {
                                updateQuantity(item.cartItemId, -1);
                              }
                            }}
                            aria-label={labels.decAria}
                            className="w-6 h-6 flex items-center justify-center text-[#21201F] cursor-pointer active:scale-90 transition"
                          >
                            <Minus className="w-4 h-4 stroke-[2]" />
                          </button>

                          <span className="text-[15px] font-medium text-[#21201F] min-w-[16px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, 1)}
                            aria-label={labels.incAria}
                            className="w-6 h-6 flex items-center justify-center text-[#21201F] cursor-pointer active:scale-90 transition"
                          >
                            <Plus className="w-4 h-4 stroke-[2]" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* SECOND WHITE ROUNDED SECTION: "Порадовать себя / You might also like" (Screen 2) */}
        <div className="bg-white rounded-t-[28px] mt-2.5 pt-4 px-3.5 pb-5">
          <h2 className="text-[20px] font-bold text-[#21201F] tracking-tight mb-3">
            {labels.mobileRecommendedTitle}
          </h2>

          <div className="grid grid-cols-3 gap-x-2 gap-y-4 justify-items-center">
            {mobileRecommendedProducts.map(rec => {
              const recName = getLocalizedProductName(rec, language);
              const recWeight = getLocalizedWeight(rec);
              const cartItemsForRec = items.filter(
                i =>
                  (i.product?.id === rec.id || i.productId === rec.id) &&
                  !isItemSoftDeleted(i.cartItemId)
              );
              const recQtyInCart = cartItemsForRec.reduce(
                (sum, i) => sum + (Number(i.quantity) || 0),
                0
              );

              const handleRecIncrease = (e: React.MouseEvent) => {
                e.stopPropagation();
                addToCart(rec, 1);
              };

              const handleRecDecrease = (e: React.MouseEvent) => {
                e.stopPropagation();
                if (cartItemsForRec.length > 0) {
                  const plainItems = cartItemsForRec.filter(
                    i => !i.selectedExtras || i.selectedExtras.length === 0
                  );
                  const targetItem =
                    plainItems.length > 0
                      ? plainItems[plainItems.length - 1]
                      : cartItemsForRec[cartItemsForRec.length - 1];
                  updateQuantity(targetItem.cartItemId, -1);
                }
              };

              return (
                <div
                  key={rec.id}
                  onClick={() => openProductDetail(rec, undefined, undefined, 'cart')}
                  style={{ maxWidth: '114.13px' }}
                  className="w-full max-w-[114.13px] flex flex-col cursor-pointer select-none"
                >
                  <div
                    style={{
                      maxWidth: '114.13px',
                      maxHeight: '114.13px',
                    }}
                    className="w-full aspect-square max-w-[114.13px] max-h-[114.13px] rounded-[18px] bg-white overflow-hidden relative shrink-0"
                  >
                    <img
                      src={rec.image}
                      alt={recName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover pointer-events-none"
                      loading="lazy"
                    />
                    <div
                      style={{ backgroundColor: '#00000008' }}
                      className="absolute inset-0 w-full h-full rounded-[18px] pointer-events-none"
                    />
                    <div
                      onClick={e => e.stopPropagation()}
                      className="absolute bottom-1.5 right-1.5 z-20"
                    >
                      {recQtyInCart > 0 ? (
                        <div className="h-[32px] w-[86px] px-1 rounded-full shadow-md select-none flex items-center justify-between bg-gradient-to-r from-[#ff5500] to-[#ff4400] text-white shadow-[#ff5500]/30 ring-2 ring-black/20">
                          <button
                            type="button"
                            onClick={handleRecDecrease}
                            className="w-6 h-6 rounded-full hover:bg-black/20 text-white flex items-center justify-center cursor-pointer shrink-0"
                            aria-label={labels.decAria}
                          >
                            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>

                          <span className="text-xs font-black text-white select-none min-w-[14px] text-center shrink-0">
                            {recQtyInCart}
                          </span>

                          <button
                            type="button"
                            onClick={handleRecIncrease}
                            className="w-6 h-6 rounded-full hover:bg-black/20 text-white flex items-center justify-center cursor-pointer shrink-0"
                            aria-label={labels.incAria}
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleRecIncrease}
                          style={{
                            width: '32px',
                            height: '32px',
                            minWidth: '32px',
                            minHeight: '32px',
                            padding: '4px',
                          }}
                          className="w-[32px] h-[32px] p-[4px] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] flex items-center justify-center text-[#21201F] cursor-pointer"
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            role="image"
                            className="w-[24px] h-[24px] shrink-0 block"
                          >
                            <path
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12 6C12.5523 6 13 6.44772 13 7V11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H13V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V13H7C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11H11V7C11 6.44772 11.4477 6 12 6Z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-1.5 px-0.5">
                    <div className="text-[14px] font-bold text-[#21201F] leading-tight">
                      €{(Number(rec.price) || 0).toFixed(2).replace('.', ',')}
                    </div>
                    <div className="text-[12px] font-normal text-[#21201F] line-clamp-2 leading-[1.25] mt-0.5">
                      <span>{recName}</span>{' '}
                      <span className="text-[#9E9B98] whitespace-nowrap">{recWeight}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MOBILE DELIVERY INFO BOTTOM SHEET (Matches Screenshots 7 & 8)         */}
      {/* ===================================================================== */}
      <div
        aria-hidden={!isDeliverySheetOpen}
        className={`md:hidden fixed inset-0 z-[90] flex flex-col justify-end ${
          isDeliverySheetOpen
            ? 'pointer-events-auto visible [transition:visibility_0s_linear_0s]'
            : 'pointer-events-none invisible [transition:visibility_0s_linear_0.34s]'
        }`}
        onClick={() => setIsDeliverySheetOpen(false)}
      >
        {/* Smooth Backdrop Overlay */}
        <div
          style={{
            opacity: isDeliverySheetOpen
              ? Math.max(0, 1 - sheetDragY / 380)
              : 0,
            transition: isSheetDragging
              ? 'none'
              : 'opacity 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
          }}
          className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        />

        {/* Smooth Sliding Sheet Wrapper */}
        <div
          ref={deliverySheetPanelRef}
          onClick={e => e.stopPropagation()}
          onTouchStart={handleSheetTouchStart}
          onTouchMove={handleSheetTouchMove}
          onTouchEnd={handleSheetTouchEnd}
          onTouchCancel={handleSheetTouchEnd}
          style={{
            transform: isDeliverySheetOpen
              ? `translate3d(0, ${sheetDragY}px, 0)`
              : 'translate3d(0, 105%, 0)',
            transition: isSheetDragging
              ? 'none'
              : 'transform 0.34s cubic-bezier(0.32, 0.72, 0, 1)',
            willChange: 'transform',
          }}
          className="relative z-10 w-full flex flex-col justify-end max-h-full"
        >
          {/* Top Drag Pill Indicator */}
          <div
            onClick={() => setIsDeliverySheetOpen(false)}
            className="w-full pt-1.5 pb-1.5 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing select-none"
          >
            <div className="w-10 h-1 rounded-full bg-white/80 shadow-2xs" />
          </div>

          <div
            ref={deliverySheetScrollRef}
            style={{ overscrollBehaviorY: 'contain', WebkitOverflowScrolling: 'touch' }}
            className="w-full bg-white rounded-t-[28px] px-4 pt-5 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] max-h-[88dvh] overflow-y-auto shadow-[0_-10px_40px_rgba(0,0,0,0.28)]"
          >
            {/* Title: "Доставка / Delivery / Consegna" OR "Самовывоз / Pickup / Asporto" */}
            <h2 className="text-[26px] font-bold text-[#21201F] tracking-tight mb-4">
              {fulfillmentType === 'asporto' ? labels.pickupTab : labels.sheetDeliveryTitle}
            </h2>

            {/* Grey Card 1: ETA + Working Hours */}
            <div className="bg-[#F5F4F2] rounded-[20px] px-4 py-3.5">
              <div className="text-[15px] font-medium text-[#21201F] leading-snug">
                {hasCustomTimeSelected
                  ? getScheduledCartTimeText(true)
                  : fulfillmentType === 'asporto'
                  ? labels.summaryPickupTime
                  : labels.sheetCourierTime}
              </div>
              <div className="text-[14px] text-[#9E9B98] leading-snug mt-0.5">
                {labels.sheetWorkingHours}
              </div>
            </div>

            {/* Conditions / Cart Table */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-[13px] text-[#9E9B98] mb-2.5 px-0.5">
                <span>{labels.sheetConditions}</span>
                <span>{labels.sheetCart}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F5F4F2] flex items-center justify-center text-[#21201F] shrink-0">
                    {fulfillmentType === 'asporto' ? (
                      <ShoppingBag className="w-5 h-5 stroke-[2]" />
                    ) : (
                      <Car className="w-5 h-5 stroke-[2]" />
                    )}
                  </div>
                  <div className="text-[17px] font-normal text-[#21201F]">
                    {fulfillmentType === 'asporto' ? (
                      <span>{labels.pickupFreeTitle}</span>
                    ) : deliveryFee === 0 ? (
                      <>
                        <span>{labels.sheetFreeDeliveryRow}</span>{' '}
                        <span className="text-[#9E9B98] line-through decoration-[#FF4A00] ml-1">
                          5,00 €
                        </span>
                      </>
                    ) : (
                      <span>
                        {language === 'ru'
                          ? 'Доставка 5,00 €'
                          : language === 'it'
                          ? 'Consegna 5,00 €'
                          : language === 'de'
                          ? 'Lieferung 5,00 €'
                          : language === 'fr'
                          ? 'Livraison 5,00 €'
                          : 'Delivery 5,00 €'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[17px] font-normal text-[#21201F] shrink-0">
                  {fulfillmentType === 'asporto' || deliveryFee > 0
                    ? language === 'ru'
                      ? 'от 0 €'
                      : language === 'it'
                      ? 'da 0 €'
                      : language === 'de'
                      ? 'ab 0 €'
                      : language === 'fr'
                      ? 'dès 0 €'
                      : 'from 0 €'
                    : language === 'ru'
                    ? 'от 25 €'
                    : language === 'it'
                    ? 'da 25 €'
                    : language === 'de'
                    ? 'ab 25 €'
                    : language === 'fr'
                    ? 'dès 25 €'
                    : 'from 25 €'}
                </div>
              </div>
            </div>

            {/* Expandable Accordion Card: "Информация о ресторане" (Screen 7 collapsed, Screen 8 expanded) */}
            <div className="bg-[#F5F4F2] rounded-[20px] px-4 py-3.5 mt-4 transition-colors">
              <button
                type="button"
                aria-expanded={isStoreInfoExpanded}
                onClick={() => setIsStoreInfoExpanded(prev => !prev)}
                className="w-full flex items-center justify-between text-left cursor-pointer select-none"
              >
                <span className="text-[15px] font-medium text-[#21201F]">
                  {labels.sheetStoreInfoTitle}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#21201F] stroke-[2] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    isStoreInfoExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              {/* Smooth CSS Grid height & opacity accordion transition */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isStoreInfoExpanded
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-[#E5E4E2] mt-3.5 pt-3.5 text-left">
                    <div className="text-[15px] font-normal text-[#21201F] mb-2">
                      {STORE_DETAILS.address}
                    </div>
                    <div className="text-[12px] leading-[1.42] text-[#9E9B98] space-y-0.5">
                      {language === 'ru' ? (
                        <>
                          <p>
                            Исполнитель (продавец): {STORE_DETAILS.name} • {getLabrioutTagline(language)},{' '}
                            {STORE_DETAILS.address}. Тел.: {STORE_DETAILS.phone} • {STORE_DETAILS.email}
                          </p>
                          <p>Режим работы: ⏰ 12h-15h 18h-22h15.</p>
                          <p>
                            {fulfillmentType === 'asporto'
                              ? `Самовывоз заказов по адресу: ${STORE_DETAILS.address}.`
                              : 'Доставка осуществляется курьерской службой LABRIOUT.'}
                          </p>
                        </>
                      ) : language === 'it' ? (
                        <>
                          <p>
                            Venditore: {STORE_DETAILS.name} • {getLabrioutTagline(language)}, {STORE_DETAILS.address}. Tel: {STORE_DETAILS.phone} • {STORE_DETAILS.email}
                          </p>
                          <p>Orari di apertura: ⏰ 12h-15h 18h-22h15.</p>
                          <p>
                            {fulfillmentType === 'asporto'
                              ? `Ritiro ordini in sede presso ${STORE_DETAILS.address}.`
                              : 'La consegna è effettuata dal servizio corrieri di LABRIOUT.'}
                          </p>
                        </>
                      ) : language === 'de' ? (
                        <>
                          <p>
                            Anbieter: {STORE_DETAILS.name} • {getLabrioutTagline(language)}, {STORE_DETAILS.address}. Tel.: {STORE_DETAILS.phone} • {STORE_DETAILS.email}
                          </p>
                          <p>Öffnungszeiten: ⏰ 12h-15h 18h-22h15.</p>
                          <p>
                            {fulfillmentType === 'asporto'
                              ? `Abholung vor Ort unter ${STORE_DETAILS.address}.`
                              : 'Lieferung durch den Lieferservice von LABRIOUT.'}
                          </p>
                        </>
                      ) : language === 'en' ? (
                        <>
                          <p>
                            Seller: {STORE_DETAILS.name} • {getLabrioutTagline(language)}, {STORE_DETAILS.address}. Tel: {STORE_DETAILS.phone} • {STORE_DETAILS.email}
                          </p>
                          <p>Opening hours: ⏰ 12h-15h 18h-22h15.</p>
                          <p>
                            {fulfillmentType === 'asporto'
                              ? `Pickup at ${STORE_DETAILS.address}.`
                              : 'Delivery operated by LABRIOUT courier service.'}
                          </p>
                        </>
                      ) : (
                        <>
                          <p>
                            Établissement : {STORE_DETAILS.name} • {getLabrioutTagline(language)}, {STORE_DETAILS.address}. Tél. : {STORE_DETAILS.phone} • {STORE_DETAILS.email}
                          </p>
                          <p>Horaires d&apos;ouverture : ⏰ 12h-15h 18h-22h15.</p>
                          <p>
                            {fulfillmentType === 'asporto'
                              ? `Retrait sur place : ${STORE_DETAILS.address}.`
                              : 'Livraison assurée par le service de livraison LABRIOUT.'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button in site brand orange #FF4A00 ("Хорошо / Got it / Ho capito") */}
            <button
              type="button"
              onClick={() => setIsDeliverySheetOpen(false)}
              className="w-full h-[52px] rounded-[18px] bg-[#FF4A00] hover:bg-[#ff5500] active:scale-[0.99] text-white font-semibold text-[16px] flex items-center justify-center mt-5 cursor-pointer select-none transition shadow-sm shadow-[#FF4A00]/25"
            >
              {labels.sheetOkBtn}
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DESKTOP VIEW (hidden md:block) - Kept 100% Unchanged                  */}
      {/* ===================================================================== */}
      <div className="hidden md:block max-w-[990px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* 1. TOP NAV: "← Вернуться в каталог" (Screenshot 2) */}
        <div className="mb-4">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-500 hover:text-neutral-900 transition cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{labels.back}</span>
          </button>
        </div>

        {/* 2. PAGE HEADER ROW: "Корзина" + "🗑 Очистить корзину" (Screenshot 2) */}
        <div className="flex items-center justify-between mb-6 pb-2">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#21201F] tracking-tight">
            {labels.title}
          </h1>

          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="bg-[#f2f2f4] hover:bg-neutral-200 text-neutral-800 text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-2xl flex items-center gap-2 transition cursor-pointer select-none"
              title={labels.clear}
            >
              <Trash2 className="w-4 h-4 text-neutral-600" />
              <span>{labels.clear}</span>
            </button>
          )}
        </div>

        {/* 3. MAIN 2-COLUMN CENTERED LAYOUT (Screenshot 2) */}
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-[62px] mb-16 items-start relative">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: Delivery card & Cart items (560px) */}
          {/* ======================================================== */}
          <div className="w-full lg:w-[560px] max-w-[560px] shrink-0 space-y-4">
            
            {/* DELIVERY HERO CARD (Strictly 560x66px with bg #F8F7F5) */}
            <div
              style={{ maxWidth: '560px', height: '66px', backgroundColor: '#F8F7F5' }}
              className="w-full max-w-[560px] h-[66px] min-h-[66px] bg-[#F8F7F5] rounded-2xl px-4 sm:px-5 flex items-center justify-between shrink-0 relative z-30"
            >
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading font-black text-sm sm:text-base text-[#21201F] leading-none">
                    {fulfillmentType === 'consegna'
                      ? `${deliveryFee === 0 ? labels.deliveryFreeTitle : `${(Number(deliveryFee) || 0).toFixed(2).replace('.', ',')} €`}`
                      : labels.pickupFreeTitle}
                  </span>
                  {fulfillmentType === 'consegna' && deliveryFee === 0 && (
                    <span className="text-xs text-neutral-400 line-through font-medium leading-none">
                      5,00 €
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500 mt-1 leading-none">
                  {labels.deliverySub}
                </p>
              </div>

              <div
                className="relative shrink-0"
                onMouseEnter={() => setIsDesktopInfoHovered(true)}
                onMouseLeave={() => setIsDesktopInfoHovered(false)}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label="Info"
                  className={`w-7 h-7 rounded-full bg-white/80 border flex items-center justify-center shadow-2xs shrink-0 cursor-pointer transition-colors ${
                    isDesktopInfoHovered
                      ? 'border-neutral-300 text-[#21201F] bg-white'
                      : 'border-neutral-200/80 text-neutral-400 hover:text-[#21201F]'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                </div>

                {/* Desktop Hover Popover with the exact same information as Mobile Sheet */}
                <div
                  className={`absolute -right-20 -top-[150px] z-50 transition-all duration-200 origin-center ${
                    isDesktopInfoHovered
                      ? 'opacity-100 scale-100 pointer-events-auto visible'
                      : 'opacity-0 scale-95 pointer-events-none invisible'
                  }`}
                >
                  <div className="w-[360px] sm:w-[380px] bg-white rounded-[24px] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.16),0_2px_10px_rgba(0,0,0,0.06)] border border-neutral-100 text-left">
                    {/* Title: "Доставка / Delivery / Consegna" OR "Самовывоз / Pickup / Asporto" */}
                    <h3 className="text-[22px] font-bold text-[#21201F] tracking-tight mb-3">
                      {fulfillmentType === 'asporto' ? labels.pickupTab : labels.sheetDeliveryTitle}
                    </h3>

                    {/* Grey Card 1: ETA + Working Hours */}
                    <div className="bg-[#F5F4F2] rounded-[18px] px-4 py-3">
                      <div className="text-[14px] font-medium text-[#21201F] leading-snug">
                        {hasCustomTimeSelected
                          ? getScheduledCartTimeText(true)
                          : fulfillmentType === 'asporto'
                          ? labels.summaryPickupTime
                          : labels.sheetCourierTime}
                      </div>
                      <div className="text-[13px] text-[#9E9B98] leading-snug mt-0.5">
                        {labels.sheetWorkingHours}
                      </div>
                    </div>

                    {/* Conditions / Cart Table */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[12px] text-[#9E9B98] mb-2 px-0.5">
                        <span>{labels.sheetConditions}</span>
                        <span>{labels.sheetCart}</span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#F5F4F2] flex items-center justify-center text-[#21201F] shrink-0">
                            {fulfillmentType === 'asporto' ? (
                              <ShoppingBag className="w-4 h-4 stroke-[2]" />
                            ) : (
                              <Car className="w-4 h-4 stroke-[2]" />
                            )}
                          </div>
                          <div className="text-[15px] font-normal text-[#21201F]">
                            {fulfillmentType === 'asporto' ? (
                              <span>{language === 'ru' ? 'Самовывоз 0 €' : 'Ritiro in sede 0 €'}</span>
                            ) : deliveryFee === 0 ? (
                              <>
                                <span>{labels.sheetFreeDeliveryRow}</span>{' '}
                                <span className="text-[#9E9B98] line-through decoration-[#FF4A00] ml-1">
                                  5,00 €
                                </span>
                              </>
                            ) : (
                              <span>
                                {language === 'ru'
                                  ? 'Доставка 5,00 €'
                                  : language === 'it'
                                  ? 'Consegna 5,00 €'
                                  : language === 'de'
                                  ? 'Lieferung 5,00 €'
                                  : language === 'fr'
                                  ? 'Livraison 5,00 €'
                                  : 'Delivery 5,00 €'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-[15px] font-normal text-[#21201F] shrink-0">
                          {fulfillmentType === 'asporto' || deliveryFee > 0
                            ? language === 'ru'
                              ? 'от 0 €'
                              : language === 'it'
                              ? 'da 0 €'
                              : language === 'de'
                              ? 'ab 0 €'
                              : language === 'fr'
                              ? 'dès 0 €'
                              : 'from 0 €'
                            : language === 'ru'
                            ? 'от 25 €'
                            : language === 'it'
                            ? 'da 25 €'
                            : language === 'de'
                            ? 'ab 25 €'
                            : language === 'fr'
                            ? 'dès 25 €'
                            : 'from 25 €'}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Accordion Card: "Информация о ресторане" */}
                    <div className="bg-[#F5F4F2] rounded-[18px] px-4 py-3 mt-3.5 transition-colors">
                      <button
                        type="button"
                        aria-expanded={isDesktopStoreInfoExpanded}
                        onClick={() => setIsDesktopStoreInfoExpanded(prev => !prev)}
                        className="w-full flex items-center justify-between text-left cursor-pointer select-none"
                      >
                        <span className="text-[14px] font-medium text-[#21201F]">
                          {labels.sheetStoreInfoTitle}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#21201F] stroke-[2] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                            isDesktopStoreInfoExpanded ? 'rotate-180' : 'rotate-0'
                          }`}
                        />
                      </button>

                      <div
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                          isDesktopStoreInfoExpanded
                            ? 'grid-rows-[1fr] opacity-100'
                            : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="border-t border-[#E5E4E2] mt-3 pt-3 text-left">
                            <div className="text-[14px] font-normal text-[#21201F] mb-1.5">
                              {STORE_DETAILS.address}
                            </div>
                            <div className="text-[12px] leading-[1.42] text-[#9E9B98] space-y-0.5">
                              {language === 'ru' ? (
                                <>
                                  <p>
                                    Исполнитель (продавец): {STORE_DETAILS.name} • {getLabrioutTagline(language)},{' '}
                                    {STORE_DETAILS.address}. Тел.: {STORE_DETAILS.phone} • {STORE_DETAILS.email}
                                  </p>
                                  <p>Режим работы: ⏰ 12h-15h 18h-22h15.</p>
                                  <p>
                                    {fulfillmentType === 'asporto'
                                      ? `Самовывоз заказов по адресу: ${STORE_DETAILS.address}.`
                                      : 'Доставка осуществляется курьерской службой LABRIOUT.'}
                                  </p>
                                </>
                              ) : language === 'it' ? (
                                <>
                                  <p>
                                    Venditore: {STORE_DETAILS.name} • {getLabrioutTagline(language)}, {STORE_DETAILS.address}. Tel: {STORE_DETAILS.phone} • {STORE_DETAILS.email}
                                  </p>
                                  <p>Orari di apertura: ⏰ 12h-15h 18h-22h15.</p>
                                  <p>
                                    {fulfillmentType === 'asporto'
                                      ? `Ritiro ordini in sede presso ${STORE_DETAILS.address}.`
                                      : 'La consegna è effettuata dal servizio corrieri di LABRIOUT.'}
                                  </p>
                                </>
                              ) : language === 'de' ? (
                                <>
                                  <p>
                                    Anbieter: {STORE_DETAILS.name} • {getLabrioutTagline(language)}, {STORE_DETAILS.address}. Tel.: {STORE_DETAILS.phone} • {STORE_DETAILS.email}
                                  </p>
                                  <p>Öffnungszeiten: ⏰ 12h-15h 18h-22h15.</p>
                                  <p>
                                    {fulfillmentType === 'asporto'
                                      ? `Abholung vor Ort unter ${STORE_DETAILS.address}.`
                                      : 'Lieferung durch den Lieferservice von LABRIOUT.'}
                                  </p>
                                </>
                              ) : language === 'en' ? (
                                <>
                                  <p>
                                    Seller: {STORE_DETAILS.name} • {getLabrioutTagline(language)}, {STORE_DETAILS.address}. Tel: {STORE_DETAILS.phone} • {STORE_DETAILS.email}
                                  </p>
                                  <p>Opening hours: ⏰ 12h-15h 18h-22h15.</p>
                                  <p>
                                    {fulfillmentType === 'asporto'
                                      ? `Pickup at ${STORE_DETAILS.address}.`
                                      : 'Delivery operated by LABRIOUT courier service.'}
                                  </p>
                                </>
                              ) : (
                                <>
                                  <p>
                                    Établissement : {STORE_DETAILS.name} • {getLabrioutTagline(language)}, {STORE_DETAILS.address}. Tél. : {STORE_DETAILS.phone} • {STORE_DETAILS.email}
                                  </p>
                                  <p>Horaires d&apos;ouverture : ⏰ 12h-15h 18h-22h15.</p>
                                  <p>
                                    {fulfillmentType === 'asporto'
                                      ? `Retrait sur place : ${STORE_DETAILS.address}.`
                                      : 'Livraison assurée par le service de livraison LABRIOUT.'}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* EMPTY CART STATE */}
            {items.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#ff5500]/10 border border-[#ff5500]/20 flex items-center justify-center text-[#ff5500] mx-auto mb-2">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-heading font-black text-2xl text-[#21201F]">
                  {labels.emptyTitle}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                  {labels.emptySub}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setCurrentView('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-2xl bg-[#ffcc00] hover:bg-[#ffd633] text-neutral-950 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm transition active:scale-95 cursor-pointer"
                  >
                    {labels.browseMenu}
                  </button>
                  <button
                    onClick={handleRestoreSample}
                    className="px-5 py-3 rounded-2xl bg-[#f2f2f4] hover:bg-neutral-200 text-neutral-800 text-xs sm:text-sm font-semibold transition cursor-pointer"
                  >
                    {labels.loadSample}
                  </button>
                </div>
              </div>
            ) : (
              /* CART ITEMS LIST: exactly 15px gap between items */
              <div className="flex flex-col gap-[15px]">
                {items.map(item => {
                  const isExpanded = !!expandedExtras[item.cartItemId];
                  const availableExtras = getAvailableExtrasForProduct(item.product);

                  const localizedName = getLocalizedProductName(item.product, language);

                  const itemUnitPrice = Number(item.totalUnitPrice ?? item.product?.price ?? 0);
                  const itemQty = Number(item.quantity ?? 1);
                  const itemTotalPrice = (isNaN(itemUnitPrice) ? 0 : itemUnitPrice) * (isNaN(itemQty) ? 1 : itemQty);
                  const oldItemPrice = (itemTotalPrice * 1.3).toFixed(2).replace('.', ',');
                  const isSoftDeleted = isItemSoftDeleted(item.cartItemId);

                  return (
                    <div
                      key={item.cartItemId}
                      className="bg-white flex flex-col transition-all duration-200 w-full max-w-[560px]"
                      id={`cart-page-item-${item.cartItemId}`}
                    >
                      {/* Top Row: Thumbnail + Product Info + Stepper / Вернуть button */}
                      <div className="flex items-center justify-between gap-4 w-full max-w-[560px]">
                        
                        {/* Left: Thumbnail & Details */}
                        <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                          {/* Square Thumbnail (69x69px preview matching Screenshot 2) */}
                          <div
                            onClick={() => {
                              if (!isSoftDeleted) {
                                openProductDetail(item.product, item.quantity, item.cartItemId, 'cart');
                              }
                            }}
                            className={`w-[69px] h-[69px] rounded-xl overflow-hidden shrink-0 relative transition-all duration-300 ${
                              isSoftDeleted
                                ? 'bg-neutral-100/90 cursor-default'
                                : 'bg-neutral-100 cursor-pointer shadow-2xs'
                            }`}
                            title={localizedName}
                          >
                            <img
                              src={item.product?.image || ''}
                              alt={localizedName}
                              width={69}
                              height={69}
                              className={`w-[69px] h-[69px] object-cover aspect-square transition-all duration-300 ${
                                isSoftDeleted
                                  ? 'opacity-30 grayscale-[35%] contrast-[85%] brightness-[105%]'
                                  : 'opacity-100'
                              }`}
                              onError={e => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                            {/* Pale white mask overlay ("как под маской блеклости", Screenshot 2) */}
                            {isSoftDeleted && (
                              <div className="absolute inset-0 bg-white/40 pointer-events-none rounded-xl" />
                            )}
                          </div>

                          {/* Info Column: Title + Price / Subtitle */}
                          <div className="flex-1 min-w-0">
                            <h3
                              onClick={() => {
                                if (!isSoftDeleted) {
                                  openProductDetail(item.product, item.quantity, item.cartItemId, 'cart');
                                }
                              }}
                              className={`text-sm sm:text-base tracking-tight leading-snug truncate transition-colors ${
                                isSoftDeleted
                                  ? 'font-semibold text-neutral-400 cursor-default'
                                  : 'font-bold text-[#21201F] cursor-pointer hover:text-[#ff5500]'
                              }`}
                              title={localizedName}
                            >
                              {localizedName}
                            </h3>

                            {isSoftDeleted ? (
                              <div className="text-xs sm:text-[13px] text-neutral-400 font-normal mt-0.5 truncate">
                                {item.product?.weight || labels.unitPiece}
                              </div>
                            ) : (
                              <>
                                {/* Price line (Screenshot 1: 1,50 € 1,95 €) */}
                                <div className="flex items-baseline gap-1.5 mt-1 flex-wrap">
                                  <span className="font-heading font-black text-sm sm:text-base text-[#21201F] tracking-tight">
                                    {itemTotalPrice.toFixed(2).replace('.', ',')} €
                                  </span>
                                  <span className="text-xs text-neutral-400 line-through font-medium">
                                    {oldItemPrice} €
                                  </span>
                                  {item.product?.weight && (
                                    <span className="text-xs text-neutral-400 font-medium">
                                      · {item.product.weight}
                                    </span>
                                  )}
                                </div>

                                {/* Extras summary if any */}
                                {!isExpanded && item.selectedExtras && item.selectedExtras.length > 0 && (
                                  <div className="mt-1 flex flex-wrap gap-x-2.5 gap-y-1">
                                    {item.selectedExtras.map(extra => (
                                      <span
                                        key={extra.id}
                                        className="text-neutral-500 text-[10.5px] leading-tight font-normal"
                                      >
                                        +{getLocalizedExtraName(item.product, extra)}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {item.specialNotes && (
                                  <p className="text-[11px] text-neutral-500 italic mt-1">
                                    {labels.notePrefix} &quot;{item.specialNotes}&quot;
                                  </p>
                                )}

                                {/* "+ Aggiungi extra" Dropdown trigger button */}
                                {availableExtras && availableExtras.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExtraDropdown(item.cartItemId)}
                                    className="mt-1.5 text-xs text-[#ff5500] hover:text-[#e04a00] font-bold inline-flex items-center gap-1 transition cursor-pointer select-none"
                                  >
                                    {isExpanded ? (
                                      <>
                                        <ChevronUp className="w-3.5 h-3.5" />
                                        <span>{labels.closeExtra}</span>
                                      </>
                                    ) : (
                                      <>
                                        <PlusCircle className="w-3.5 h-3.5" />
                                        <span>{labels.addExtra}</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Right: Either "Вернуть" Button OR Stepper Capsule [ 🗑  1  + ] */}
                        {isSoftDeleted ? (
                          <button
                            type="button"
                            onClick={() => restoreItem(item.cartItemId)}
                            className="shrink-0 bg-[#e7e8ec] hover:bg-[#dcdee3] active:scale-95 text-[#21201F] text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer shadow-2xs select-none"
                            id={`cart-page-restore-btn-${item.cartItemId}`}
                          >
                            {labels.undo}
                          </button>
                        ) : (
                          <div className="shrink-0 flex items-center bg-[#f2f2f4] rounded-2xl px-2 py-1 gap-2.5 sm:gap-3">
                            <button
                              type="button"
                              onClick={() => {
                                if (item.quantity <= 1) {
                                  softDeleteItem(item.cartItemId);
                                } else {
                                  updateQuantity(item.cartItemId, -1);
                                }
                              }}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-neutral-700 hover:text-neutral-950 rounded-xl hover:bg-neutral-200/70 transition cursor-pointer active:scale-90"
                              title={item.quantity === 1 ? labels.removeTitle : labels.decAria}
                              aria-label={labels.decAria}
                            >
                              {item.quantity === 1 ? (
                                <Trash2 className="w-3.5 h-3.5 text-neutral-600 hover:text-red-500" />
                              ) : (
                                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                              )}
                            </button>

                            <span className="font-heading font-black text-sm sm:text-base text-[#21201F] min-w-[20px] text-center select-none">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateQuantity(item.cartItemId, 1)}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-neutral-900 hover:text-black rounded-xl hover:bg-neutral-200/70 transition cursor-pointer active:scale-90"
                              title={labels.incAria}
                              aria-label={labels.incAria}
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Expanded Extras Selector Dropdown */}
                      {isExpanded && availableExtras && availableExtras.length > 0 && (
                        <div className="mt-2.5 pt-2.5 border-t border-gray-100 space-y-1.5 w-full animate-fadeIn">
                          {availableExtras.map(extra => {
                            const isChecked = item.selectedExtras?.some(e => e.id === extra.id);
                            const extraName = getLocalizedExtraName(item.product, extra);

                            return (
                              <div
                                key={extra.id}
                                onClick={() => handleToggleExtra(item, extra)}
                                className={`group flex items-center justify-between gap-2.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer select-none text-[#21201F] bg-white ${
                                  isChecked
                                    ? 'border-neutral-300'
                                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div
                                    style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}
                                    className={`w-[28px] h-[28px] rounded-[8px] border flex items-center justify-center shrink-0 checkbox-inset-shadow transition ${
                                      isChecked
                                        ? 'bg-[#FF5000] border-transparent text-white'
                                        : 'border-neutral-300 bg-white'
                                    }`}
                                  >
                                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] text-white" />}
                                  </div>

                                  <span className="text-[14px] font-normal text-[#21201F] leading-tight">
                                    {extraName}
                                  </span>
                                </div>

                                <span className="text-[14px] font-light text-[#908F8F] shrink-0">
                                  +{(Number(extra.price) || 0).toFixed(2).replace('.', ',')} €
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: Order Summary (Screenshot 2: "Итого") */}
          {/* ======================================================== */}
          <div className="w-full lg:w-[328px] max-w-[328px] shrink-0 self-start space-y-4">
            <div className="bg-white rounded-3xl p-0 space-y-3">
              
              {/* Header: "Summary" + Delivery / Pickup Switcher */}
              <div>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#21201F] tracking-tight">
                  {labels.summaryTitle}
                </h2>

                {/* Pickup / Delivery Switcher (Segmented Control matching sidebar cart) */}
                <div className="mt-3.5 mb-2 bg-[#f0f0f2] p-1 rounded-2xl grid grid-cols-2 gap-1 select-none">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('asporto')}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
                      fulfillmentType === 'asporto'
                        ? 'bg-white text-[#21201f] shadow-xs'
                        : 'bg-transparent text-[#737373] hover:text-neutral-900'
                    }`}
                  >
                    {labels.pickupTab}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('consegna')}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-center ${
                      fulfillmentType === 'consegna'
                        ? 'bg-white text-[#21201f] shadow-xs'
                        : 'bg-transparent text-[#737373] hover:text-neutral-900'
                    }`}
                  >
                    {labels.deliveryTab}
                  </button>
                </div>

                <p className="text-[16px] text-neutral-400 font-medium mt-2">
                  {hasCustomTimeSelected
                    ? getScheduledCartTimeText(false)
                    : fulfillmentType === 'consegna'
                    ? labels.summaryDeliveryTime
                    : labels.summaryPickupTime}
                </p>
              </div>

              {/* Top Divider Line (spacing reduced by 50%) */}
              <div className="border-t border-neutral-100" />

              {/* Price Breakdown (Screenshot 2: Товары / Скидки / Доставка / К оплате - 16px) */}
              <div className="space-y-2 text-[16px] text-neutral-600">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] text-neutral-700">{labels.productsTotal(itemsCount)}</span>
                  <span className="font-bold text-[16px] text-neutral-900">
                    {(Number(subtotal) || 0).toFixed(2).replace('.', ',')} €
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[#e62e2e] text-[16px]">
                    <span className="flex items-center gap-1 font-medium">
                      <Tag className="w-4 h-4" />
                      {labels.discount} ({appliedCoupon})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">-{(Number(discountAmount) || 0).toFixed(2).replace('.', ',')} €</span>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-neutral-400 hover:text-red-500 underline cursor-pointer"
                      >
                        {labels.removePromo}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-[16px] text-neutral-700">{labels.delivery}</span>
                  <span className="font-bold text-[16px] text-neutral-900">
                    {deliveryFee === 0 ? labels.free : `${(Number(deliveryFee) || 0).toFixed(2).replace('.', ',')} €`}
                  </span>
                </div>

                {/* Bottom Divider Line (spacing reduced by 50%) */}
                <div className="border-t border-neutral-100 pt-1.5 mt-1.5" />

                {/* Total / To Pay Row (Screenshot 2: Total & Price both 20px) */}
                <div className="flex items-baseline justify-between pt-0.5">
                  <span className="font-bold text-[20px] text-neutral-900">
                    {labels.toPay}
                  </span>
                  <span className="font-heading font-black text-[20px] text-[#21201F] tracking-tight">
                    {(Number(total) || 0).toFixed(2).replace('.', ',')} €
                  </span>
                </div>
              </div>

              {/* Primary Action Button (Strictly 328x56px: Brand Orange "Proceed to checkout") */}
              <button
                type="button"
                onClick={() => {
                  setCurrentView('checkout');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={itemsCount === 0}
                style={{ width: '328px', height: '56px' }}
                className="w-[328px] max-w-full h-[56px] min-h-[56px] rounded-2xl bg-[#ff5500] hover:bg-[#ff6611] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-white font-heading font-black text-base shadow-md shadow-[#ff5500]/25 hover:shadow-lg transition flex items-center justify-center gap-2 cursor-pointer select-none"
                id="cart-page-proceed-checkout-btn"
              >
                <span>{labels.checkoutBtn}</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5] text-white" />
              </button>

            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 4. BOTTOM SECTION: "Подобрали для вас / Consigliati per te" (Screenshot 2) */}
        {/* ======================================================== */}
        <div className="pt-4 border-t border-neutral-200/80">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#21201F] tracking-tight">
              {labels.recommendedTitle}
            </h2>

            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs sm:text-sm font-bold text-neutral-700 hover:text-neutral-950 bg-[#f2f2f4] hover:bg-neutral-200 px-3.5 py-1.5 rounded-full transition cursor-pointer"
            >
              {labels.seeAll}
            </button>
          </div>

          {/* 4 Product Cards Grid matching the exact design and dimensions of the main page */}
          <div className="grid grid-cols-[repeat(2,173.2px)] justify-center sm:justify-start sm:grid-cols-2 lg:grid-cols-4 gap-[8px] sm:gap-[27px]">
            {recommendedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
