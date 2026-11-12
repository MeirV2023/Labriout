import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { CartItem, ProductItem, SelectedExtra, FulfillmentType, PlacedOrder, CustomerOrderInfo, Language, CategoryId } from '../types';
import { STORE_DETAILS, INITIAL_SAMPLE_CART_ITEMS, MENU_PRODUCTS } from '../data/menuData';
import { LABRIOUT_MENU_PRODUCTS, getLabrioutTagline } from '../data/labrioutMenuData';
import { TRANSLATIONS } from '../utils/translations';
import {
  fetchCatalogMenu,
  createDirectStripeIntent,
  createOrderInBackend,
  recordOrderInOfflineFirstDb,
  subscribeToRealtimeStream,
  resolveInitialTenantId,
  getBaseProductsForTenant,
} from '../utils/api';

export type AppView =
  | 'home'
  | 'cart'
  | 'product'
  | 'chi-siamo'
  | 'contatti'
  | 'checkout'
  | 'menu'
  | 'owner'
  | 'super-admin';

export type CurrencyCode = 'EUR' | 'USD';

interface CartContextType {
  currentView: AppView;
  setCurrentView: (view: AppView, pushHistory?: boolean, resetScroll?: boolean) => void;
  selectedProductDetail: ProductItem | null;
  setSelectedProductDetail: (product: ProductItem | null) => void;
  openProductDetail: (product: ProductItem, initialQuantity?: number, cartItemId?: string, source?: 'home' | 'menu' | 'cart') => void;
  productDetailSource: 'home' | 'menu' | 'cart' | null;
  setProductDetailSource: (source: 'home' | 'menu' | 'cart' | null) => void;
  pendingScrollCategory: CategoryId | 'tutti' | null;
  setPendingScrollCategory: (category: CategoryId | 'tutti' | null) => void;
  selectedCategory: CategoryId;
  setSelectedCategory: (category: CategoryId) => void;
  selectedCardKey: string;
  setSelectedCardKey: (key: string) => void;
  categorySubFilters: Record<string, string>;
  setCategorySubFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  navigateToCategory: (category: CategoryId | 'tutti', subFilter?: string, targetView?: AppView) => void;
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setItemQuantity: (cartItemId: string, newQuantity: number) => void;
  addToCart: (product: ProductItem, quantity?: number, selectedExtras?: SelectedExtra[], specialNotes?: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  updateCartItemExtras: (cartItemId: string, extras: SelectedExtra[], specialNotes?: string) => void;
  
  // Fulfillment & Timing
  fulfillmentType: FulfillmentType;
  setFulfillmentType: (type: FulfillmentType) => void;
  selectedTimeSlot: string;
  setSelectedTimeSlot: (slot: string) => void;
  selectedDayIndex: number;
  setSelectedDayIndex: (index: number) => void;
  selectedSlot: string;
  setSelectedSlot: (slot: string) => void;

  // Pricing & Calculations
  itemsCount: number;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  total: number;
  couponCode: string;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // UI state
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCartBouncing: boolean;
  cartBounceKey: number;
  triggerCartBounce: () => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  productModalItem: ProductItem | null;
  setProductModalItem: (item: ProductItem | null) => void;
  editingCartItemId: string | null;
  setEditingCartItemId: (id: string | null) => void;
  activePlacedOrder: PlacedOrder | null;
  setActivePlacedOrder: (order: PlacedOrder | null) => void;
  isStoreInfoOpen: boolean;
  setIsStoreInfoOpen: (open: boolean) => void;
  softDeletedItemIds: string[];
  softDeleteItem: (cartItemId: string) => void;
  restoreItem: (cartItemId: string) => void;
  isItemSoftDeleted: (cartItemId: string) => boolean;

  // Language & Localization
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;

  // Currency
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  currencySymbol: '€' | '$';
  formatMoney: (value: number | string, opts?: { decimals?: number; withPlus?: boolean }) => string;

  // Order creation & Multi-Tenant Backend Sync
  submitOrder: (customer: CustomerOrderInfo) => PlacedOrder;
  activeTenantId: string;
  setActiveTenantId: (tenantId: string) => void;
  catalogProducts: ProductItem[];
  refreshCatalog: () => Promise<void>;
  activeTenantInfo: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'labriout_cart_v3';
const LANG_STORAGE_KEY = 'labriout_lang_v1';
const CURRENCY_STORAGE_KEY = 'labriout_currency_v1';
const FULFILLMENT_STORAGE_KEY = 'labriout_fulfillment_v3';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Helper to parse initial view and product from window.location.pathname
  const getInitialViewFromUrl = (): { view: AppView; product: ProductItem | null } => {
    if (typeof window === 'undefined') return { view: 'home', product: null };
    const path = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    if (path === '/cart') return { view: 'cart', product: null };
    if (path === '/checkout') return { view: 'checkout', product: null };
    if (path === '/menu') return { view: 'menu', product: null };
    if (path === '/owner' || path === '/kds') return { view: 'owner', product: null };
    if (path === '/super-admin' || path === '/cms') return { view: 'super-admin', product: null };
    if (path === '/about' || path === '/chi-siamo') return { view: 'chi-siamo', product: null };
    if (path === '/contact' || path === '/contatti') return { view: 'contatti', product: null };
    if (path.startsWith('/product/')) {
      const prodId = path.replace('/product/', '');
      const allProds = [...MENU_PRODUCTS, ...LABRIOUT_MENU_PRODUCTS];
      const found = allProds.find(p => p.id === prodId);
      const baseList = getBaseProductsForTenant(resolveInitialTenantId());
      return { view: 'product', product: found || baseList[0] };
    }
    return { view: 'home', product: null };
  };

  const initialRoute = getInitialViewFromUrl();
  // Current active view: 'home' | 'cart' | 'product' | 'chi-siamo' | 'contatti' | 'checkout' | 'menu'
  const [currentView, setCurrentViewState] = useState<AppView>(initialRoute.view);
  const [selectedProductDetail, setSelectedProductDetail] = useState<ProductItem | null>(initialRoute.product);

  // Saved scroll Y before opening product bottom sheet on mobile
  const savedScrollYRef = useRef<number>(0);

  // Sync with browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialViewFromUrl();
      setCurrentViewState(route.view);
      if (route.product) {
        setSelectedProductDetail(route.product);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Menu Catalog Category Navigation State
  const initialTenant = resolveInitialTenantId();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(
    initialTenant === 'labriout' ? 'panini' : 'friggitoria'
  );
  const [selectedCardKey, setSelectedCardKey] = useState<string>(
    initialTenant === 'labriout' ? 'panini' : 'friggitoria'
  );
  const [categorySubFilters, setCategorySubFilters] = useState<Record<string, string>>({
    friggitoria: 'tutti',
    panini: 'tutti',
    panini_special: 'tutti',
    girarrosto: 'tutti',
    patate: 'tutti',
    gastronomia: 'tutti',
    pranzo: 'tutti',
    rosticceria: 'tutti',
    bevande: 'tutti',
  });

  // Anchor scroll and source tracking
  const [pendingScrollCategory, setPendingScrollCategory] = useState<CategoryId | 'tutti' | null>(null);
  const [productDetailSource, setProductDetailSource] = useState<'home' | 'menu' | 'cart' | null>(null);

  const navigateToCategory = (catId: CategoryId | 'tutti', subFilter?: string, targetView?: AppView) => {
    setSelectedCategory(catId === 'tutti' ? 'tutti' : catId);
    setSelectedCardKey(catId === 'tutti' ? 'all' : catId);
    if (subFilter && catId !== 'tutti') {
      setCategorySubFilters(prev => ({ ...prev, [catId]: subFilter }));
    }

    const destView: AppView = targetView || (currentView === 'menu' ? 'menu' : 'home');
    setPendingScrollCategory(null);
    requestAnimationFrame(() => {
      setPendingScrollCategory(catId);
    });
    setCurrentView(destView, true, false);
  };

  const scrollToTopInstant = () => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const setCurrentView = (view: AppView, pushHistory = true, resetScroll = true) => {
    const returningFromProductMobile =
      !resetScroll &&
      currentView === 'product' &&
      view !== 'product' &&
      typeof window !== 'undefined' &&
      window.innerWidth < 768;

    if (resetScroll) {
      setPendingScrollCategory(null);
      scrollToTopInstant();
    }
    setCurrentViewState(view);
    if (typeof window !== 'undefined') {
      if (resetScroll) {
        requestAnimationFrame(() => {
          scrollToTopInstant();
          requestAnimationFrame(scrollToTopInstant);
        });
        setTimeout(scrollToTopInstant, 30);
      } else if (returningFromProductMobile) {
        const targetY = savedScrollYRef.current;
        if (Math.abs((window.scrollY || window.pageYOffset || 0) - targetY) > 1) {
          window.scrollTo({ top: targetY, left: 0, behavior: 'instant' as ScrollBehavior });
        }
      }
      if (pushHistory) {
        const targetPath =
          view === 'cart'
            ? '/cart'
            : view === 'checkout'
            ? '/checkout'
            : view === 'menu'
            ? '/menu'
            : view === 'owner'
            ? '/owner'
            : view === 'super-admin'
            ? '/super-admin'
            : view === 'chi-siamo'
            ? '/about'
            : view === 'contatti'
            ? '/contact'
            : view === 'product' && selectedProductDetail
            ? `/product/${selectedProductDetail.id}`
            : '/';
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ view, productId: selectedProductDetail?.id }, '', targetPath);
        }
      }
    }
  };

  const openProductDetail = (
    product: ProductItem,
    initialQuantity?: number,
    cartItemId?: string,
    source?: 'home' | 'menu' | 'cart'
  ) => {
    if (typeof window !== 'undefined' && currentView !== 'product') {
      savedScrollYRef.current =
        window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    }
    setSelectedProductDetail(product);
    if (source) {
      setProductDetailSource(source);
    } else if (currentView === 'menu' || currentView === 'cart' || currentView === 'home') {
      setProductDetailSource(currentView);
    } else if (!productDetailSource) {
      setProductDetailSource('home');
    }
    if (cartItemId) {
      setEditingCartItemId(cartItemId);
    } else {
      setEditingCartItemId(null);
    }
    if (product.category && (typeof window === 'undefined' || window.innerWidth >= 768)) {
      setSelectedCategory(product.category);
      setSelectedCardKey(product.category);
    }
    setCurrentViewState('product');
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 768) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      const targetPath = `/product/${product.id}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ view: 'product', productId: product.id }, '', targetPath);
      }
    }
  };

  // Helper to normalize and sanitize any cart item structure (handles legacy stored items & updates product images)
  const sanitizeCartItem = (raw: any): CartItem => {
    const rawProd = raw?.product || {};
    const prodId = String(raw?.productId || rawProd.id || '');
    const allProds = [...MENU_PRODUCTS, ...LABRIOUT_MENU_PRODUCTS];
    const latestProd = allProds.find(p => p.id === prodId || (rawProd.name && p.name === rawProd.name));
    const product = latestProd ? { ...latestProd, ...rawProd, image: latestProd.image } : rawProd;
    const basePrice = Number(product.price ?? raw?.unitPrice ?? raw?.price ?? 0);
    const selectedExtras: SelectedExtra[] = Array.isArray(raw?.selectedExtras)
      ? raw.selectedExtras.map((e: any) => ({
          id: String(e?.id || ''),
          name: String(e?.name || ''),
          price: Number(e?.price ?? 0),
        }))
      : [];
    const extrasTotal = selectedExtras.reduce((sum, e) => sum + (Number(e.price) || 0), 0);
    const totalUnitPrice = Number(raw?.totalUnitPrice ?? raw?.unitPrice ?? (basePrice + extrasTotal));
    const cartItemId = String(raw?.cartItemId || raw?.id || `item-${product.id || Math.random().toString(36).substring(2, 9)}`);

    return {
      cartItemId,
      productId: String(raw?.productId || product.id || cartItemId),
      product: {
        ...product,
        price: basePrice,
      },
      quantity: Math.max(1, Number(raw?.quantity) || 1),
      selectedExtras,
      specialNotes: String(raw?.specialNotes || ''),
      totalUnitPrice: isNaN(totalUnitPrice) ? basePrice : totalUnitPrice,
    };
  };

  const getCartItemSignature = (productId: string, extras: SelectedExtra[] = [], notes?: string): string => {
    const sortedExtras = [...extras]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map(e => e.id)
      .join('_');
    const cleanNotes = (notes || '').trim().toLowerCase();
    return `${productId}-${sortedExtras}-${cleanNotes}`;
  };

  const mergeCartItemsList = (list: CartItem[], softDeletedIds: string[] = []): CartItem[] => {
    const result: CartItem[] = [];
    list.forEach(item => {
      if (softDeletedIds.includes(item.cartItemId)) {
        result.push(item);
        return;
      }
      const prodId = item.product?.id || item.productId;
      const sig = getCartItemSignature(prodId, item.selectedExtras || [], item.specialNotes);
      const existingIdx = result.findIndex(
        r =>
          !softDeletedIds.includes(r.cartItemId) &&
          getCartItemSignature(r.product?.id || r.productId, r.selectedExtras || [], r.specialNotes) === sig
      );
      if (existingIdx !== -1) {
        result[existingIdx] = {
          ...result[existingIdx],
          quantity: (Number(result[existingIdx].quantity) || 1) + (Number(item.quantity) || 1),
        };
      } else {
        result.push(item);
      }
    });
    return result;
  };

  const defaultSampleItems =
    initialTenant === 'labriout'
      ? [
          {
            cartItemId: 'sample-lab-1',
            productId: LABRIOUT_MENU_PRODUCTS[1].id,
            product: LABRIOUT_MENU_PRODUCTS[1],
            quantity: 1,
            selectedExtras: [],
            specialNotes: '',
            totalUnitPrice: LABRIOUT_MENU_PRODUCTS[1].price,
          },
          {
            cartItemId: 'sample-lab-2',
            productId: LABRIOUT_MENU_PRODUCTS[18].id,
            product: LABRIOUT_MENU_PRODUCTS[18],
            quantity: 1,
            selectedExtras: [],
            specialNotes: '',
            totalUnitPrice: LABRIOUT_MENU_PRODUCTS[18].price,
          },
        ]
      : (INITIAL_SAMPLE_CART_ITEMS as any[]);

  const tenantCartKey =
    initialTenant === 'labriout' ? `${CART_STORAGE_KEY}_labriout` : CART_STORAGE_KEY;

  // Initialize items from localStorage or fallback to Screenshot 2 exact sample items
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(tenantCartKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = parsed.map(sanitizeCartItem);
          return mergeCartItemsList(sanitized);
        }
      }
      return mergeCartItemsList(defaultSampleItems.map(sanitizeCartItem));
    } catch {
      return mergeCartItemsList(defaultSampleItems.map(sanitizeCartItem));
    }
  });

  // Language (URL ?lang=en|fr|de|it|ru > localStorage > tenant default)
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      if (typeof window !== 'undefined' && window.location.search) {
        const urlLang = new URLSearchParams(window.location.search).get('lang')?.toLowerCase();
        if (urlLang && ['it', 'en', 'ru', 'de', 'fr'].includes(urlLang)) {
          localStorage.setItem(LANG_STORAGE_KEY, urlLang);
          return urlLang as Language;
        }
      }
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (savedLang && ['it', 'en', 'ru', 'de', 'fr'].includes(savedLang)) return savedLang;
      return initialTenant === 'labriout' ? 'fr' : 'it';
    } catch {
      return initialTenant === 'labriout' ? 'fr' : 'it';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
      if (typeof window !== 'undefined' && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        if (params.has('lang')) {
          params.set('lang', lang);
          const qs = params.toString();
          window.history.replaceState(
            window.history.state,
            '',
            `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`
          );
        }
      }
    } catch {
      // ignore
    }
  };

  // Currency (URL ?currency=usd|eur > localStorage > America/* timezone -> USD, else EUR)
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      if (typeof window !== 'undefined' && window.location.search) {
        const urlCurr = new URLSearchParams(window.location.search).get('currency')?.toUpperCase();
        if (urlCurr === 'USD' || urlCurr === 'EUR') {
          localStorage.setItem(CURRENCY_STORAGE_KEY, urlCurr);
          return urlCurr;
        }
      }
      const savedCurr = localStorage.getItem(CURRENCY_STORAGE_KEY)?.toUpperCase();
      if (savedCurr === 'USD' || savedCurr === 'EUR') {
        return savedCurr;
      }
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.startsWith('America/')) {
        return 'USD';
      }
      return 'EUR';
    } catch {
      return 'EUR';
    }
  });

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, c);
      if (typeof window !== 'undefined' && window.location.search) {
        const params = new URLSearchParams(window.location.search);
        if (params.has('currency')) {
          params.set('currency', c.toLowerCase());
          const qs = params.toString();
          window.history.replaceState(
            window.history.state,
            '',
            `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`
          );
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const currencySymbol: '€' | '$' = currency === 'USD' ? '$' : '€';

  const formatMoney = useCallback(
    (value: number | string, opts?: { decimals?: number; withPlus?: boolean }): string => {
      const n = Number(value) || 0;
      const decimals = opts?.decimals ?? 2;
      const sign = opts?.withPlus && n > 0 ? '+' : n < 0 ? '-' : '';
      const formatted = Math.abs(n).toFixed(decimals);
      if (currency === 'USD') {
        return `${sign}$${formatted}`;
      }
      return `${sign}€${formatted}`;
    },
    [currency]
  );

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.title = `LABRIOUT | ${getLabrioutTagline(language)}`;
    }
  }, [language]);

  // Fulfillment: default to 'asporto' (Pickup) as first tab
  const [fulfillmentType, setFulfillmentTypeState] = useState<FulfillmentType>(() => {
    try {
      const saved = localStorage.getItem(FULFILLMENT_STORAGE_KEY) as FulfillmentType;
      if (saved === 'asporto' || saved === 'consegna') return saved;
      return 'asporto';
    } catch {
      return 'asporto';
    }
  });

  const setFulfillmentType = (type: FulfillmentType) => {
    setFulfillmentTypeState(type);
    try {
      localStorage.setItem(FULFILLMENT_STORAGE_KEY, type);
    } catch {
      // ignore
    }
  };

  const [selectedTimeSlot, setSelectedTimeSlotState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('panzarotto_time_slot_v1');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'subito';
  });

  const setSelectedTimeSlot = (slot: string) => {
    setSelectedTimeSlotState(slot);
    try {
      localStorage.setItem('panzarotto_time_slot_v1', slot);
    } catch {
      // ignore
    }
  };

  const [selectedDayIndex, setSelectedDayIndexState] = useState<number>(() => {
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      const savedDate = localStorage.getItem('panzarotto_date_key_v5');
      if (savedDate === todayKey) {
        const saved = localStorage.getItem('panzarotto_day_index_v5');
        if (saved !== null) {
          const parsed = parseInt(saved, 10);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 5) return parsed;
        }
      } else {
        localStorage.setItem('panzarotto_date_key_v5', todayKey);
        localStorage.setItem('panzarotto_day_index_v5', '0');
      }
    } catch {
      // ignore
    }
    return 0; // Always 0 (Oggi / Today) by default
  });

  const setSelectedDayIndex = (index: number) => {
    setSelectedDayIndexState(index);
    try {
      const todayKey = new Date().toISOString().slice(0, 10);
      localStorage.setItem('panzarotto_date_key_v5', todayKey);
      localStorage.setItem('panzarotto_day_index_v5', index.toString());
    } catch {
      // ignore
    }
  };

  const [selectedSlot, setSelectedSlotState] = useState<string>(() => {
    try {
      const savedTimeSlot = localStorage.getItem('panzarotto_time_slot_v1');
      if (!savedTimeSlot || savedTimeSlot === 'subito') return '';
      const saved = localStorage.getItem('panzarotto_slot_v2');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '';
  });

  const setSelectedSlot = (slot: string) => {
    setSelectedSlotState(slot);
    try {
      localStorage.setItem('panzarotto_slot_v2', slot);
    } catch {
      // ignore
    }
  };
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // UI modals
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCartBouncing, setIsCartBouncing] = useState<boolean>(false);
  const [cartBounceKey, setCartBounceKey] = useState<number>(0);
  const bounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const triggerCartBounce = () => {
    setCartBounceKey(prev => prev + 1);
    setIsCartBouncing(true);
    if (bounceTimerRef.current) {
      clearTimeout(bounceTimerRef.current);
    }
    bounceTimerRef.current = setTimeout(() => {
      setIsCartBouncing(false);
    }, 750);
  };

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [productModalItem, setProductModalItem] = useState<ProductItem | null>(null);
  const [editingCartItemId, setEditingCartItemId] = useState<string | null>(null);
  const [activePlacedOrder, setActivePlacedOrder] = useState<PlacedOrder | null>(null);
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState<boolean>(false);
  const [softDeletedItemIds, setSoftDeletedItemIds] = useState<string[]>([]);
  const softDeleteTimersRef = React.useRef<Map<string, NodeJS.Timeout>>(new Map());

  const softDeleteItem = (cartItemId: string) => {
    // Clear any existing timer for this item
    const existingTimer = softDeleteTimersRef.current.get(cartItemId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      softDeleteTimersRef.current.delete(cartItemId);
    }

    setSoftDeletedItemIds(prev => (prev.includes(cartItemId) ? prev : [...prev, cartItemId]));

    // 5-second timer: item stays in "Вернуть" state for 5s, then disappears permanently
    const timer = setTimeout(() => {
      setSoftDeletedItemIds(prev => prev.filter(id => id !== cartItemId));
      setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
      softDeleteTimersRef.current.delete(cartItemId);
    }, 5000);

    softDeleteTimersRef.current.set(cartItemId, timer);
  };

  const restoreItem = (cartItemId: string) => {
    // Cancel the 5-second auto-deletion timer
    const existingTimer = softDeleteTimersRef.current.get(cartItemId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      softDeleteTimersRef.current.delete(cartItemId);
    }

    setSoftDeletedItemIds(prev => prev.filter(id => id !== cartItemId));
    setItems(prevItems =>
      prevItems.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, item.quantity) } : item
      )
    );
  };

  const isItemSoftDeleted = (cartItemId: string): boolean => {
    return softDeletedItemIds.includes(cartItemId);
  };

  // Sync to localStorage (only persist active items)
  useEffect(() => {
    try {
      const activeItems = items.filter(item => !softDeletedItemIds.includes(item.cartItemId));
      localStorage.setItem(tenantCartKey, JSON.stringify(activeItems));
    } catch {
      // ignore
    }
  }, [items, softDeletedItemIds, tenantCartKey]);

  // Translation helper
  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.it;
    let text = dict[key] || TRANSLATIONS.it[key] || key;
    if (text.includes('{threshold}') && (!replacements || replacements.threshold === undefined)) {
      const defaultThreshold =
        currency === 'USD' ? '$30' : language === 'en' ? '€30' : '30 €';
      text = text.replace(/\{threshold\}/g, defaultThreshold);
    }
    if (replacements) {
      Object.entries(replacements).forEach(([rKey, rVal]) => {
        text = text.replace(new RegExp(`\\{${rKey}\\}`, 'g'), String(rVal));
      });
    }
    return text;
  };

  // Generate deterministic ID for an item based on its product & selected extras
  const generateCartItemId = (productId: string, extras: SelectedExtra[], notes?: string): string => {
    const sortedExtras = [...extras].sort((a, b) => a.id.localeCompare(b.id)).map(e => e.id).join('_');
    const cleanNotes = (notes || '').trim().toLowerCase();
    return `${productId}-${sortedExtras}-${cleanNotes}`;
  };

  const calculateItemUnitPrice = (product: ProductItem, extras: SelectedExtra[]): number => {
    const extrasTotal = extras.reduce((acc, curr) => acc + curr.price, 0);
    return product.price + extrasTotal;
  };

  const addToCart = (
    product: ProductItem,
    quantity = 1,
    selectedExtras: SelectedExtra[] = [],
    specialNotes = ''
  ) => {
    triggerCartBounce();
    const count = Math.max(1, quantity);
    const unitPrice = calculateItemUnitPrice(product, selectedExtras);
    const targetSig = getCartItemSignature(product.id, selectedExtras, specialNotes);

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item =>
          !softDeletedItemIds.includes(item.cartItemId) &&
          getCartItemSignature(item.product?.id || item.productId, item.selectedExtras || [], item.specialNotes) ===
            targetSig
      );

      if (existingIndex !== -1) {
        return prevItems.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                quantity: (Number(item.quantity) || 1) + count,
                totalUnitPrice: unitPrice,
              }
            : item
        );
      }

      const baseId = generateCartItemId(product.id, selectedExtras, specialNotes);
      const cartItemId = prevItems.some(i => i.cartItemId === baseId)
        ? `${baseId}-${Date.now()}`
        : baseId;

      return [
        ...prevItems,
        {
          cartItemId,
          productId: product.id,
          product,
          quantity: count,
          selectedExtras: [...selectedExtras],
          specialNotes,
          totalUnitPrice: unitPrice,
        },
      ];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    // If quantity is updated, ensure item is not in soft-deleted state
    const existingTimer = softDeleteTimersRef.current.get(cartItemId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      softDeleteTimersRef.current.delete(cartItemId);
    }
    setSoftDeletedItemIds(prev => prev.filter(id => id !== cartItemId));

    setItems(prevItems => {
      return prevItems
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const setItemQuantity = (cartItemId: string, newQuantity: number) => {
    const existingTimer = softDeleteTimersRef.current.get(cartItemId);
    if (existingTimer) {
      clearTimeout(existingTimer);
      softDeleteTimersRef.current.delete(cartItemId);
    }
    setSoftDeletedItemIds(prev => prev.filter(id => id !== cartItemId));

    setItems(prevItems => {
      return prevItems
        .map(item => {
          if (item.cartItemId === cartItemId) {
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeItem = (cartItemId: string) => {
    // Soft delete: marks item for undo ("Вернуть") instead of instantly destroying it
    softDeleteItem(cartItemId);
  };

  const clearCart = () => {
    softDeleteTimersRef.current.forEach(timer => clearTimeout(timer));
    softDeleteTimersRef.current.clear();
    setItems([]);
    setSoftDeletedItemIds([]);
    setAppliedCoupon(null);
    setDiscountPercent(0);
    setCouponCode('');
  };

  const updateCartItemExtras = (cartItemId: string, extras: SelectedExtra[], specialNotes = '') => {
    setItems(prevItems => {
      const updated = prevItems.map(item => {
        if (item.cartItemId === cartItemId) {
          const newUnitPrice = calculateItemUnitPrice(item.product, extras);
          return {
            ...item,
            selectedExtras: extras,
            specialNotes,
            totalUnitPrice: newUnitPrice,
          };
        }
        return item;
      });
      return mergeCartItemsList(updated, softDeletedItemIds);
    });
  };

  // Multi-Tenant & Live Catalog Sync with Microservice #1 (Admin CMS)
  const [activeTenantId, setActiveTenantIdState] = useState<string>(() => resolveInitialTenantId());
  const [catalogProducts, setCatalogProducts] = useState<ProductItem[]>(() =>
    getBaseProductsForTenant(resolveInitialTenantId())
  );
  const [activeTenantInfo, setActiveTenantInfo] = useState<any>(null);
  const [backendCoupons, setBackendCoupons] = useState<any[]>([]);

  const setActiveTenantId = (tenantId: string) => {
    setActiveTenantIdState(tenantId);
    setCatalogProducts(getBaseProductsForTenant(tenantId));
  };

  const refreshCatalog = useCallback(async () => {
    try {
      const baseProducts = getBaseProductsForTenant(activeTenantId);
      const data = await fetchCatalogMenu(activeTenantId);
      if (data.tenant) {
        setActiveTenantInfo(data.tenant);
      }
      if (Array.isArray(data.coupons)) {
        setBackendCoupons(data.coupons);
      }
      if (Array.isArray(data.products) && data.products.length > 0) {
        const dbMap = new Map<string, ProductItem>();
        data.products.forEach(p => dbMap.set(p.id, p));

        // Merge: override static products if customized in DB, and prepend any newly created DB products
        const merged = baseProducts.map(staticProd => {
          const override = dbMap.get(staticProd.id);
          if (override) {
            dbMap.delete(staticProd.id);
            return {
              ...staticProd,
              ...override,
              availableExtras: Array.isArray(override.availableExtras)
                ? override.availableExtras
                : staticProd.availableExtras,
              originalPrice:
                override.originalPrice !== undefined
                  ? override.originalPrice
                  : staticProd.originalPrice,
            };
          }
          return staticProd;
        });

        const brandNewProducts = Array.from(dbMap.values());
        const nextCatalog = [...brandNewProducts, ...merged];
        setCatalogProducts(nextCatalog);
        setSelectedProductDetail(prev => {
          if (!prev) return prev;
          const updated = nextCatalog.find(p => p.id === prev.id);
          return updated || prev;
        });
      }
    } catch {
      // Fallback to local static baseProducts if backend is offline
      setCatalogProducts(getBaseProductsForTenant(activeTenantId));
    }
  }, [activeTenantId]);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  // Real-time SSE subscription for customer OrderTrackerModal & live menu updates
  useEffect(() => {
    const unsubscribe = subscribeToRealtimeStream(activeTenantId, evt => {
      if (evt.type === 'MENU_UPDATED') {
        refreshCatalog();
      }
      if (
        (evt.type === 'ORDER_STATUS_UPDATED' || evt.type === 'ORDER_PACKING_UPDATED') &&
        evt.data
      ) {
        setActivePlacedOrder(prev => {
          if (!prev) return prev;
          if (prev.id === evt.data.id || prev.id === evt.data.orderNumber) {
            return {
              ...prev,
              status: evt.data.status,
              packingChecklist: evt.data.packingChecklist || prev.packingChecklist,
              timing: evt.data.timing || prev.timing,
            };
          }
          return prev;
        });
      }
    });
    return unsubscribe;
  }, [activeTenantId, refreshCatalog]);

  // Coupons (Supports TikTok / Instagram influencer promo codes from DB + defaults)
  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const formatSuccessMsg = (pct: number, channel?: string) => {
      const ch = channel ? ` (${channel})` : '';
      if (language === 'ru') return `Скидка ${pct}%${ch} успешно применена!`;
      if (language === 'en') return `${pct}%${ch} discount applied successfully!`;
      if (language === 'de') return `${pct}%${ch} Rabatt erfolgreich angewendet!`;
      if (language === 'it') return `Sconto del ${pct}%${ch} applicato con successo!`;
      return `Remise de ${pct}%${ch} appliquée avec succès !`;
    };
    const dbMatch = backendCoupons.find(c => String(c.code).toUpperCase() === cleanCode);
    if (dbMatch) {
      const pct = Number(dbMatch.discount_percent || 10);
      setAppliedCoupon(cleanCode);
      setDiscountPercent(pct);
      return {
        success: true,
        message: formatSuccessMsg(pct, dbMatch.channel || 'Promo'),
      };
    }
    if (cleanCode === 'LABRIOUT10' || cleanCode === 'POMPEI10' || cleanCode === 'PANZAROTTO10') {
      setAppliedCoupon(cleanCode);
      setDiscountPercent(10);
      return { success: true, message: formatSuccessMsg(10) };
    }
    if (cleanCode === 'TIKTOK15' || cleanCode === 'WELCOME' || cleanCode === 'CIAO') {
      setAppliedCoupon(cleanCode);
      setDiscountPercent(15);
      return { success: true, message: formatSuccessMsg(15) };
    }
    const invalidMsg =
      language === 'ru'
        ? 'Промокод недействителен или истёк.'
        : language === 'en'
        ? 'Invalid or expired promo code.'
        : language === 'de'
        ? 'Ungültiger oder abgelaufener Gutscheincode.'
        : language === 'it'
        ? 'Codice non valido o scaduto.'
        : 'Code promo invalide ou expiré.';
    return { success: false, message: invalidMsg };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
    setCouponCode('');
  };

  // Calculations (only active, non-soft-deleted items count)
  const activeItems = items.filter(item => !softDeletedItemIds.includes(item.cartItemId));
  const itemsCount = activeItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
  const subtotal = activeItems.reduce((acc, item) => {
    const price = Number(item.totalUnitPrice ?? item.product?.price ?? 0);
    const qty = Number(item.quantity ?? 1);
    return acc + (isNaN(price) ? 0 : price) * (isNaN(qty) ? 1 : qty);
  }, 0);

  // Delivery fee logic
  const isFreeDelivery = subtotal >= STORE_DETAILS.freeDeliveryThreshold || fulfillmentType === 'asporto';
  const deliveryFee = fulfillmentType === 'asporto' ? 0 : (isFreeDelivery ? 0 : STORE_DETAILS.deliveryFee);

  const discountAmount = appliedCoupon ? (subtotal * discountPercent) / 100 : 0;
  const total = Math.max(0, (subtotal || 0) - (discountAmount || 0) + (deliveryFee || 0));

  // Create order & dispatch to Payment Stripe Microservice (#3) + Realtime Order Microservice (#4)
  const submitOrder = (customer: CustomerOrderInfo): PlacedOrder => {
    const orderNumber = `PANZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const snapshotItems = [...activeItems];
    const newOrder: PlacedOrder = {
      id: orderNumber,
      orderNumber,
      tenantId: activeTenantId,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customer,
      items: snapshotItems,
      subtotal,
      deliveryFee,
      discountAmount,
      couponCode: appliedCoupon,
      total,
      status: 'received',
      estimatedMinutes:
        customer.fulfillmentType === 'asporto'
          ? STORE_DETAILS.asportoEstimatedMins
          : STORE_DETAILS.deliveryEstimatedMins,
      packingChecklist: {
        itemsChecked: Object.fromEntries(snapshotItems.map(i => [i.cartItemId, false])),
        napkinsIncluded: false,
        saucesVerified: false,
        thermalBagSealed: false,
        receiptAttached: false,
      },
    };

    const persistedOrder = recordOrderInOfflineFirstDb(newOrder, activeTenantId);
    setActivePlacedOrder(persistedOrder);
    clearCart();
    setIsCheckoutModalOpen(false);

    // Asynchronously persist order in SQLite & trigger Kitchen KDS SSE Gong
    (async () => {
      try {
        let stripePaymentIntentId: string | undefined;
        let fiscalSignature: string | undefined;

        if (customer.paymentMethod !== 'cash') {
          const paymentRes = await createDirectStripeIntent(
            activeTenantId,
            total,
            customer.paymentMethod
          ).catch(() => null);
          if (paymentRes) {
            stripePaymentIntentId = paymentRes.paymentIntentId;
            fiscalSignature = paymentRes.fiscalSignature;
          }
        }

        const backendRes = await createOrderInBackend(
          {
            orderNumber,
            customer,
            items: snapshotItems,
            subtotal,
            deliveryFee,
            discountAmount,
            couponCode: appliedCoupon,
            total,
            stripePaymentIntentId,
            fiscalSignature,
          },
          activeTenantId
        );

        if (backendRes?.order) {
          setActivePlacedOrder(prev =>
            prev && prev.id === orderNumber ? { ...prev, ...backendRes.order } : prev
          );
        }
      } catch {
        // Order remains active in local UI even if backend is offline
      }
    })();

    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductDetail,
        setSelectedProductDetail,
        openProductDetail,
        selectedCategory,
        setSelectedCategory,
        selectedCardKey,
        setSelectedCardKey,
        categorySubFilters,
        setCategorySubFilters,
        navigateToCategory,
        pendingScrollCategory,
        setPendingScrollCategory,
        productDetailSource,
        setProductDetailSource,
        items,
        setItems,
        setItemQuantity,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        updateCartItemExtras,
        fulfillmentType,
        setFulfillmentType,
        selectedTimeSlot,
        setSelectedTimeSlot,
        selectedDayIndex,
        setSelectedDayIndex,
        selectedSlot,
        setSelectedSlot,
        itemsCount,
        subtotal,
        deliveryFee,
        discountAmount,
        total,
        couponCode,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isCartBouncing,
        cartBounceKey,
        triggerCartBounce,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        productModalItem,
        setProductModalItem,
        editingCartItemId,
        setEditingCartItemId,
        activePlacedOrder,
        setActivePlacedOrder,
        isStoreInfoOpen,
        setIsStoreInfoOpen,
        softDeletedItemIds,
        softDeleteItem,
        restoreItem,
        isItemSoftDeleted,
        language,
        setLanguage,
        t,
        currency,
        setCurrency,
        currencySymbol,
        formatMoney,
        submitOrder,
        activeTenantId,
        setActiveTenantId,
        catalogProducts,
        refreshCatalog,
        activeTenantInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
