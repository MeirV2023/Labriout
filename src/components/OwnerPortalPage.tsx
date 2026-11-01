import React, { useState, useEffect, useCallback } from 'react';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  PackageCheck,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Volume2,
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

type OwnerTab = 'kds' | 'stripe' | 'inventory' | 'analytics';

export const OwnerPortalPage: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const { activeTenantId, activeTenantInfo, setCurrentView, refreshCatalog } = useCart();
  const [activeTab, setActiveTab] = useState<OwnerTab>('kds');
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [lastRealtimeBanner, setLastRealtimeBanner] = useState<string | null>(null);
  const [nowTick, setNowTick] = useState<number>(Date.now());

  // Inventory & 86-List State
  const [inventory, setInventory] = useState<any[]>([]);
  const [stopListProducts, setStopListProducts] = useState<any[]>([]);

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

  // Live 1-second timer for Dodo IS Time Tracking stopwatches
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
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          : totalSec < 660
          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
          : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
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
    setStripeSaveMsg('Ключи Stripe успешно сохранены! Прямые выплаты активны (0% комиссии платформы).');
    loadAllOwnerData();
    setTimeout(() => setStripeSaveMsg(null), 5000);
  };

  const handleFillDefaultTestStripeKeys = async () => {
    const testPub = 'pk_test_51PanzarottoPompeiDirectStripeKey99';
    const testSec = 'sk_test_51PanzarottoPompeiSecretDirectKey99';
    const testWh = 'whsec_panzarotto_pompei_live_webhook';
    const testIban = 'IT60 X054 2811 1010 0000 0123 456';

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
    setStripeSaveMsg(
      'Эталонные тестовые ключи Stripe (pk_test_... / sk_test_...) активированы и сохранены в базе!'
    );
    loadAllOwnerData();
    setTimeout(() => setStripeSaveMsg(null), 6000);
  };

  const handleSimulateStripeTestOrder = async () => {
    if (simulatingOrder) return;
    setSimulatingOrder(true);
    try {
      const testCustomers = [
        { name: 'Alessandro Esposito (Stripe Test)', phone: '+39 338 441 9021', address: 'Via Roma 18, Pompei' },
        { name: 'Giulia Conti (Stripe Test)', phone: '+39 347 882 1104', address: 'Piazza Bartolo Longo 4, Pompei' },
        { name: 'Lorenzo De Luca (Stripe Test)', phone: '+39 320 559 3310', address: 'Via Lepanto 72, Pompei' },
      ];
      const pick = testCustomers[Math.floor(Math.random() * testCustomers.length)];
      const subtotal = 19.0;
      const deliveryFee = 2.0;
      const total = subtotal + deliveryFee;

      const intent = await createDirectStripeIntent(activeTenantId, total, 'card');

      const created = await createOrderInBackend(
        {
          items: [
            {
              cartItemId: `sim-${Date.now()}-1`,
              productId: 'panz-classico',
              name: 'Panzarotto Classico (Моцарелла & Томаты)',
              quantity: 2,
              unitPrice: 6.0,
              selectedExtras: [{ id: 'bufala', name: 'Двойная Моцарелла ди Буфала', price: 2.0 }],
              specialNotes: 'Тестовый заказ через Stripe (Карта 4242)',
            },
            {
              cartItemId: `sim-${Date.now()}-2`,
              productId: 'cuoppo-napoletano',
              name: 'Cuoppo Napoletano (Большой кулек фритто)',
              quantity: 1,
              unitPrice: 7.0,
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
            email: 'stripe.test@panzarotto.it',
            fulfillmentType: 'consegna',
            deliveryZoneId: 'pompei-centro',
            deliveryAddress: pick.address,
            pickupTime: 'Как можно скорее (ASAP)',
            notes: 'Оплачено тестовой картой Stripe 4242 •••• 4242',
          },
        },
        activeTenantId
      );

      if (soundEnabled) {
        playKitchenOrderSound('new_order');
      }
      setActiveTab('kds');
      setLastRealtimeBanner(
        `⚡ ТЕСТОВЫЙ ЗАКАЗ STRIPE #${created?.order?.id || 'NEW'} (${pick.name}) УСПЕШНО ОПЛАЧЕН И УПАЛ НА КУХНЮ!`
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

  const activeOrders = orders.filter(o => o.status !== 'completed');
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="min-h-screen bg-[#0c0e14] text-neutral-100 pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#12151f]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-[#ff5500]" />
              <span>На витрину</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff5500]/20 border border-[#ff5500]/40 text-[#ff7733] text-[11px] font-extrabold uppercase">
                  <ChefHat className="w-3.5 h-3.5" />
                  Микросервис Владельца & Кухни (Port 4002)
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-bold">
                  ● Live SSE
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
                {activeTenantInfo?.name || 'Panzarotto Street Food — Pompei'} • KDS & Управление
              </h1>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateStripeTestOrder}
              disabled={simulatingOrder}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#635bff] to-indigo-600 hover:from-[#5249f5] hover:to-indigo-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition cursor-pointer disabled:opacity-60"
              title="Мгновенно провести тестовую транзакцию Stripe и отправить новый заказ на KDS кухню"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{simulatingOrder ? 'Оплата Stripe...' : '⚡ + Тест-заказ Stripe'}</span>
            </button>

            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playKitchenOrderSound('new_order');
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-neutral-400'
              }`}
              title="Тест звукового оповещения кухни"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{soundEnabled ? 'Звук кухни ВКЛ' : 'Звук ВЫКЛ'}</span>
            </button>

            <button
              onClick={loadAllOwnerData}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 cursor-pointer"
              title="Обновить данные"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold cursor-pointer"
              >
                Выйти
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            {
              id: 'kds' as OwnerTab,
              label: `KDS Кухня & Сборка (${activeOrders.length})`,
              icon: Flame,
              badge: 'Dodo IS + Toast Packing',
            },
            {
              id: 'stripe' as OwnerTab,
              label: 'Прямая оплата Stripe',
              icon: CreditCard,
              badge: '0% комиссии',
            },
            {
              id: 'inventory' as OwnerTab,
              label: 'Склад & Стоп-лист (86)',
              icon: Boxes,
              badge: 'iiko / Lightspeed',
            },
            {
              id: 'analytics' as OwnerTab,
              label: 'Дашборд, ABC & AI',
              icon: BarChart3,
              badge: 'Poster POS + AI',
            },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition cursor-pointer border ${
                  isActive
                    ? 'bg-[#ff5500] border-[#ff5500] text-white shadow-lg shadow-[#ff5500]/25'
                    : 'bg-[#181c28] border-white/10 text-neutral-300 hover:bg-[#202636]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-black/25 text-white' : 'bg-white/5 text-neutral-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time new order alert banner */}
      {lastRealtimeBanner && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-gradient-to-r from-[#ff5500] to-amber-600 text-white px-4 py-3 rounded-2xl font-extrabold text-sm flex items-center justify-between shadow-xl animate-bounce">
            <span>{lastRealtimeBanner}</span>
            <span className="text-xs bg-black/25 px-2.5 py-1 rounded-lg">Прилетело по WebSockets/SSE</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {loading ? (
          <div className="p-12 text-center text-neutral-400 text-sm">
            Загрузка данных микросервиса владельца...
          </div>
        ) : activeTab === 'kds' ? (
          <div className="space-y-6">
            {/* KDS Header Legend */}
            <div className="bg-[#151924] border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#ff5500]" />
                  <span>Экран Повара (KDS) и Сборщика Заказов (Packing Screen)</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Этапы как в Dodo IS (секундомер SLA) + обязательный чек-лист сборщика Toast POS перед выдачей (0% ошибок комплектации).
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                  ● Норма &lt; 6 мин
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                  ● Внимание 6–11 мин
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                  ● Просрочка &gt; 11 мин
                </span>
              </div>
            </div>

            {/* Active Orders Grid */}
            {activeOrders.length === 0 ? (
              <div className="bg-[#151924] border border-white/10 rounded-3xl p-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-black text-white">Все активные заказы выданы!</h3>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Как только клиент оформит заказ на сайте, здесь мгновенно появится карточка со звуковым сигналом.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {activeOrders.map(order => {
                  const sw = formatStopwatch(order.timing?.receivedAt, order.timing?.completedAt);
                  const isPickup = order.customer.fulfillmentType === 'asporto';
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
                      (it, idx) => checklist.itemsChecked?.[it.cartItemId || `item-${idx + 1}`]
                    ).length +
                    (checklist.napkinsIncluded ? 1 : 0) +
                    (checklist.saucesVerified ? 1 : 0) +
                    (checklist.receiptAttached ? 1 : 0) +
                    (checklist.thermalBagSealed ? 1 : 0);

                  const isFullyPacked = completedChecklistSteps === totalChecklistSteps;

                  return (
                    <div
                      key={order.id}
                      className="bg-[#151924] border-2 border-white/10 hover:border-[#ff5500]/50 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl transition"
                    >
                      {/* Order Card Header */}
                      <div>
                        <div className="p-4 bg-[#1b202e] border-b border-white/10 flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-lg text-white">#{order.id}</span>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase flex items-center gap-1 ${
                                  isPickup
                                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                }`}
                              >
                                {isPickup ? <Store className="w-3 h-3" /> : <Bike className="w-3 h-3" />}
                                {isPickup ? 'Самовывоз' : 'Доставка'}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-neutral-300 mt-1">
                              {order.customer.name} • {order.customer.phone}
                            </p>
                            {!isPickup && order.customer.deliveryAddress && (
                              <p className="text-[11px] text-neutral-400 mt-0.5">
                                📍 {order.customer.deliveryAddress}
                              </p>
                            )}
                          </div>

                          {/* Dodo IS Live Stopwatch */}
                          <div className="text-right shrink-0">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border font-mono font-black text-xs ${sw.slaColor}`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>{sw.text}</span>
                            </div>
                            <p className="text-[10px] text-neutral-400 mt-1">
                              Принят в {order.createdAt}
                            </p>
                          </div>
                        </div>

                        {/* Stage Progress Bar */}
                        <div className="px-4 py-2.5 bg-[#121620] border-b border-white/5 flex items-center justify-between text-[11px]">
                          <span className="text-neutral-400 font-semibold">Текущий этап:</span>
                          <span className="font-extrabold uppercase text-[#ff7733]">
                            {order.status === 'received' && '1. Новый заказ (Ждет кухню)'}
                            {order.status === 'preparing' && '2. Раскатка и начинка'}
                            {order.status === 'frying' && '3. Обжарка во фритюре'}
                            {order.status === 'packing' && '4. Сборка пакета (Packing)'}
                            {order.status === 'ready' && '5. Готов к выдаче клиенту'}
                            {order.status === 'delivering' && '5. Передан курьеру'}
                          </span>
                        </div>

                        {/* Order Items with Interactive Checkboxes for Chef/Packer */}
                        <div className="p-4 space-y-2.5">
                          <div className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                            <span>Позиции заказа (отметьте готовые):</span>
                            <span>€{Number(order.total).toFixed(2)}</span>
                          </div>

                          {order.items.map((item: any, idx: number) => {
                            const itemKey = item.cartItemId || `item-${idx + 1}`;
                            const isChecked = Boolean(checklist.itemsChecked?.[itemKey]);
                            const itemName = item.name || item.product?.name || 'Блюдо';
                            const extras = Array.isArray(item.selectedExtras) ? item.selectedExtras : [];

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
                                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                                    : 'bg-[#1a1f2e] border-white/10 text-white hover:border-[#ff5500]/50'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-start gap-2.5">
                                    <div
                                      className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 font-bold text-xs ${
                                        isChecked
                                          ? 'bg-emerald-500 text-black'
                                          : 'bg-white/10 text-transparent border border-white/25'
                                      }`}
                                    >
                                      ✓
                                    </div>
                                    <div>
                                      <p className="font-extrabold text-sm leading-snug">
                                        <span className="text-[#ff7733] mr-1.5">{item.quantity}x</span>
                                        {itemName}
                                      </p>
                                      {extras.length > 0 && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                          {extras.map((ex: any, i: number) => (
                                            <span
                                              key={i}
                                              className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ff5500]/20 text-[#ff9966]"
                                            >
                                              + {ex.name}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      {item.specialNotes && (
                                        <p className="text-[11px] font-bold text-amber-300 mt-1">
                                          ⚠️ Примечание: {item.specialNotes}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                          {order.customer.notes && (
                            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs">
                              📝 <strong>Комментарий клиента:</strong> {order.customer.notes}
                            </div>
                          )}

                          {/* Toast POS Packing Screen Checklist */}
                          <div className="pt-2 border-t border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                                <PackageCheck className="w-4 h-4 text-[#ff5500]" />
                                Чек-лист Сборщика (Toast Packing):
                              </span>
                              <span
                                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                                  isFullyPacked
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-white/10 text-neutral-300'
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
                                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                                        : 'bg-[#10131c] border-white/10 text-neutral-400 hover:text-white'
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

                      {/* KDS Action Buttons Footer */}
                      <div className="p-4 bg-[#11141d] border-t border-white/10 space-y-2">
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => handleStageChange(order.id, 'preparing')}
                            className={`py-2 px-2 rounded-xl text-[11px] font-extrabold uppercase transition cursor-pointer ${
                              order.status === 'preparing'
                                ? 'bg-[#ff5500] text-white'
                                : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                            }`}
                          >
                            1. Готовится
                          </button>
                          <button
                            onClick={() => handleStageChange(order.id, 'frying')}
                            className={`py-2 px-2 rounded-xl text-[11px] font-extrabold uppercase transition cursor-pointer ${
                              order.status === 'frying'
                                ? 'bg-[#ff5500] text-white'
                                : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                            }`}
                          >
                            2. Обжарка
                          </button>
                          <button
                            onClick={() => handleStageChange(order.id, 'packing')}
                            className={`py-2 px-2 rounded-xl text-[11px] font-extrabold uppercase transition cursor-pointer ${
                              order.status === 'packing'
                                ? 'bg-[#ff5500] text-white'
                                : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                            }`}
                          >
                            3. Сборка
                          </button>
                        </div>

                        {order.status !== 'ready' && order.status !== 'delivering' ? (
                          <button
                            onClick={() =>
                              handlePackingToggle(order.id, {
                                completeAllAndReady: true,
                              })
                            }
                            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition cursor-pointer"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>
                              {isFullyPacked
                                ? 'Выдать заказ / Готов!'
                                : 'Отметить весь чек-лист & Выдать'}
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStageChange(order.id, 'completed')}
                            className="w-full py-3 px-4 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white font-black text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Завершить и убрать с экрана</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recently Completed Orders */}
            {completedOrders.length > 0 && (
              <div className="bg-[#151924] border border-white/10 rounded-2xl p-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 mb-3">
                  Выданные заказы за смену ({completedOrders.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {completedOrders.slice(0, 6).map(o => (
                    <div
                      key={o.id}
                      className="p-3 rounded-xl bg-[#10131c] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-black text-emerald-400">#{o.id}</span>
                        <span className="text-neutral-300 ml-2">{o.customer.name}</span>
                      </div>
                      <span className="font-bold text-white">€{Number(o.total).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : activeTab === 'stripe' ? (
          /* TAB 2: DIRECT STRIPE CONFIGURATION FOR OWNER (Microservice #3) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-[#151924] border border-white/10 rounded-3xl p-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold">
                    <Lock className="w-3 h-3" />
                    Payment Microservice (Port 4003)
                  </span>
                  <h2 className="text-lg font-black text-white mt-1">
                    Прямой прием платежей Stripe на счет владельца
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Вставьте свои ключи из кабинета Stripe Dashboard. Все оплаты картами, Apple Pay и Google Pay идут напрямую на ваш банковский счет без посредников.
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    stripeConfig?.isConnected
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {stripeConfig?.isConnected ? '● Stripe Подключен' : '● Ожидает ключи'}
                </span>
              </div>

              {stripeSaveMsg && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  ✓ {stripeSaveMsg}
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-extrabold text-indigo-300">
                    ⚡ Быстрый тест приема платежей и падения заказов на KDS
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Тестовые ключи Stripe (`pk_test_51Panzarotto...`) уже предзаполнены в БД. Вы можете сбросить их к эталонным или сразу отправить тестовый заказ.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleFillDefaultTestStripeKeys}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-[11px] font-extrabold transition cursor-pointer"
                  >
                    🔑 Заполнить тест-ключи
                  </button>
                  <button
                    type="button"
                    onClick={handleSimulateStripeTestOrder}
                    disabled={simulatingOrder}
                    className="px-3 py-2 rounded-xl bg-[#635bff] hover:bg-[#5249f5] text-white text-[11px] font-extrabold transition cursor-pointer"
                  >
                    {simulatingOrder ? 'Отправка...' : '⚡ Провести тест-заказ (€21.00)'}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveStripeKeys} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStripeModeInput('test')}
                    className={`p-3 rounded-2xl border text-xs font-extrabold transition cursor-pointer ${
                      stripeModeInput === 'test'
                        ? 'bg-[#ff5500]/15 border-[#ff5500] text-white'
                        : 'bg-[#10131c] border-white/10 text-neutral-400'
                    }`}
                  >
                    🛠 Тестовый режим (Test Keys)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStripeModeInput('live')}
                    className={`p-3 rounded-2xl border text-xs font-extrabold transition cursor-pointer ${
                      stripeModeInput === 'live'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-[#10131c] border-white/10 text-neutral-400'
                    }`}
                  >
                    🚀 Боевой режим (Live Keys)
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Stripe Publishable Key (Публичный ключ витрины)
                  </label>
                  <input
                    type="text"
                    value={pubKeyInput}
                    onChange={e => setPubKeyInput(e.target.value)}
                    placeholder="pk_live_51..."
                    className="w-full bg-[#0e1118] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Stripe Secret Key (Секретный ключ для прямых транзакций)
                  </label>
                  <input
                    type="text"
                    value={secKeyInput}
                    onChange={e => setSecKeyInput(e.target.value)}
                    placeholder="sk_live_51..."
                    className="w-full bg-[#0e1118] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Stripe Webhook Secret (для подтверждения 3D Secure)
                  </label>
                  <input
                    type="text"
                    value={webhookInput}
                    onChange={e => setWebhookInput(e.target.value)}
                    placeholder="whsec_..."
                    className="w-full bg-[#0e1118] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Банковский счет IBAN (Куда Stripe переводит выручку)
                  </label>
                  <input
                    type="text"
                    value={ibanInput}
                    onChange={e => setIbanInput(e.target.value)}
                    placeholder="IT60 X054 2811 1010 0000 0123 456"
                    className="w-full bg-[#0e1118] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#ff5500]"
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-neutral-300 mb-2">
                    Активные способы оплаты на сайте:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { state: acceptCard, setter: setAcceptCard, label: '💳 Карты Visa / Mastercard' },
                      { state: acceptApplePay, setter: setAcceptApplePay, label: ' Apple Pay / Google Pay' },
                      { state: acceptCash, setter: setAcceptCash, label: '💶 Наличные при получении' },
                      { state: acceptSatispay, setter: setAcceptSatispay, label: '📱 Satispay (Италия/ЕС)' },
                    ].map((m, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => m.setter(!m.state)}
                        className={`p-2.5 rounded-xl border text-left font-bold flex items-center justify-between cursor-pointer ${
                          m.state
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                            : 'bg-[#10131c] border-white/10 text-neutral-500'
                        }`}
                      >
                        <span>{m.label}</span>
                        <span>{m.state ? 'ВКЛ' : 'ВЫКЛ'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#ff5500] hover:bg-[#e04a00] text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-[#ff5500]/25"
                >
                  Сохранить ключи Stripe в микросервисе оплаты
                </button>
              </form>
            </div>

            {/* Right Col: Commission Savings & Live Transactions */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-gradient-to-br from-emerald-950/70 to-[#151924] border border-emerald-500/30 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                    Ваша выгода против агрегаторов (Uber Eats / Foodora)
                  </span>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5">
                    <p className="text-[11px] text-neutral-400">Оборот через сайт</p>
                    <p className="text-xl font-black text-white mt-0.5">
                      €{stripeTransactions?.summary?.totalVolume?.toFixed(2) || '72.80'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30">
                    <p className="text-[11px] text-emerald-300">Сэкономлено комиссии (30%)</p>
                    <p className="text-xl font-black text-emerald-400 mt-0.5">
                      +€{stripeTransactions?.summary?.ownerSavedEur?.toFixed(2) || '20.40'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Агрегаторы доставки забирают <strong>30% с каждого заказа</strong>. С собственным сайтом за фиксированную подписку и трафиком из ваших роликов в Instagram / TikTok вся выручка идет напрямую на ваш Stripe!
                </p>
              </div>

              <div className="bg-[#151924] border border-white/10 rounded-3xl p-5 space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
                  Последние транзакции и фискальные подписи (KassenSichV)
                </h3>
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                  {(stripeTransactions?.transactions || []).map((tx: any) => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-2xl bg-[#10131c] border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-black text-white">
                          #{tx.order_number} • {tx.customer_name}
                        </p>
                        <p className="text-[10px] font-mono text-neutral-400 mt-0.5">
                          {tx.stripe_payment_intent_id || 'CASH-ON-DELIVERY'} • {tx.fiscal_signature}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-emerald-400">€{Number(tx.total).toFixed(2)}</p>
                        <span className="text-[10px] uppercase font-bold text-neutral-400">
                          {tx.payment_method}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'inventory' ? (
          /* TAB 3: INVENTORY & 86 STOP-LIST (iiko / Lightspeed) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Ingredient Warehouse */}
            <div className="lg:col-span-6 bg-[#151924] border border-white/10 rounded-3xl p-6 space-y-4">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-[#ff5500]" />
                  <span>Складской учет ингредиентов и упаковки (iiko / Lightspeed)</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  При каждом заказе на сайте ингредиенты и термопакеты списываются автоматически по технологической карте.
                </p>
              </div>

              <div className="space-y-2.5">
                {inventory.map(item => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                      item.isLowStock
                        ? 'bg-rose-500/10 border-rose-500/40'
                        : 'bg-[#10131c] border-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{item.name}</span>
                        {item.isLowStock && (
                          <span className="px-2 py-0.5 rounded bg-rose-500 text-white text-[10px] font-black">
                            Мало на складе!
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Расход на заказ: {item.consumePerOrder} {item.unit} • Мін. порог: {item.minThreshold}{' '}
                        {item.unit}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-base font-black text-white">
                          {item.currentStock} {item.unit}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRestockItem(item.id, 10)}
                        className="px-3 py-1.5 rounded-xl bg-[#ff5500]/20 hover:bg-[#ff5500] text-[#ff7733] hover:text-white border border-[#ff5500]/40 text-xs font-extrabold transition cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+10</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 1-Click 86 Stop-List */}
            <div className="lg:col-span-6 bg-[#151924] border border-white/10 rounded-3xl p-6 space-y-4">
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <Power className="w-5 h-5 text-[#ff5500]" />
                  <span>Стоп-лист блюд в 1 клик (86-List Витрины)</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Если закончился ингредиент на кухне, выключите блюдо здесь — оно мгновенно скроется с витрины сайта.
                </p>
              </div>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {stopListProducts.map(prod => (
                  <div
                    key={prod.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                      prod.isAvailable
                        ? 'bg-[#10131c] border-white/10'
                        : 'bg-rose-950/30 border-rose-500/40 opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div>
                        <p className="font-bold text-sm text-white">{prod.name}</p>
                        <p className="text-xs text-neutral-400">
                          Цена: €{prod.price.toFixed(2)} • Фудкост: €{prod.foodCost.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleProductStop(prod.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase transition cursor-pointer shrink-0 ${
                        prod.isAvailable
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300'
                          : 'bg-rose-600 text-white shadow-lg'
                      }`}
                    >
                      {prod.isAvailable ? '● В продаже' : '⛔ В СТОП-ЛИСТЕ'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* TAB 4: POSTER POS ANALYTICS, ABC MENU & TOAST AI INSIGHTS */
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
              {[
                {
                  label: 'Выручка',
                  value: `€${analytics?.kpis?.totalRevenue?.toFixed(2) || '72.80'}`,
                  sub: `${analytics?.kpis?.totalOrders || 3} заказов`,
                  color: 'text-white',
                },
                {
                  label: 'Средний чек',
                  value: `€${analytics?.kpis?.avgOrderValue?.toFixed(2) || '24.27'}`,
                  sub: '+14% с модификаторами',
                  color: 'text-[#ff7733]',
                },
                {
                  label: 'Чистая маржа',
                  value: `€${analytics?.kpis?.grossProfit?.toFixed(2) || '52.26'}`,
                  sub: 'После вычета сырья',
                  color: 'text-emerald-400',
                },
                {
                  label: 'Фудкост (Сырье)',
                  value: `${analytics?.kpis?.foodCostPercent || 27.5}%`,
                  sub: 'Эталон стритфуда < 30%',
                  color: 'text-sky-400',
                },
                {
                  label: 'Ср. время выдачи',
                  value: `${Math.floor((analytics?.kpis?.avgPrepSeconds || 315) / 60)}м ${
                    (analytics?.kpis?.avgPrepSeconds || 315) % 60
                  }с`,
                  sub: 'Dodo IS Time Tracker',
                  color: 'text-amber-300',
                },
                {
                  label: 'Экономия 30% комиссии',
                  value: `+€${analytics?.kpis?.savedCommissionEur?.toFixed(2) || '20.75'}`,
                  sub: 'Против UberEats/Foodora',
                  color: 'text-emerald-400',
                },
              ].map((kpi, i) => (
                <div
                  key={i}
                  className="bg-[#151924] border border-white/10 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <span className="text-[11px] font-bold uppercase text-neutral-400">{kpi.label}</span>
                  <span className={`text-xl font-black mt-1 ${kpi.color}`}>{kpi.value}</span>
                  <span className="text-[10px] text-neutral-500 mt-1">{kpi.sub}</span>
                </div>
              ))}
            </div>

            {/* AI Insights (Toast POS Style) */}
            <div className="bg-[#151924] border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#ff5500]" />
                  <span>AI-Аналитика и Подсказки для Владельца (Toast AI Engine)</span>
                </h3>
                <span className="text-xs text-neutral-400">Обновляется в реальном времени</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(analytics?.aiInsights || []).map((ins: any) => (
                  <div
                    key={ins.id}
                    className="p-4 rounded-2xl bg-[#10131c] border border-white/10 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#ff5500]/20 text-[#ff8844] text-[10px] font-black uppercase mb-2">
                        {ins.impact}
                      </span>
                      <h4 className="font-extrabold text-sm text-white">{ins.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                        {ins.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ABC Analysis Table & Peak Hours */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-[#151924] border border-white/10 rounded-3xl p-6 space-y-4">
                <div>
                  <h3 className="text-base font-black text-white">
                    ABC-анализ меню и Маржинальность блюд (iiko / Poster POS)
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Группа A приносит 80% прибыли ресторана, Группа B — 15%, Группа C — 5%.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-neutral-400 uppercase text-[10px]">
                        <th className="py-2.5 pr-3">Блюдо</th>
                        <th className="py-2.5 px-2">Цена</th>
                        <th className="py-2.5 px-2">Фудкост</th>
                        <th className="py-2.5 px-2">Маржа %</th>
                        <th className="py-2.5 px-2">Продано</th>
                        <th className="py-2.5 px-2">Чистая прибыль</th>
                        <th className="py-2.5 pl-2 text-right">ABC Класс</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {(analytics?.abcAnalysis || []).map((row: any) => (
                        <tr key={row.id} className="hover:bg-white/5">
                          <td className="py-3 pr-3 font-bold text-white">{row.name}</td>
                          <td className="py-3 px-2">€{row.price.toFixed(2)}</td>
                          <td className="py-3 px-2 text-neutral-400">€{row.foodCost.toFixed(2)}</td>
                          <td className="py-3 px-2 font-bold text-emerald-400">{row.marginPct}%</td>
                          <td className="py-3 px-2">{row.unitsSold} шт.</td>
                          <td className="py-3 px-2 font-black text-white">€{row.profit.toFixed(2)}</td>
                          <td className="py-3 pl-2 text-right">
                            <span
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-black text-xs ${
                                row.abcGrade === 'A'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : row.abcGrade === 'B'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              }`}
                            >
                              {row.abcGrade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Peak Hours Chart */}
              <div className="lg:col-span-4 bg-[#151924] border border-white/10 rounded-3xl p-6 space-y-4">
                <div>
                  <h3 className="text-base font-black text-white">График пиковых часов кухни</h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Помогает выводить второго повара на фритюр в часы максимального спроса.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {(analytics?.peakHours || []).map((ph: any) => {
                    const widthPct = Math.min(100, Math.round((ph.orders / 30) * 100));
                    return (
                      <div key={ph.hour} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-mono font-bold text-neutral-300">{ph.hour}</span>
                          <span className="font-bold text-white">
                            {ph.orders} зак. • €{ph.revenue}
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-[#0e1118] overflow-hidden">
                          <div
                            style={{ width: `${widthPct}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-[#ff5500] to-amber-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
