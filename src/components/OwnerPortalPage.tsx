import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  PackageCheck,
  CreditCard,
  Volume2,
  VolumeX,
  RefreshCw,
  Flame,
  Bike,
  Store,
  ShieldCheck,
  Sparkles,
  Boxes,
  ArrowLeft,
  Check,
  Plus,
  Lock,
  DollarSign,
  BarChart3,
  Power,
  Search,
  Bell,
  Settings,
  Maximize2,
  Menu as MenuIcon,
  Home,
  ClipboardList,
  UtensilsCrossed,
  Users,
  ChevronRight,
  ChevronDown,
  Eye,
  Edit3,
  Copy,
  TrendingUp,
  Star,
  MapPin,
  Phone,
  LogOut,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PlacedOrder } from '../types';
import {
  fetchTenantOrders,
  updateOrderStatusOnKds,
  updateOrderPackingChecklist,
  fetchOwnerInventory,
  restockInventory,
  toggleProductStopList,
  fetchOwnerAnalytics,
  fetchTenantStripeConfig,
  saveTenantStripeConfig,
  fetchStripeTransactions,
  createDirectStripeIntent,
  createOrderInBackend,
  subscribeToRealtimeStream,
  playKitchenOrderSound,
} from '../utils/api';
import { REVIEWS_DATA } from '../data/menuData';

type OwnerTab = 'dashboard' | 'kds' | 'order-list' | 'menus' | 'stripe';

// Helper component for Riday-style Circular Ring Gauge KPI Cards (Screenshot 1)
const CircularGauge: React.FC<{
  percent: number;
  color?: string;
  children: React.ReactNode;
}> = ({ percent, color = '#e66430', children }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(5, Math.min(100, percent));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="transparent"
          stroke="#eceef5"
          strokeWidth="6.5"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="6.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-11 h-11 rounded-full bg-[#fff3ed] flex items-center justify-center text-[#e66430]">
          {children}
        </div>
      </div>
    </div>
  );
};

