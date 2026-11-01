import type { IncomingMessage, ServerResponse } from 'node:http';
import crypto from 'node:crypto';
import { db } from '../../database/db.ts';
import { getTenantId, readJsonBody, sendJson, setCorsHeaders } from '../http-utils.ts';
import { realtimeBus } from '../event-bus.ts';

export function mapOrderRow(row: any) {
  let items = [];
  let packingChecklist = {
    itemsChecked: {} as Record<string, boolean>,
    napkinsIncluded: false,
    saucesVerified: false,
    thermalBagSealed: false,
    receiptAttached: false,
    packedBy: '',
  };

  try {
    items = JSON.parse(row.items_json || '[]');
  } catch {
    items = [];
  }

  try {
    packingChecklist = {
      ...packingChecklist,
      ...JSON.parse(row.packing_checklist_json || '{}'),
    };
  } catch {
    // keep default
  }

  const nowMs = Date.now();
  const receivedAt = Number(row.received_at || nowMs);
  const completedAt = row.completed_at ? Number(row.completed_at) : null;
  const elapsedSeconds = completedAt
    ? Math.max(1, Math.round((completedAt - receivedAt) / 1000))
    : Math.max(1, Math.round((nowMs - receivedAt) / 1000));

  return {
    id: row.order_number || row.id,
    dbId: row.id,
    tenantId: row.tenant_id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    customer: {
      name: row.customer_name,
      phone: row.customer_phone,
      email: row.customer_email || undefined,
      fulfillmentType: row.fulfillment_type,
      deliveryAddress: row.delivery_address || undefined,
      deliveryCity: row.delivery_city || undefined,
      postalCode: row.postal_code || undefined,
      timeSlot: row.time_slot,
      paymentMethod: row.payment_method,
      notes: row.notes || undefined,
    },
    items,
    subtotal: Number(row.subtotal || 0),
    deliveryFee: Number(row.delivery_fee || 0),
    discountAmount: Number(row.discount_amount || 0),
    couponCode: row.coupon_code || null,
    total: Number(row.total || 0),
    estimatedFoodCost: Number(row.estimated_food_cost || 0),
    paymentStatus: row.payment_status || 'paid',
    stripePaymentIntentId: row.stripe_payment_intent_id || null,
    fiscalSignature: row.fiscal_signature || null,
    status: row.status,
    estimatedMinutes: Number(row.estimated_minutes || 20),
    packingChecklist,
    timing: {
      receivedAt,
      preparingAt: row.preparing_at ? Number(row.preparing_at) : null,
      fryingAt: row.frying_at ? Number(row.frying_at) : null,
      packingAt: row.packing_at ? Number(row.packing_at) : null,
      readyAt: row.ready_at ? Number(row.ready_at) : null,
      completedAt,
      elapsedSeconds,
    },
  };
}

