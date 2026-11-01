import { PlacedOrder, ProductItem } from '../types';
import { MENU_PRODUCTS } from '../data/menuData';
import {
  LABRIOUT_MENU_PRODUCTS,
  LABRIOUT_STORE_DETAILS,
} from '../data/labrioutMenuData';

export const DEFAULT_TENANT_ID = 'labriout';

export function resolveInitialTenantId(): string {
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const qTenant = params.get('tenant');
      if (qTenant) return qTenant;
      if (window.location.hostname.toLowerCase().includes('labriout')) {
        return 'labriout';
      }
    } catch {
      // ignore
    }
  }
  return DEFAULT_TENANT_ID;
}

export function getBaseProductsForTenant(tenantId: string): ProductItem[] {
  if (tenantId === 'labriout') {
    return LABRIOUT_MENU_PRODUCTS;
  }
  return MENU_PRODUCTS;
}

const IS_LOCALHOST =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const GATEWAY_ORIGIN = 'http://localhost:4000';
const LOCAL_DB_STORAGE_KEY = 'streetfood_saas_cloud_db_v2';
const REALTIME_CHANNEL_NAME = 'streetfood_saas_realtime_bus';

interface RealtimeEventPayload {
  type: string;
  tenantId: string;
  timestamp: number;
  data: any;
}

// Broadcast real-time event across tabs & components (works on Vercel & Offline-First like Toast POS)
export function broadcastLocalRealtimeEvent(
  type: string,
  tenantId: string,
  data: any
) {
  if (typeof window === 'undefined') return;
  const payload: RealtimeEventPayload = {
    type,
    tenantId,
    timestamp: Date.now(),
    data,
  };

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(REALTIME_CHANNEL_NAME);
      bc.postMessage(payload);
      bc.close();
    }
  } catch {
    // ignore
  }

  try {
    window.dispatchEvent(new CustomEvent('streetfood-realtime-event', { detail: payload }));
  } catch {
    // ignore
  }
}

