import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronRight,
  Plus,
  Minus,
  Check,
  Heart,
  MessageSquare,
  ArrowRight,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CATEGORY_CONFIGS, MENU_PRODUCTS, getAvailableExtrasForProduct } from '../data/menuData';
import { SelectedExtra, ProductItem } from '../types';
import { ProductCard } from './ProductCard';
import {
  getCategoryLabel,
  getLocalizedProductName,
  getLocalizedProductDescription,
} from '../utils/menuTranslations';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProductDetail,
    setCurrentView,
    navigateToCategory,
    openProductDetail,
    productDetailSource,
    setPendingScrollCategory,
    addToCart,
    updateQuantity,
    removeItem,
    isItemSoftDeleted,
    items,
    setItems,
    editingCartItemId,
    setEditingCartItemId,
    triggerCartBounce,
    catalogProducts,
    language,
    t,
  } = useCart();

  const product = useMemo(() => {
    if (!selectedProductDetail) return null;
    return catalogProducts.find(p => p.id === selectedProductDetail.id) || selectedProductDetail;
  }, [selectedProductDetail, catalogProducts]);

  const [quantity, setQuantity] = useState<number>(1);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);
  const [specialNotes, setSpecialNotes] = useState<string>('');
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [hasEdited, setHasEdited] = useState<boolean>(false);
  const [isAddedAnimation, setIsAddedAnimation] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [nutritionMode, setNutritionMode] = useState<'portion' | '100g'>('portion');
  const [mobileNutritionMode, setMobileNutritionMode] = useState<'100g' | 'portion'>('100g');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isDescExpanded, setIsDescExpanded] = useState<boolean>(false);
  const [showLegalInfo, setShowLegalInfo] = useState<boolean>(false);

  // Mobile sheet drag-to-close & animation state
  const mobileBackdropRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileSheetRef = useRef<HTMLDivElement>(null);
  const [dragOffsetY, setDragOffsetY] = useState<number>(0);
  const [isDraggingSheet, setIsDraggingSheet] = useState<boolean>(false);
  const [isClosingSheet, setIsClosingSheet] = useState<boolean>(false);
  const [isSheetEntered, setIsSheetEntered] = useState<boolean>(false);

  // Refs for gesture tracking without re-binding listeners
  const touchStateRef = useRef<{
    startY: number;
    startX: number;
    dragOriginY: number;
    lastY: number;
    lastTime: number;
    velocityY: number;
    isDragging: boolean;
    currentOffset: number;
  }>({
    startY: 0,
    startX: 0,
    dragOriginY: 0,
    lastY: 0,
    lastTime: 0,
    velocityY: 0,
    isDragging: false,
    currentOffset: 0,
  });

  // Trigger smooth slide-up entrance when sheet mounts
  useEffect(() => {
    setIsClosingSheet(false);
    setDragOffsetY(0);
    const frame = requestAnimationFrame(() => {
      setIsSheetEntered(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Prevent background page scrolling on mobile via event containment on the fixed overlay
  // (Never mutate html/body overflow, which in combination with overflow-x: clip resets viewport scroll)
  useEffect(() => {
    const backdropEl = mobileBackdropRef.current;
    if (!backdropEl) return;

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth >= 768) return;
      const scrollEl = mobileScrollRef.current;
      const target = e.target as Node | null;
      if (!scrollEl || !target || !scrollEl.contains(target)) {
        if (e.cancelable) e.preventDefault();
        return;
      }
      const atTop = scrollEl.scrollTop <= 0 && e.deltaY < 0;
      const atBottom =
        scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atBottom || scrollEl.scrollHeight <= scrollEl.clientHeight) {
        if (e.cancelable) e.preventDefault();
      }
    };

    const handleBackdropTouchMove = (e: TouchEvent) => {
      if (window.innerWidth >= 768) return;
      const sheetEl = mobileSheetRef.current;
      const scrollEl = mobileScrollRef.current;
      const target = e.target as Node | null;
      // If touching outside the sheet (on the dark backdrop), block background scroll
      if (!sheetEl || !target || !sheetEl.contains(target)) {
        if (e.cancelable) e.preventDefault();
        return;
      }
      // If touching on the sheet but outside the scrollable body (e.g. sticky bottom bar), block background scroll unless dragging sheet
      if ((!scrollEl || !scrollEl.contains(target)) && !touchStateRef.current.isDragging) {
        if (e.cancelable) e.preventDefault();
      }
    };

    backdropEl.addEventListener('wheel', handleWheel, { passive: false });
    backdropEl.addEventListener('touchmove', handleBackdropTouchMove, { passive: false });
    return () => {
      backdropEl.removeEventListener('wheel', handleWheel);
      backdropEl.removeEventListener('touchmove', handleBackdropTouchMove);
    };
  }, [product?.id]);

  // Sync / Reset on product change or when opened with an item from cart
  useEffect(() => {
    const matchedItem = editingCartItemId
      ? items.find(i => i.cartItemId === editingCartItemId)
      : undefined;

    if (matchedItem) {
      setQuantity(matchedItem.quantity);
      setSelectedExtras(matchedItem.selectedExtras || []);
      setSpecialNotes(matchedItem.specialNotes || '');
      setShowNotes(Boolean(matchedItem.specialNotes));
    } else {
      setQuantity(1);
      setSelectedExtras([]);
      setSpecialNotes('');
      setShowNotes(false);
    }

    setHasEdited(false);
    setActiveImageIndex(0);
    setIsDescExpanded(false);
    setShowLegalInfo(false);
    setDragOffsetY(0);
    setIsDraggingSheet(false);

    if (product) {
      const savedFav = localStorage.getItem(`fav_prod_${product.id}`);
      setIsFavorite(savedFav === 'true');
      if (mobileScrollRef.current) {
        mobileScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (window.innerWidth >= 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [product?.id, editingCartItemId]);

  // Smoothly animate sheet down off-screen and then navigate back
  const handleCloseSheet = () => {
    if (isClosingSheet) return;
    setIsClosingSheet(true);
    setIsDraggingSheet(false);
    const sheetHeight = mobileSheetRef.current?.offsetHeight || window.innerHeight;
    setDragOffsetY(sheetHeight + 40);

    setTimeout(() => {
      setEditingCartItemId(null);
      const returnView = productDetailSource || 'home';
      setCurrentView(returnView, true, false);
    }, 260);
  };

  // Native non-passive touch listeners on the sheet so iOS Safari never rubber-bands the inner scroll container
  useEffect(() => {
    const sheetEl = mobileSheetRef.current;
    const scrollEl = mobileScrollRef.current;
    if (!sheetEl || !scrollEl) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const now = performance.now();
      touchStateRef.current = {
        startY: touch.clientY,
        startX: touch.clientX,
        dragOriginY: touch.clientY,
        lastY: touch.clientY,
        lastTime: now,
        velocityY: 0,
        isDragging: false,
        currentOffset: 0,
      };
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      const now = performance.now();
      const state = touchStateRef.current;

      const dt = Math.max(1, now - state.lastTime);
      const dyFromLast = touch.clientY - state.lastY;
      const instantVy = dyFromLast / dt; // px/ms (+ is downward)
      // Smooth velocity with exponential moving average
      state.velocityY = state.velocityY * 0.35 + instantVy * 0.65;
      state.lastY = touch.clientY;
      state.lastTime = now;

      const totalDeltaY = touch.clientY - state.startY;
      const totalDeltaX = touch.clientX - state.startX;

      if (!state.isDragging) {
        // Start dragging the sheet if scroll is at the very top and user pulls down
        const isAtTop = scrollEl.scrollTop <= 0;
        const isPullingDown = touch.clientY - state.dragOriginY > 2 && totalDeltaY > 0;
        const isVertical = Math.abs(totalDeltaY) > Math.abs(totalDeltaX) * 1.1;

        if (isAtTop && isPullingDown && isVertical) {
          state.isDragging = true;
          state.dragOriginY = touch.clientY;
          setIsDraggingSheet(true);
        } else {
          // Prevent scroll chaining at the bottom of the sheet
          const isAtBottom =
            scrollEl.scrollTop + scrollEl.clientHeight >= scrollEl.scrollHeight - 1;
          if ((isAtBottom && dyFromLast < 0) || scrollEl.scrollHeight <= scrollEl.clientHeight) {
            if (e.cancelable) {
              e.preventDefault();
            }
          }
          // Keep updating dragOriginY while scrolling so if user hits scrollTop === 0 mid-gesture, transition is seamless
          if (scrollEl.scrollTop <= 0) {
            state.dragOriginY = touch.clientY;
          }
          return;
        }
      }

      if (state.isDragging) {
        // Prevent native iOS rubber-band overscroll so the image stays glued to the top of the sheet
        if (e.cancelable) {
          e.preventDefault();
        }
        scrollEl.scrollTop = 0;

        const rawOffset = touch.clientY - state.dragOriginY;
        const clampedOffset = Math.max(0, rawOffset);
        state.currentOffset = clampedOffset;
        setDragOffsetY(clampedOffset);

        // If user pushes the sheet all the way back to 0 and keeps pushing up, hand control back to normal scrolling
        if (rawOffset < -4) {
          state.isDragging = false;
          state.currentOffset = 0;
          setIsDraggingSheet(false);
          setDragOffsetY(0);
        }
      }
    };

    const onTouchEndOrCancel = () => {
      const state = touchStateRef.current;
      if (!state.isDragging) return;

      state.isDragging = false;
      setIsDraggingSheet(false);

      const sheetHeight = sheetEl.offsetHeight || window.innerHeight * 0.96;
      const offset = state.currentOffset;
      const vy = state.velocityY; // px/ms

      // Close if pulled past 50% of the sheet height OR if user flicked down quickly (vy >= 0.55 px/ms and offset > 40px)
      const passedHalfway = offset >= sheetHeight * 0.5;
      const isFastDownwardFlick = vy >= 0.55 && offset > 40;

      if (passedHalfway || isFastDownwardFlick) {
        handleCloseSheet();
      } else {
        // Snap smoothly back to original top position
        state.currentOffset = 0;
        setDragOffsetY(0);
      }
    };

    sheetEl.addEventListener('touchstart', onTouchStart, { passive: true });
    sheetEl.addEventListener('touchmove', onTouchMove, { passive: false });
    sheetEl.addEventListener('touchend', onTouchEndOrCancel, { passive: true });
    sheetEl.addEventListener('touchcancel', onTouchEndOrCancel, { passive: true });

    return () => {
      sheetEl.removeEventListener('touchstart', onTouchStart);
      sheetEl.removeEventListener('touchmove', onTouchMove);
      sheetEl.removeEventListener('touchend', onTouchEndOrCancel);
      sheetEl.removeEventListener('touchcancel', onTouchEndOrCancel);
    };
  }, [product?.id, isClosingSheet, productDetailSource]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          {language === 'ru' ? 'Товар не найден' : language === 'en' ? 'Product not found' : 'Prodotto non trovato'}
        </h2>
        <button
          onClick={() => setCurrentView('home')}
          className="mt-4 px-6 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff6611] text-white font-bold text-sm uppercase cursor-pointer transition shadow-md"
        >
          {t('backToMenu')}
        </button>
      </div>
    );
  }

  // Find Category info
  const categoryConfig = CATEGORY_CONFIGS.find(c => c.id === product.category);
  const categoryLabel = categoryConfig
    ? getCategoryLabel(product.category, language, categoryConfig.label)
    : language === 'ru'
    ? 'Меню'
    : 'Menu';

  // Localized text
  const localizedName = getLocalizedProductName(product, language);
  const description = getLocalizedProductDescription(product, language);

  const ingredientsText =
    language === 'en'
      ? product.ingredientsEn || description
      : language === 'de'
      ? product.ingredientsDe || product.ingredientsEn || description
      : language === 'fr'
      ? product.ingredientsFr || product.ingredientsEn || description
      : language === 'ru'
      ? product.ingredientsRu || description
      : product.ingredients || description;

  // Helper to detect drinks / beverages / alcohol
  const isDrinkProduct = (prod: ProductItem): boolean => {
    if (prod.category === 'bevande') return true;
    const lower = (prod.name + ' ' + (prod.nameEn || '') + ' ' + (prod.nameRu || '') + ' ' + prod.id).toLowerCase();
    return (
      lower.includes('birra') ||
      lower.includes('beer') ||
      lower.includes('vino') ||
      lower.includes('wine') ||
      lower.includes('coca') ||
      lower.includes('fanta') ||
      lower.includes('sprite') ||
      lower.includes('acqua') ||
      lower.includes('water') ||
      lower.includes('chinotto') ||
      lower.includes('peroni') ||
      lower.includes('heineken') ||
      lower.includes('moretti') ||
      lower.includes('nastro azzurro') ||
      lower.includes('red bull') ||
      lower.includes('estathe')
    );
  };

  const isDrink = isDrinkProduct(product);

  // Gallery images
  const getProductGallery = (prod: ProductItem): string[] => {
    const rawAdditional = (prod as any).images || (prod as any).gallery;
    if (Array.isArray(rawAdditional) && rawAdditional.length > 0) {
      return Array.from(new Set([prod.image, ...rawAdditional].filter(Boolean)));
    }
    return prod.image ? [prod.image] : [];
  };

  const galleryImages = getProductGallery(product);
  const activeImage = galleryImages[activeImageIndex] || product.image;

  // Toggle Favorite
  const toggleFavorite = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    localStorage.setItem(`fav_prod_${product.id}`, String(next));
  };

  const availableExtras = getAvailableExtrasForProduct(product);

  // Toggle Extra Selection
  const toggleExtra = (extraId: string, name: string, price: number) => {
    setHasEdited(true);
    setSelectedExtras(prev => {
      const exists = prev.some(e => e.id === extraId);
      if (exists) {
        return prev.filter(e => e.id !== extraId);
      } else {
        return [...prev, { id: extraId, name, price }];
      }
    });
  };

  const isEditingCartItem = Boolean(
    editingCartItemId && items.some(i => i.cartItemId === editingCartItemId)
  );

  // Price calculations (keep showing 1x unit price when quantity is set to 0 so price doesn't drop to €0,00)
  const extrasUnitPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const unitPrice = product.price + extrasUnitPrice;
  const effectivePriceQty = Math.max(1, quantity);
  const totalPrice = unitPrice * effectivePriceQty;
  const rawOrigPrice = product.originalPrice;
  const hasDiscount =
    rawOrigPrice !== 0 &&
    rawOrigPrice !== null &&
    (rawOrigPrice === undefined || Number(rawOrigPrice) > product.price);
  const baseOldPrice = hasDiscount
    ? rawOrigPrice !== undefined
      ? Number(rawOrigPrice)
      : Number((product.price * 1.3).toFixed(2))
    : product.price;
  const oldPrice = Number((baseOldPrice + extrasUnitPrice).toFixed(2));
  const discountPercent = hasDiscount
    ? Math.abs(baseOldPrice - product.price * 1.3) < 0.05
      ? 30
      : Math.max(1, Math.round(((baseOldPrice - product.price) / baseOldPrice) * 100))
    : 0;

  // Save/update/remove item in cart
  const commitItemToCart = () => {
    const targetCartItemId = editingCartItemId
      ? items.find(i => i.cartItemId === editingCartItemId)?.cartItemId
      : undefined;

    if (targetCartItemId) {
      if (quantity <= 0) {
        setItems(prevItems => prevItems.filter(item => item.cartItemId !== targetCartItemId));
        setEditingCartItemId(null);
        triggerCartBounce();
        return;
      }

      if (!hasEdited) {
        setEditingCartItemId(null);
        return;
      }

      setItems(prevItems => {
        const getSig = (prodId: string, extras: SelectedExtra[] = [], notes?: string) => {
          const sorted = [...extras]
            .sort((a, b) => a.id.localeCompare(b.id))
            .map(e => e.id)
            .join('_');
          return `${prodId}-${sorted}-${(notes || '').trim().toLowerCase()}`;
        };

        const updated = prevItems.map(item => {
          if (item.cartItemId === targetCartItemId) {
            const extrasTotal = selectedExtras.reduce((sum, e) => sum + (Number(e.price) || 0), 0);
            return {
              ...item,
              quantity,
              selectedExtras,
              specialNotes,
              totalUnitPrice: product.price + extrasTotal,
            };
          }
          return item;
        });

        const merged: typeof prevItems = [];
        updated.forEach(item => {
          if (isItemSoftDeleted(item.cartItemId)) {
            merged.push(item);
            return;
          }
          const sig = getSig(item.product?.id || item.productId, item.selectedExtras || [], item.specialNotes);
          const existingIdx = merged.findIndex(
            m =>
              !isItemSoftDeleted(m.cartItemId) &&
              getSig(m.product?.id || m.productId, m.selectedExtras || [], m.specialNotes) === sig
          );
          if (existingIdx !== -1) {
            merged[existingIdx] = {
              ...merged[existingIdx],
              quantity: (Number(merged[existingIdx].quantity) || 1) + (Number(item.quantity) || 1),
            };
          } else {
            merged.push(item);
          }
        });

        return merged;
      });
      setEditingCartItemId(null);
      triggerCartBounce();
    } else {
      addToCart(product, Math.max(1, quantity), selectedExtras, specialNotes);
    }
  };

  // Desktop Add To Cart -> Opens Cart Page
  const handleAddToCartDesktop = () => {
    commitItemToCart();
    setIsAddedAnimation(true);
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mobile Sheet Add To Cart -> Adds/saves/removes item and closes sheet back to source view
  const handleAddToCartMobileSheet = () => {
    commitItemToCart();
    setIsAddedAnimation(true);
    handleCloseSheet();
  };

  // Base Nutritional Values (КБЖУ)
  const getBaseNutritionValues = () => {
    let kcal = 345.0;
    let protein = 14.2;
    let fat = 18.0;
    let carbs = 38.5;

    if (isDrink) {
      kcal = 135.0;
      protein = 1.0;
      fat = 0.0;
      carbs = 10.5;
    } else if (product.category === 'panini' || product.category === 'panini_special') {
      kcal = 686.8;
      protein = 18.5;
      fat = 45.5;
      carbs = 50.6;
    } else if (product.category === 'girarrosto') {
      kcal = 520.0;
      protein = 44.0;
      fat = 26.5;
      carbs = 12.0;
    } else if (product.category === 'patate') {
      kcal = 380.0;
      protein = 5.8;
      fat = 19.5;
      carbs = 48.0;
    } else if (product.category === 'gastronomia' || product.category === 'pranzo') {
      kcal = 490.0;
      protein = 18.2;
      fat = 17.5;
      carbs = 62.0;
    }
    return { kcal, protein, fat, carbs };
  };

  const getNutrition = (mode: 'portion' | '100g') => {
    const { kcal, protein, fat, carbs } = getBaseNutritionValues();
    if (mode === '100g') {
      const f = isDrink ? 0.3 : 0.42;
      return {
        kcal: (kcal * f).toFixed(1).replace('.', ','),
        protein: (protein * f).toFixed(1).replace('.', ','),
        fat: (fat * f).toFixed(1).replace('.', ','),
        carbs: (carbs * f).toFixed(1).replace('.', ','),
        kcalInt: Math.round(kcal * f),
        proteinInt: Math.round(protein * f),
        fatInt: Math.round(fat * f),
        carbsInt: Math.round(carbs * f),
      };
    }

    return {
      kcal: kcal.toFixed(1).replace('.', ','),
      protein: protein.toFixed(1).replace('.', ','),
      fat: fat.toFixed(1).replace('.', ','),
      carbs: carbs.toFixed(1).replace('.', ','),
      kcalInt: Math.round(kcal),
      proteinInt: Math.round(protein),
      fatInt: Math.round(fat),
      carbsInt: Math.round(carbs),
    };
  };

  const nutrition = getNutrition(nutritionMode);
  const mobileNutrition = getNutrition(mobileNutritionMode);

  // Weight / Volume display localized by selected language
  const getLocalizedWeight = (prod: ProductItem = product) => {
    const prodIsDrink = isDrinkProduct(prod);
    if (prodIsDrink) {
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

      if (prod.name.toLowerCase().includes('vino') || prod.id.includes('vino')) {
        return language === 'ru' ? '75 сл' : '75 cl';
      }

      if (prod.weight) {
        return language === 'ru'
          ? prod.weight.replace(/\bcl\b/i, 'сл').replace(/\bml\b/i, 'мл').replace(/\bl\b/i, 'л')
          : prod.weight.replace(/\bсл\b/i, 'cl').replace(/\bмл\b/i, 'ml').replace(/\bл\b/i, 'L');
      }

      return language === 'ru' ? '33 сл' : '33 cl';
    }

    const defaultGrams = prod.category === 'panini' || prod.category === 'panini_special' ? 265 : 200;
    const baseWeight = prod.weight || `${defaultGrams} g`;

    if (language === 'ru') {
      return baseWeight.replace(/\s*g\b/i, ' г').replace(/\s*gr\b/i, ' г');
    } else {
      return baseWeight.replace(/\s*г\b/i, ' g').replace(/\s*gr\b/i, ' g');
    }
  };

  const displayWeight = getLocalizedWeight(product);

  // Recommended products for Desktop (4 items) and Mobile Sheet (6 items = 2 rows of 3 items)
  const allRecommendedProducts = useMemo(() => {
    const inCartIds = new Set(
      items
        .filter(i => !isItemSoftDeleted(i.cartItemId))
        .map(i => i.product?.id || i.productId)
    );

    const availablePool = MENU_PRODUCTS.filter(
      p => p.id !== product.id && !inCartIds.has(p.id)
    );
    const pool = availablePool.length >= 6 ? availablePool : MENU_PRODUCTS.filter(p => p.id !== product.id);

    const drinkCandidates = pool.filter(p => p.category === 'bevande');
    const firstDrink =
      drinkCandidates.length > 0
        ? drinkCandidates[Math.floor(Math.random() * drinkCandidates.length)]
        : pool[0] || null;

    const otherCandidates = pool.filter(
      p => !firstDrink || p.id !== firstDrink.id
    );

    const shuffledOthers = [...otherCandidates].sort(() => Math.random() - 0.5);
    const chosenOthers = shuffledOthers.slice(0, 5);

    return firstDrink ? [firstDrink, ...chosenOthers] : chosenOthers.slice(0, 6);
  }, [product.id]);

  const recommendedProducts = useMemo(() => allRecommendedProducts.slice(0, 4), [allRecommendedProducts]);
  const mobileRecommendedProducts = useMemo(() => allRecommendedProducts.slice(0, 6), [allRecommendedProducts]);

  // Sum of items added from the mobile "You might also like" block so the sheet bottom bar total updates live
  const mobileRecommendedAddedTotal = useMemo(() => {
    return mobileRecommendedProducts.reduce((sum, rec) => {
      const cartItemsForRec = items.filter(
        i => (i.product?.id === rec.id || i.productId === rec.id) && !isItemSoftDeleted(i.cartItemId)
      );
      const recQty = cartItemsForRec.reduce((qSum, i) => qSum + (Number(i.quantity) || 0), 0);
      return sum + recQty * (Number(rec.price) || 0);
    }, 0);
  }, [mobileRecommendedProducts, items, isItemSoftDeleted]);

  const mobileSheetTotalPrice = totalPrice + mobileRecommendedAddedTotal;

  // Combined full description for mobile "Всё описание"
  const fullMobileDescription =
    ingredientsText && ingredientsText !== description
      ? `${description} ${ingredientsText}`
      : description;
  const shouldShowExpandDesc = fullMobileDescription.length > 90 && !isDescExpanded;

  const backdropProgress = Math.max(
    0,
    Math.min(1, 1 - dragOffsetY / (typeof window !== 'undefined' ? window.innerHeight * 0.85 : 700))
  );

  return (
    <>
      {/* ===================================================================== */}
      {/* MOBILE BOTTOM SHEET ("ШТОРКА") - Matches Screenshot 2                 */}
      {/* ===================================================================== */}
      <div
        ref={mobileBackdropRef}
        style={{
          backgroundColor: `rgba(0, 0, 0, ${(isSheetEntered && !isClosingSheet ? 0.55 * backdropProgress : 0).toFixed(3)})`,
          transition: isDraggingSheet ? 'none' : 'background-color 0.28s ease',
          overscrollBehavior: 'none',
        }}
        className="md:hidden fixed inset-0 z-[80] flex flex-col justify-end backdrop-blur-[1px]"
        onClick={handleCloseSheet}
      >
        {/* Translating Wrapper: includes BOTH the top drag pill and the sheet so they move down together */}
        <div
          ref={mobileSheetRef}
          onClick={e => e.stopPropagation()}
          style={{
            transform: !isSheetEntered
              ? 'translate3d(0, 100%, 0)'
              : `translate3d(0, ${dragOffsetY}px, 0)`,
            transition: isDraggingSheet
              ? 'none'
              : isClosingSheet
              ? 'transform 0.26s cubic-bezier(0.32, 0.72, 0, 1)'
              : 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'transform',
          }}
          className="w-full flex flex-col justify-end max-h-full"
        >
          {/* Top tap/drag area & centered drag indicator pill (moves with the sheet) */}
          <div
            className="w-full pt-1.5 pb-1.5 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing select-none"
            onClick={handleCloseSheet}
          >
            <div className="w-10 h-1 rounded-full bg-white/80 shadow-2xs" />
          </div>

          {/* Sheet Container */}
          <div className="w-full h-[96dvh] max-h-[96dvh] bg-[#F5F4F2] rounded-t-[28px] overflow-hidden flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.35)] relative">
            {/* Scrollable Body inside the Sheet (overscrollBehaviorY: none prevents iOS top bounce gap) */}
            <div
              ref={mobileScrollRef}
              style={{
                overscrollBehaviorY: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
              className="flex-1 overflow-y-auto no-scrollbar"
            >
              {/* 1. TOP WHITE CARD: Image + Description + Nutrition + Legal Info */}
              <div className="bg-white rounded-t-[28px] rounded-b-[24px] pb-4 overflow-hidden">
                {/* Edge-to-edge Top Product Image with Floating Close Button */}
                <div className="relative w-full aspect-square rounded-t-[28px] bg-white overflow-hidden select-none">
                  <img
                    src={activeImage}
                    alt={localizedName}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className="w-full h-full object-cover block select-none"
                  />

                  {/* Top-Right Close Button (X) matching Screenshot 2 */}
                  <button
                    type="button"
                    onClick={handleCloseSheet}
                    aria-label="Chiudi"
                    className="absolute top-3.5 right-3.5 z-20 w-9 h-9 rounded-full bg-white/95 hover:bg-white shadow-[0_2px_12px_rgba(0,0,0,0.14)] flex items-center justify-center text-[#21201F] active:scale-90 transition cursor-pointer"
                  >
                    <X className="w-5 h-5 stroke-[2.2]" />
                  </button>
                </div>

              {/* Product Title (24px bold) + Weight inline & Description below (Screenshot 3) */}
              <div className="px-4 pt-3.5">
                <h1 className="text-[24px] font-bold text-[#21201F] leading-[1.15] tracking-tight">
                  <span>{localizedName}</span>{' '}
                  <span className="text-[#9E9B98] font-bold whitespace-nowrap">
                    {displayWeight}
                  </span>
                </h1>

                <div className="relative mt-2 text-[15px] leading-[1.38] text-[#21201F] font-normal">
                  <p className={!isDescExpanded ? 'line-clamp-2' : ''}>
                    {fullMobileDescription}
                  </p>
                  {shouldShowExpandDesc && (
                    <button
                      type="button"
                      onClick={() => setIsDescExpanded(true)}
                      className="inline-flex items-center bg-gradient-to-l from-white from-70% via-white/95 to-transparent pl-8 text-[#9E9B98] hover:text-[#21201F] text-[15px] font-normal cursor-pointer absolute bottom-0 right-0"
                    >
                      <span>
                        {language === 'ru'
                          ? 'Развернуть'
                          : language === 'en'
                          ? 'Full description'
                          : 'Tutta la descrizione'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Nutritional Info ("На 100 г" + 4 compact columns matching Screenshot 2) */}
              <div className="px-4 pt-4">
                <div className="flex items-center gap-2 text-[13px] text-[#9E9B98] font-normal mb-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileNutritionMode(prev => (prev === '100g' ? 'portion' : '100g'))
                    }
                    className="cursor-pointer hover:text-[#21201F] transition"
                  >
                    {mobileNutritionMode === '100g'
                      ? language === 'ru'
                        ? 'На 100 г'
                        : 'Per 100 g'
                      : language === 'ru'
                      ? 'Всё блюдо'
                      : language === 'en'
                      ? 'Whole dish'
                      : 'Piatto intero'}
                  </button>
                </div>

                <div className="flex items-start gap-6">
                  <div>
                    <div className="text-[15px] font-bold text-[#21201F] leading-tight">
                      {mobileNutrition.kcalInt}
                    </div>
                    <div className="text-[12px] text-[#9E9B98] leading-tight mt-0.5">
                      {language === 'ru' ? 'ккал' : 'kcal'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#21201F] leading-tight">
                      {mobileNutrition.proteinInt}
                      {language === 'ru' ? 'г' : 'g'}
                    </div>
                    <div className="text-[12px] text-[#9E9B98] leading-tight mt-0.5">
                      {language === 'ru' ? 'белки' : language === 'en' ? 'protein' : 'proteine'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#21201F] leading-tight">
                      {mobileNutrition.fatInt}
                      {language === 'ru' ? 'г' : 'g'}
                    </div>
                    <div className="text-[12px] text-[#9E9B98] leading-tight mt-0.5">
                      {language === 'ru' ? 'жиры' : language === 'en' ? 'fats' : 'grassi'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#21201F] leading-tight">
                      {mobileNutrition.carbsInt}
                      {language === 'ru' ? 'г' : 'g'}
                    </div>
                    <div className="text-[12px] text-[#9E9B98] leading-tight mt-0.5">
                      {language === 'ru' ? 'углеводы' : language === 'en' ? 'carbs' : 'carboidrati'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal Info Pill ("Юридическая информация ›" at bottom of first white card, matching Screenshot 3) */}
              <div className="px-4 pt-3.5">
                <button
                  type="button"
                  aria-expanded={showLegalInfo}
                  onClick={() => setShowLegalInfo(prev => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F4F2] hover:bg-[#EAE8E4] text-[#8A8784] text-[12px] font-medium active:scale-95 transition cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8A8784] shrink-0" />
                  <span>
                    {language === 'ru'
                      ? 'Юридическая информация'
                      : language === 'en'
                      ? 'Legal & allergen info'
                      : 'Informazioni legali e allergeni'}
                  </span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-[#8A8784] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                      showLegalInfo ? 'rotate-90' : 'rotate-0'
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                    showLegalInfo
                      ? 'grid-rows-[1fr] opacity-100 mt-2'
                      : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-3 rounded-2xl bg-[#F5F4F2] text-[12px] text-[#6E6C69] leading-relaxed">
                      <p className="font-semibold text-[#21201F] mb-0.5">
                        LABRIOUT • 🥩 Street food &amp; spécialités maison • ✡️ 100% Casher • Badatz de Brunoy
                      </p>
                      <p>📍 64 av. Simone Veil, Bonneuil-sur-Marne • 📞 0769774086 • ⏰ 12h-15h 18h-22h15</p>
                      <p className="mt-1">
                        {language === 'ru'
                          ? 'Состав и возможные аллергены уточняйте у персонала при заказе.'
                          : language === 'en'
                          ? 'Ask our staff for detailed allergen and ingredient information.'
                          : 'Per informazioni dettagliate su ingredienti e allergeni, contatta il nostro staff.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 1B. SEPARATE WHITE CARD FOR EXTRAS / ADDITIONS (Matching Screenshots) */}
            {availableExtras && availableExtras.length > 0 && (() => {
              const handleToggleExtraGroupItem = (extraId: string, name: string, price: number) => {
                setHasEdited(true);
                setSelectedExtras(prev => {
                  const exists = prev.some(e => e.id === extraId);
                  if (exists) {
                    return prev.filter(e => e.id !== extraId);
                  } else {
                    return [...prev, { id: extraId, name, price }];
                  }
                });
              };

              const handleIncreaseExtraItem = (
                extraId: string,
                name: string,
                price: number,
                maxLimit = 10
              ) => {
                setHasEdited(true);
                setSelectedExtras(prev => {
                  const currentCount = prev.filter(e => e.id === extraId).length;
                  if (currentCount >= maxLimit) return prev;
                  return [...prev, { id: extraId, name, price }];
                });
              };

              const handleDecreaseExtraItem = (extraId: string) => {
                setHasEdited(true);
                setSelectedExtras(prev => {
                  const idx = prev.findIndex(e => e.id === extraId);
                  if (idx === -1) return prev;
                  const next = [...prev];
                  next.splice(idx, 1);
                  return next;
                });
              };

              return (
                <div className="bg-white rounded-[24px] mt-2 px-4 py-2">
                  {availableExtras.map((extra, idx) => {
                    const extraQty = selectedExtras.filter(e => e.id === extra.id).length;
                    const isChecked = extraQty > 0;
                    const isLastItem = idx === availableExtras.length - 1;
                    const extraName =
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
                      <div key={extra.id}>
                        <div
                          onClick={() =>
                            handleToggleExtraGroupItem(extra.id, extraName, extra.price)
                          }
                          className="h-[52px] min-h-[52px] max-h-[52px] flex items-center justify-between gap-2 cursor-pointer select-none"
                        >
                          {/* Left: Checkbox + Single-line Name & Price (never wraps or jumps) */}
                          <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                            <div
                              style={{
                                width: '26px',
                                height: '26px',
                                minWidth: '26px',
                                minHeight: '26px',
                              }}
                              className={`w-[26px] h-[26px] rounded-[8px] flex items-center justify-center shrink-0 transition-colors ${
                                isChecked
                                  ? 'bg-[#FF4A00] text-white'
                                  : 'bg-[#EBEAE8]'
                              }`}
                            >
                              {isChecked && (
                                <Check className="w-4 h-4 stroke-[2.6] text-white" />
                              )}
                            </div>

                            <div className="flex items-baseline gap-2 min-w-0 overflow-hidden whitespace-nowrap">
                              <span className="text-[15px] font-normal text-[#21201F] leading-none truncate">
                                {extraName}
                              </span>
                              <span className="text-[15px] font-normal text-[#9E9B98] leading-none whitespace-nowrap shrink-0">
                                +{(Number(extra.price) || 0).toFixed(2).replace('.', ',')} €
                              </span>
                            </div>
                          </div>

                          {/* Right: Stepper [- 1 +] when checked (appears without shifting row height) */}
                          {isChecked && (
                            <div
                              onClick={e => e.stopPropagation()}
                              className="flex items-center gap-1.5 shrink-0"
                            >
                              <button
                                type="button"
                                onClick={() => handleDecreaseExtraItem(extra.id)}
                                aria-label="Diminuisci"
                                className="w-[38px] h-[36px] rounded-[12px] bg-[#F5F4F2] active:bg-[#E5E4E2] flex items-center justify-center text-[#21201F] cursor-pointer"
                              >
                                <Minus className="w-4 h-4 stroke-[2]" />
                              </button>
                              <span className="min-w-[20px] text-center text-[15px] font-medium text-[#21201F]">
                                {extraQty}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleIncreaseExtraItem(
                                    extra.id,
                                    extraName,
                                    extra.price,
                                    10
                                  )
                                }
                                aria-label="Aumenta"
                                className="w-[38px] h-[36px] rounded-[12px] bg-[#F5F4F2] active:bg-[#E5E4E2] flex items-center justify-center text-[#21201F] cursor-pointer"
                              >
                                <Plus className="w-4 h-4 stroke-[2]" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Subtle divider line aligned with text */}
                        {!isLastItem && (
                          <div className="ml-[38px] border-b border-[#F0EFED]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* 2. SECOND WHITE CARD: "Вам может понравиться" - 3 items per row (Screenshot 2) */}
            <div className="bg-white rounded-t-[24px] mt-2 pt-4 px-3.5 pb-6">
              <h2 className="text-[20px] font-bold text-[#21201F] tracking-tight mb-3">
                {language === 'ru'
                  ? 'Вам может понравиться'
                  : language === 'en'
                  ? 'You might also like'
                  : 'Potrebbe piacerti anche'}
              </h2>

              <div className="grid grid-cols-3 gap-x-2 gap-y-4 justify-items-center">
                {mobileRecommendedProducts.map(rec => {
                  const recName = getLocalizedProductName(rec, language);
                  const recWeight = getLocalizedWeight(rec);
                  const cartItemsForRec = items.filter(
                    i => (i.product?.id === rec.id || i.productId === rec.id) && !isItemSoftDeleted(i.cartItemId)
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
                      onClick={() => openProductDetail(rec, undefined, undefined, productDetailSource || 'home')}
                      style={{ maxWidth: '114.13px' }}
                      className="w-full max-w-[114.13px] flex flex-col cursor-pointer select-none"
                    >
                      {/* Preview Image Container: up to 114.13 x 114.13px with #00000008 fade overlay */}
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

                        {/* Fade layer: #00000008 background (Screenshot 2) */}
                        <div
                          style={{
                            backgroundColor: '#00000008',
                          }}
                          className="absolute inset-0 w-full h-full rounded-[18px] pointer-events-none"
                        />

                        {/* Floating Add / Stepper Button at bottom right of preview (matching main page ProductCard) */}
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
                                aria-label="Diminuisci quantità"
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
                                aria-label="Aumenta quantità"
                              >
                                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                              </button>
                            </div>
                          ) : (
                            /* "+" Button: strictly 32x32px, padding 4px, inner 24x24 image, path 12x12px (Screenshots 3, 4, 5) */
                            <button
                              type="button"
                              aria-label={language === 'ru' ? 'Увеличить' : language === 'it' ? 'Aggiungi' : 'Increase'}
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

          {/* 3. STICKY BOTTOM BAR OF THE SHEET (Exact layout of Screenshot 2) */}
          <div className="shrink-0 bg-white border-t border-neutral-200/70 px-4 pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] shadow-[0_-6px_24px_rgba(0,0,0,0.06)] z-20">
            {/* Row 1: Product Title + Weight on Left, Price on Right */}
            <div className="flex items-baseline justify-between gap-3 mb-2.5">
              <div className="flex items-baseline gap-1.5 min-w-0">
                <span className="text-[15px] font-medium text-[#21201F] truncate">
                  {localizedName}
                </span>
                <span className="text-[14px] text-[#9E9B98] font-normal shrink-0">
                  {displayWeight}
                </span>
              </div>
              <div className="flex items-baseline gap-2 shrink-0">
                <span className="text-[17px] font-bold text-[#21201F]">
                  €{(Number(mobileSheetTotalPrice) || 0).toFixed(2).replace('.', ',')}
                </span>
                {hasDiscount && (
                  <span className="text-[13px] text-[#9E9B98] line-through font-normal">
                    €{(Number(oldPrice * quantity + mobileRecommendedAddedTotal) || 0).toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
            </div>

            {/* Row 2: Quantity Stepper [- 1 +] on Left + Main Add/Done/Save/Delete Button on Right */}
            <div className="flex items-center gap-2.5">
              <div className="h-[50px] w-[122px] rounded-[16px] bg-[#F5F4F2] flex items-center justify-between px-3 shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => {
                    const minQty = isEditingCartItem ? 0 : 1;
                    if (quantity > minQty) {
                      setQuantity(quantity - 1);
                      setHasEdited(true);
                    }
                  }}
                  disabled={quantity <= (isEditingCartItem ? 0 : 1)}
                  aria-label="Diminuisci quantità"
                  className="w-8 h-8 flex items-center justify-center text-[#21201F] disabled:opacity-35 cursor-pointer active:scale-90 transition"
                >
                  <Minus className="w-4 h-4 stroke-[2.2]" />
                </button>
                <span className="text-[16px] font-bold text-[#21201F] min-w-[20px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setQuantity(quantity + 1);
                    setHasEdited(true);
                  }}
                  aria-label="Aumenta quantità"
                  className="w-8 h-8 flex items-center justify-center text-[#21201F] cursor-pointer active:scale-90 transition"
                >
                  <Plus className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCartMobileSheet}
                style={
                  isEditingCartItem && quantity === 0
                    ? { backgroundColor: '#FA3E2C' }
                    : undefined
                }
                className={`flex-1 h-[50px] rounded-[16px] active:scale-[0.98] text-white font-semibold text-[16px] flex items-center justify-center shadow-sm transition cursor-pointer select-none ${
                  isEditingCartItem && quantity === 0
                    ? 'bg-[#FA3E2C] hover:bg-[#e53524] shadow-[#FA3E2C]/25'
                    : 'bg-[#ff5500] hover:bg-[#ff6611] shadow-[#ff5500]/25'
                }`}
              >
                <span>
                  {isEditingCartItem
                    ? quantity === 0
                      ? language === 'ru'
                        ? 'Удалить'
                        : language === 'it'
                        ? 'Rimuovi'
                        : language === 'de'
                        ? 'Entfernen'
                        : language === 'fr'
                        ? 'Supprimer'
                        : 'Remove'
                      : hasEdited
                      ? language === 'ru'
                        ? 'Сохранить'
                        : language === 'it'
                        ? 'Salva'
                        : language === 'de'
                        ? 'Speichern'
                        : language === 'fr'
                        ? 'Enregistrer'
                        : 'Save'
                      : language === 'ru'
                      ? 'Готово'
                      : language === 'it'
                      ? 'Fatto'
                      : language === 'de'
                      ? 'Fertig'
                      : language === 'fr'
                      ? 'Terminé'
                      : 'Done'
                    : language === 'ru'
                    ? 'Добавить'
                    : language === 'it'
                    ? 'Aggiungi'
                    : language === 'de'
                    ? 'Hinzufügen'
                    : language === 'fr'
                    ? 'Ajouter'
                    : 'Add'}
                </span>
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DESKTOP VIEW (md and up)                                              */}
      {/* ===================================================================== */}
      <div className="hidden md:block w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 animate-fadeIn font-sans text-neutral-900">
        
        {/* 1. Breadcrumb Navigation: Home › Category › Product Name */}
        <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-500 mb-2 sm:mb-2.5 overflow-x-auto whitespace-nowrap pb-0.5">
          <button
            type="button"
            onClick={() => {
              setPendingScrollCategory(null);
              setCurrentView('home');
            }}
            className="hover:text-neutral-900 transition cursor-pointer font-normal"
          >
            {language === 'ru' ? 'Главная' : 'Home'}
          </button>
          <span className="text-neutral-400">›</span>
          <button
            type="button"
            onClick={() => navigateToCategory(product.category, undefined, 'home')}
            className="hover:text-[#ff5500] text-neutral-600 transition cursor-pointer font-medium"
          >
            {categoryLabel}
          </button>
          <span className="text-neutral-400">›</span>
          <span className="text-neutral-400 truncate max-w-[320px]">
            {localizedName}
          </span>
        </nav>

        {/* 2. Top Title Row with Weight & Favorite Heart */}
        <div className="flex items-start justify-between gap-4 mb-3 sm:mb-4">
          <h1 className="text-[30px] sm:text-[40px] lg:text-[48px] font-black text-[#21201F] tracking-tight leading-tight flex flex-wrap items-baseline gap-2.5">
            <span>{localizedName}</span>
            <span className="text-neutral-400 text-2xl sm:text-3xl lg:text-[38px] font-bold font-sans">
              {displayWeight}
            </span>
          </h1>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={toggleFavorite}
            aria-label="Aggiungi ai preferiti"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-neutral-200/80 shadow-xs flex items-center justify-center cursor-pointer hover:border-neutral-400 hover:shadow-md active:scale-95 transition-all shrink-0"
          >
            <Heart
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                isFavorite ? 'text-red-500 fill-red-500' : 'text-neutral-700'
              }`}
            />
          </button>
        </div>

        {/* 3. Main 2-Column Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
          
          {/* LEFT COLUMN: Main Image (464x464px) & Previews (64.4x64.4px) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-4">
            <div
              className="relative w-full max-w-[464px] aspect-square rounded-[28px] sm:rounded-[32px] overflow-hidden bg-[#f7f7f8] border border-neutral-100 shadow-sm flex items-center justify-center select-none"
              style={{ width: '464px', maxWidth: '100%', height: '464px' }}
            >
              <img
                src={activeImage}
                alt={localizedName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {/* Badges on bottom-left of image */}
              <div className="absolute bottom-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                <span className="bg-[#ffd200] text-neutral-900 text-xs font-black uppercase px-2.5 py-0.5 rounded-lg tracking-wider shadow-sm w-fit">
                  {language === 'ru' ? 'НОВОЕ' : 'NOVITÀ'}
                </span>
                {hasDiscount && discountPercent > 0 && (
                  <span className="bg-[#e62e2e] text-white text-xs font-black uppercase px-2.5 py-0.5 rounded-lg tracking-wider shadow-sm w-fit">
                    -{discountPercent}%
                  </span>
                )}
                {product.isVegetarian && (
                  <span className="bg-[#00875A] text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm w-fit">
                    Vegetariano 🍃
                  </span>
                )}
              </div>
            </div>

            {galleryImages.length > 1 && (
              <div className="flex items-center justify-center gap-3 pt-1 overflow-x-auto w-full max-w-[464px]">
                {galleryImages.map((imgSrc, idx) => {
                  const isActive = activeImageIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      aria-label={`Preview angle ${idx + 1}`}
                      style={{
                        width: '64.4px',
                        height: '64.4px',
                        minWidth: '64.4px',
                        minHeight: '64.4px',
                        borderWidth: '1px',
                        borderColor: isActive ? '#21201F' : '#e5e7eb',
                      }}
                      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all border ${
                        isActive
                          ? 'border-[#21201F] opacity-100 shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgSrc}
                        alt={`Preview ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Actions, Nutritional Info, Composition & Specs */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pb-[15px] border-b border-neutral-100">
              <div className="flex items-baseline gap-2">
                <span className="font-heading font-black text-[32px] text-[#21201F] tracking-tight leading-none">
                  {(Number(totalPrice) || 0).toFixed(2).replace('.', ',')} €
                </span>
                {hasDiscount && (
                  <span className="text-neutral-400 font-semibold text-base sm:text-lg line-through">
                    {(Number(oldPrice * quantity) || 0).toFixed(2).replace('.', ',')} €
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-[126px] h-[56px] flex items-center justify-between bg-white rounded-2xl px-2.5 border border-neutral-200/90 shadow-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 disabled:opacity-30 disabled:hover:bg-neutral-100 transition cursor-pointer active:scale-95 shrink-0"
                    aria-label="Diminuisci quantità"
                  >
                    <Minus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                  <span className="font-black text-base sm:text-lg text-[#21201F] min-w-5 text-center select-none">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#ff5500] hover:bg-[#ff6611] text-white shadow-xs shadow-[#ff5500]/25 transition cursor-pointer active:scale-95 shrink-0"
                    aria-label="Aumenta quantità"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCartDesktop}
                  style={{ width: '140px', height: '56px' }}
                  className={`w-[140px] h-[56px] min-w-[140px] min-h-[56px] shrink-0 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-md shadow-[#ff5500]/25 transition-all cursor-pointer active:scale-[0.98] select-none whitespace-nowrap ${
                    isAddedAnimation
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                      : 'bg-gradient-to-r from-[#ff5500] to-[#ff4400] hover:from-[#ff6611] hover:to-[#ff5500] text-white'
                  }`}
                >
                  <span>
                    {isAddedAnimation
                      ? language === 'ru'
                        ? 'Добавлено ✓'
                        : language === 'it'
                        ? 'Aggiunto ✓'
                        : 'Added ✓'
                      : language === 'ru'
                      ? 'Корзина'
                      : language === 'it'
                      ? 'Carrello'
                      : 'Cart'}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0 text-white" />
                </button>
              </div>
            </div>

            {/* Nutritional Breakdown Table (КБЖУ) */}
            <div className="pt-[15px] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
                <button
                  type="button"
                  onClick={() => setNutritionMode('portion')}
                  className={`transition cursor-pointer ${
                    nutritionMode === 'portion' ? 'text-neutral-900 font-bold' : 'hover:text-neutral-700'
                  }`}
                >
                  {language === 'ru' ? 'Всё блюдо' : language === 'en' ? 'Whole dish' : 'Piatto intero'}
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setNutritionMode('100g')}
                  className={`transition cursor-pointer ${
                    nutritionMode === '100g' ? 'text-neutral-900 font-bold' : 'hover:text-neutral-700'
                  }`}
                >
                  {language === 'ru' ? 'На 100 г' : language === 'en' ? 'Per 100 g' : 'Per 100 g'}
                </button>
              </div>

              <div className="flex flex-wrap items-start gap-6 sm:gap-[30px] pt-1 border-b border-neutral-100 pb-[15px]">
                <div className="shrink-0">
                  <div className="text-[20px] font-black text-neutral-900 leading-tight">{nutrition.kcal}</div>
                  <div className="text-[11px] text-neutral-500 font-medium">{language === 'ru' ? 'ккал' : 'kcal'}</div>
                </div>
                <div className="shrink-0">
                  <div className="text-[20px] font-black text-neutral-900 leading-tight">{nutrition.protein}</div>
                  <div className="text-[11px] text-neutral-500 font-medium">{language === 'ru' ? 'белки' : language === 'en' ? 'protein' : 'proteine'}</div>
                </div>
                <div className="shrink-0">
                  <div className="text-[20px] font-black text-neutral-900 leading-tight">{nutrition.fat}</div>
                  <div className="text-[11px] text-neutral-500 font-medium">{language === 'ru' ? 'жиры' : language === 'en' ? 'fats' : 'grassi'}</div>
                </div>
                <div className="shrink-0">
                  <div className="text-[20px] font-black text-neutral-900 leading-tight">{nutrition.carbs}</div>
                  <div className="text-[11px] text-neutral-500 font-medium">{language === 'ru' ? 'углеводы' : language === 'en' ? 'carbs' : 'carboidrati'}</div>
                </div>
              </div>
            </div>

            {/* Description Paragraph */}
            <div className="pt-[15px] pb-[15px] border-b border-neutral-100 space-y-3">
              <p className="text-[16px] text-neutral-700 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Interactive Extras & Additions */}
            {availableExtras && availableExtras.length > 0 && (
              <div className="pt-[15px]">
                <div className="space-y-0.5">
                  {availableExtras.map(extra => {
                    const isChecked = selectedExtras.some(e => e.id === extra.id);
                    const extraName =
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
                      <div
                        key={extra.id}
                        onClick={() => toggleExtra(extra.id, extraName, extra.price)}
                        className="group flex items-center gap-3 py-1 px-0 transition-all cursor-pointer text-[#21201F]"
                      >
                        <div
                          style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px' }}
                          className={`w-[32px] h-[32px] rounded-[10px] border flex items-center justify-center shrink-0 checkbox-inset-shadow ${
                            isChecked
                              ? 'bg-[#FF5000] border-transparent text-white'
                              : 'border-neutral-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-4 h-4 stroke-[3] text-white" />}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          <span className="text-[16px] font-semibold text-[#21201F] leading-tight">
                            {extraName}
                          </span>
                          <span className="text-[16px] font-light text-[#908F8F] shrink-0 leading-tight">
                            +{(Number(extra.price) || 0).toFixed(2).replace('.', ',')} €
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Special Notes Accordion for Kitchen */}
            <div className="pt-3.5 sm:pt-4">
              <button
                type="button"
                onClick={() => setShowNotes(!showNotes)}
                className="text-[11px] sm:text-xs font-bold text-neutral-500 hover:text-neutral-900 transition flex items-center gap-1 cursor-pointer"
              >
                <MessageSquare className="w-3 h-3" />
                <span>
                  {showNotes
                    ? language === 'ru'
                      ? 'Скрыть пожелания для кухни'
                      : 'Nascondi note per la cucina'
                    : language === 'ru'
                    ? '+ Добавить примечание или пожелание для кухни'
                    : '+ Aggiungi note per la cucina'}
                </span>
              </button>

              {showNotes && (
                <div className="mt-1.5 animate-fadeIn">
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={e => setSpecialNotes(e.target.value)}
                    placeholder={
                      language === 'ru'
                        ? 'Напр., без перца, хорошо прожарить, соусы отдельно...'
                        : 'Es. Senza pepe, ben cotto, salse a parte...'
                    }
                    className="w-full bg-[#f6f6f8] border border-[1px] border-[#E8E7E6] rounded-xl p-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 4. BOTTOM SECTION: "Может, ещё кое-что? / You might also like" */}
        <div className="mt-8 sm:mt-12">
          <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mb-5">
            {language === 'ru' ? 'Может, ещё кое-что?' : language === 'en' ? 'You might also like' : 'Potrebbe piacerti anche'}
          </h2>

          <div className="grid grid-cols-[repeat(2,minmax(0,173.2px))] justify-center sm:justify-start sm:grid-cols-[repeat(4,232.4px)] gap-[8px] sm:gap-[27px] max-w-[1113px] w-full">
            {recommendedProducts.map(rec => (
              <ProductCard key={rec.id} product={rec} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
