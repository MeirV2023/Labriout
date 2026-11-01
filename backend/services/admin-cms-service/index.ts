import type { IncomingMessage, ServerResponse } from 'node:http';
import { db } from '../../database/db.ts';
import { getTenantId, readJsonBody, sendJson } from '../http-utils.ts';
import { realtimeBus } from '../event-bus.ts';

export function mapProductRow(row: any) {
  let availableExtras = [];
  try {
    availableExtras = JSON.parse(row.available_extras_json || '[]');
  } catch {
    availableExtras = [];
  }

  return {
    id: row.id,
    tenantId: row.tenant_id,
    category: row.category,
    subCategory: row.sub_category || 'tutti',
    name: row.name,
    nameEn: row.name_en || row.name,
    nameDe: row.name_de || row.name_en || row.name,
    nameFr: row.name_fr || row.name_en || row.name,
    nameRu: row.name_ru || row.name,
    description: row.description,
    descriptionEn: row.description_en || row.description,
    descriptionDe: row.description_de || row.description_en || row.description,
    descriptionFr: row.description_fr || row.description_en || row.description,
    descriptionRu: row.description_ru || row.description,
    ingredients: row.ingredients || '',
    weight: row.weight || '',
    price: Number(row.price),
    foodCost: Number(row.food_cost || 1.5),
    image: row.image,
    badge: row.badge || undefined,
    isSpicy: Boolean(row.is_spicy),
    isVegetarian: Boolean(row.is_vegetarian),
    isPopular: Boolean(row.is_popular),
    isAvailable: Boolean(row.is_available),
    prepTimeSec: Number(row.prep_time_sec || 300),
    availableExtras,
    updatedAt: row.updated_at,
  };
}