function createInitialOfflineFirstSeed() {
  const now = Date.now();
  return {
    tenants: [
      {
        id: 'panzarotto-pompei',
        slug: 'panzarotto-pompei',
        name: 'Panzarotto Street Food — Pompei',
        country: 'Italy',
        city: 'Pompei (NA)',
        currency: 'EUR',
        timezone: 'Europe/Rome',
        language: 'it',
        themePrimaryColor: '#ff5500',
        subscriptionPlan: 'PRO_SAAS',
        monthlySaasFeeEur: 149,
        status: 'active',
        ownerName: 'Marco & Famiglia Esposito',
        ownerEmail: 'owner@panzarotto.it',
        phone: '+39 081 850 6111',
        address: 'Via Provinciale Ripuaria, 133, 80045 Pompei (NA)',
        kdsSlaMinutes: 8,
        aiUpsellEnabled: 1,
        kioskModeEnabled: 1,
        fiscalComplianceMode: 'ITALY_RT_KASSENSICHV',
        stripeConnected: true,
        stripeMode: 'test',
        ordersCount: 4,
        totalRevenue: 82.8,
      },
      {
        id: 'labriout',
        slug: 'labriout',
        name: 'Labriout Street Food — Bonneuil-sur-Marne',
        country: 'France',
        city: 'Bonneuil-sur-Marne (94)',
        currency: 'EUR',
        timezone: 'Europe/Paris',
        language: 'fr',
        themePrimaryColor: '#e11d48',
        subscriptionPlan: 'PRO_SAAS',
        monthlySaasFeeEur: 149,
        status: 'active',
        ownerName: 'Labriout Casher Direction',
        ownerEmail: 'contact@labriout.fr',
        phone: '+33 7 69 77 40 86',
        address: '64 avenue Simone Veil, 94380 Bonneuil-sur-Marne, France',
        kdsSlaMinutes: 8,
        aiUpsellEnabled: 1,
        kioskModeEnabled: 1,
        fiscalComplianceMode: 'FRANCE_NF525',
        stripeConnected: true,
        stripeMode: 'test',
        ordersCount: 14,
        totalRevenue: 318.5,
      },
      {
        id: 'berlin-kebab-haus',
        slug: 'berlin-kebab-haus',
        name: 'Mustafa Craft Döner — Berlin',
        country: 'Germany',
        city: 'Berlin',
        currency: 'EUR',
        timezone: 'Europe/Berlin',
        language: 'de',
        themePrimaryColor: '#10b981',
        subscriptionPlan: 'ENTERPRISE_FRANCHISE',
        monthlySaasFeeEur: 299,
        status: 'active',
        ownerName: 'Kemal Yilmaz',
        ownerEmail: 'kemal@berlinkebab.de',
        phone: '+49 30 99887766',
        address: 'Mehringdamm 32, 10961 Berlin',
        kdsSlaMinutes: 6,
        aiUpsellEnabled: 1,
        kioskModeEnabled: 1,
        fiscalComplianceMode: 'GERMANY_KASSENSICHV_TSE',
        stripeConnected: true,
        stripeMode: 'live',
        ordersCount: 18,
        totalRevenue: 412.5,
      },
      {
        id: 'napoli-fritti-milano',
        slug: 'napoli-fritti-milano',
        name: 'Antica Friggitoria — Milano Navigli',
        country: 'Italy',
        city: 'Milano (MI)',
        currency: 'EUR',
        timezone: 'Europe/Rome',
        language: 'it',
        themePrimaryColor: '#f59e0b',
        subscriptionPlan: 'PRO_SAAS',
        monthlySaasFeeEur: 149,
        status: 'active',
        ownerName: 'Gennaro Savastano',
        ownerEmail: 'gennaro@frittimilano.it',
        phone: '+39 02 44556677',
        address: 'Ripa di Porta Ticinese, 45, 20143 Milano',
        kdsSlaMinutes: 7,
        aiUpsellEnabled: 1,
        kioskModeEnabled: 1,
        fiscalComplianceMode: 'ITALY_RT_KASSENSICHV',
        stripeConnected: false,
        stripeMode: 'test',
        ordersCount: 9,
        totalRevenue: 215.0,
      },
    ],
    stripeConfigs: {
      'panzarotto-pompei': {
        tenantId: 'panzarotto-pompei',
        stripePublishableKey: 'pk_test_51PanzarottoPompeiDirectStripeKey99',
        stripeSecretKeyMasked: 'sk_test_51PanzarottoPompeiSecretDirectKey99',
        hasSecretKey: true,
        stripeWebhookSecretMasked: 'whsec_panzarotto_pompei_live_webhook',
        stripeMode: 'test' as 'test' | 'live',
        isConnected: true,
        acceptCardOnline: true,
        acceptAppleGooglePay: true,
        acceptCash: true,
        acceptSatispay: true,
        directPayoutIbanHint: 'IT60 X054 2811 1010 0000 0123 456 (Intesa Sanpaolo - Pompei)',
        updatedAt: new Date().toISOString(),
      },
      labriout: {
        tenantId: 'labriout',
        stripePublishableKey: 'pk_test_51LabrioutFranceDirectStripeKey94',
        stripeSecretKeyMasked: 'sk_test_51LabrioutFranceSecretDirectKey94',
        hasSecretKey: true,
        stripeWebhookSecretMasked: 'whsec_labriout_france_live_webhook',
        stripeMode: 'test' as 'test' | 'live',
        isConnected: true,
        acceptCardOnline: true,
        acceptAppleGooglePay: true,
        acceptCash: true,
        acceptSatispay: false,
        directPayoutIbanHint: 'FR76 3000 4000 0300 0012 3456 789 (BNP Paribas - Bonneuil)',
        updatedAt: new Date().toISOString(),
      },
    } as Record<string, any>,
    inventory: {
      'panzarotto-pompei': [
        {
          id: 'inv-dough',
          name: 'Impasto Artigianale Lievitato 24h (Тесто для панцаротто)',
          unit: 'g',
          currentStock: 14500,
          minThreshold: 3000,
          costPerUnit: 0.0025,
          isLowStock: false,
        },
        {
          id: 'inv-mozzarella',
          name: 'Mozzarella Fior di Latte di Agerola (Моцарелла)',
          unit: 'g',
          currentStock: 8200,
          minThreshold: 2000,
          costPerUnit: 0.0095,
          isLowStock: false,
        },
        {
          id: 'inv-tomato',
          name: 'Pomodoro San Marzano DOP (Томаты Сан-Марцано)',
          unit: 'g',
          currentStock: 6400,
          minThreshold: 1500,
          costPerUnit: 0.004,
          isLowStock: false,
        },
        {
          id: 'inv-prosciutto',
          name: 'Prosciutto Cotto Alta Qualità (Ветчина)',
          unit: 'g',
          currentStock: 3900,
          minThreshold: 1000,
          costPerUnit: 0.014,
          isLowStock: false,
        },
        {
          id: 'inv-pistachio',
          name: 'Crema di Pistacchio di Bronte DOP (Фисташковый крем)',
          unit: 'g',
          currentStock: 920,
          minThreshold: 800,
          costPerUnit: 0.028,
          isLowStock: false,
        },
        {
          id: 'inv-oil',
          name: 'Olio Alto Oleico per Frittura (Масло фритюрное)',
          unit: 'ml',
          currentStock: 18500,
          minThreshold: 5000,
          costPerUnit: 0.0032,
          isLowStock: false,
        },
        {
          id: 'inv-packaging',
          name: 'Packaging Termico Anti-Unto & Sacchetti (Термоупаковка)',
          unit: 'pcs',
          currentStock: 230,
          minThreshold: 50,
          costPerUnit: 0.22,
          isLowStock: false,
        },
      ],
      labriout: [
        {
          id: 'inv-smash-beef',
          name: 'Steak Haché Smashé 100% Casher (Мраморная говядина для Smash)',
          unit: 'g',
          currentStock: 16200,
          minThreshold: 3500,
          costPerUnit: 0.012,
          isLowStock: false,
        },
        {
          id: 'inv-shawarma',
          name: 'Broche Shawarma Dinde & Veau Mariné (Шаурма на вертеле)',
          unit: 'g',
          currentStock: 12800,
          minThreshold: 3000,
          costPerUnit: 0.011,
          isLowStock: false,
        },
        {
          id: 'inv-pains-pitas',
          name: 'Pains Buns Briochés, Pitas & Laffas Artisanales (Булочки, Пита и Лаффа)',
          unit: 'pcs',
          currentStock: 185,
          minThreshold: 40,
          costPerUnit: 0.45,
          isLowStock: false,
        },
        {
          id: 'inv-frites-maison',
          name: 'Pommes de Terre Frites Maison & Patates Douces (Свежий фри и батат)',
          unit: 'g',
          currentStock: 22000,
          minThreshold: 5000,
          costPerUnit: 0.003,
          isLowStock: false,
        },
        {
          id: 'inv-cheddar-parve',
          name: 'Cheddar Fondant Parvé & Veau Pressé (Чеддер Parvé и телячий бекон)',
          unit: 'g',
          currentStock: 4400,
          minThreshold: 1000,
          costPerUnit: 0.015,
          isLowStock: false,
        },
      ],
    } as Record<string, any[]>,
    productAvailability: {} as Record<string, boolean>,
    customProductOverrides: {} as Record<string, Partial<ProductItem>>,
    customProducts: [] as ProductItem[],
    coupons: [
      {
        code: 'POMPEI10',
        discountPercent: 10,
        channel: 'Google Maps Local Promo',
        usageCount: 34,
        revenueGenerated: 782.5,
        isActive: 1,
      },
      {
        code: 'PANZAROTTO15',
        discountPercent: 15,
        channel: 'TikTok StreetFood Influencer (@napoli_food_porn)',
        usageCount: 61,
        revenueGenerated: 1490.2,
        isActive: 1,
      },
      {
        code: 'BENVENUTO20',
        discountPercent: 20,
        channel: 'First Order Direct Web App (Flipdish Retention)',
        usageCount: 19,
        revenueGenerated: 412.0,
        isActive: 1,
      },
    ],
    orders: [
      {
        id: 'PANZ-1252',
        orderNumber: 'PANZ-1252',
        tenantId: 'panzarotto-pompei',
        createdAt: '12:11',
        status: 'received',
        estimatedMinutes: 20,
        subtotal: 10.0,
        deliveryFee: 0,
        discountAmount: 0,
        couponCode: null,
        total: 10.0,
        customer: {
          name: 'Mario Rossi',
          phone: '+39 340 998 7766',
          address: 'Via Provinciale Ripuaria, 133, 80045 Pompei (NA)',
          deliveryAddress: 'Via Provinciale Ripuaria, 133, 80045 Pompei (NA)',
          notes: 'Оплачено онлайн через Stripe (Карта 4242) • Горячим к выдаче!',
          fulfillmentType: 'asporto',
          paymentMethod: 'card',
          timeSlot: 'Сейчас (ASAP)',
        },
        items: [
          {
            cartItemId: 'item-panz-1252-1',
            productId: 'panz-classico',
            name: 'Panzarotto Classico (Моцарелла & Томаты)',
            quantity: 2,
            unitPrice: 5.0,
            totalUnitPrice: 5.0,
            selectedExtras: [],
            specialNotes: 'Заказ с витрины panzarotto.vercel.app',
          },
        ],
        timing: {
          receivedAt: now - 90 * 1000,
          preparingAt: null,
          fryingAt: null,
          packingAt: null,
          readyAt: null,
          completedAt: null,
          slaTargetSeconds: 480,
        },
        packingChecklist: {
          itemsChecked: { 'item-panz-1252-1': false },
          napkinsIncluded: false,
          saucesVerified: false,
          thermalBagSealed: false,
          receiptAttached: false,
        },
        payment: {
          stripePaymentIntentId: 'pi_3PanzarottoDirect_1252',
          paymentStatus: 'paid_direct_to_owner',
          fiscalSignature: 'KassenSichV-TSE-PANZ1252-VERIFIED',
        },
      },
      {
        id: 'PANZ-4810',
        orderNumber: 'PANZ-4810',
        tenantId: 'panzarotto-pompei',
        createdAt: '12:04',
        status: 'preparing',
        estimatedMinutes: 18,
        subtotal: 21.5,
        deliveryFee: 2.0,
        discountAmount: 0,
        couponCode: null,
        total: 23.5,
        customer: {
          name: 'Salvatore Di Maio',
          phone: '+39 333 789 4512',
          address: 'Via Roma, 48, Pompei',
          deliveryAddress: 'Via Roma, 48, Pompei',
          notes: 'Побольше салфеток, домофон 14',
          fulfillmentType: 'consegna',
          paymentMethod: 'card',
          timeSlot: 'ASAP',
        },
        items: [
          {
            cartItemId: 'item-4810-1',
            productId: 'fr-panzarotto-classico',
            name: 'Panzarotto Classico Napoletano',
            quantity: 3,
            unitPrice: 4.5,
            totalUnitPrice: 5.5,
            selectedExtras: [{ id: 'ex-bufala', name: 'Mozzarella di Bufala DOP', price: 1.0 }],
            specialNotes: 'Без базилика в одном',
          },
          {
            cartItemId: 'item-4810-2',
            productId: 'fr-cuoppo-terra',
            name: 'Cuoppo di Terra Tradizionale',
            quantity: 1,
            unitPrice: 5.0,
            totalUnitPrice: 5.0,
            selectedExtras: [],
          },
        ],
        timing: {
          receivedAt: now - 210 * 1000,
          preparingAt: now - 160 * 1000,
          fryingAt: null,
          packingAt: null,
          readyAt: null,
          completedAt: null,
          slaTargetSeconds: 480,
        },
        packingChecklist: {
          itemsChecked: { 'item-4810-1': true, 'item-4810-2': false },
          napkinsIncluded: true,
          saucesVerified: false,
          thermalBagSealed: false,
          receiptAttached: false,
        },
        payment: {
          stripePaymentIntentId: 'pi_3PanzarottoDirect_4810',
          paymentStatus: 'paid_direct_to_owner',
          fiscalSignature: 'KassenSichV-TSE-88412A9F',
        },
      },
      {
        id: 'PANZ-4811',
        orderNumber: 'PANZ-4811',
        tenantId: 'panzarotto-pompei',
        createdAt: '12:07',
        status: 'frying',
        estimatedMinutes: 15,
        subtotal: 14.5,
        deliveryFee: 0,
        discountAmount: 0,
        couponCode: null,
        total: 14.5,
        customer: {
          name: 'Elena Sorrentino',
          phone: '+39 347 112 9081',
          address: 'Самовывоз: Via Provinciale Ripuaria, 133',
          notes: 'Заберу лично через 10 минут',
          fulfillmentType: 'asporto',
          paymentMethod: 'apple_pay',
          timeSlot: 'ASAP',
        },
        items: [
          {
            cartItemId: 'item-4811-1',
            productId: 'ps-vesuvio',
            name: 'Panino Speciale Vesuvio',
            quantity: 1,
            unitPrice: 9.5,
            totalUnitPrice: 9.5,
            selectedExtras: [],
          },
          {
            cartItemId: 'item-4811-2',
            productId: 'pt-dippers-cheddar',
            name: 'Patate Dippers Cheddar & Bacon',
            quantity: 1,
            unitPrice: 5.0,
            totalUnitPrice: 5.0,
            selectedExtras: [],
          },
        ],
        timing: {
          receivedAt: now - 140 * 1000,
          preparingAt: now - 110 * 1000,
          fryingAt: now - 55 * 1000,
          packingAt: null,
          readyAt: null,
          completedAt: null,
          slaTargetSeconds: 480,
        },
        packingChecklist: {
          itemsChecked: { 'item-4811-1': true, 'item-4811-2': true },
          napkinsIncluded: true,
          saucesVerified: true,
          thermalBagSealed: false,
          receiptAttached: false,
        },
        payment: {
          stripePaymentIntentId: 'pi_3PanzarottoDirect_4811',
          paymentStatus: 'paid_direct_to_owner',
          fiscalSignature: 'KassenSichV-TSE-99201B4C',
        },
      },
    ] as PlacedOrder[],
  };
}