export async function handleRealtimeOrderService(
  req: IncomingMessage,
  res: ServerResponse,
  url: URL
): Promise<boolean> {
  const path = url.pathname;

  // 1. Server-Sent Events (SSE) Endpoint: GET /api/realtime/stream
  if (req.method === 'GET' && path === '/api/realtime/stream') {
    const tenantId = url.searchParams.get('tenantId') || '*';
    const clientId = crypto.randomUUID();

    setCorsHeaders(res);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });

    res.write(
      `data: ${JSON.stringify({
        type: 'CONNECTED',
        clientId,
        tenantId,
        timestamp: Date.now(),
      })}\n\n`
    );

    realtimeBus.addClient(clientId, tenantId, res);

    // Heartbeat every 20 seconds to keep SSE connection alive
    const heartbeat = setInterval(() => {
      try {
        res.write(`: heartbeat ${Date.now()}\n\n`);
      } catch {
        clearInterval(heartbeat);
      }
    }, 20000);

    req.on('close', () => {
      clearInterval(heartbeat);
    });

    return true;
  }

  if (!path.startsWith('/api/orders') && !path.startsWith('/api/coupons/validate')) {
    return false;
  }

  const tenantId = getTenantId(req, url);

  // 2. POST /api/coupons/validate -> Validate TikTok/Instagram Promo Codes from DB
  if (req.method === 'POST' && path === '/api/coupons/validate') {
    const body = await readJsonBody(req);
    const code = String(body.code || '').trim().toUpperCase();
    const row = db
      .prepare('SELECT * FROM coupons WHERE tenant_id = ? AND code = ? AND is_active = 1')
      .get(tenantId, code) as any;

    if (!row) {
      sendJson(res, 200, {
        valid: false,
        message: 'Codice non valido o scaduto.',
      });
      return true;
    }

    sendJson(res, 200, {
      valid: true,
      code: row.code,
      discountPercent: Number(row.discount_percent),
      channel: row.channel,
      message: `Sconto ${row.discount_percent}% (${row.channel}) applicato!`,
    });
    return true;
  }

  // 3. GET /api/orders -> Fetch all orders for tenant
  if (req.method === 'GET' && path === '/api/orders') {
    const rows = db
      .prepare('SELECT * FROM orders WHERE tenant_id = ? ORDER BY received_at DESC LIMIT 100')
      .all(tenantId) as any[];

    sendJson(res, 200, {
      service: 'realtime-order-microservice',
      tenantId,
      orders: rows.map(mapOrderRow),
    });
    return true;
  }

  // 4. GET /api/orders/:orderNumber -> Fetch single order for Live Customer OrderTrackerModal
  if (req.method === 'GET' && path.startsWith('/api/orders/')) {
    const orderIdOrNumber = decodeURIComponent(path.replace('/api/orders/', ''));
    const row = db
      .prepare('SELECT * FROM orders WHERE id = ? OR order_number = ? LIMIT 1')
      .get(orderIdOrNumber, orderIdOrNumber) as any;

    if (!row) {
      sendJson(res, 404, { error: 'Order not found' });
      return true;
    }

    sendJson(res, 200, {
      service: 'realtime-order-microservice',
      order: mapOrderRow(row),
    });
    return true;
  }

  // 5. POST /api/orders -> Customer submits a new order from the Storefront
  if (req.method === 'POST' && path === '/api/orders') {
    const body = await readJsonBody(req);
    const targetTenantId = body.tenantId || tenantId;
    const customer = body.customer || {};
    const rawItems = Array.isArray(body.items) ? body.items : [];

    const orderNumber = body.orderNumber || `PANZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const id = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const nowMs = Date.now();
    const createdAt = new Date(nowMs).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Normalize items and calculate estimated food cost from DB products
    let estimatedFoodCost = 0;
    const itemsChecked: Record<string, boolean> = {};

    const normalizedItems = rawItems.map((item: any, idx: number) => {
      const cartItemId = item.cartItemId || `item-${idx + 1}`;
      const productId = item.productId || item.product?.id || '';
      const prodName = item.name || item.product?.name || 'Prodotto';
      const qty = Math.max(1, Number(item.quantity || 1));
      const unitPrice = Number(item.totalUnitPrice ?? item.unitPrice ?? item.product?.price ?? 0);

      const dbProd = db
        .prepare('SELECT food_cost FROM products WHERE tenant_id = ? AND id = ?')
        .get(targetTenantId, productId) as { food_cost: number } | undefined;

      const unitFoodCost = dbProd ? Number(dbProd.food_cost) : Number((unitPrice * 0.28).toFixed(2));
      estimatedFoodCost += unitFoodCost * qty;
      itemsChecked[cartItemId] = false;

      return {
        cartItemId,
        productId,
        name: prodName,
        product: item.product || { id: productId, name: prodName, price: unitPrice },
        quantity: qty,
        totalUnitPrice: unitPrice,
        unitPrice,
        selectedExtras: Array.isArray(item.selectedExtras) ? item.selectedExtras : [],
        specialNotes: item.specialNotes || '',
      };
    });

    const packingChecklist = {
      itemsChecked,
      napkinsIncluded: false,
      saucesVerified: false,
      thermalBagSealed: false,
      receiptAttached: false,
      packedBy: '',
    };

    const subtotal = Number(body.subtotal || 0);
    const deliveryFee = Number(body.deliveryFee || 0);
    const discountAmount = Number(body.discountAmount || 0);
    const total = Number(body.total || 0);
    const couponCode = body.couponCode || null;

    const fiscalSignature = `KASSEN-SIG-${crypto
      .createHash('sha256')
      .update(`${orderNumber}:${total}:${nowMs}`)
      .digest('hex')
      .slice(0, 16)
      .toUpperCase()}`;

    const stripePi =
      customer.paymentMethod === 'cash'
        ? null
        : body.stripePaymentIntentId || `pi_live_${crypto.randomBytes(8).toString('hex')}`;

    const estimatedMinutes =
      customer.fulfillmentType === 'asporto' ? 15 : 30;

    db.prepare(`
      INSERT INTO orders (
        id, tenant_id, order_number, customer_name, customer_phone, customer_email,
        fulfillment_type, delivery_address, delivery_city, postal_code, time_slot,
        payment_method, payment_status, stripe_payment_intent_id, fiscal_signature, notes,
        items_json, subtotal, delivery_fee, discount_amount, coupon_code, total,
        estimated_food_cost, status, estimated_minutes, packing_checklist_json,
        created_at, received_at, prep_duration_sec
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      targetTenantId,
      orderNumber,
      customer.name || 'Cliente Online',
      customer.phone || '',
      customer.email || null,
      customer.fulfillmentType || 'asporto',
      customer.deliveryAddress || null,
      customer.deliveryCity || 'Pompei',
      customer.postalCode || '80045',
      customer.timeSlot || 'Subito',
      customer.paymentMethod || 'card',
      customer.paymentMethod === 'cash' ? 'pending_cash' : 'paid',
      stripePi,
      fiscalSignature,
      customer.notes || null,
      JSON.stringify(normalizedItems),
      subtotal,
      deliveryFee,
      discountAmount,
      couponCode,
      total,
      Number(estimatedFoodCost.toFixed(2)),
      'received',
      estimatedMinutes,
      JSON.stringify(packingChecklist),
      createdAt,
      nowMs,
      0
    );

    // Deduct stock automatically (iiko / Lightspeed recipe deduction)
    db.prepare(`
      UPDATE inventory_items
      SET current_stock = MAX(0, ROUND(current_stock - consume_per_order, 2)),
          updated_at = ?
      WHERE tenant_id = ?
    `).run(new Date().toISOString(), targetTenantId);

    // Increment coupon stats if coupon was used
    if (couponCode) {
      db.prepare(`
        UPDATE coupons
        SET usage_count = usage_count + 1,
            revenue_generated = ROUND(revenue_generated + ?, 2)
        WHERE tenant_id = ? AND code = ?
      `).run(total, targetTenantId, String(couponCode).toUpperCase());
    }

    const insertedRow = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    const createdOrder = mapOrderRow(insertedRow);

    // Broadcast real-time event to Kitchen KDS, Owner Dashboard & Customer Tracker
    realtimeBus.broadcast({
      type: 'ORDER_CREATED',
      tenantId: targetTenantId,
      timestamp: nowMs,
      data: createdOrder,
    });

    sendJson(res, 201, {
      success: true,
      service: 'realtime-order-microservice',
      order: createdOrder,
    });
    return true;
  }

  return false;
}