export async function handleAdminCmsService(
  req: IncomingMessage,
  res: ServerResponse,
  url: URL
): Promise<boolean> {
  const path = url.pathname;
  if (!path.startsWith('/api/admin') && !path.startsWith('/api/catalog')) {
    return false;
  }

  const tenantId = getTenantId(req, url);

  // 1. GET /api/catalog/menu -> Public Storefront & CMS Live Catalog Sync
  if (req.method === 'GET' && path === '/api/catalog/menu') {
    const tenant = db.prepare('SELECT * FROM tenants WHERE id = ?').get(tenantId) as any;
    const stripe = db
      .prepare('SELECT stripe_publishable_key, stripe_mode, is_connected, accept_card_online, accept_apple_google_pay, accept_cash, accept_satispay FROM tenant_stripe_configs WHERE tenant_id = ?')
      .get(tenantId) as any;
    const products = db
      .prepare('SELECT * FROM products WHERE tenant_id = ? ORDER BY sort_order ASC, updated_at DESC')
      .all(tenantId) as any[];
    const coupons = db
      .prepare('SELECT code, discount_percent, channel, is_active FROM coupons WHERE tenant_id = ? AND is_active = 1')
      .all(tenantId) as any[];

    sendJson(res, 200, {
      service: 'admin-cms-microservice',
      tenantId,
      tenant: tenant
        ? {
            id: tenant.id,
            slug: tenant.slug,
            name: tenant.name,
            country: tenant.country,
            city: tenant.city,
            address: tenant.address,
            phone: tenant.phone,
            currency: tenant.currency,
            currencySymbol: tenant.currency_symbol,
            deliveryFee: Number(tenant.delivery_fee),
            freeDeliveryThreshold: Number(tenant.free_delivery_threshold),
            asportoEstimatedMins: Number(tenant.asporto_estimated_mins),
            deliveryEstimatedMins: Number(tenant.delivery_estimated_mins),
            instagramHandle: tenant.instagram_handle,
            tiktokHandle: tenant.tiktok_handle,
            primaryColor: tenant.primary_color,
            isOpen: Boolean(tenant.is_open),
          }
        : null,
      stripePublic: stripe
        ? {
            publishableKey: stripe.stripe_publishable_key,
            mode: stripe.stripe_mode,
            isConnected: Boolean(stripe.is_connected),
            acceptCardOnline: Boolean(stripe.accept_card_online),
            acceptAppleGooglePay: Boolean(stripe.accept_apple_google_pay),
            acceptCash: Boolean(stripe.accept_cash),
            acceptSatispay: Boolean(stripe.accept_satispay),
          }
        : null,
      products: products.map(mapProductRow),
      coupons,
    });
    return true;
  }

  // 2. GET /api/admin/tenants -> Multi-Tenant SaaS Overview (All Global Restaurant Clients)
  if (req.method === 'GET' && path === '/api/admin/tenants') {
    const rows = db
      .prepare(
        `SELECT t.*,
                s.stripe_publishable_key,
                s.stripe_mode,
                s.is_connected as stripe_connected,
                s.direct_payout_iban_hint,
                (SELECT COUNT(*) FROM orders o WHERE o.tenant_id = t.id) as orders_count,
                (SELECT COALESCE(SUM(o.total), 0) FROM orders o WHERE o.tenant_id = t.id) as gross_gmv,
                (SELECT COUNT(*) FROM products p WHERE p.tenant_id = t.id) as products_count
         FROM tenants t
         LEFT JOIN tenant_stripe_configs s ON s.tenant_id = t.id
         ORDER BY t.created_at ASC`
      )
      .all() as any[];

    const totalMrrEur = rows.reduce((sum, r) => sum + Number(r.monthly_fee_eur || 0), 0);
    const totalGmvEur = rows.reduce((sum, r) => sum + Number(r.gross_gmv || 0), 0);

    sendJson(res, 200, {
      service: 'admin-cms-microservice',
      saasMetrics: {
        totalTenants: rows.length,
        activeSubscriptions: rows.filter(r => r.subscription_status === 'active').length,
        mrrEur: Number(totalMrrEur.toFixed(2)),
        arrEur: Number((totalMrrEur * 12).toFixed(2)),
        platformGmvEur: Number(totalGmvEur.toFixed(2)),
      },
      tenants: rows.map(r => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        country: r.country,
        city: r.city,
        address: r.address,
        phone: r.phone,
        currency: r.currency,
        currencySymbol: r.currency_symbol,
        subscriptionPlan: r.subscription_plan,
        monthlyFeeEur: Number(r.monthly_fee_eur),
        subscriptionStatus: r.subscription_status,
        deliveryFee: Number(r.delivery_fee),
        freeDeliveryThreshold: Number(r.free_delivery_threshold),
        asportoEstimatedMins: Number(r.asporto_estimated_mins),
        deliveryEstimatedMins: Number(r.delivery_estimated_mins),
        instagramHandle: r.instagram_handle || '',
        tiktokHandle: r.tiktok_handle || '',
        primaryColor: r.primary_color || '#ff5500',
        isOpen: Boolean(r.is_open),
        stripeConnected: Boolean(r.stripe_connected),
        stripeMode: r.stripe_mode || 'test',
        stripePublishableKey: r.stripe_publishable_key || '',
        directPayoutIbanHint: r.direct_payout_iban_hint || '',
        ordersCount: Number(r.orders_count || 0),
        grossGmv: Number(Number(r.gross_gmv || 0).toFixed(2)),
        productsCount: Number(r.products_count || 0),
        createdAt: r.created_at,
      })),
    });
    return true;
  }

  // 3. POST /api/admin/tenants -> Onboard a New Global Street-Food Restaurant Client (50-100€/mo SaaS)
  if (req.method === 'POST' && path === '/api/admin/tenants') {
    const body = await readJsonBody(req);
    const rawSlug = String(body.slug || body.name || `tenant-${Date.now()}`)
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '');
    const id = rawSlug || `tenant-${Date.now()}`;
    const nowIso = new Date().toISOString();

    db.prepare(`
      INSERT INTO tenants (
        id, slug, name, country, city, address, phone, currency, currency_symbol,
        subscription_plan, monthly_fee_eur, subscription_status,
        delivery_fee, free_delivery_threshold, asporto_estimated_mins, delivery_estimated_mins,
        instagram_handle, tiktok_handle, primary_color, logo_url, hero_banner_url, is_open, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      id,
      body.name || 'New Street Food Client',
      body.country || 'IT',
      body.city || 'Roma',
      body.address || 'Via del Corso 10',
      body.phone || '+39 06 1234567',
      body.currency || 'EUR',
      body.currencySymbol || '€',
      body.subscriptionPlan || 'PRO_89',
      Number(body.monthlyFeeEur || 89),
      'active',
      Number(body.deliveryFee ?? 2.5),
      Number(body.freeDeliveryThreshold ?? 20),
      15,
      30,
      body.instagramHandle || '@streetfood_official',
      body.tiktokHandle || '@streetfood_tiktok',
      body.primaryColor || '#ff5500',
      '/logo-custom.png',
      '/banner-hero-new.jpg',
      1,
      nowIso
    );

    db.prepare(`
      INSERT INTO tenant_stripe_configs (
        tenant_id, stripe_publishable_key, stripe_secret_key, stripe_webhook_secret,
        stripe_mode, is_connected, accept_card_online, accept_apple_google_pay,
        accept_cash, accept_satispay, direct_payout_iban_hint, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      body.stripePublishableKey || `pk_test_${id.replace(/-/g, '')}`,
      body.stripeSecretKey || `sk_test_${id.replace(/-/g, '')}`,
      `whsec_${id.replace(/-/g, '')}`,
      'test',
      1,
      1,
      1,
      1,
      1,
      body.directPayoutIbanHint || 'Direct Owner Bank Account via Stripe',
      nowIso
    );

    // Clone starter products from panzarotto-pompei so the new client immediately has a working template
    const templateProducts = db
      .prepare('SELECT * FROM products WHERE tenant_id = ?')
      .all('panzarotto-pompei') as any[];

    const insertClone = db.prepare(`
      INSERT INTO products (
        id, tenant_id, category, sub_category, name, name_en, name_de, name_fr, name_ru,
        description, description_en, description_ru, ingredients, weight,
        price, food_cost, image, badge, is_spicy, is_vegetarian, is_popular,
        is_available, prep_time_sec, available_extras_json, sort_order, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of templateProducts) {
      insertClone.run(
        p.id,
        id,
        p.category,
        p.sub_category,
        p.name,
        p.name_en,
        p.name_de,
        p.name_fr,
        p.name_ru,
        p.description,
        p.description_en,
        p.description_ru,
        p.ingredients,
        p.weight,
        p.price,
        p.food_cost,
        p.image,
        p.badge,
        p.is_spicy,
        p.is_vegetarian,
        p.is_popular,
        p.is_available,
        p.prep_time_sec,
        p.available_extras_json,
        p.sort_order,
        nowIso
      );
    }

    sendJson(res, 201, {
      success: true,
      service: 'admin-cms-microservice',
      tenantId: id,
    });
    return true;
  }

  // 4. PATCH /api/admin/tenants/:id -> Update tenant settings, subscription fee, delivery fee, etc.
  const tenantPatchMatch = path.match(/^\/api\/admin\/tenants\/([^/]+)$/);
  if (req.method === 'PATCH' && tenantPatchMatch) {
    const targetId = decodeURIComponent(tenantPatchMatch[1]);
    const body = await readJsonBody(req);

    const existing = db.prepare('SELECT * FROM tenants WHERE id = ?').get(targetId) as any;
    if (!existing) {
      sendJson(res, 404, { error: 'Tenant not found' });
      return true;
    }

    db.prepare(`
      UPDATE tenants
      SET name = ?,
          city = ?,
          country = ?,
          address = ?,
          phone = ?,
          monthly_fee_eur = ?,
          subscription_plan = ?,
          delivery_fee = ?,
          free_delivery_threshold = ?,
          instagram_handle = ?,
          tiktok_handle = ?,
          primary_color = ?,
          is_open = ?
      WHERE id = ?
    `).run(
      body.name ?? existing.name,
      body.city ?? existing.city,
      body.country ?? existing.country,
      body.address ?? existing.address,
      body.phone ?? existing.phone,
      body.monthlyFeeEur !== undefined ? Number(body.monthlyFeeEur) : existing.monthly_fee_eur,
      body.subscriptionPlan ?? existing.subscription_plan,
      body.deliveryFee !== undefined ? Number(body.deliveryFee) : existing.delivery_fee,
      body.freeDeliveryThreshold !== undefined
        ? Number(body.freeDeliveryThreshold)
        : existing.free_delivery_threshold,
      body.instagramHandle ?? existing.instagram_handle,
      body.tiktokHandle ?? existing.tiktok_handle,
      body.primaryColor ?? existing.primary_color,
      body.isOpen !== undefined ? (body.isOpen ? 1 : 0) : existing.is_open,
      targetId
    );

    realtimeBus.broadcast({
      type: 'MENU_UPDATED',
      tenantId: targetId,
      timestamp: Date.now(),
      data: { tenantUpdated: true },
    });

    sendJson(res, 200, {
      success: true,
      service: 'admin-cms-microservice',
      tenantId: targetId,
    });
    return true;
  }

  // 5. POST /api/admin/products -> Upsert Product (Update Price, Photo, Name, Modifiers, FoodCost, Availability)
  if (req.method === 'POST' && path === '/api/admin/products') {
    const body = await readJsonBody(req);
    const targetTenantId = body.tenantId || tenantId;
    const productId =
      body.id ||
      `prod-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;

    const existing = db
      .prepare('SELECT * FROM products WHERE tenant_id = ? AND id = ?')
      .get(targetTenantId, productId) as any;

    const nowIso = new Date().toISOString();
    const extrasJson = Array.isArray(body.availableExtras)
      ? JSON.stringify(body.availableExtras)
      : existing?.available_extras_json || '[]';

    if (existing) {
      db.prepare(`
        UPDATE products
        SET category = ?,
            sub_category = ?,
            name = ?,
            name_en = ?,
            name_ru = ?,
            description = ?,
            description_en = ?,
            description_ru = ?,
            ingredients = ?,
            weight = ?,
            price = ?,
            food_cost = ?,
            image = ?,
            badge = ?,
            is_spicy = ?,
            is_vegetarian = ?,
            is_popular = ?,
            is_available = ?,
            prep_time_sec = ?,
            available_extras_json = ?,
            updated_at = ?
        WHERE tenant_id = ? AND id = ?
      `).run(
        body.category ?? existing.category,
        body.subCategory ?? existing.sub_category,
        body.name ?? existing.name,
        body.nameEn ?? existing.name_en,
        body.nameRu ?? existing.name_ru,
        body.description ?? existing.description,
        body.descriptionEn ?? existing.description_en,
        body.descriptionRu ?? existing.description_ru,
        body.ingredients ?? existing.ingredients,
        body.weight ?? existing.weight,
        body.price !== undefined ? Number(body.price) : existing.price,
        body.foodCost !== undefined ? Number(body.foodCost) : existing.food_cost,
        body.image ?? existing.image,
        body.badge !== undefined ? body.badge : existing.badge,
        body.isSpicy !== undefined ? (body.isSpicy ? 1 : 0) : existing.is_spicy,
        body.isVegetarian !== undefined ? (body.isVegetarian ? 1 : 0) : existing.is_vegetarian,
        body.isPopular !== undefined ? (body.isPopular ? 1 : 0) : existing.is_popular,
        body.isAvailable !== undefined ? (body.isAvailable ? 1 : 0) : existing.is_available,
        body.prepTimeSec !== undefined ? Number(body.prepTimeSec) : existing.prep_time_sec,
        extrasJson,
        nowIso,
        targetTenantId,
        productId
      );
    } else {
      db.prepare(`
        INSERT INTO products (
          id, tenant_id, category, sub_category, name, name_en, name_de, name_fr, name_ru,
          description, description_en, description_ru, ingredients, weight,
          price, food_cost, image, badge, is_spicy, is_vegetarian, is_popular,
          is_available, prep_time_sec, available_extras_json, sort_order, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        productId,
        targetTenantId,
        body.category || 'friggitoria',
        body.subCategory || 'tutti',
        body.name || 'Nuovo Prodotto',
        body.nameEn || body.name || 'New Product',
        body.nameDe || body.name || 'Neues Produkt',
        body.nameFr || body.name || 'Nouveau Produit',
        body.nameRu || body.name || 'Новое блюдо',
        body.description || '',
        body.descriptionEn || body.description || '',
        body.descriptionRu || body.description || '',
        body.ingredients || '',
        body.weight || '200g',
        Number(body.price || 5.0),
        Number(body.foodCost || 1.5),
        body.image || 'https://www.edeka.de/uploads/rezepte/rez_edeka-panzerotti-rezept-i-p-1-1.jpg',
        body.badge || null,
        body.isSpicy ? 1 : 0,
        body.isVegetarian ? 1 : 0,
        body.isPopular ? 1 : 1,
        body.isAvailable !== false ? 1 : 0,
        Number(body.prepTimeSec || 300),
        extrasJson,
        99,
        nowIso
      );
    }

    const updatedRow = db
      .prepare('SELECT * FROM products WHERE tenant_id = ? AND id = ?')
      .get(targetTenantId, productId);
    const mapped = mapProductRow(updatedRow);

    realtimeBus.broadcast({
      type: 'MENU_UPDATED',
      tenantId: targetTenantId,
      timestamp: Date.now(),
      data: mapped,
    });

    sendJson(res, 200, {
      success: true,
      service: 'admin-cms-microservice',
      product: mapped,
    });
    return true;
  }

  // 6. DELETE /api/admin/products/:id -> Remove custom product
  const prodDelMatch = path.match(/^\/api\/admin\/products\/([^/]+)$/);
  if (req.method === 'DELETE' && prodDelMatch) {
    const productId = decodeURIComponent(prodDelMatch[1]);
    db.prepare('DELETE FROM products WHERE tenant_id = ? AND id = ?').run(tenantId, productId);

    realtimeBus.broadcast({
      type: 'MENU_UPDATED',
      tenantId,
      timestamp: Date.now(),
      data: { deletedProductId: productId },
    });

    sendJson(res, 200, { success: true, deletedId: productId });
    return true;
  }

  // 7. POST /api/admin/coupons -> Create Influencer / TikTok / Instagram Promo Code
  if (req.method === 'POST' && path === '/api/admin/coupons') {
    const body = await readJsonBody(req);
    const targetTenantId = body.tenantId || tenantId;
    const code = String(body.code || '').trim().toUpperCase();
    const discountPercent = Math.min(90, Math.max(1, Number(body.discountPercent || 10)));
    const channel = body.channel || 'Instagram / TikTok Reels';

    if (!code) {
      sendJson(res, 400, { error: 'Promo code is required' });
      return true;
    }

    db.prepare(`
      INSERT INTO coupons (code, tenant_id, discount_percent, channel, usage_count, revenue_generated, is_active)
      VALUES (?, ?, ?, ?, 0, 0, 1)
      ON CONFLICT(tenant_id, code) DO UPDATE SET
        discount_percent = excluded.discount_percent,
        channel = excluded.channel,
        is_active = 1
    `).run(code, targetTenantId, discountPercent, channel);

    sendJson(res, 201, {
      success: true,
      service: 'admin-cms-microservice',
      coupon: { code, tenantId: targetTenantId, discountPercent, channel },
    });
    return true;
  }

  return false;
}