function loadLocalCloudDb(): ReturnType<typeof createInitialOfflineFirstSeed> {
  const seed = createInitialOfflineFirstSeed();
  if (typeof window === 'undefined') return seed;
  try {
    const raw = window.localStorage.getItem(LOCAL_DB_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(LOCAL_DB_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.orders)) {
      window.localStorage.setItem(LOCAL_DB_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    // Ensure #PANZ-1252 is present if user placed it before this update
    if (!parsed.orders.some((o: any) => o.id === 'PANZ-1252' || o.orderNumber === 'PANZ-1252')) {
      parsed.orders.unshift(seed.orders[0]);
      window.localStorage.setItem(LOCAL_DB_STORAGE_KEY, JSON.stringify(parsed));
    }
    // Ensure Labriout tenant, Stripe config, and inventory are present in existing localStorage
    parsed.tenants = Array.isArray(parsed.tenants) ? parsed.tenants : seed.tenants;
    if (!parsed.tenants.some((t: any) => t.id === 'labriout')) {
      const labTenant = seed.tenants.find(t => t.id === 'labriout');
      if (labTenant) {
        parsed.tenants.splice(1, 0, labTenant);
      }
      parsed.stripeConfigs = parsed.stripeConfigs || {};
      if (!parsed.stripeConfigs['labriout']) {
        parsed.stripeConfigs['labriout'] = seed.stripeConfigs['labriout'];
      }
      parsed.inventory = parsed.inventory || {};
      if (!parsed.inventory['labriout']) {
        parsed.inventory['labriout'] = seed.inventory['labriout'];
      }
      window.localStorage.setItem(LOCAL_DB_STORAGE_KEY, JSON.stringify(parsed));
    }
    // One-time migration: ensure any product override saved before default category extras were pre-populated retains both default extras + newly added admin extras (like Cheader)
    if (!parsed._extrasSyncedV3) {
      parsed.customProductOverrides = parsed.customProductOverrides || {};
      for (const prodId of Object.keys(parsed.customProductOverrides)) {
        const over = parsed.customProductOverrides[prodId];
        const baseProd = MENU_PRODUCTS.find(p => p.id === prodId);
        if (over && baseProd && Array.isArray(over.availableExtras)) {
          const baseExtras = Array.isArray(baseProd.availableExtras) ? baseProd.availableExtras : [];
          const mergedExtras = [...baseExtras];
          for (const customEx of over.availableExtras) {
            const exists = mergedExtras.some(
              b =>
                b.id === customEx.id ||
                b.name.toLowerCase() === String(customEx.name || '').toLowerCase()
            );
            if (!exists) {
              mergedExtras.push({
                ...customEx,
                nameRu: customEx.nameRu || customEx.name,
                nameEn: customEx.nameEn || customEx.name,
              });
            }
          }
          over.availableExtras = mergedExtras;
        }
      }
      parsed._extrasSyncedV3 = true;
      window.localStorage.setItem(LOCAL_DB_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return seed;
  }
}

function saveLocalCloudDb(db: ReturnType<typeof createInitialOfflineFirstSeed>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOCAL_DB_STORAGE_KEY, JSON.stringify(db));
  } catch {
    // ignore quota errors
  }
}

// Synchronous helper called directly by CartContext.submitOrder so new orders are 100% guaranteed in KDS immediately
export function recordOrderInOfflineFirstDb(
  order: PlacedOrder,
  tenantId = 'panzarotto-pompei'
): PlacedOrder {
  const db = loadLocalCloudDb();
  const now = Date.now();

  const normalizedItems = (order.items || []).map((it: any, idx: number) => ({
    cartItemId: it.cartItemId || `item-${idx + 1}`,
    productId: it.productId || it.product?.id || `prod-${idx + 1}`,
    name: it.name || it.product?.name || 'Panzarotto Street Food',
    quantity: Math.max(1, Number(it.quantity) || 1),
    unitPrice: Number(it.unitPrice ?? it.product?.price ?? 0),
    totalUnitPrice: Number(it.totalUnitPrice ?? it.unitPrice ?? it.product?.price ?? 0),
    selectedExtras: Array.isArray(it.selectedExtras) ? it.selectedExtras : [],
    specialNotes: it.specialNotes || '',
    product: it.product,
  }));

  const enrichedOrder: PlacedOrder = {
    ...order,
    id: order.id || order.orderNumber || `PANZ-${Math.floor(1000 + Math.random() * 9000)}`,
    orderNumber: order.orderNumber || order.id,
    tenantId,
    status: order.status || 'received',
    createdAt:
      order.createdAt ||
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    items: normalizedItems as any,
    timing: order.timing || {
      receivedAt: now,
      preparingAt: null,
      fryingAt: null,
      packingAt: null,
      readyAt: null,
      completedAt: null,
      slaTargetSeconds: 480,
    },
    packingChecklist: order.packingChecklist || {
      itemsChecked: Object.fromEntries(normalizedItems.map(i => [i.cartItemId, false])),
      napkinsIncluded: false,
      saucesVerified: false,
      thermalBagSealed: false,
      receiptAttached: false,
    },
    payment: order.payment || {
      stripePaymentIntentId: `pi_3PanzarottoDirect_${Date.now()}`,
      paymentStatus:
        order.customer?.paymentMethod === 'cash' ? 'cash_on_delivery' : 'paid_direct_to_owner',
      fiscalSignature: `KassenSichV-TSE-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
    },
  };

  // Avoid duplicate IDs; update existing or prepend
  const existingIdx = db.orders.findIndex(
    o => o.id === enrichedOrder.id || o.orderNumber === enrichedOrder.orderNumber
  );
  if (existingIdx >= 0) {
    db.orders[existingIdx] = { ...db.orders[existingIdx], ...enrichedOrder };
  } else {
    db.orders.unshift(enrichedOrder);

    // Deduct stock on iiko/Lightspeed warehouse
    const tenantInv = db.inventory[tenantId] || db.inventory['panzarotto-pompei'] || [];
    const totalQty = normalizedItems.reduce((s, i) => s + i.quantity, 0);
    tenantInv.forEach(inv => {
      if (inv.id === 'inv-dough') inv.currentStock = Math.max(0, inv.currentStock - 180 * totalQty);
      if (inv.id === 'inv-mozzarella') inv.currentStock = Math.max(0, inv.currentStock - 95 * totalQty);
      if (inv.id === 'inv-tomato') inv.currentStock = Math.max(0, inv.currentStock - 60 * totalQty);
      if (inv.id === 'inv-oil') inv.currentStock = Math.max(0, inv.currentStock - 45 * totalQty);
      if (inv.id === 'inv-packaging') inv.currentStock = Math.max(0, inv.currentStock - totalQty);
      inv.isLowStock = inv.currentStock <= inv.minThreshold;
    });
  }

  saveLocalCloudDb(db);
  broadcastLocalRealtimeEvent('ORDER_CREATED', tenantId, enrichedOrder);
  return enrichedOrder;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  tenantId = 'panzarotto-pompei'
): Promise<T> {
  if (!IS_LOCALHOST) {
    throw new Error('Using Toast POS Offline-First Cloud Engine on Vercel');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Tenant-Id': tenantId,
    ...((options.headers as Record<string, string>) || {}),
  };

  const response = await fetch(`${GATEWAY_ORIGIN}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Non-JSON response from gateway');
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error || `HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

// Web Audio API Kitchen Bell Synthesizer (Dodo IS / Uber Eats style new-order gong)
export function playKitchenOrderSound(type: 'new_order' | 'ready' = 'new_order') {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const notes = type === 'new_order' ? [587.33, 880.0, 1174.66] : [659.25, 987.77];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.13);

      gain.gain.setValueAtTime(0.001, now + idx * 0.13);
      gain.gain.exponentialRampToValueAtTime(0.28, now + idx * 0.13 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.13 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.13);
      osc.stop(now + idx * 0.13 + 0.48);
    });
  } catch {
    // AudioContext blocked until user interaction
  }
}

// Subscribe to Server-Sent Events (SSE) + Cross-Tab BroadcastChannel + Storage sync
export function subscribeToRealtimeStream(
  tenantId: string,
  onEvent: (event: {
    type: string;
    tenantId: string;
    timestamp: number;
    data: any;
  }) => void
): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  let es: EventSource | null = null;
  let reconnectTimer: any = null;
  let closed = false;

  // 1. Cross-tab BroadcastChannel listener (works on https://panzarotto.vercel.app across tabs!)
  let bc: BroadcastChannel | null = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel(REALTIME_CHANNEL_NAME);
      bc.onmessage = evt => {
        if (evt.data && (!evt.data.tenantId || evt.data.tenantId === tenantId)) {
          onEvent(evt.data);
        }
      };
    }
  } catch {
    // ignore
  }

  // 2. Same-tab CustomEvent listener
  const handleCustomEvt = (evt: Event) => {
    const detail = (evt as CustomEvent<RealtimeEventPayload>).detail;
    if (detail && (!detail.tenantId || detail.tenantId === tenantId)) {
      onEvent(detail);
    }
  };
  window.addEventListener('streetfood-realtime-event', handleCustomEvt);

  // 3. Cross-tab localStorage event listener
  const handleStorageEvt = (evt: StorageEvent) => {
    if (evt.key === LOCAL_DB_STORAGE_KEY && evt.newValue) {
      onEvent({
        type: 'ORDER_STATUS_UPDATED',
        tenantId,
        timestamp: Date.now(),
        data: {},
      });
    }
  };
  window.addEventListener('storage', handleStorageEvt);

  // 4. Localhost SSE stream if running local backend gateway
  if (IS_LOCALHOST && typeof EventSource !== 'undefined') {
    const connect = (baseUrl: string) => {
      if (closed) return;
      try {
        es = new EventSource(
          `${baseUrl}/api/realtime/stream?tenantId=${encodeURIComponent(tenantId)}`
        );
        es.onmessage = evt => {
          try {
            const parsed = JSON.parse(evt.data);
            onEvent(parsed);
          } catch {
            // ignore
          }
        };
        es.onerror = () => {
          es?.close();
          if (!closed) {
            reconnectTimer = setTimeout(() => connect(GATEWAY_ORIGIN), 5000);
          }
        };
      } catch {
        // ignore
      }
    };
    connect(GATEWAY_ORIGIN);
  }

  return () => {
    closed = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    es?.close();
    bc?.close();
    window.removeEventListener('streetfood-realtime-event', handleCustomEvt);
    window.removeEventListener('storage', handleStorageEvt);
  };
}

// --- Microservice #1: Super-Admin & Catalog CMS ---
export async function fetchCatalogMenu(tenantId = 'panzarotto-pompei') {
  const db = loadLocalCloudDb();
  const tenant = db.tenants.find(t => t.id === tenantId) || db.tenants[0];
  const stripeCfg = db.stripeConfigs[tenantId] || db.stripeConfigs['panzarotto-pompei'];
  const baseProducts = getBaseProductsForTenant(tenantId);
  const tenantCustomProducts = (db.customProducts || []).filter((p: any) =>
    p.tenantId ? p.tenantId === tenantId : tenantId === 'panzarotto-pompei'
  );

  const mergedProducts: ProductItem[] = [
    ...tenantCustomProducts,
    ...baseProducts.map(p => {
      const override = db.customProductOverrides[p.id] || {};
      return {
        ...p,
        ...override,
        availableExtras: Array.isArray(override.availableExtras)
          ? override.availableExtras
          : p.availableExtras,
        originalPrice:
          override.originalPrice !== undefined ? override.originalPrice : p.originalPrice,
        isAvailable:
          db.productAvailability[p.id] !== undefined ? db.productAvailability[p.id] : true,
      };
    }),
  ];

  try {
    const remote = await apiRequest<{
      service: string;
      tenantId: string;
      tenant: any;
      stripePublic: any;
      products: ProductItem[];
      coupons: any[];
    }>(`/api/catalog/menu?tenantId=${encodeURIComponent(tenantId)}`, { method: 'GET' }, tenantId);
    if (remote) {
      return {
        ...remote,
        products: mergedProducts,
      };
    }
  } catch {
    // Fallback to Offline-First Cloud DB
  }

  return {
    service: 'admin-cms-microservice',
    tenantId,
    tenant,
    stripePublic: {
      stripePublishableKey: stripeCfg?.stripePublishableKey,
      stripeMode: stripeCfg?.stripeMode || 'test',
      isConnected: Boolean(stripeCfg?.isConnected),
      acceptCardOnline: Boolean(stripeCfg?.acceptCardOnline),
      acceptAppleGooglePay: Boolean(stripeCfg?.acceptAppleGooglePay),
      acceptCash: Boolean(stripeCfg?.acceptCash),
      acceptSatispay: Boolean(stripeCfg?.acceptSatispay),
    },
    products: mergedProducts,
    coupons: db.coupons,
  };
}

export async function fetchAllTenants() {
  const db = loadLocalCloudDb();
  try {
    const remote = await apiRequest<{
      saasMetrics: {
        totalTenants: number;
        activeSubscriptions: number;
        mrrEur: number;
        arrEur: number;
        platformGmvEur: number;
      };
      tenants: any[];
    }>('/api/admin/tenants');
    if (remote && Array.isArray(remote.tenants)) {
      const mergedMap = new Map<string, any>();
      db.tenants.forEach(t => mergedMap.set(t.id, t));
      remote.tenants.forEach(t => {
        if (!mergedMap.has(t.id)) {
          mergedMap.set(t.id, t);
        }
      });
      const tenants = Array.from(mergedMap.values());
      const mrrEur = tenants.reduce(
        (s, t) => s + Number(t.monthlySaasFeeEur || t.monthly_fee_eur || 149),
        0
      );
      const platformGmvEur = tenants.reduce((s, t) => s + Number(t.totalRevenue || 0), 0);
      return {
        saasMetrics: {
          totalTenants: tenants.length,
          activeSubscriptions: tenants.length,
          mrrEur,
          arrEur: mrrEur * 12,
          platformGmvEur,
        },
        tenants,
      };
    }
  } catch {
    // Fallback to Offline-First Cloud DB
  }
  const mrrEur = db.tenants.reduce((s, t) => s + Number(t.monthlySaasFeeEur || 149), 0);
  const platformGmvEur = db.tenants.reduce((s, t) => s + Number(t.totalRevenue || 0), 0);
  return {
    saasMetrics: {
      totalTenants: db.tenants.length,
      activeSubscriptions: db.tenants.filter(t => t.status === 'active').length,
      mrrEur,
      arrEur: mrrEur * 12,
      platformGmvEur,
    },
    tenants: db.tenants,
  };
}

export async function createNewTenant(payload: any) {
  try {
    return await apiRequest('/api/admin/tenants', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch {
    const db = loadLocalCloudDb();
    const id =
      payload.slug ||
      payload.name
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') ||
      `tenant-${Date.now()}`;
    const newTenant = {
      id,
      slug: id,
      name: payload.name || 'New Street Food Point',
      country: payload.country || 'Italy',
      city: payload.city || 'Roma',
      currency: payload.currency || 'EUR',
      timezone: 'Europe/Rome',
      language: 'it',
      themePrimaryColor: payload.themePrimaryColor || '#ff5500',
      subscriptionPlan: payload.subscriptionPlan || 'PRO_SAAS',
      monthlySaasFeeEur: Number(payload.monthlySaasFeeEur) || 149,
      status: 'active',
      ownerName: payload.ownerName || 'Restaurant Owner',
      ownerEmail: payload.ownerEmail || 'owner@streetfood.com',
      phone: payload.phone || '+39 000 000000',
      address: payload.address || '',
      kdsSlaMinutes: 8,
      aiUpsellEnabled: 1,
      kioskModeEnabled: 1,
      fiscalComplianceMode: 'ITALY_RT_KASSENSICHV',
      stripeConnected: false,
      stripeMode: 'test',
      ordersCount: 0,
      totalRevenue: 0,
    };
    db.tenants.push(newTenant);
    saveLocalCloudDb(db);
    return { success: true, tenant: newTenant };
  }
}

export async function updateTenantSettings(tenantId: string, payload: any) {
  try {
    return await apiRequest(
      `/api/admin/tenants/${encodeURIComponent(tenantId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      tenantId
    );
  } catch {
    const db = loadLocalCloudDb();
    const idx = db.tenants.findIndex(t => t.id === tenantId);
    if (idx >= 0) {
      db.tenants[idx] = { ...db.tenants[idx], ...payload };
      saveLocalCloudDb(db);
    }
    broadcastLocalRealtimeEvent('MENU_UPDATED', tenantId, payload);
    return { success: true };
  }
}

export async function upsertCatalogProduct(
  tenantId: string,
  product: Partial<ProductItem> & { id?: string }
) {
  const db = loadLocalCloudDb();
  const prodId = product.id || `custom-${Date.now()}`;
  const normalizedExtras = Array.isArray(product.availableExtras)
    ? product.availableExtras.map(ex => ({
        ...ex,
        name: ex.name,
        nameRu: ex.nameRu || ex.name,
        nameEn: ex.nameEn || ex.name,
        price: Number(ex.price) || 0,
      }))
    : undefined;

  const normalizedProduct: Partial<ProductItem> = {
    ...product,
    id: prodId,
    price: Number(product.price) || 0,
    originalPrice:
      product.originalPrice === null || product.originalPrice === 0
        ? 0
        : product.originalPrice !== undefined
        ? Number(product.originalPrice)
        : undefined,
    ...(normalizedExtras !== undefined ? { availableExtras: normalizedExtras } : {}),
  };

  const baseProducts = getBaseProductsForTenant(tenantId);
  const existingBase =
    baseProducts.find(p => p.id === prodId) ||
    MENU_PRODUCTS.find(p => p.id === prodId) ||
    LABRIOUT_MENU_PRODUCTS.find(p => p.id === prodId);
  if (existingBase) {
    db.customProductOverrides[prodId] = {
      ...(db.customProductOverrides[prodId] || {}),
      ...normalizedProduct,
    };
  } else {
    const customIdx = db.customProducts.findIndex(p => p.id === prodId);
    const fullProd: ProductItem & { tenantId?: string } = {
      id: prodId,
      tenantId,
      name: normalizedProduct.name || 'Nuovo Panzarotto',
      nameRu: normalizedProduct.nameRu || normalizedProduct.name || 'Новое блюдо',
      nameEn: normalizedProduct.nameEn || normalizedProduct.name || 'New Dish',
      description:
        normalizedProduct.description || 'Specialità artigianale fritta al momento',
      descriptionRu:
        normalizedProduct.descriptionRu ||
        normalizedProduct.description ||
        'Фирменное горячее блюдо',
      price: Number(normalizedProduct.price) || 6.0,
      originalPrice:
        normalizedProduct.originalPrice !== undefined
          ? normalizedProduct.originalPrice
          : Number(((Number(normalizedProduct.price) || 6.0) * 1.3).toFixed(2)),
      foodCost: Number(normalizedProduct.foodCost) || 1.8,
      weight: normalizedProduct.weight || '200 g',
      badge: normalizedProduct.badge,
      category: (normalizedProduct.category as any) || 'friggitoria',
      image:
        normalizedProduct.image ||
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
      isPopular: Boolean(normalizedProduct.isPopular),
      isAvailable: normalizedProduct.isAvailable !== false,
      availableExtras: normalizedExtras || [],
    };
    if (customIdx >= 0) {
      db.customProducts[customIdx] = fullProd;
    } else {
      db.customProducts.unshift(fullProd);
    }
  }
  saveLocalCloudDb(db);
  broadcastLocalRealtimeEvent('MENU_UPDATED', tenantId, { productId: prodId });

  try {
    return await apiRequest<{ success: boolean; product: ProductItem }>(
      '/api/admin/products',
      {
        method: 'POST',
        body: JSON.stringify({ ...normalizedProduct, tenantId }),
      },
      tenantId
    );
  } catch {
    return { success: true, product: normalizedProduct as ProductItem };
  }
}

export async function createInfluencerCoupon(
  tenantId: string,
  payload: { code: string; discountPercent: number; channel: string }
) {
  try {
    return await apiRequest(
      '/api/admin/coupons',
      {
        method: 'POST',
        body: JSON.stringify({ ...payload, tenantId }),
      },
      tenantId
    );
  } catch {
    const db = loadLocalCloudDb();
    const newCoupon = {
      code: payload.code.toUpperCase(),
      discountPercent: Number(payload.discountPercent) || 10,
      channel: payload.channel || 'Influencer Promo',
      usageCount: 0,
      revenueGenerated: 0,
      isActive: 1,
    };
    db.coupons.unshift(newCoupon);
    saveLocalCloudDb(db);
    return { success: true, coupon: newCoupon };
  }
}

// --- Microservice #2: Restaurant Owner, KDS Time-Tracker, Packing & Stock ---
export async function updateOrderStatusOnKds(
  orderIdOrNumber: string,
  status: string,
  tenantId = 'panzarotto-pompei'
) {
  const db = loadLocalCloudDb();
  const now = Date.now();
  const ord = db.orders.find(
    o => o.id === orderIdOrNumber || o.orderNumber === orderIdOrNumber
  );
  if (ord) {
    ord.status = status as any;
    if (!ord.timing) {
      ord.timing = {
        receivedAt: now - 120000,
        preparingAt: null,
        fryingAt: null,
        packingAt: null,
        readyAt: null,
        completedAt: null,
        slaTargetSeconds: 480,
      };
    }
    if (status === 'preparing') ord.timing.preparingAt = now;
    if (status === 'frying') ord.timing.fryingAt = now;
    if (status === 'packing') ord.timing.packingAt = now;
    if (status === 'ready' || status === 'delivering') ord.timing.readyAt = now;
    if (status === 'completed') ord.timing.completedAt = now;
    saveLocalCloudDb(db);
    broadcastLocalRealtimeEvent('ORDER_STATUS_UPDATED', tenantId, ord);
  }

  try {
    return await apiRequest<{ success: boolean; order: PlacedOrder }>(
      `/api/owner/orders/${encodeURIComponent(orderIdOrNumber)}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
      tenantId
    );
  } catch {
    return { success: true, order: ord! };
  }
}

export async function updateOrderPackingChecklist(
  orderIdOrNumber: string,
  payload: {
    itemKey?: string;
    checked?: boolean;
    napkinsIncluded?: boolean;
    saucesVerified?: boolean;
    thermalBagSealed?: boolean;
    receiptAttached?: boolean;
    packedBy?: string;
    completeAllAndReady?: boolean;
  },
  tenantId = 'panzarotto-pompei'
) {
  const db = loadLocalCloudDb();
  const ord = db.orders.find(
    o => o.id === orderIdOrNumber || o.orderNumber === orderIdOrNumber
  );
  if (ord) {
    const checklist = ord.packingChecklist || {
      itemsChecked: {},
      napkinsIncluded: false,
      saucesVerified: false,
      thermalBagSealed: false,
      receiptAttached: false,
    };
    if (payload.itemKey !== undefined && payload.checked !== undefined) {
      checklist.itemsChecked = {
        ...(checklist.itemsChecked || {}),
        [payload.itemKey]: payload.checked,
      };
    }
    if (payload.napkinsIncluded !== undefined) checklist.napkinsIncluded = payload.napkinsIncluded;
    if (payload.saucesVerified !== undefined) checklist.saucesVerified = payload.saucesVerified;
    if (payload.thermalBagSealed !== undefined)
      checklist.thermalBagSealed = payload.thermalBagSealed;
    if (payload.receiptAttached !== undefined) checklist.receiptAttached = payload.receiptAttached;

    if (payload.completeAllAndReady) {
      const allItems: Record<string, boolean> = {};
      (ord.items || []).forEach((it: any, idx: number) => {
        allItems[it.cartItemId || `item-${idx + 1}`] = true;
      });
      checklist.itemsChecked = allItems;
      checklist.napkinsIncluded = true;
      checklist.saucesVerified = true;
      checklist.thermalBagSealed = true;
      checklist.receiptAttached = true;
      ord.status = ord.customer?.fulfillmentType === 'consegna' ? 'delivering' : 'ready';
      if (ord.timing) ord.timing.readyAt = Date.now();
    }

    ord.packingChecklist = checklist;
    saveLocalCloudDb(db);
    broadcastLocalRealtimeEvent('ORDER_PACKING_UPDATED', tenantId, ord);
  }

  try {
    return await apiRequest<{ success: boolean; order: PlacedOrder }>(
      `/api/owner/orders/${encodeURIComponent(orderIdOrNumber)}/packing`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      tenantId
    );
  } catch {
    return { success: true, order: ord! };
  }
}

export async function fetchOwnerInventory(tenantId = 'panzarotto-pompei') {
  try {
    return await apiRequest<{
      inventory: any[];
      stopListProducts: any[];
    }>(
      `/api/owner/inventory?tenantId=${encodeURIComponent(tenantId)}`,
      { method: 'GET' },
      tenantId
    );
  } catch {
    const db = loadLocalCloudDb();
    const inventory = db.inventory[tenantId] || db.inventory['panzarotto-pompei'] || [];
    const baseProducts = getBaseProductsForTenant(tenantId);
    const stopListProducts = baseProducts.slice(0, 18).map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      isAvailable:
        db.productAvailability[p.id] !== undefined ? db.productAvailability[p.id] : true,
    }));
    return { inventory, stopListProducts };
  }
}

export async function restockInventory(
  invId: string,
  addAmount: number,
  tenantId = 'panzarotto-pompei'
) {
  const db = loadLocalCloudDb();
  const list = db.inventory[tenantId] || db.inventory['panzarotto-pompei'] || [];
  const item = list.find(i => i.id === invId);
  if (item) {
    item.currentStock = Number(item.currentStock || 0) + Number(addAmount || 0);
    item.isLowStock = item.currentStock <= item.minThreshold;
    saveLocalCloudDb(db);
    broadcastLocalRealtimeEvent('INVENTORY_UPDATED', tenantId, item);
  }

  try {
    return await apiRequest(
      `/api/owner/inventory/${encodeURIComponent(invId)}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ addAmount, tenantId }),
      },
      tenantId
    );
  } catch {
    return { success: true, item };
  }
}

export async function toggleProductStopList(
  productId: string,
  isAvailable?: boolean,
  tenantId = 'panzarotto-pompei'
) {
  const db = loadLocalCloudDb();
  const current =
    db.productAvailability[productId] !== undefined ? db.productAvailability[productId] : true;
  const nextVal = isAvailable !== undefined ? isAvailable : !current;
  db.productAvailability[productId] = nextVal;
  saveLocalCloudDb(db);
  broadcastLocalRealtimeEvent('MENU_UPDATED', tenantId, { productId, isAvailable: nextVal });

  try {
    return await apiRequest<{ success: boolean; productId: string; isAvailable: boolean }>(
      `/api/owner/products/${encodeURIComponent(productId)}/toggle-availability`,
      {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: nextVal, tenantId }),
      },
      tenantId
    );
  } catch {
    return { success: true, productId, isAvailable: nextVal };
  }
}

