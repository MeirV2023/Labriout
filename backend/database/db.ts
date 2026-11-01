import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const DB_PATH = path.join(DATA_DIR, 'streetfood_saas.sqlite');

export const db = new DatabaseSync(DB_PATH);

// Enable WAL mode for high concurrency (real-time orders + KDS + admin reads/writes)
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    -- 1. Multi-Tenant Restaurants Table (Flipdish / SaaS Model)
    CREATE TABLE IF NOT EXISTS tenants (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT 'IT',
      city TEXT NOT NULL DEFAULT 'Pompei',
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      currency TEXT NOT NULL DEFAULT 'EUR',
      currency_symbol TEXT NOT NULL DEFAULT '€',
      subscription_plan TEXT NOT NULL DEFAULT 'PRO_89',
      monthly_fee_eur REAL NOT NULL DEFAULT 89.0,
      subscription_status TEXT NOT NULL DEFAULT 'active',
      delivery_fee REAL NOT NULL DEFAULT 2.50,
      free_delivery_threshold REAL NOT NULL DEFAULT 20.00,
      asporto_estimated_mins INTEGER NOT NULL DEFAULT 15,
      delivery_estimated_mins INTEGER NOT NULL DEFAULT 30,
      instagram_handle TEXT,
      tiktok_handle TEXT,
      primary_color TEXT NOT NULL DEFAULT '#ff5500',
      logo_url TEXT,
      hero_banner_url TEXT,
      is_open INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    -- 2. Tenant Stripe Direct Payout Configuration (Payment Microservice)
    CREATE TABLE IF NOT EXISTS tenant_stripe_configs (
      tenant_id TEXT PRIMARY KEY REFERENCES tenants(id) ON DELETE CASCADE,
      stripe_publishable_key TEXT NOT NULL DEFAULT '',
      stripe_secret_key TEXT NOT NULL DEFAULT '',
      stripe_webhook_secret TEXT NOT NULL DEFAULT '',
      stripe_mode TEXT NOT NULL DEFAULT 'test', -- 'test' | 'live'
      is_connected INTEGER NOT NULL DEFAULT 0,
      accept_card_online INTEGER NOT NULL DEFAULT 1,
      accept_apple_google_pay INTEGER NOT NULL DEFAULT 1,
      accept_cash INTEGER NOT NULL DEFAULT 1,
      accept_satispay INTEGER NOT NULL DEFAULT 1,
      direct_payout_iban_hint TEXT DEFAULT '',
      updated_at TEXT NOT NULL
    );

    -- 3. Menu Products Table (Catalog & Remote CMS Microservice)
    CREATE TABLE IF NOT EXISTS products (
      id TEXT NOT NULL,
      tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      sub_category TEXT DEFAULT 'tutti',
      name TEXT NOT NULL,
      name_en TEXT,
      name_de TEXT,
      name_fr TEXT,
      name_ru TEXT,
      description TEXT NOT NULL,
      description_en TEXT,
      description_de TEXT,
      description_fr TEXT,
      description_ru TEXT,
      ingredients TEXT,
      weight TEXT,
      price REAL NOT NULL,
      food_cost REAL NOT NULL DEFAULT 1.80,
      image TEXT NOT NULL,
      badge TEXT,
      is_spicy INTEGER NOT NULL DEFAULT 0,
      is_vegetarian INTEGER NOT NULL DEFAULT 0,
      is_popular INTEGER NOT NULL DEFAULT 0,
      is_available INTEGER NOT NULL DEFAULT 1,
      prep_time_sec INTEGER NOT NULL DEFAULT 360,
      available_extras_json TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (tenant_id, id)
    );

    -- 4. Ingredients & Packaging Inventory (iiko / Lightspeed Stock Control)
    CREATE TABLE IF NOT EXISTS inventory_items (
      id TEXT NOT NULL,
      tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      category TEXT NOT NULL, -- 'dough' | 'cheese' | 'meat' | 'oil' | 'packaging' | 'sauce'
      unit TEXT NOT NULL, -- 'kg' | 'l' | 'pcs' | 'portions'
      current_stock REAL NOT NULL,
      min_threshold REAL NOT NULL,
      cost_per_unit REAL NOT NULL,
      consume_per_order REAL NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (tenant_id, id)
    );

    -- 5. Orders Table with Dodo IS Time Tracking & Toast POS Packing Checklist
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      order_number TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      fulfillment_type TEXT NOT NULL, -- 'asporto' | 'consegna' | 'prenota'
      delivery_address TEXT,
      delivery_city TEXT,
      postal_code TEXT,
      time_slot TEXT NOT NULL,
      payment_method TEXT NOT NULL, -- 'card' | 'apple_pay' | 'cash' | 'satispay'
      payment_status TEXT NOT NULL DEFAULT 'paid', -- 'pending' | 'paid' | 'failed' | 'refunded'
      stripe_payment_intent_id TEXT,
      fiscal_signature TEXT, -- European KassenSichV / Fiscal hash
      notes TEXT,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      delivery_fee REAL NOT NULL,
      discount_amount REAL NOT NULL,
      coupon_code TEXT,
      total REAL NOT NULL,
      estimated_food_cost REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'received', -- 'received' | 'preparing' | 'frying' | 'packing' | 'ready' | 'delivering' | 'completed' | 'cancelled'
      estimated_minutes INTEGER NOT NULL DEFAULT 20,
      packing_checklist_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      received_at INTEGER NOT NULL,
      preparing_at INTEGER,
      frying_at INTEGER,
      packing_at INTEGER,
      ready_at INTEGER,
      completed_at INTEGER,
      prep_duration_sec INTEGER DEFAULT 0
    );

    -- 6. Coupons / Influencer Promo Codes (TikTok / Reels Traffic Tracking)
    CREATE TABLE IF NOT EXISTS coupons (
      code TEXT NOT NULL,
      tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      discount_percent INTEGER NOT NULL,
      channel TEXT NOT NULL DEFAULT 'Instagram / TikTok',
      usage_count INTEGER NOT NULL DEFAULT 0,
      revenue_generated REAL NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      PRIMARY KEY (tenant_id, code)
    );
  `);

  seedInitialDataIfNeeded();
}

const DEFAULT_EXTRAS_FRITTI = [
  { id: 'ex-provola', name: 'Extra Provola Affumicata', nameRu: 'Доп. копченая провола', price: 1.0 },
  { id: 'ex-crudo', name: 'Prosciutto Crudo di Parma', nameRu: 'Пармская ветчина прошутто', price: 1.5 },
  { id: 'ex-piccante', name: 'Salame Piccante Napoletano', nameRu: 'Острая неаполитанская салями', price: 1.0 },
  { id: 'ex-salsa-cheddar', name: 'Salsa Cheddar Calda', nameRu: 'Горячий сырный соус Чеддер', price: 1.0 },
];

const DEFAULT_EXTRAS_PANINI = [
  { id: 'ex-doppio-burger', name: 'Doppio Hamburger Chianina (+180g)', nameRu: 'Двойная котлета Кьянина (+180г)', price: 3.5 },
  { id: 'ex-bacon', name: 'Bacon Croccante Affumicato', nameRu: 'Хрустящий копченый бекон', price: 1.5 },
  { id: 'ex-friarielli', name: 'Friarielli Napoletani Saltati', nameRu: 'Неаполитанские фриариелли', price: 1.5 },
  { id: 'ex-patatine-dentro', name: 'Patatine Fritte nel Panino', nameRu: 'Картофель фри внутрь панино', price: 1.0 },
];

function seedInitialDataIfNeeded() {
  const countRow = db.prepare('SELECT COUNT(*) as cnt FROM tenants').get() as { cnt: number };
  if (countRow.cnt > 0) return;

  const nowIso = new Date().toISOString();

  // 1. Seed Tenants (Main Panzarotto Pompei + 2 global SaaS clients to showcase Multi-Tenant Admin)
  const insertTenant = db.prepare(`
    INSERT INTO tenants (
      id, slug, name, country, city, address, phone, currency, currency_symbol,
      subscription_plan, monthly_fee_eur, subscription_status,
      delivery_fee, free_delivery_threshold, asporto_estimated_mins, delivery_estimated_mins,
      instagram_handle, tiktok_handle, primary_color, logo_url, hero_banner_url, is_open, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertTenant.run(
    'panzarotto-pompei',
    'panzarotto-pompei',
    'Panzarotto Street Food — Pompei',
    'IT',
    'Pompei (NA)',
    'Via Provinciale Ripuaria, 133, 80045 Pompei NA',
    '+39 081 850 6177',
    'EUR',
    '€',
    'PRO_89',
    89.0,
    'active',
    2.5,
    20.0,
    15,
    30,
    '@panzarotto_pompei',
    '@panzarottopompei',
    '#ff5500',
    '/logo-custom.png',
    '/banner-hero-new.jpg',
    1,
    nowIso
  );

  insertTenant.run(
    'berlin-kebab-haus',
    'berlin-kebab-haus',
    'Mustafa Craft Döner — Berlin',
    'DE',
    'Berlin',
    'Mehringdamm 32, 10961 Berlin, Germany',
    '+49 30 2589 4410',
    'EUR',
    '€',
    'GROWTH_99',
    99.0,
    'active',
    3.0,
    25.0,
    12,
    28,
    '@mustafacraft_berlin',
    '@berlin.doner.craft',
    '#e11d48',
    '/logo-custom.png',
    '/banner-hero-new.jpg',
    1,
    nowIso
  );

  insertTenant.run(
    'napoli-fritti-milano',
    'napoli-fritti-milano',
    'Spaccanapoli Fritti — Milano Navigli',
    'IT',
    'Milano (MI)',
    'Ripa di Porta Ticinese, 47, 20143 Milano MI',
    '+39 02 9415 8821',
    'EUR',
    '€',
    'STARTER_59',
    59.0,
    'active',
    2.9,
    22.0,
    15,
    32,
    '@spaccanapoli_milano',
    '@spaccanapolifritti',
    '#f97316',
    '/logo-custom.png',
    '/banner-hero-new.jpg',
    1,
    nowIso
  );

  // 2. Seed Tenant Stripe Configs
  const insertStripe = db.prepare(`
    INSERT INTO tenant_stripe_configs (
      tenant_id, stripe_publishable_key, stripe_secret_key, stripe_webhook_secret,
      stripe_mode, is_connected, accept_card_online, accept_apple_google_pay,
      accept_cash, accept_satispay, direct_payout_iban_hint, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertStripe.run(
    'panzarotto-pompei',
    'pk_test_51PanzarottoPompeiDirectStripeKey99',
    'sk_test_51PanzarottoPompeiSecretDirectKey99',
    'whsec_panzarotto_pompei_live_webhook',
    'test',
    1,
    1,
    1,
    1,
    1,
    'IT60 X054 2811 1010 0000 0123 456 (Intesa Sanpaolo — Pompei)',
    nowIso
  );

  insertStripe.run(
    'berlin-kebab-haus',
    'pk_test_51BerlinDonerCraftDirectKey88',
    'sk_test_51BerlinDonerCraftSecretKey88',
    'whsec_berlin_doner_webhook',
    'live',
    1,
    1,
    1,
    1,
    0,
    'DE89 3704 0044 0532 0130 00 (N26 Bank — Berlin)',
    nowIso
  );

  insertStripe.run(
    'napoli-fritti-milano',
    'pk_test_51MilanoFrittiDirectKey77',
    'sk_test_51MilanoFrittiSecretKey77',
    'whsec_milano_fritti_webhook',
    'test',
    1,
    1,
    1,
    1,
    1,
    'IT88 Q030 6909 6061 0000 0098 765 (UniCredit — Milano)',
    nowIso
  );

  // 3. Seed Core Products for Panzarotto Street Food Pompei
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, tenant_id, category, sub_category, name, name_en, name_de, name_fr, name_ru,
      description, description_en, description_ru, ingredients, weight,
      price, food_cost, image, badge, is_spicy, is_vegetarian, is_popular,
      is_available, prep_time_sec, available_extras_json, sort_order, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const seedProducts = [
    {
      id: 'fr-panzarotto-special',
      category: 'friggitoria',
      subCategory: 'panzarotto',
      name: 'Panzarotto di Patate Special',
      nameEn: 'Special Potato Crocchè (Panzarotto)',
      nameRu: 'Панцаротто (Крокке) из картофеля Special',
      description: 'Il nostro celebre panzarotto gigante di patate fresche, cuore filante di provola affumicata di Agerola, prosciutto cotto scelto, salame napoletano e pepe nero.',
      descriptionEn: 'Our famous giant fresh potato croquette with smoked Agerola provola cheese, cooked ham, Neapolitan salami and black pepper.',
      descriptionRu: 'Наш легендарный гигантский картофельный панцаротто со свежей копченой проволой из Аджеролы, ветчиной, неаполитанской салями и черным перцем.',
      ingredients: 'Patate fresche, provola di Agerola, prosciutto cotto, salame, parmigiano, panatura dorata',
      weight: '220g',
      price: 2.50,
      foodCost: 0.68,
      image: 'https://www.edeka.de/uploads/rezepte/rez_edeka-panzerotti-rezept-i-p-1-1.jpg',
      badge: 'PIÙ AMATO',
      isSpicy: 0,
      isVegetarian: 0,
      isPopular: 1,
      prepTimeSec: 240,
      extras: DEFAULT_EXTRAS_FRITTI,
    },
    {
      id: 'fr-arancino-ragu',
      category: 'friggitoria',
      subCategory: 'arancini',
      name: 'Arancino Rosso al Ragù Napoletano',
      nameEn: 'Neapolitan Ragù Arancino',
      nameRu: 'Красный Аранчино с неаполитанским рагу',
      description: 'Riso carnaroli mantecato al ragù lento della tradizione, ripieno di macinato scelto, piselli dolci e cuore di fior di latte.',
      descriptionEn: 'Carnaroli rice slow-cooked in Neapolitan ragù, stuffed with seasoned beef, sweet peas and fior di latte mozzarella.',
      descriptionRu: 'Рис карнароли в традиционном томленом рагу с начинкой из отборного фарша, зеленого горошка и моцареллы фьор-ди-латте.',
      ingredients: 'Riso Carnaroli, ragù napoletano, carne macinata, piselli, fior di latte',
      weight: '240g',
      price: 2.50,
      foodCost: 0.72,
      image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?auto=format&fit=crop&w=600&q=80',
      badge: 'SPECIALE',
      isSpicy: 0,
      isVegetarian: 0,
      isPopular: 1,
      prepTimeSec: 260,
      extras: DEFAULT_EXTRAS_FRITTI,
    },
    {
      id: 'fr-frittatina-pasta',
      category: 'friggitoria',
      subCategory: 'arancini',
      name: 'Frittatina di Pasta Classica Napoletana',
      nameEn: 'Classic Neapolitan Pasta Frittatina',
      nameRu: 'Классическая неаполитанская Фриттатина из пасты',
      description: 'Bucatini di Gragnano IGP con besciamella vellutata, macinato di carne, piselli, provola filante e crosticina ultra croccante.',
      descriptionEn: 'Gragnano IGP bucatini pasta with velvety béchamel, minced meat, peas, melted provola and ultra-crispy crust.',
      descriptionRu: 'Паста букатини из Граньяно IGP с бархатистым соусом бешамель, мясным фаршем, горошком, тягучей проволой и хрустящей корочкой.',
      ingredients: 'Bucatini di Gragnano, besciamella, provola, carne macinata, piselli',
      weight: '200g',
      price: 2.50,
      foodCost: 0.65,
      image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80',
      badge: 'CONSIGLIATO',
      isSpicy: 0,
      isVegetarian: 0,
      isPopular: 1,
      prepTimeSec: 240,
      extras: DEFAULT_EXTRAS_FRITTI,
    },
    {
      id: 'pan-pompei-king',
      category: 'panini',
      subCategory: 'hamburger',
      name: 'Panino Pompei Burger & Provola',
      nameEn: 'Pompei Burger & Smoked Provola Panino',
      nameRu: 'Панино Помпеи Бургер и копченая Провола',
      description: 'Sfilatino caldo croccante con hamburger di scottona 200g sulla piastra, provola affumicata, bacon croccante, patatine fritte e salsa Panzarotto.',
      descriptionEn: 'Warm crispy baguette with 200g grilled scottona beef patty, smoked provola, crispy bacon, french fries and signature Panzarotto sauce.',
      descriptionRu: 'Горячий хрустящий багет с говяжьей котлетой скоттона 200г на гриле, копченой проволой, беконом, картофелем фри и фирменным соусом.',
      ingredients: 'Pane artigianale, hamburger scottona 200g, provola, bacon, patatine, salsa',
      weight: '420g',
      price: 8.50,
      foodCost: 2.65,
      image: 'https://recipesblob.oetker.de/assets/7e4a3efbf228408090ab65d8ed246123/1272x764/panini-brote-qf-hero-8454.webp',
      badge: 'PIÙ AMATO',
      isSpicy: 0,
      isVegetarian: 0,
      isPopular: 1,
      prepTimeSec: 420,
      extras: DEFAULT_EXTRAS_PANINI,
    },
    {
      id: 'pan-salsiccia-friarielli',
      category: 'panini',
      subCategory: 'salsiccia',
      name: 'Panino Salsiccia a Punta di Coltello & Friarielli',
      nameEn: 'Neapolitan Sausage & Friarielli Panino',
      nameRu: 'Панино с неаполитанской сальсиччей и фриариелли',
      description: 'Il re dello street food campano: doppia salsiccia paesana alla piastra, friarielli saltati con aglio e peperoncino e provola affumicata.',
      descriptionEn: 'The king of Campania street food: double grilled artisan sausage, sautéed friarielli greens with garlic & chili, and smoked provola.',
      descriptionRu: 'Король уличной еды Кампании: двойная фермерская колбаска сальсичча на гриле, обжаренные фриариелли с чесноком и чили и копченая провола.',
      ingredients: 'Salsiccia paesana, friarielli napoletani, provola affumicata, peperoncino',
      weight: '400g',
      price: 8.00,
      foodCost: 2.40,
      image: 'https://www.southernliving.com/thmb/NxEWuzQ3nuFkReiW9Grc8k6YsVs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chicken-fontina-panini_2728_beauty_196-6a6cea44c0404f7f95133c719527bb38.jpg',
      badge: 'SPECIALE',
      isSpicy: 1,
      isVegetarian: 0,
      isPopular: 1,
      prepTimeSec: 420,
      extras: DEFAULT_EXTRAS_PANINI,
    },
    {
      id: 'gir-pollo-intero',
      category: 'girarrosto',
      subCategory: 'pollo',
      name: 'Pollo Allo Spiedo Intero + Patate al Forno',
      nameEn: 'Whole Rotisserie Chicken + Roasted Potatoes',
      nameRu: 'Целый цыпленок на вертеле + запеченный картофель',
      description: 'Pollo ruspante cotto lentamente al girarrosto con erbe mediterranee, servito con abbondante porzione di patate al forno dorate.',
      descriptionEn: 'Free-range chicken slowly roasted on the spit with Mediterranean herbs, served with a generous portion of golden roasted potatoes.',
      descriptionRu: 'Фермерский цыпленок, медленно запеченный на вертеле со средиземноморскими травами, подается с большой порцией золотистого картофеля.',
      ingredients: 'Pollo ruspante 1.2kg, rosmarino, salvia, patate al forno, spezie',
      weight: '1150g',
      price: 13.00,
      foodCost: 4.20,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkserDQvSX99zP9TiSpdD17iVxZvx76PexHEmF155AYqz_qLxC4MM2B8M&s=10',
      badge: 'PIÙ AMATO',
      isSpicy: 0,
      isVegetarian: 0,
      isPopular: 1,
      prepTimeSec: 300,
      extras: DEFAULT_EXTRAS_FRITTI,
    },
    {
      id: 'pat-super-cheddar-bacon',
      category: 'patate',
      subCategory: 'farcite',
      name: 'Vaschetta Maxi Patate Cheddar & Bacon',
      nameEn: 'Maxi Loaded Fries with Cheddar & Crispy Bacon',
      nameRu: 'Макси-бокс картофеля фри с Чеддером и беконом',
      description: 'Maxi porzione di patatine fritte croccanti ricoperte da colata di formaggio Cheddar fuso e dadini di bacon affumicato.',
      descriptionEn: 'Maxi box of crispy French fries topped with warm melted Cheddar cheese sauce and smoked crispy bacon bits.',
      descriptionRu: 'Большая порция хрустящего картофеля фри под горячим расплавленным сыром Чеддер с кусочками копченого бекона.',
      ingredients: 'Patate fritte, salsa cheddar calda, bacon croccante',
      weight: '350g',
      price: 5.00,
      foodCost: 1.25,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
      badge: 'NOVITÀ',
      isSpicy: 0,
      isVegetarian: 0,
      isPopular: 1,
      prepTimeSec: 210,
      extras: DEFAULT_EXTRAS_FRITTI,
    },
    {
      id: 'bev-coca-33',
      category: 'bevande',
      subCategory: 'soft_drinks',
      name: 'Coca-Cola Original Lattina 33cl',
      nameEn: 'Coca-Cola Classic Can 330ml',
      nameRu: 'Coca-Cola классическая ж/б 330 мл',
      description: 'Servita ghiacciata, perfetta con panzarotti e panini caldi.',
      descriptionEn: 'Served ice-cold, perfect with hot panzarotti and panini.',
      descriptionRu: 'Подается ледяной — идеально к горячим панцаротто и панини.',
      ingredients: 'Bevanda analcolica frizzante',
      weight: '330ml',
      price: 2.00,
      foodCost: 0.55,
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
      badge: '',
      isSpicy: 0,
      isVegetarian: 1,
      isPopular: 1,
      prepTimeSec: 30,
      extras: [],
    },
  ];

  seedProducts.forEach((p, idx) => {
    insertProduct.run(
      p.id,
      'panzarotto-pompei',
      p.category,
      p.subCategory,
      p.name,
      p.nameEn,
      p.nameEn,
      p.nameEn,
      p.nameRu,
      p.description,
      p.descriptionEn,
      p.descriptionRu,
      p.ingredients,
      p.weight,
      p.price,
      p.foodCost,
      p.image,
      p.badge || null,
      p.isSpicy,
      p.isVegetarian,
      p.isPopular,
      1,
      p.prepTimeSec,
      JSON.stringify(p.extras),
      idx + 1,
      nowIso
    );
  });

  // 4. Seed Inventory (iiko / Lightspeed Kitchen Stock)
  const insertInventory = db.prepare(`
    INSERT INTO inventory_items (
      id, tenant_id, name, category, unit, current_stock, min_threshold, cost_per_unit, consume_per_order, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const inventoryList = [
    ['inv-potato-mash', 'panzarotto-pompei', 'Impasto Patate Fresche (Panzarotto)', 'dough', 'kg', 38.5, 10.0, 1.40, 0.35, nowIso],
    ['inv-provola', 'panzarotto-pompei', 'Provola Affumicata di Agerola DOP', 'cheese', 'kg', 14.2, 5.0, 8.90, 0.15, nowIso],
    ['inv-scottona', 'panzarotto-pompei', 'Hamburger Scottona 200g Freschi', 'meat', 'pcs', 64, 20, 1.75, 1, nowIso],
    ['inv-salsiccia', 'panzarotto-pompei', 'Salsiccia Paesana a Punta di Coltello', 'meat', 'pcs', 48, 15, 1.30, 1, nowIso],
    ['inv-fry-oil', 'panzarotto-pompei', 'Olio Alto Oleico Friggitoria Professionale', 'oil', 'l', 42.0, 15.0, 2.60, 0.08, nowIso],
    ['inv-thermal-bags', 'panzarotto-pompei', 'Sacchetti Termici Anti-Condensa + Sigilli', 'packaging', 'pcs', 210, 50, 0.18, 1, nowIso],
    ['inv-napkins-kit', 'panzarotto-pompei', 'Kit Tovaglioli + Salviettine Limone', 'packaging', 'pcs', 340, 80, 0.07, 1, nowIso],
  ];

  for (const row of inventoryList) {
    insertInventory.run(...row);
  }

  // 5. Seed Influencer Coupons (TikTok / Instagram Reels traffic)
  const insertCoupon = db.prepare(`
    INSERT INTO coupons (code, tenant_id, discount_percent, channel, usage_count, revenue_generated, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertCoupon.run('POMPEI10', 'panzarotto-pompei', 10, 'Instagram Bio Link', 47, 1142.50, 1);
  insertCoupon.run('PANZAROTTO10', 'panzarotto-pompei', 10, 'Google Maps & Flyers', 29, 680.00, 1);
  insertCoupon.run('TIKTOK15', 'panzarotto-pompei', 15, 'TikTok Viral Reels', 84, 2190.80, 1);
  insertCoupon.run('WELCOME', 'panzarotto-pompei', 15, 'First Website Order', 63, 1510.20, 1);

  // 6. Seed Realistic Live Orders for KDS & Packing Screen Demo
  const nowMs = Date.now();
  const insertOrder = db.prepare(`
    INSERT INTO orders (
      id, tenant_id, order_number, customer_name, customer_phone, customer_email,
      fulfillment_type, delivery_address, delivery_city, postal_code, time_slot,
      payment_method, payment_status, stripe_payment_intent_id, fiscal_signature, notes,
      items_json, subtotal, delivery_fee, discount_amount, coupon_code, total,
      estimated_food_cost, status, estimated_minutes, packing_checklist_json,
      created_at, received_at, preparing_at, frying_at, packing_at, ready_at, completed_at, prep_duration_sec
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleOrders = [
    {
      id: 'ord-live-101',
      orderNumber: 'PANZ-4821',
      customerName: 'Marco Esposito',
      customerPhone: '+39 338 912 4401',
      customerEmail: 'marco.esposito@gmail.com',
      fulfillmentType: 'consegna',
      deliveryAddress: 'Via Roma 68, int. 4, Pompei',
      deliveryCity: 'Pompei',
      postalCode: '80045',
      timeSlot: 'Il prima possibile (~25–35 min)',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      stripePi: 'pi_3Q9PanzarottoLive8821',
      notes: 'Citofono Esposito | Salsa cheddar ben calda',
      items: [
        {
          cartItemId: 'item-1',
          productId: 'fr-panzarotto-special',
          name: 'Panzarotto di Patate Special',
          quantity: 3,
          unitPrice: 3.50,
          selectedExtras: [{ id: 'ex-salsa-cheddar', name: 'Salsa Cheddar Calda', price: 1.0 }],
          specialNotes: 'Ben dorati',
        },
        {
          cartItemId: 'item-2',
          productId: 'pan-pompei-king',
          name: 'Panino Pompei Burger & Provola',
          quantity: 2,
          unitPrice: 10.00,
          selectedExtras: [{ id: 'ex-bacon', name: 'Bacon Croccante Affumicato', price: 1.5 }],
          specialNotes: 'Senza cipolla',
        },
        {
          cartItemId: 'item-3',
          productId: 'bev-coca-33',
          name: 'Coca-Cola Original Lattina 33cl',
          quantity: 2,
          unitPrice: 2.00,
          selectedExtras: [],
          specialNotes: '',
        },
      ],
      subtotal: 34.50,
      deliveryFee: 0,
      discountAmount: 0,
      couponCode: null,
      total: 34.50,
      foodCost: 8.85,
      status: 'frying',
      estimatedMinutes: 25,
      receivedAt: nowMs - 6 * 60 * 1000,
      preparingAt: nowMs - 5 * 60 * 1000,
      fryingAt: nowMs - 2 * 60 * 1000,
      packingAt: null,
      readyAt: null,
      completedAt: null,
      prepDurationSec: 360,
      checklist: {
        itemsChecked: { 'item-1': true, 'item-2': false, 'item-3': true },
        napkinsIncluded: true,
        saucesVerified: false,
        thermalBagSealed: false,
        receiptAttached: false,
        packedBy: 'Luigi (Cucina)',
      },
    },
    {
      id: 'ord-live-102',
      orderNumber: 'PANZ-4822',
      customerName: 'Giulia Sorrentino',
      customerPhone: '+39 347 551 0923',
      customerEmail: 'giulia.sorrentino@icloud.com',
      fulfillmentType: 'asporto',
      deliveryAddress: null,
      deliveryCity: 'Pompei',
      postalCode: '80045',
      timeSlot: 'Ritiro in 15 min',
      paymentMethod: 'apple_pay',
      paymentStatus: 'paid',
      stripePi: 'pi_3Q9PanzarottoApplePay8822',
      notes: 'Arrivo tra 10 minuti in auto',
      items: [
        {
          cartItemId: 'item-201',
          productId: 'gir-pollo-intero',
          name: 'Pollo Allo Spiedo Intero + Patate al Forno',
          quantity: 1,
          unitPrice: 13.00,
          selectedExtras: [],
          specialNotes: 'Tagliato in 4 pezzi',
        },
        {
          cartItemId: 'item-202',
          productId: 'fr-arancino-ragu',
          name: 'Arancino Rosso al Ragù Napoletano',
          quantity: 2,
          unitPrice: 2.50,
          selectedExtras: [],
          specialNotes: '',
        },
      ],
      subtotal: 18.00,
      deliveryFee: 0,
      discountAmount: 2.70,
      couponCode: 'TIKTOK15',
      total: 15.30,
      foodCost: 5.64,
      status: 'packing',
      estimatedMinutes: 15,
      receivedAt: nowMs - 9 * 60 * 1000,
      preparingAt: nowMs - 8 * 60 * 1000,
      fryingAt: nowMs - 5 * 60 * 1000,
      packingAt: nowMs - 1 * 60 * 1000,
      readyAt: null,
      completedAt: null,
      prepDurationSec: 540,
      checklist: {
        itemsChecked: { 'item-201': true, 'item-202': true },
        napkinsIncluded: true,
        saucesVerified: true,
        thermalBagSealed: false,
        receiptAttached: true,
        packedBy: 'Sofia (Banco)',
      },
    },
    {
      id: 'ord-live-103',
      orderNumber: 'PANZ-4823',
      customerName: 'Alessandro De Luca',
      customerPhone: '+39 329 440 1188',
      customerEmail: 'aledeluca@outlook.it',
      fulfillmentType: 'consegna',
      deliveryAddress: 'Via Plinio 112, Pompei',
      deliveryCity: 'Pompei',
      postalCode: '80045',
      timeSlot: 'Il prima possibile (~25–35 min)',
      paymentMethod: 'card',
      paymentStatus: 'paid',
      stripePi: 'pi_3Q9PanzarottoLive8823',
      notes: 'Non suonare al citofono, chiamare al cellulare',
      items: [
        {
          cartItemId: 'item-301',
          productId: 'pan-salsiccia-friarielli',
          name: 'Panino Salsiccia a Punta di Coltello & Friarielli',
          quantity: 2,
          unitPrice: 9.00,
          selectedExtras: [{ id: 'ex-patatine-dentro', name: 'Patatine Fritte nel Panino', price: 1.0 }],
          specialNotes: 'Piccante',
        },
        {
          cartItemId: 'item-302',
          productId: 'pat-super-cheddar-bacon',
          name: 'Vaschetta Maxi Patate Cheddar & Bacon',
          quantity: 1,
          unitPrice: 5.00,
          selectedExtras: [],
          specialNotes: '',
        },
      ],
      subtotal: 23.00,
      deliveryFee: 0,
      discountAmount: 0,
      couponCode: null,
      total: 23.00,
      foodCost: 6.05,
      status: 'received',
      estimatedMinutes: 30,
      receivedAt: nowMs - 45 * 1000,
      preparingAt: null,
      fryingAt: null,
      packingAt: null,
      readyAt: null,
      completedAt: null,
      prepDurationSec: 45,
      checklist: {
        itemsChecked: { 'item-301': false, 'item-302': false },
        napkinsIncluded: false,
        saucesVerified: false,
        thermalBagSealed: false,
        receiptAttached: false,
        packedBy: '',
      },
    },
  ];

  for (const o of sampleOrders) {
    const fiscalSig = crypto
      .createHash('sha256')
      .update(`${o.orderNumber}:${o.total}:${o.receivedAt}`)
      .digest('hex')
      .slice(0, 16)
      .toUpperCase();

    insertOrder.run(
      o.id,
      'panzarotto-pompei',
      o.orderNumber,
      o.customerName,
      o.customerPhone,
      o.customerEmail,
      o.fulfillmentType,
      o.deliveryAddress,
      o.deliveryCity,
      o.postalCode,
      o.timeSlot,
      o.paymentMethod,
      o.paymentStatus,
      o.stripePi,
      `KASSEN-SIG-${fiscalSig}`,
      o.notes,
      JSON.stringify(o.items),
      o.subtotal,
      o.deliveryFee,
      o.discountAmount,
      o.couponCode,
      o.total,
      o.foodCost,
      o.status,
      o.estimatedMinutes,
      JSON.stringify(o.checklist),
      new Date(o.receivedAt).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      o.receivedAt,
      o.preparingAt,
      o.fryingAt,
      o.packingAt,
      o.readyAt,
      o.completedAt,
      o.prepDurationSec
    );
  }
}