export const OwnerPortalPage: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const {
    activeTenantId,
    activeTenantInfo,
    setCurrentView,
    refreshCatalog,
    catalogProducts,
    openProductDetail,
  } = useCart();

  // Default to KDS Kitchen screen so the chef immediately sees active orders & timers,
  // with 1-click access to Dashboard, Order List, Menus, and Stripe in the Riday sidebar.
  const [activeTab, setActiveTab] = useState<OwnerTab>('kds');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [orderMenuExpanded, setOrderMenuExpanded] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [chartHoverIdx, setChartHoverIdx] = useState<number | null>(5);

  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastRealtimeBanner, setLastRealtimeBanner] = useState<string | null>(null);
  const [nowTick, setNowTick] = useState<number>(Date.now());

  // Inventory & 86-List State
  const [inventory, setInventory] = useState<any[]>([]);
  const [stopListProducts, setStopListProducts] = useState<any[]>([]);
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<string>('all');

  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);

  // Stripe Direct State
  const [stripeConfig, setStripeConfig] = useState<any>(null);
  const [stripeTransactions, setStripeTransactions] = useState<any>(null);
  const [pubKeyInput, setPubKeyInput] = useState('');
  const [secKeyInput, setSecKeyInput] = useState('');
  const [webhookInput, setWebhookInput] = useState('');
  const [ibanInput, setIbanInput] = useState('');
  const [stripeModeInput, setStripeModeInput] = useState<'test' | 'live'>('test');
  const [acceptCard, setAcceptCard] = useState(true);
  const [acceptApplePay, setAcceptApplePay] = useState(true);
  const [acceptCash, setAcceptCash] = useState(true);
  const [acceptSatispay, setAcceptSatispay] = useState(true);
  const [stripeSaveMsg, setStripeSaveMsg] = useState<string | null>(null);
  const [simulatingOrder, setSimulatingOrder] = useState<boolean>(false);

  // Live 1-second timer for Kitchen SLA stopwatches (KEPT EXACTLY AS REQUESTED)
  useEffect(() => {
    const timer = setInterval(() => setNowTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const loadAllOwnerData = useCallback(async () => {
    try {
      const [ordRes, invRes, anaRes, strCfg, strTx] = await Promise.all([
        fetchTenantOrders(activeTenantId),
        fetchOwnerInventory(activeTenantId),
        fetchOwnerAnalytics(activeTenantId),
        fetchTenantStripeConfig(activeTenantId),
        fetchStripeTransactions(activeTenantId),
      ]);

      if (ordRes?.orders) setOrders(ordRes.orders);
      if (invRes?.inventory) setInventory(invRes.inventory);
      if (invRes?.stopListProducts) setStopListProducts(invRes.stopListProducts);
      if (anaRes) setAnalytics(anaRes);
      if (strCfg) {
        setStripeConfig(strCfg);
        setPubKeyInput(strCfg.stripePublishableKey || '');
        setSecKeyInput(strCfg.stripeSecretKeyMasked || '');
        setWebhookInput(strCfg.stripeWebhookSecretMasked || '');
        setIbanInput(strCfg.directPayoutIbanHint || '');
        setStripeModeInput(strCfg.stripeMode || 'test');
        setAcceptCard(Boolean(strCfg.acceptCardOnline));
        setAcceptApplePay(Boolean(strCfg.acceptAppleGooglePay));
        setAcceptCash(Boolean(strCfg.acceptCash));
        setAcceptSatispay(Boolean(strCfg.acceptSatispay));
      }
      if (strTx) setStripeTransactions(strTx);
    } catch (err) {
      console.error('Failed to load owner data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTenantId]);

  useEffect(() => {
    setLoading(true);
    loadAllOwnerData();
  }, [loadAllOwnerData]);

  // Real-time SSE connection for instant new order gong & KDS updates
  useEffect(() => {
    const unsubscribe = subscribeToRealtimeStream(activeTenantId, evt => {
      if (evt.type === 'ORDER_CREATED') {
        if (soundEnabled) {
          playKitchenOrderSound('new_order');
        }
        setLastRealtimeBanner(
          `🔔 НОВЫЙ ЗАКАЗ #${evt.data?.orderNumber || evt.data?.id} (${evt.data?.customer?.name}) — €${Number(
            evt.data?.total || 0
          ).toFixed(2)}`
        );
        setTimeout(() => setLastRealtimeBanner(null), 8000);
        loadAllOwnerData();
      } else if (
        evt.type === 'ORDER_STATUS_UPDATED' ||
        evt.type === 'ORDER_PACKING_UPDATED' ||
        evt.type === 'INVENTORY_UPDATED' ||
        evt.type === 'MENU_UPDATED'
      ) {
        loadAllOwnerData();
      }
    });
    return unsubscribe;
  }, [activeTenantId, soundEnabled, loadAllOwnerData]);

  // Exact dish/order SLA stopwatch timer (kept intact, styled for crisp visibility)
  const formatStopwatch = (receivedAt?: number, completedAt?: number | null) => {
    const start = receivedAt || nowTick;
    const end = completedAt || nowTick;
    const totalSec = Math.max(0, Math.floor((end - start) / 1000));
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return {
      text: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
      totalSec,
      slaColor:
        totalSec < 360
          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
          : totalSec < 660
          ? 'bg-amber-50 text-amber-600 border-amber-200'
          : 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse',
      barColor:
        totalSec < 360
          ? 'bg-emerald-500'
          : totalSec < 660
          ? 'bg-amber-500'
          : 'bg-rose-500',
    };
  };

  const handleStageChange = async (orderId: string, nextStatus: string) => {
    await updateOrderStatusOnKds(orderId, nextStatus, activeTenantId);
    if (nextStatus === 'ready' && soundEnabled) {
      playKitchenOrderSound('ready');
    }
    loadAllOwnerData();
  };

  const handlePackingToggle = async (orderId: string, payload: any) => {
    await updateOrderPackingChecklist(orderId, payload, activeTenantId);
    if (payload.completeAllAndReady && soundEnabled) {
      playKitchenOrderSound('ready');
    }
    loadAllOwnerData();
  };

  const handleSaveStripeKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setStripeSaveMsg(null);
    await saveTenantStripeConfig(activeTenantId, {
      stripePublishableKey: pubKeyInput,
      stripeSecretKey: secKeyInput,
      stripeWebhookSecret: webhookInput,
      directPayoutIbanHint: ibanInput,
      stripeMode: stripeModeInput,
      acceptCardOnline: acceptCard,
      acceptAppleGooglePay: acceptApplePay,
      acceptCash: acceptCash,
      acceptSatispay: acceptSatispay,
    });
    setStripeSaveMsg('Ключи Stripe успешно сохранены! Прямые выплаты активны (0% комиссии).');
    loadAllOwnerData();
    setTimeout(() => setStripeSaveMsg(null), 5000);
  };

  const handleFillDefaultTestStripeKeys = async () => {
    const testPub = 'pk_test_51LabrioutDirectStripeKey99';
    const testSec = 'sk_test_51LabrioutSecretDirectKey99';
    const testWh = 'whsec_labriout_live_webhook';
    const testIban = 'FR76 3000 6000 0112 3456 7890 189';

    setPubKeyInput(testPub);
    setSecKeyInput(testSec);
    setWebhookInput(testWh);
    setIbanInput(testIban);
    setStripeModeInput('test');
    setAcceptCard(true);
    setAcceptApplePay(true);
    setAcceptCash(true);
    setAcceptSatispay(true);

    await saveTenantStripeConfig(activeTenantId, {
      stripePublishableKey: testPub,
      stripeSecretKey: testSec,
      stripeWebhookSecret: testWh,
      directPayoutIbanHint: testIban,
      stripeMode: 'test',
      acceptCardOnline: true,
      acceptAppleGooglePay: true,
      acceptCash: true,
      acceptSatispay: true,
    });
    setStripeSaveMsg('Эталонные тестовые ключи Stripe активированы и сохранены!');
    loadAllOwnerData();
    setTimeout(() => setStripeSaveMsg(null), 6000);
  };

  const handleSimulateStripeTestOrder = async () => {
    if (simulatingOrder) return;
    setSimulatingOrder(true);
    try {
      const testCustomers = [
        {
          name: 'David Cohen',
          phone: '+33 6 12 45 78 90',
          address: '14 Rue du Colonel Fabien, Bonneuil-sur-Marne',
        },
        {
          name: 'Sarah Lévy',
          phone: '+33 6 98 32 11 04',
          address: '28 Avenue du Général Leclerc, Créteil',
        },
        {
          name: 'Yoni Haddad',
          phone: '+33 7 69 77 40 86',
          address: '64 av. Simone Veil, Bonneuil-sur-Marne',
        },
      ];
      const pick = testCustomers[Math.floor(Math.random() * testCustomers.length)];
      const subtotal = 24.0;
      const deliveryFee = 3.5;
      const total = subtotal + deliveryFee;

      const intent = await createDirectStripeIntent(activeTenantId, total, 'card');

      const created = await createOrderInBackend(
        {
          items: [
            {
              cartItemId: `sim-${Date.now()}-1`,
              productId: 'lab-burger-double-smash',
              name: 'Double Smash Burger',
              quantity: 1,
              unitPrice: 13.0,
              selectedExtras: [
                { id: 'lab-ex-cheddar', name: 'Cheddar fondant Parvé', price: 2.0 },
              ],
              specialNotes: 'Bien cuit, sauce burger maison',
            },
            {
              cartItemId: `sim-${Date.now()}-2`,
              productId: 'lab-pita-shawarma',
              name: 'Laffa / Pita Shawarma',
              quantity: 1,
              unitPrice: 11.0,
              selectedExtras: [],
            },
          ],
          subtotal,
          discount: 0,
          deliveryFee,
          total,
          couponCode: null,
          paymentMethod: 'card',
          stripePaymentIntentId: intent?.paymentIntentId || `pi_test_${Date.now()}`,
          fiscalSignature: intent?.fiscalSignature || undefined,
          customer: {
            name: pick.name,
            phone: pick.phone,
            email: 'client@labriout.fr',
            fulfillmentType: 'consegna',
            deliveryZoneId: 'bonneuil-94',
            deliveryAddress: pick.address,
            pickupTime: 'Как можно скорее (ASAP)',
            notes: 'Оплачено онлайн (Stripe •••• 4242)',
          },
        },
        activeTenantId
      );

      if (soundEnabled) {
        playKitchenOrderSound('new_order');
      }
      setActiveTab('kds');
      setLastRealtimeBanner(
        `⚡ НОВЫЙ ЗАКАЗ #${created?.order?.id || 'NEW'} (${pick.name}) ОПЛАЧЕН И ПОСТУПИЛ НА КУХНЮ!`
      );
      setTimeout(() => setLastRealtimeBanner(null), 8000);
      await loadAllOwnerData();
    } catch (err) {
      console.error('Failed to simulate test Stripe order:', err);
    } finally {
      setSimulatingOrder(false);
    }
  };

  const handleToggleProductStop = async (productId: string) => {
    await toggleProductStopList(productId, undefined, activeTenantId);
    await loadAllOwnerData();
    await refreshCatalog();
  };

  const handleRestockItem = async (invId: string, amount: number) => {
    await restockInventory(invId, amount, activeTenantId);
    loadAllOwnerData();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const activeOrders = useMemo(
    () => orders.filter(o => o.status !== 'completed'),
    [orders]
  );
  const completedOrders = useMemo(
    () => orders.filter(o => o.status === 'completed'),
    [orders]
  );

  // Filtered orders for search & status filter
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (statusFilter === 'active' && o.status === 'completed') return false;
      if (statusFilter === 'completed' && o.status !== 'completed') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = String(o.id).toLowerCase().includes(q);
        const matchCustomer = o.customer?.name?.toLowerCase().includes(q);
        const matchAddr = o.customer?.deliveryAddress?.toLowerCase().includes(q);
        const matchItems = o.items?.some((it: any) =>
          (it.name || it.product?.name || '').toLowerCase().includes(q)
        );
        return matchId || matchCustomer || matchAddr || matchItems;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Filtered products for the Riday Menus view
  const mergedMenuProducts = useMemo(() => {
    const stopMap = new Map(stopListProducts.map(p => [p.id, p]));
    const source = catalogProducts.length > 0 ? catalogProducts : stopListProducts;
    return source
      .map(p => {
        const st = stopMap.get(p.id);
        return {
          ...p,
          isAvailable: st !== undefined ? st.isAvailable : p.isAvailable !== false,
          foodCost: p.foodCost ?? st?.foodCost ?? Number((p.price * 0.28).toFixed(2)),
        };
      })
      .filter(p => {
        if (menuCategoryFilter !== 'all' && p.category !== menuCategoryFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            (p.nameRu && p.nameRu.toLowerCase().includes(q)) ||
            (p.description && p.description.toLowerCase().includes(q))
          );
        }
        return true;
      });
  }, [catalogProducts, stopListProducts, menuCategoryFilter, searchQuery]);

  // Dashboard metrics
  const totalOrdersCount = orders.length || analytics?.kpis?.totalOrders || 18;
  const totalRevenueEur = useMemo(() => {
    const sum = orders.reduce((acc, o) => acc + Number(o.total || 0), 0);
    return sum > 0 ? sum : analytics?.kpis?.totalRevenue || 425.5;
  }, [orders, analytics]);
  const uniqueCustomersCount = useMemo(() => {
    const set = new Set(orders.map(o => o.customer?.phone || o.customer?.name));
    return Math.max(set.size, orders.length, 14);
  }, [orders]);

  // Monthly / Weekly chart data for Riday Area Spline Chart (Screenshot 1)
  const earningsSeries = [
    { month: 'Пн', income: 420, expense: 145 },
    { month: 'Вт', income: 510, expense: 170 },
    { month: 'Ср', income: 640, expense: 210 },
    { month: 'Чт', income: 590, expense: 185 },
    { month: 'Пт', income: 480, expense: 150 },
    { month: 'Сб (Вечер)', income: 760, expense: 230 },
    { month: 'Вс', income: 890, expense: 265 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return {
          label: 'Новый заказ',
          cls: 'bg-[#fbe9e7] text-[#e65100]',
        };
      case 'preparing':
        return {
          label: 'Готовится',
          cls: 'bg-[#fff3e0] text-[#ef6c00]',
        };
      case 'frying':
        return {
          label: 'На гриле / Фритюр',
          cls: 'bg-[#fce4ec] text-[#d81b60]',
        };
      case 'packing':
        return {
          label: 'Сборка',
          cls: 'bg-[#ede7f6] text-[#5e35b1]',
        };
      case 'ready':
      case 'delivering':
        return {
          label: 'Готов к выдаче',
          cls: 'bg-[#e3f2fd] text-[#1e88e5]',
        };
      case 'completed':
        return {
          label: 'Выдан',
          cls: 'bg-[#e8f5e9] text-[#2e7d32]',
        };
      default:
        return {
          label: status,
          cls: 'bg-slate-100 text-slate-700',
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] text-[#1e293b] flex flex-col lg:flex-row font-sans pb-20 lg:pb-0">
      {/* ===================================================================== */}
      {/* RIDAY LEFT SIDEBAR (Screenshot 1, 2, 3, 4)                            */}
      {/* ===================================================================== */}
      <aside
        className={`${
          sidebarOpen ? 'w-full lg:w-[260px]' : 'hidden lg:flex lg:w-[82px]'
        } bg-white border-b lg:border-b-0 lg:border-r border-slate-200/80 shrink-0 flex flex-col justify-between transition-all duration-200 z-30 lg:min-h-screen sticky top-0`}
      >
        <div>
          {/* Top Brand Logo & Toggle */}
          <div className="h-[74px] px-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-9 h-9 rounded-xl hover:bg-slate-100 text-[#4c84ff] flex items-center justify-center transition cursor-pointer"
                title="Свернуть/развернуть меню"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              {sidebarOpen && (
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo-labriur.png"
                    onError={e => {
                      e.currentTarget.src = '/logo-custom.png';
                    }}
                    alt="Labriout"
                    className="h-9 w-auto object-contain"
                  />
                  <div>
                    <span className="font-black text-base text-slate-800 tracking-tight block leading-none">
                      La Briout
                    </span>
                    <span className="text-[10px] font-bold text-[#e66430] uppercase tracking-wider">
                      Kitchen & POS
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Menu (Riday Style with Soft Blue Active Pill & Circular Icon) */}
          <nav className="p-3.5 space-y-1.5">
            {/* 1. Dashboard */}
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between p-2 rounded-full transition cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#d6e6ff] text-[#3b76ef] font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    activeTab === 'dashboard'
                      ? 'bg-[#4c84ff] text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Home className="w-4 h-4" />
                </div>
                {sidebarOpen && <span className="text-sm">Дашборд</span>}
              </div>
              {sidebarOpen && <ChevronRight className="w-4 h-4 mr-2 opacity-60" />}
            </button>

            {/* 2. Order (KDS Kitchen + Order List) */}
            <div>
              <button
                type="button"
                onClick={() => {
                  setOrderMenuExpanded(!orderMenuExpanded);
                  if (activeTab !== 'kds' && activeTab !== 'order-list') {
                    setActiveTab('kds');
                  }
                }}
                className={`w-full flex items-center justify-between p-2 rounded-full transition cursor-pointer ${
                  activeTab === 'kds' || activeTab === 'order-list'
                    ? 'bg-[#d6e6ff] text-[#3b76ef] font-extrabold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 font-semibold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                      activeTab === 'kds' || activeTab === 'order-list'
                        ? 'bg-[#4c84ff] text-white shadow-sm shadow-blue-500/30'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  {sidebarOpen && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Заказы & Кухня</span>
                      {activeOrders.length > 0 && (
                        <span className="px-1.5 py-0.5 text-[10px] font-black rounded-md bg-[#e66430] text-white">
                          {activeOrders.length}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {sidebarOpen &&
                  (orderMenuExpanded ? (
                    <ChevronDown className="w-4 h-4 mr-2 opacity-70" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2 opacity-60" />
                  ))}
              </button>

              {/* Riday Sub-menu links with -o- indicator */}
              {sidebarOpen && orderMenuExpanded && (
                <div className="mt-1 ml-6 space-y-1 border-l border-slate-200 pl-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('kds')}
                    className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-xs transition cursor-pointer ${
                      activeTab === 'kds'
                        ? 'text-[#3b76ef] font-extrabold bg-blue-50/60'
                        : 'text-slate-500 hover:text-slate-800 font-semibold'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] opacity-70">─○─</span>
                      <span>Экран Кухни (Таймер)</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#e66430] text-white text-[9px] font-black uppercase">
                      LIVE
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('order-list')}
                    className={`w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-xs transition cursor-pointer ${
                      activeTab === 'order-list'
                        ? 'text-[#3b76ef] font-extrabold bg-blue-50/60'
                        : 'text-slate-500 hover:text-slate-800 font-semibold'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] opacity-70">─○─</span>
                      <span>Список заказов (Таблица)</span>
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Menus & Stop-List (Screenshot 4) */}
            <button
              type="button"
              onClick={() => setActiveTab('menus')}
              className={`w-full flex items-center justify-between p-2 rounded-full transition cursor-pointer ${
                activeTab === 'menus'
                  ? 'bg-[#d6e6ff] text-[#3b76ef] font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    activeTab === 'menus'
                      ? 'bg-[#4c84ff] text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                {sidebarOpen && <span className="text-sm">Меню & Склад (86)</span>}
              </div>
              {sidebarOpen && <ChevronRight className="w-4 h-4 mr-2 opacity-60" />}
            </button>

            {/* 4. Stripe & Online Store */}
            <button
              type="button"
              onClick={() => setActiveTab('stripe')}
              className={`w-full flex items-center justify-between p-2 rounded-full transition cursor-pointer ${
                activeTab === 'stripe'
                  ? 'bg-[#d6e6ff] text-[#3b76ef] font-extrabold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    activeTab === 'stripe'
                      ? 'bg-[#4c84ff] text-white shadow-sm shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                </div>
                {sidebarOpen && <span className="text-sm">Касса Stripe</span>}
              </div>
              {sidebarOpen && <ChevronRight className="w-4 h-4 mr-2 opacity-60" />}
            </button>
          </nav>
        </div>

        {/* Bottom Quick Switchers */}
        <div className="p-3.5 border-t border-slate-100 space-y-2">
          <button
            type="button"
            onClick={() => setCurrentView('super-admin')}
            className="w-full py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Settings className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Супер-Админ (CMS)</span>}
          </button>

          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#e66430] shrink-0" />
            {sidebarOpen && <span>На витрину сайта</span>}
          </button>
        </div>
      </aside>

      {/* ===================================================================== */}
      {/* MAIN CONTENT AREA (Riday Topbar + Page Views)                         */}
      {/* ===================================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* RIDAY TOP HEADER BAR */}
        <header className="h-[74px] bg-[#f5f6fa] px-4 sm:px-7 flex items-center justify-between gap-4 sticky top-0 z-20 backdrop-blur-md bg-[#f5f6fa]/90">
          {/* Search Input (Riday rounded white pill input) */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Поиск заказов, блюд или клиентов..."
              className="w-full bg-white rounded-2xl pl-4 pr-10 py-2.5 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 focus:outline-none focus:border-[#4c84ff]"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Right Pastel Action Buttons & Profile (Matching Screenshot 1-4) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Simulate Test Order Button */}
            <button
              type="button"
              onClick={handleSimulateStripeTestOrder}
              disabled={simulatingOrder}
              className="px-3.5 py-2.5 rounded-xl bg-[#e66430] hover:bg-[#d45625] text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm shadow-[#e66430]/25 transition cursor-pointer disabled:opacity-60"
              title="Отправить тестовый заказ на кухню со звуковым сигналом"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {simulatingOrder ? 'Отправка...' : '+ Тест-заказ'}
              </span>
            </button>

            {/* Fullscreen Button (Pastel Purple) */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="hidden sm:flex w-10 h-10 rounded-xl bg-[#ede7f6] hover:bg-[#e1d5f2] text-[#5e35b1] items-center justify-center transition cursor-pointer"
              title="Полный экран (для планшета кухни)"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Sound & Active Orders Bell (Pastel Blue with Badge) */}
            <button
              type="button"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playKitchenOrderSound('new_order');
              }}
              className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition cursor-pointer ${
                soundEnabled
                  ? 'bg-[#e3f2fd] hover:bg-[#d0e8fc] text-[#1e88e5]'
                  : 'bg-slate-200 text-slate-500'
              }`}
              title={soundEnabled ? 'Звук кухни ВКЛ (нажмите для теста)' : 'Звук кухни ВЫКЛ'}
            >
              {soundEnabled ? <Bell className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#3b76ef] text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                {activeOrders.length}
              </span>
            </button>

            {/* Refresh Button (Pastel Blue) */}
            <button
              type="button"
              onClick={loadAllOwnerData}
              className="w-10 h-10 rounded-xl bg-[#e3f2fd] hover:bg-[#d0e8fc] text-[#1e88e5] flex items-center justify-center transition cursor-pointer"
              title="Обновить данные"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Settings / Stripe Button (Pastel Orange with Badge) */}
            <button
              type="button"
              onClick={() => setActiveTab('stripe')}
              className="relative hidden sm:flex w-10 h-10 rounded-xl bg-[#fbe9e7] hover:bg-[#f8d8d4] text-[#e65100] items-center justify-center transition cursor-pointer"
              title="Настройки оплаты Stripe"
            >
              <Settings className="w-4 h-4" />
            </button>

            <div className="h-7 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

            {/* User Greeting & Avatar */}
            <div className="flex items-center gap-2.5">
              <div className="text-right hidden sm:block">
                <span className="text-xs text-slate-500">Hello, </span>
                <span className="text-xs font-extrabold text-slate-800">Chef Labriout</span>
                <span className="block text-[10px] text-emerald-600 font-bold">● Online SSE</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#fdebd0] border-2 border-white shadow-sm flex items-center justify-center text-[#e66430] font-black text-sm">
                <ChefHat className="w-5 h-5" />
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                  title="Выйти из панели"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Real-time new order notification toast */}
        {lastRealtimeBanner && (
          <div className="px-4 sm:px-7 pt-2">
            <div className="bg-gradient-to-r from-[#e66430] to-amber-500 text-white px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-between shadow-lg">
              <span>{lastRealtimeBanner}</span>
              <span className="text-[11px] bg-black/20 px-2.5 py-1 rounded-lg">Live KDS</span>
            </div>
          </div>
        )}

        {/* PAGE BODY */}
        <div className="p-4 sm:p-7 flex-1 space-y-6">
          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-semibold shadow-xs">
              Загрузка данных кухни и заказов...
            </div>
          ) : activeTab === 'kds' ? (
            /* ================================================================= */
            /* VIEW 1: KDS KITCHEN SCREEN + LIVE STOPWATCH TIMERS + RIGHT STATS  */
            /* ================================================================= */
            <div className="space-y-6">
              {/* Page Title & Breadcrumb (Riday Style) + SLA Timer Legend */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
                    Кухня KDS & Таймер блюд
                  </h1>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Home className="w-3.5 h-3.5 text-[#4c84ff]" />
                    <span>-</span>
                    <span className="text-[#4c84ff]">Заказы</span>
                    <span>-</span>
                    <span className="text-slate-600 font-semibold">Активные на кухне</span>
                  </div>
                </div>

                {/* SLA Stopwatch Legend */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                    ● Норма &lt; 6 мин
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                    ● Внимание 6–11 мин
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                    ● Просрочка &gt; 11 мин
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Left / Main Area (9 cols): Active Kitchen Order Cards with Live Stopwatch */}
                <div className="xl:col-span-9 space-y-6">
                  {activeOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center space-y-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-800">
                        Все активные заказы приготовлены и выданы!
                      </h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Новые заказы с сайта появляются здесь мгновенно со звуковым сигналом и автоматическим запуском таймера приготовления.
                      </p>
                      <button
                        type="button"
                        onClick={handleSimulateStripeTestOrder}
                        className="mt-2 px-4 py-2.5 rounded-xl bg-[#e66430] hover:bg-[#d45625] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Создать тестовый заказ для проверки таймера</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {activeOrders.map(order => {
                        const sw = formatStopwatch(
                          order.timing?.receivedAt,
                          order.timing?.completedAt
                        );
                        const isPickup = order.customer.fulfillmentType === 'asporto';
                        const badge = getStatusBadge(order.status);
                        const checklist = order.packingChecklist || {
                          itemsChecked: {},
                          napkinsIncluded: false,
                          saucesVerified: false,
                          thermalBagSealed: false,
                          receiptAttached: false,
                        };

                        const totalChecklistSteps = order.items.length + 4;
                        const completedChecklistSteps =
                          order.items.filter(
                            (it, idx) =>
                              checklist.itemsChecked?.[it.cartItemId || `item-${idx + 1}`]
                          ).length +
                          (checklist.napkinsIncluded ? 1 : 0) +
                          (checklist.saucesVerified ? 1 : 0) +
                          (checklist.receiptAttached ? 1 : 0) +
                          (checklist.thermalBagSealed ? 1 : 0);

                        const isFullyPacked = completedChecklistSteps === totalChecklistSteps;

                        return (
                          <div
                            key={order.id}
                            className="bg-white rounded-3xl border border-slate-200/90 hover:border-[#e66430]/60 shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between transition"
                          >
                            {/* Top SLA Progress Line */}
                            <div className="w-full h-1.5 bg-slate-100">
                              <div
                                className={`h-full transition-all duration-500 ${sw.barColor}`}
                                style={{
                                  width: `${Math.min(100, Math.round((sw.totalSec / 660) * 100))}%`,
                                }}
                              />
                            </div>

                            <div>
                              {/* Card Header with Order ID, Customer & LIVE STOPWATCH TIMER */}
                              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-3">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-black text-lg text-slate-900">
                                      #{order.id}
                                    </span>
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                                        isPickup
                                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                                      }`}
                                    >
                                      {isPickup ? (
                                        <Store className="w-3 h-3" />
                                      ) : (
                                        <Bike className="w-3 h-3" />
                                      )}
                                      {isPickup ? 'Самовывоз' : 'Доставка'}
                                    </span>
                                    <span
                                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badge.cls}`}
                                    >
                                      {badge.label}
                                    </span>
                                  </div>

                                  <p className="text-xs font-bold text-slate-700 mt-1.5 flex items-center gap-2">
                                    <span>{order.customer.name}</span>
                                    <span className="text-slate-400">•</span>
                                    <span className="text-slate-500">{order.customer.phone}</span>
                                  </p>
                                  {!isPickup && order.customer.deliveryAddress && (
                                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                      <MapPin className="w-3 h-3 text-[#e66430] shrink-0" />
                                      <span>{order.customer.deliveryAddress}</span>
                                    </p>
                                  )}
                                </div>

                                {/* LIVE DISH/ORDER TIMER (KEPT EXACTLY AS CURRENT) */}
                                <div className="text-right shrink-0">
                                  <div
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border font-mono font-black text-sm shadow-2xs ${sw.slaColor}`}
                                  >
                                    <Clock className="w-4 h-4" />
                                    <span>{sw.text}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                                    Принят в {order.createdAt}
                                  </p>
                                </div>
                              </div>

                              {/* Dishes Checklist */}
                              <div className="p-5 space-y-2.5">
                                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                  <span>Блюда к приготовлению (отметьте готовые):</span>
                                  <span className="text-slate-800 text-xs font-black">
                                    €{Number(order.total).toFixed(2)}
                                  </span>
                                </div>

                                {order.items.map((item: any, idx: number) => {
                                  const itemKey = item.cartItemId || `item-${idx + 1}`;
                                  const isChecked = Boolean(checklist.itemsChecked?.[itemKey]);
                                  const itemName = item.name || item.product?.name || 'Блюдо';
                                  const extras = Array.isArray(item.selectedExtras)
                                    ? item.selectedExtras
                                    : [];

                                  return (
                                    <div
                                      key={itemKey}
                                      onClick={() =>
                                        handlePackingToggle(order.id, {
                                          itemKey,
                                          checked: !isChecked,
                                        })
                                      }
                                      className={`p-3 rounded-2xl border transition cursor-pointer select-none ${
                                        isChecked
                                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                          : 'bg-[#f8f9fc] border-slate-200/80 text-slate-800 hover:border-[#e66430]'
                                      }`}
                                    >
                                      <div className="flex items-start gap-2.5">
                                        <div
                                          className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 font-bold text-xs ${
                                            isChecked
                                              ? 'bg-emerald-500 text-white'
                                              : 'bg-white text-transparent border border-slate-300'
                                          }`}
                                        >
                                          ✓
                                        </div>
                                        <div className="flex-1">
                                          <p
                                            className={`font-extrabold text-sm leading-snug ${
                                              isChecked ? 'line-through opacity-75' : ''
                                            }`}
                                          >
                                            <span className="text-[#e66430] mr-1.5">
                                              {item.quantity}x
                                            </span>
                                            {itemName}
                                          </p>
                                          {extras.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                              {extras.map((ex: any, i: number) => (
                                                <span
                                                  key={i}
                                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100/80 text-[#e66430]"
                                                >
                                                  + {ex.name}
                                                </span>
                                              ))}
                                            </div>
                                          )}
                                          {item.specialNotes && (
                                            <p className="text-[11px] font-bold text-amber-700 mt-1">
                                              ⚠️ Примечание: {item.specialNotes}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}

                                {order.customer.notes && (
                                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                                    📝 <strong>Комментарий:</strong> {order.customer.notes}
                                  </div>
                                )}

                                {/* Packing Checklist */}
                                <div className="pt-3 border-t border-slate-100 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                      <PackageCheck className="w-4 h-4 text-[#e66430]" />
                                      Контроль сборки пакета:
                                    </span>
                                    <span
                                      className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                                        isFullyPacked
                                          ? 'bg-emerald-100 text-emerald-700'
                                          : 'bg-slate-100 text-slate-600'
                                      }`}
                                    >
                                      {completedChecklistSteps}/{totalChecklistSteps}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                                    {[
                                      { key: 'napkinsIncluded', label: 'Салфетки & приборы' },
                                      { key: 'saucesVerified', label: 'Соусы проверены' },
                                      { key: 'receiptAttached', label: 'Чек прикреплен' },
                                      { key: 'thermalBagSealed', label: 'Пакет запечатан' },
                                    ].map(chk => {
                                      const val = Boolean((checklist as any)[chk.key]);
                                      return (
                                        <button
                                          key={chk.key}
                                          type="button"
                                          onClick={() =>
                                            handlePackingToggle(order.id, {
                                              [chk.key]: !val,
                                            })
                                          }
                                          className={`p-2 rounded-xl border text-left font-bold flex items-center gap-1.5 transition cursor-pointer ${
                                            val
                                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                              : 'bg-slate-50 border-slate-200/80 text-slate-500 hover:text-slate-800'
                                          }`}
                                        >
                                          <span>{val ? '☑' : '☐'}</span>
                                          <span className="truncate">{chk.label}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* KDS Stage & Complete Buttons */}
                            <div className="p-4 bg-[#f8f9fc] border-t border-slate-100 space-y-2">
                              <div className="grid grid-cols-3 gap-1.5">
                                {[
                                  { id: 'preparing', label: '1. Готовится' },
                                  { id: 'frying', label: '2. Гриль/Фритюр' },
                                  { id: 'packing', label: '3. Сборка' },
                                ].map(st => (
                                  <button
                                    key={st.id}
                                    type="button"
                                    onClick={() => handleStageChange(order.id, st.id)}
                                    className={`py-2 px-2 rounded-xl text-[11px] font-extrabold uppercase transition cursor-pointer ${
                                      order.status === st.id
                                        ? 'bg-[#e66430] text-white shadow-xs'
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    {st.label}
                                  </button>
                                ))}
                              </div>

                              {order.status !== 'ready' && order.status !== 'delivering' ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handlePackingToggle(order.id, {
                                      completeAllAndReady: true,
                                    })
                                  }
                                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 transition cursor-pointer"
                                >
                                  <Check className="w-4 h-4 stroke-[3]" />
                                  <span>
                                    {isFullyPacked
                                      ? 'Выдать заказ / Готов!'
                                      : 'Отметить готовность & Выдать'}
                                  </span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleStageChange(order.id, 'completed')}
                                  className="w-full py-3 px-4 rounded-xl bg-[#4c84ff] hover:bg-[#3b76ef] text-white font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition cursor-pointer"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Завершить заказ (Архив)</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right Column (3 cols): Riday Order Summary Widgets (Screenshot 3) */}
                <div className="xl:col-span-3 space-y-5">
                  {/* Widget 1: Total Sale with Green Sparkline Area Chart */}
                  <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-500">Выручка смены</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">
                          €{totalRevenueEur.toFixed(2)}
                        </p>
                      </div>
                      <svg className="w-24 h-14" viewBox="0 0 100 50">
                        <defs>
                          <linearGradient id="saleGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,40 Q15,20 30,28 T65,12 T100,25 L100,50 L0,50 Z"
                          fill="url(#saleGrad)"
                        />
                        <path
                          d="M0,40 Q15,20 30,28 T65,12 T100,25"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                        />
                      </svg>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-600">
                        {orders.length} всего заказов
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('dashboard')}
                        className="text-[#4c84ff] font-bold hover:underline cursor-pointer"
                      >
                        Отчет →
                      </button>
                    </div>
                  </div>

                  {/* Widget 2: Active Kitchen Queue (Blue Sparkline) */}
                  <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-500">Ср. время выдачи</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">
                          {Math.floor((analytics?.kpis?.avgPrepSeconds || 315) / 60)}м{' '}
                          {(analytics?.kpis?.avgPrepSeconds || 315) % 60}с
                        </p>
                      </div>
                      <svg className="w-24 h-14" viewBox="0 0 100 50">
                        <defs>
                          <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4c84ff" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#4c84ff" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,38 Q20,25 40,32 T75,10 T100,22 L100,50 L0,50 Z"
                          fill="url(#sessionGrad)"
                        />
                        <path
                          d="M0,38 Q20,25 40,32 T75,10 T100,22"
                          fill="none"
                          stroke="#4c84ff"
                          strokeWidth="2.5"
                        />
                      </svg>
                    </div>
                    <div className="pt-2 flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-[#e3f2fd] text-[#1e88e5] text-[11px] font-bold">
                        Live KDS
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#ede7f6] text-[#5e35b1] text-[11px] font-bold">
                        {activeOrders.length} в работе
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-[#e8f5e9] text-[#2e7d32] text-[11px] font-bold">
                        {completedOrders.length} выдано
                      </span>
                    </div>
                  </div>

                  {/* Widget 3: Recent Kitchen Activity Timeline (Screenshot 4) */}
                  <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-800">
                      Последние события кухни
                    </h3>
                    <div className="space-y-3">
                      {orders.slice(0, 4).map((o, idx) => {
                        const barColors = [
                          'bg-[#4c84ff]',
                          'bg-[#10b981]',
                          'bg-[#f59e0b]',
                          'bg-[#e66430]',
                        ];
                        return (
                          <div key={o.id} className="flex items-start gap-3 text-xs">
                            <span className="font-extrabold text-slate-700 w-11 shrink-0 pt-0.5">
                              {o.createdAt || '12:30'}
                            </span>
                            <div
                              className={`w-1 h-9 rounded-full shrink-0 ${
                                barColors[idx % barColors.length]
                              }`}
                            />
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-600 truncate">
                                Заказ #{o.id} • €{Number(o.total).toFixed(2)}
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Клиент: {o.customer.name}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'order-list' ? (
            /* ================================================================= */
            /* VIEW 2: RIDAY ORDER LIST TABLE + LIVE STOPWATCH TIMERS (Screen 3) */
            /* ================================================================= */
            <div className="space-y-6">
              {/* Breadcrumb Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">Order List</h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Home className="w-3.5 h-3.5 text-[#4c84ff]" />
                    <span>-</span>
                    <span className="text-[#4c84ff]">Order</span>
                    <span>-</span>
                    <span className="text-slate-600 font-semibold">Order List</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {[
                    { id: 'all', label: `Все (${orders.length})` },
                    { id: 'active', label: `Активные (${activeOrders.length})` },
                    { id: 'completed', label: `Выданные (${completedOrders.length})` },
                  ].map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setStatusFilter(f.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        statusFilter === f.id
                          ? 'bg-[#4c84ff] text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Main Table Card (9 cols) */}
                <div className="xl:col-span-9 bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs font-extrabold text-slate-800">
                        <th className="py-3.5 px-3">Order ID</th>
                        <th className="py-3.5 px-3">Время</th>
                        <th className="py-3.5 px-3">Клиент</th>
                        <th className="py-3.5 px-3">Состав / Адрес</th>
                        <th className="py-3.5 px-3">Таймер блюд</th>
                        <th className="py-3.5 px-3">Сумма</th>
                        <th className="py-3.5 px-3">Статус</th>
                        <th className="py-3.5 px-3 text-right">Действие</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-[13px]">
                      {filteredOrders.map(order => {
                        const sw = formatStopwatch(
                          order.timing?.receivedAt,
                          order.timing?.completedAt
                        );
                        const badge = getStatusBadge(order.status);
                        const dishesText = order.items
                          .map((i: any) => `${i.quantity}x ${i.name || i.product?.name}`)
                          .join(', ');

                        return (
                          <tr key={order.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-4 px-3 font-extrabold text-slate-700">
                              #{order.id}
                            </td>
                            <td className="py-4 px-3 text-slate-600 font-medium">
                              {order.createdAt}
                            </td>
                            <td className="py-4 px-3">
                              <p className="font-bold text-slate-800">{order.customer.name}</p>
                              <p className="text-[11px] text-slate-400">{order.customer.phone}</p>
                            </td>
                            <td className="py-4 px-3 max-w-[240px]">
                              <p className="font-semibold text-slate-700 truncate">{dishesText}</p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {order.customer.fulfillmentType === 'asporto'
                                  ? 'Самовывоз (64 av. Simone Veil)'
                                  : order.customer.deliveryAddress}
                              </p>
                            </td>
                            <td className="py-4 px-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl border font-mono font-bold text-xs ${sw.slaColor}`}
                              >
                                <Clock className="w-3.5 h-3.5" />
                                {sw.text} min
                              </span>
                            </td>
                            <td className="py-4 px-3 font-extrabold text-slate-800">
                              €{Number(order.total).toFixed(2)}
                            </td>
                            <td className="py-4 px-3">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${badge.cls}`}
                              >
                                {badge.label}
                              </span>
                            </td>
                            <td className="py-4 px-3 text-right">
                              {order.status !== 'completed' ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStageChange(
                                      order.id,
                                      order.status === 'ready' ? 'completed' : 'ready'
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-xl bg-[#e66430] hover:bg-[#d45625] text-white text-[11px] font-bold transition cursor-pointer"
                                >
                                  {order.status === 'ready' ? 'В архив' : 'Готов ✓'}
                                </button>
                              ) : (
                                <span className="text-emerald-600 font-bold text-xs">✓ Выдан</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Right Column (3 cols): Same Riday Summary Widgets as Screenshot 3 */}
                <div className="xl:col-span-3 space-y-5">
                  <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-500">Total Sale</p>
                        <p className="text-2xl font-black text-slate-800 mt-1">
                          €{totalRevenueEur.toFixed(2)}
                        </p>
                      </div>
                      <svg className="w-24 h-14" viewBox="0 0 100 50">
                        <path
                          d="M0,40 Q15,20 30,28 T65,12 T100,25 L100,50 L0,50 Z"
                          fill="#10b981"
                          fillOpacity="0.2"
                        />
                        <path
                          d="M0,40 Q15,20 30,28 T65,12 T100,25"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                        />
                      </svg>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-600">
                        {orders.length} total orders
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('kds')}
                        className="text-[#4c84ff] font-bold hover:underline cursor-pointer"
                      >
                        Экран KDS →
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-3">
                    <p className="text-xs font-bold text-slate-500">Повторные клиенты</p>
                    <p className="text-2xl font-black text-slate-800">84.5%</p>
                    <div className="flex items-center gap-4 text-xs pt-1">
                      <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4c84ff]" /> Новые
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#e66430]" /> Постоянные
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'menus' ? (
            /* ================================================================= */
            /* VIEW 3: RIDAY MENU LIST (Circular Plate Cards + 86 Stop-List)     */
            /* ================================================================= */
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">Menu List</h1>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Home className="w-3.5 h-3.5 text-[#4c84ff]" />
                    <span>-</span>
                    <span className="text-[#4c84ff]">Menu</span>
                    <span>-</span>
                    <span className="text-slate-600 font-semibold">Стоп-лист (86) & Склад</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'all', label: 'Все блюда' },
                    { id: 'panini', label: 'Burgers' },
                    { id: 'panini_special', label: 'Pitas & Laffas' },
                    { id: 'girarrosto', label: 'Assiettes' },
                    { id: 'friggitoria', label: 'Entrées' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setMenuCategoryFilter(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        menuCategoryFilter === cat.id
                          ? 'bg-[#4c84ff] text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Riday Circular Dish Cards Grid (9 cols, matching Screenshot 4) */}
                <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-14 pt-10">
                  {mergedMenuProducts.slice(0, 18).map(prod => {
                    const isAvail = prod.isAvailable !== false;
                    return (
                      <div
                        key={prod.id}
                        className={`bg-white rounded-3xl pt-20 pb-5 px-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border transition relative flex flex-col justify-between ${
                          isAvail
                            ? 'border-slate-100 hover:shadow-md'
                            : 'border-rose-200 bg-rose-50/30 opacity-80'
                        }`}
                      >
                        {/* Floating Circular Dish Plate (Screenshot 4) */}
                        <div className="w-32 h-32 rounded-full mx-auto -mt-32 mb-3 p-1.5 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>

                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-slate-800 line-clamp-1">
                            {prod.name}
                          </h3>
                          <p className="text-xs text-[#4c84ff] font-semibold mt-0.5">
                            €{Number(prod.price).toFixed(2)} •{' '}
                            <span className={isAvail ? 'text-emerald-600' : 'text-rose-600'}>
                              {isAvail ? 'В продаже' : 'Стоп-лист (86)'}
                            </span>
                          </p>
                        </div>

                        {/* Round Pastel Action Buttons (View / Edit in CMS / Toggle Stop-List) */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-4">
                          <button
                            type="button"
                            onClick={() => openProductDetail(prod, undefined, undefined, 'home')}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <span className="w-8 h-8 rounded-full bg-[#e8f5e9] group-hover:bg-emerald-500 text-emerald-600 group-hover:text-white flex items-center justify-center transition">
                              <Eye className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">View</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCurrentView('super-admin')}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <span className="w-8 h-8 rounded-full bg-[#fbe9e7] group-hover:bg-[#e66430] text-[#e66430] group-hover:text-white flex items-center justify-center transition">
                              <Edit3 className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleProductStop(prod.id)}
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                          >
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                                isAvail
                                  ? 'bg-[#e3f2fd] group-hover:bg-rose-500 text-[#1e88e5] group-hover:text-white'
                                  : 'bg-rose-600 text-white'
                              }`}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">
                              {isAvail ? 'В стоп' : 'Включить'}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right Column (4 cols): Warehouse Inventory Stock */}
                <div className="xl:col-span-4 bg-white rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800">
                        Складской учет сырья
                      </h3>
                      <p className="text-xs text-slate-400">
                        Автосписание при каждом заказе на кухне
                      </p>
                    </div>
                    <Boxes className="w-5 h-5 text-[#e66430]" />
                  </div>

                  <div className="space-y-2.5">
                    {inventory.map(item => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                          item.isLowStock
                            ? 'bg-rose-50 border-rose-200'
                            : 'bg-[#f8f9fc] border-slate-200/70'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-slate-800">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Остаток:{' '}
                            <strong className="text-slate-700">
                              {item.currentStock} {item.unit}
                            </strong>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRestockItem(item.id, 10)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#fbe9e7] hover:bg-[#e66430] text-[#e66430] hover:text-white text-xs font-extrabold transition cursor-pointer"
                        >
                          +10 {item.unit}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'dashboard' ? (
            /* ================================================================= */
            /* VIEW 4: RIDAY DASHBOARD 5 (Screenshots 1 & 2)                     */
            /* ================================================================= */
            <div className="space-y-6">
              {/* Row 1: 3 Riday Circular Ring Gauge KPI Cards (Screenshot 1) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-600">Total Orders</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{totalOrdersCount}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      +12% за эту неделю
                    </p>
                  </div>
                  <CircularGauge percent={72} color="#e66430">
                    <ClipboardList className="w-5 h-5" />
                  </CircularGauge>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-600">Total Customers</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      {uniqueCustomersCount}
                    </p>
                    <p className="text-[11px] text-[#4c84ff] font-semibold mt-1">
                      Постоянные гости 94
                    </p>
                  </div>
                  <CircularGauge percent={64} color="#e66430">
                    <Users className="w-5 h-5" />
                  </CircularGauge>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-600">Total Revenue</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      €{totalRevenueEur.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                      0% комиссии агрегаторов
                    </p>
                  </div>
                  <CircularGauge percent={82} color="#e66430">
                    <DollarSign className="w-5 h-5" />
                  </CircularGauge>
                </div>
              </div>

              {/* Row 2: Total Earnings Dual-Spline Chart (8 cols) + Top Categories Donut (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Total Earnings Card (Screenshot 1) */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-600">Total Earnings</p>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                        €{(totalRevenueEur * 18.5).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#e66430]" /> Выручка
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-600">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#2f3337]" /> Фудкост
                        </span>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                        Эта неделя
                      </span>
                    </div>
                  </div>

                  {/* Smooth Dual-Spline Area Chart */}
                  <div className="relative pt-6">
                    <svg className="w-full h-56 overflow-visible" viewBox="0 0 700 200">
                      <defs>
                        <linearGradient id="ridayOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#e66430" stopOpacity="0.28" />
                          <stop offset="100%" stopColor="#e66430" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="ridayDarkGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2f3337" stopOpacity="0.18" />
                          <stop offset="100%" stopColor="#2f3337" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid Lines */}
                      {[30, 75, 120, 165].map((y, idx) => (
                        <line
                          key={idx}
                          x1="35"
                          y1={y}
                          x2="680"
                          y2={y}
                          stroke="#f1f5f9"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Orange Income Area & Smooth Curve */}
                      <path
                        d="M40,120 C110,110 150,70 220,72 C290,74 330,100 400,65 C470,30 520,85 580,45 C620,25 650,40 675,35 L675,175 L40,175 Z"
                        fill="url(#ridayOrangeGrad)"
                      />
                      <path
                        d="M40,120 C110,110 150,70 220,72 C290,74 330,100 400,65 C470,30 520,85 580,45 C620,25 650,40 675,35"
                        fill="none"
                        stroke="#e66430"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {/* Dark FoodCost Area & Smooth Curve */}
                      <path
                        d="M40,155 C110,145 150,95 220,105 C290,115 330,145 400,110 C470,75 520,140 580,100 C620,80 650,115 675,125 L675,175 L40,175 Z"
                        fill="url(#ridayDarkGrad)"
                      />
                      <path
                        d="M40,155 C110,145 150,95 220,105 C290,115 330,145 400,110 C470,75 520,140 580,100 C620,80 650,115 675,125"
                        fill="none"
                        stroke="#2f3337"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* X-Axis Labels */}
                      {earningsSeries.map((pt, i) => {
                        const x = 45 + i * 102;
                        return (
                          <g
                            key={pt.month}
                            className="cursor-pointer"
                            onMouseEnter={() => setChartHoverIdx(i)}
                          >
                            <text
                              x={x}
                              y="194"
                              textAnchor="middle"
                              className="fill-slate-400 text-[11px] font-semibold"
                            >
                              {pt.month}
                            </text>
                            {chartHoverIdx === i && (
                              <>
                                <line
                                  x1={x}
                                  y1="25"
                                  x2={x}
                                  y2="175"
                                  stroke="#cbd5e1"
                                  strokeDasharray="4 4"
                                />
                                <circle cx={x} cy="55" r="5" fill="#e66430" />
                                <circle cx={x} cy="112" r="4" fill="#2f3337" />
                              </>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>

                {/* Top Categories Donut Chart Card (Screenshot 1) */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col justify-between items-center">
                  <div className="w-full flex items-center justify-between">
                    <h3 className="text-base font-extrabold text-slate-800">Top Categories</h3>
                    <span className="px-3 py-1 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                      Месяц
                    </span>
                  </div>

                  {/* Multi-Segment SVG Donut Chart */}
                  <div className="my-4 relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-48 h-48 -rotate-90" viewBox="0 0 120 120">
                      {/* Segment 1: Smash Burgers (38%) */}
                      <circle
                        cx="60"
                        cy="60"
                        r="42"
                        fill="transparent"
                        stroke="#e66430"
                        strokeWidth="18"
                        strokeDasharray="98 264"
                        strokeDashoffset="0"
                      />
                      {/* Segment 2: Pitas & Laffas (27%) */}
                      <circle
                        cx="60"
                        cy="60"
                        r="42"
                        fill="transparent"
                        stroke="#f6c391"
                        strokeWidth="18"
                        strokeDasharray="70 264"
                        strokeDashoffset="-100"
                      />
                      {/* Segment 3: Assiettes (20%) */}
                      <circle
                        cx="60"
                        cy="60"
                        r="42"
                        fill="transparent"
                        stroke="#fae6d1"
                        strokeWidth="18"
                        strokeDasharray="52 264"
                        strokeDashoffset="-172"
                      />
                      {/* Segment 4: Entrées & Boissons (15%) */}
                      <circle
                        cx="60"
                        cy="60"
                        r="42"
                        fill="transparent"
                        stroke="#2f3337"
                        strokeWidth="18"
                        strokeDasharray="38 264"
                        strokeDashoffset="-226"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xs font-bold text-slate-400 block">100%</span>
                      <span className="text-sm font-black text-slate-800">Casher</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="w-full grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-2.5 rounded-sm bg-[#e66430]" /> Burgers (38%)
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-2.5 rounded-sm bg-[#f6c391]" /> Pitas & Laffas (27%)
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-2.5 rounded-sm bg-[#fae6d1]" /> Assiettes (20%)
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-2.5 rounded-sm bg-[#2f3337]" /> Entrées (15%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Recently Orders Table (Screenshot 2) with Live Dish/Order Timer */}
              <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                    Recently Orders
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('kds')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    Открыть KDS Кухню →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#eef0f8] text-slate-800 text-xs font-extrabold">
                        <th className="py-3.5 px-4 rounded-l-xl">Order ID</th>
                        <th className="py-3.5 px-4">Order Name</th>
                        <th className="py-3.5 px-4">Customer Name</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Order Status</th>
                        <th className="py-3.5 px-4">Delivered Time (Таймер)</th>
                        <th className="py-3.5 px-4 rounded-r-xl">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-[13px]">
                      {orders.slice(0, 6).map((order, idx) => {
                        const sw = formatStopwatch(
                          order.timing?.receivedAt,
                          order.timing?.completedAt
                        );
                        const badge = getStatusBadge(order.status);
                        const firstItem =
                          order.items?.[0]?.name ||
                          order.items?.[0]?.product?.name ||
                          'Double Smash Burger';

                        return (
                          <tr
                            key={order.id}
                            className={idx % 2 === 1 ? 'bg-slate-50/70' : 'bg-white'}
                          >
                            <td className="py-3.5 px-4 font-extrabold text-slate-800">
                              {order.id}
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-slate-700">
                              {firstItem}
                              {order.items.length > 1 && ` (+${order.items.length - 1})`}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 font-medium">
                              {order.customer.name}
                            </td>
                            <td className="py-3.5 px-4 text-slate-500">
                              {order.customer.fulfillmentType === 'asporto'
                                ? 'Retrait Boutique'
                                : order.customer.deliveryAddress || 'Bonneuil-sur-Marne'}
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold ${badge.cls}`}
                              >
                                {badge.label}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                              {sw.text} min
                            </td>
                            <td className="py-3.5 px-4 font-extrabold text-slate-800">
                              €{Number(order.total).toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Row 4: Customer Review Cards (Screenshot 2) */}
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                  Customer Review
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {REVIEWS_DATA.slice(0, 2).map(rev => (
                    <div
                      key={rev.id}
                      className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-orange-100 text-[#e66430] font-black flex items-center justify-center text-sm">
                            {rev.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800">{rev.name}</p>
                            <p className="text-[11px] text-slate-400">
                              {rev.date} • {rev.city}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {rev.textRu || rev.text}
                        </p>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ================================================================= */
            /* VIEW 5: STRIPE DIRECT PAYMENT SETTINGS                            */
            /* ================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold">
                      <Lock className="w-3 h-3" />
                      Прямой эквайринг Stripe (0% комиссии)
                    </span>
                    <h2 className="text-lg font-extrabold text-slate-800 mt-1.5">
                      Настройка ключей оплаты Stripe для La Briout
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    ● Подключен
                  </span>
                </div>

                {stripeSaveMsg && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    ✓ {stripeSaveMsg}
                  </div>
                )}

                <form onSubmit={handleSaveStripeKeys} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setStripeModeInput('test')}
                      className={`p-3 rounded-2xl border text-xs font-extrabold transition cursor-pointer ${
                        stripeModeInput === 'test'
                          ? 'bg-[#e66430] border-[#e66430] text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      🛠 Тестовый режим (Test)
                    </button>
                    <button
                      type="button"
                      onClick={() => setStripeModeInput('live')}
                      className={`p-3 rounded-2xl border text-xs font-extrabold transition cursor-pointer ${
                        stripeModeInput === 'live'
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      🚀 Боевой режим (Live)
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Stripe Publishable Key
                    </label>
                    <input
                      type="text"
                      value={pubKeyInput}
                      onChange={e => setPubKeyInput(e.target.value)}
                      className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#4c84ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Stripe Secret Key
                    </label>
                    <input
                      type="text"
                      value={secKeyInput}
                      onChange={e => setSecKeyInput(e.target.value)}
                      className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#4c84ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      IBAN счета ресторана
                    </label>
                    <input
                      type="text"
                      value={ibanInput}
                      onChange={e => setIbanInput(e.target.value)}
                      className="w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#4c84ff]"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 px-5 rounded-xl bg-[#e66430] hover:bg-[#d45625] text-white font-extrabold text-xs uppercase tracking-wider transition cursor-pointer shadow-sm"
                    >
                      Сохранить настройки
                    </button>
                    <button
                      type="button"
                      onClick={handleFillDefaultTestStripeKeys}
                      className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      Сбросить тест-ключи
                    </button>
                  </div>
                </form>
              </div>

              <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-4">
                <h3 className="text-base font-extrabold text-slate-800">
                  Последние онлайн-транзакции
                </h3>
                <div className="space-y-2.5">
                  {(stripeTransactions?.transactions || []).map((tx: any) => (
                    <div
                      key={tx.id}
                      className="p-3.5 rounded-2xl bg-[#f8f9fc] border border-slate-200/70 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800">
                          #{tx.order_number} • {tx.customer_name}
                        </p>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {tx.stripe_payment_intent_id || 'CASH'}
                        </p>
                      </div>
                      <span className="font-black text-emerald-600">
                        €{Number(tx.total).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