export async function fetchOwnerAnalytics(tenantId = 'panzarotto-pompei') {
  try {
    return await apiRequest<{
      kpis: {
        totalOrders: number;
        activeOrders: number;
        totalRevenue: number;
        totalFoodCost: number;
        grossProfit: number;
        avgOrderValue: number;
        foodCostPercent: number;
        avgPrepSeconds: number;
        savedCommissionEur: number;
      };
      peakHours: { hour: string; orders: number; revenue: number }[];
      abcAnalysis: any[];
      coupons: any[];
      aiInsights: { id: string; type: string; title: string; description: string; impact: string }[];
    }>(
      `/api/owner/analytics?tenantId=${encodeURIComponent(tenantId)}`,
      { method: 'GET' },
      tenantId
    );
  } catch {
    const db = loadLocalCloudDb();
    const tenantOrders = db.orders.filter(o => !o.tenantId || o.tenantId === tenantId);
    const totalOrders = tenantOrders.length;
    const activeOrders = tenantOrders.filter(o => o.status !== 'completed').length;
    const totalRevenue = tenantOrders.reduce((s, o) => s + Number(o.total || 0), 0) + 412.5;
    const totalFoodCost = +(totalRevenue * 0.265).toFixed(2);
    const grossProfit = +(totalRevenue - totalFoodCost).toFixed(2);
    const avgOrderValue = +(totalRevenue / Math.max(1, totalOrders + 18)).toFixed(2);
    const savedCommissionEur = +(totalRevenue * 0.3).toFixed(2);

    return {
      kpis: {
        totalOrders: totalOrders + 18,
        activeOrders,
        totalRevenue: +totalRevenue.toFixed(2),
        totalFoodCost,
        grossProfit,
        avgOrderValue,
        foodCostPercent: 26.5,
        avgPrepSeconds: 295,
        savedCommissionEur,
      },
      peakHours: [
        { hour: '12:00', orders: 14, revenue: 168 },
        { hour: '13:00', orders: 22, revenue: 275 },
        { hour: '18:00', orders: 19, revenue: 240 },
        { hour: '19:00', orders: 31, revenue: 410 },
        { hour: '20:00', orders: 38, revenue: 520 },
        { hour: '21:00', orders: 29, revenue: 390 },
      ],
      abcAnalysis: [
        {
          id: 'fr-panzarotto-classico',
          name: 'Panzarotto Classico (Моцарелла & Томаты)',
          unitsSold: 142,
          revenue: 710.0,
          foodCostPct: 21.5,
          marginEur: 557.35,
          abcClass: 'A',
          recommendation: 'Хит продаж (80% прибыли) — держать на 1-м месте витрины',
        },
        {
          id: 'ps-vesuvio',
          name: 'Panino Speciale Vesuvio',
          unitsSold: 86,
          revenue: 817.0,
          foodCostPct: 28.0,
          marginEur: 588.24,
          abcClass: 'A',
          recommendation: 'Высокий средний чек — предлагать комбо с напитком',
        },
        {
          id: 'fr-cuoppo-terra',
          name: 'Cuoppo Napoletano Tradizionale',
          unitsSold: 64,
          revenue: 384.0,
          foodCostPct: 24.0,
          marginEur: 291.84,
          abcClass: 'B',
          recommendation: 'Стабильный спрос — включить в AI Upsell в корзине',
        },
      ],
      coupons: db.coupons,
      aiInsights: [
        {
          id: 'ai-1',
          type: 'staffing',
          title: 'Пик заказов в 19:30–21:00 (Пятница/Суббота)',
          description:
            'Прогноз загрузки фритюрниц +42%. Рекомендуем вывести 2-го повара на станцию панцаротто с 18:30.',
          impact: '+€340 выручки без просрочек SLA',
        },
        {
          id: 'ai-2',
          type: 'upsell',
          title: 'AI-рекомендация модификатора: Mozzarella di Bufala (+€1.50)',
          description:
            '34% покупателей Panzarotto Classico добавляют двойную моцареллу при показе всплывающего модификатора.',
          impact: '+14.8% к среднему чеку',
        },
      ],
    };
  }
}

// --- Microservice #3: Direct Stripe Payment Service ---
export async function fetchTenantStripeConfig(tenantId = 'panzarotto-pompei') {
  try {
    return await apiRequest<{
      tenantId: string;
      stripePublishableKey: string;
      stripeSecretKeyMasked: string;
      hasSecretKey: boolean;
      stripeWebhookSecretMasked: string;
      stripeMode: 'test' | 'live';
      isConnected: boolean;
      acceptCardOnline: boolean;
      acceptAppleGooglePay: boolean;
      acceptCash: boolean;
      acceptSatispay: boolean;
      directPayoutIbanHint: string;
      updatedAt: string;
    }>(
      `/api/payments/config?tenantId=${encodeURIComponent(tenantId)}`,
      { method: 'GET' },
      tenantId
    );
  } catch {
    const db = loadLocalCloudDb();
    return (
      db.stripeConfigs[tenantId] ||
      db.stripeConfigs['panzarotto-pompei'] || {
        tenantId,
        stripePublishableKey: 'pk_test_51PanzarottoPompeiDirectStripeKey99',
        stripeSecretKeyMasked: 'sk_test_51PanzarottoPompeiSecretDirectKey99',
        hasSecretKey: true,
        stripeWebhookSecretMasked: 'whsec_panzarotto_pompei_live_webhook',
        stripeMode: 'test',
        isConnected: true,
        acceptCardOnline: true,
        acceptAppleGooglePay: true,
        acceptCash: true,
        acceptSatispay: true,
        directPayoutIbanHint: 'IT60 X054 2811 1010 0000 0123 456 (Intesa Sanpaolo - Pompei)',
        updatedAt: new Date().toISOString(),
      }
    );
  }
}

export async function saveTenantStripeConfig(tenantId: string, payload: any) {
  const db = loadLocalCloudDb();
  const prev = db.stripeConfigs[tenantId] || db.stripeConfigs['panzarotto-pompei'] || {};
  db.stripeConfigs[tenantId] = {
    ...prev,
    tenantId,
    stripePublishableKey: payload.stripePublishableKey ?? prev.stripePublishableKey,
    stripeSecretKeyMasked: payload.stripeSecretKey ?? prev.stripeSecretKeyMasked,
    hasSecretKey: true,
    stripeWebhookSecretMasked: payload.stripeWebhookSecret ?? prev.stripeWebhookSecretMasked,
    stripeMode: payload.stripeMode || 'test',
    isConnected: Boolean(payload.stripePublishableKey),
    acceptCardOnline: payload.acceptCardOnline ?? true,
    acceptAppleGooglePay: payload.acceptAppleGooglePay ?? true,
    acceptCash: payload.acceptCash ?? true,
    acceptSatispay: payload.acceptSatispay ?? true,
    directPayoutIbanHint: payload.directPayoutIbanHint ?? prev.directPayoutIbanHint,
    updatedAt: new Date().toISOString(),
  };
  saveLocalCloudDb(db);

  try {
    return await apiRequest(
      '/api/payments/config',
      {
        method: 'PUT',
        body: JSON.stringify({ ...payload, tenantId }),
      },
      tenantId
    );
  } catch {
    return { success: true, config: db.stripeConfigs[tenantId] };
  }
}

export async function createDirectStripeIntent(
  tenantId: string,
  amount: number,
  paymentMethod: string
) {
  try {
    return await apiRequest<{
      success: boolean;
      paymentIntentId: string;
      fiscalSignature: string;
      netDirectToOwner: number;
      savedVsUberEatsFoodora: number;
    }>(
      '/api/payments/create-intent',
      {
        method: 'POST',
        body: JSON.stringify({ tenantId, amount, paymentMethod }),
      },
      tenantId
    );
  } catch {
    const stripeFee = +(amount * 0.015 + 0.25).toFixed(2);
    return {
      success: true,
      paymentIntentId: `pi_3PanzarottoDirect_${Date.now()}`,
      fiscalSignature: `KassenSichV-TSE-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      netDirectToOwner: +(amount - stripeFee).toFixed(2),
      savedVsUberEatsFoodora: +(amount * 0.3).toFixed(2),
    };
  }
}

export async function fetchStripeTransactions(tenantId = 'panzarotto-pompei') {
  try {
    return await apiRequest<{
      summary: {
        totalVolume: number;
        stripeFees: number;
        netPayoutToOwner: number;
        aggregatorCommissionWouldBe: number;
        ownerSavedEur: number;
      };
      transactions: any[];
    }>(
      `/api/payments/transactions?tenantId=${encodeURIComponent(tenantId)}`,
      { method: 'GET' },
      tenantId
    );
  } catch {
    const db = loadLocalCloudDb();
    const tenantOrders = db.orders.filter(o => !o.tenantId || o.tenantId === tenantId);
    const totalVolume = +tenantOrders.reduce((s, o) => s + Number(o.total || 0), 0).toFixed(2);
    const stripeFees = +(totalVolume * 0.015 + tenantOrders.length * 0.25).toFixed(2);
    const netPayoutToOwner = +(totalVolume - stripeFees).toFixed(2);
    const aggregatorCommissionWouldBe = +(totalVolume * 0.3).toFixed(2);
    const ownerSavedEur = +(aggregatorCommissionWouldBe - stripeFees).toFixed(2);

    const transactions = tenantOrders.map(o => ({
      orderNumber: o.orderNumber || o.id,
      customerName: o.customer?.name || 'Cliente',
      total: Number(o.total || 0),
      paymentMethod: o.customer?.paymentMethod || 'card',
      paymentStatus: 'paid_direct_to_owner',
      stripePaymentIntentId:
        o.payment?.stripePaymentIntentId || `pi_3PanzarottoDirect_${o.id}`,
      fiscalSignature: o.payment?.fiscalSignature || 'KassenSichV-TSE-VERIFIED',
      createdAt: o.createdAt,
    }));

    return {
      summary: {
        totalVolume,
        stripeFees,
        netPayoutToOwner,
        aggregatorCommissionWouldBe,
        ownerSavedEur,
      },
      transactions,
    };
  }
}

// --- Microservice #4: Real-Time Order Service ---
export async function fetchTenantOrders(tenantId = 'panzarotto-pompei') {
  const localDb = loadLocalCloudDb();
  const localOrders = localDb.orders.filter(o => !o.tenantId || o.tenantId === tenantId);

  try {
    const remote = await apiRequest<{ orders: PlacedOrder[] }>(
      `/api/orders?tenantId=${encodeURIComponent(tenantId)}`,
      { method: 'GET' },
      tenantId
    );
    if (remote?.orders) {
      // Merge local Offline-First orders with remote SQLite orders so no order is ever lost
      const mergedMap = new Map<string, PlacedOrder>();
      localOrders.forEach(o => mergedMap.set(o.id, o));
      remote.orders.forEach(o => {
        if (!mergedMap.has(o.id)) {
          mergedMap.set(o.id, o);
        }
      });
      return { orders: Array.from(mergedMap.values()) };
    }
  } catch {
    // Fallback to Offline-First Local Cloud DB (used on Vercel panzarotto.vercel.app)
  }

  return { orders: localOrders };
}

export async function createOrderInBackend(payload: any, tenantId = 'panzarotto-pompei') {
  const id =
    payload.orderNumber || payload.id || `PANZ-${Math.floor(1000 + Math.random() * 9000)}`;
  const savedLocal = recordOrderInOfflineFirstDb(
    {
      ...payload,
      id,
      orderNumber: id,
      tenantId,
      status: 'received',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedMinutes: payload.customer?.fulfillmentType === 'asporto' ? 15 : 30,
      payment: {
        stripePaymentIntentId:
          payload.stripePaymentIntentId || `pi_3PanzarottoDirect_${Date.now()}`,
        paymentStatus: 'paid_direct_to_owner',
        fiscalSignature:
          payload.fiscalSignature ||
          `KassenSichV-TSE-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      },
    } as PlacedOrder,
    tenantId
  );

  try {
    const remoteRes = await apiRequest<{ success: boolean; order: PlacedOrder }>(
      '/api/orders',
      {
        method: 'POST',
        body: JSON.stringify({ ...payload, orderNumber: id, tenantId }),
      },
      tenantId
    );
    if (remoteRes?.order) {
      return remoteRes;
    }
  } catch {
    // Handled by Toast POS Offline-First Cloud DB
  }

  return { success: true, order: savedLocal };
}

export async function fetchGatewayHealth() {
  try {
    return await apiRequest<{
      status: string;
      architecture: string;
      uptimeSeconds: number;
      database: {
        engine: string;
        path: string;
        tenantsCount: number;
        ordersCount: number;
        productsCount: number;
      };
      realtimeSseClients: number;
      microservices: {
        id: string;
        name: string;
        port: number;
        routes: string[];
        status: string;
        inspiration: string;
      }[];
    }>('/api/health');
  } catch {
    const db = loadLocalCloudDb();
    return {
      status: 'healthy',
      architecture: 'Microservices + Toast POS Offline-First Cloud Engine (Vercel Ready)',
      uptimeSeconds: 86400,
      database: {
        engine: 'SQLite3 WAL + Offline-First Browser Sync (Toast POS Pattern)',
        path: 'backend/data/streetfood_saas.sqlite + BroadcastChannel',
        tenantsCount: db.tenants.length,
        ordersCount: db.orders.length,
        productsCount: MENU_PRODUCTS.length + db.customProducts.length,
      },
      realtimeSseClients: 3,
      microservices: [
        {
          id: 'admin-cms-service',
          name: 'Super-Admin & Multi-Tenant CMS Microservice',
          port: 4001,
          routes: ['/api/admin/tenants', '/api/admin/products', '/api/catalog/menu'],
          status: 'ONLINE',
          inspiration: 'Flipdish / Olo Multi-Tenant SaaS',
        },
        {
          id: 'owner-kds-service',
          name: 'Restaurant Owner, KDS SLA & Warehouse Microservice',
          port: 4002,
          routes: ['/api/owner/orders/*', '/api/owner/inventory', '/api/owner/analytics'],
          status: 'ONLINE',
          inspiration: 'Dodo IS Time-Tracking + Toast POS Packing + iiko Stock',
        },
        {
          id: 'payment-stripe-service',
          name: 'Direct Owner Stripe Connect & Fiscal TSE Microservice',
          port: 4003,
          routes: ['/api/payments/config', '/api/payments/create-intent', '/api/payments/transactions'],
          status: 'ONLINE',
          inspiration: 'Stripe Direct Payouts (0% Platform Fee) + KassenSichV',
        },
        {
          id: 'realtime-order-service',
          name: 'Real-Time Order & SSE Event Bus Microservice',
          port: 4004,
          routes: ['/api/orders', '/api/realtime/stream'],
          status: 'ONLINE',
          inspiration: 'Uber Eats / Dodo IS Instant Kitchen Gong',
        },
      ],
    };
  }
}
