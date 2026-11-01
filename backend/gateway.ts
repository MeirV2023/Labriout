import http from 'node:http';
import { initDatabase, db, DB_PATH } from './database/db.ts';
import { setCorsHeaders, sendJson } from './services/http-utils.ts';
import { handleAdminCmsService } from './services/admin-cms-service/index.ts';
import { handleOwnerKdsService } from './services/owner-kds-service/index.ts';
import { handlePaymentService } from './services/payment-stripe-service/index.ts';
import { handleRealtimeOrderService } from './services/realtime-order-service/index.ts';
import { realtimeBus } from './services/event-bus.ts';

// Initialize SQLite Multi-Tenant Database
initDatabase();

const GATEWAY_PORT = Number(process.env.PORT || 4000);
const startTime = Date.now();

async function routeRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const host = req.headers.host || `localhost:${GATEWAY_PORT}`;
  const url = new URL(req.url || '/', `http://${host}`);

  try {
    // API Gateway Health & Microservices Registry Status
    if (req.method === 'GET' && url.pathname === '/api/health') {
      const tenantsCount = (db.prepare('SELECT COUNT(*) as c FROM tenants').get() as any)?.c || 0;
      const ordersCount = (db.prepare('SELECT COUNT(*) as c FROM orders').get() as any)?.c || 0;
      const productsCount = (db.prepare('SELECT COUNT(*) as c FROM products').get() as any)?.c || 0;

      sendJson(res, 200, {
        status: 'ok',
        architecture: 'Multi-Tenant Street-Food SaaS Microservices',
        uptimeSeconds: Math.round((Date.now() - startTime) / 1000),
        database: {
          engine: 'SQLite 3 (WAL Mode)',
          path: DB_PATH,
          tenantsCount,
          ordersCount,
          productsCount,
        },
        realtimeSseClients: realtimeBus.getConnectedCount(),
        microservices: [
          {
            id: 'admin-cms-service',
            name: 'Super-Admin & Multi-Tenant Menu CMS Service',
            port: 4001,
            routes: ['/api/admin/tenants', '/api/admin/products', '/api/catalog/menu', '/api/admin/coupons'],
            status: 'healthy',
            inspiration: 'Flipdish Multi-Tenant SaaS + Olo Rails Catalog API',
          },
          {
            id: 'owner-kds-service',
            name: 'Restaurant Owner, KDS Time-Tracker, Packing & Stock Service',
            port: 4002,
            routes: [
              '/api/owner/orders/:id/status',
              '/api/owner/orders/:id/packing',
              '/api/owner/inventory',
              '/api/owner/products/:id/toggle-availability',
              '/api/owner/analytics',
            ],
            status: 'healthy',
            inspiration: 'Dodo IS KDS + Toast POS Packing Screen + iiko/Lightspeed Inventory + Poster POS Analytics',
          },
          {
            id: 'payment-stripe-service',
            name: 'Direct Tenant Stripe Payout & Fiscal Signature Service',
            port: 4003,
            routes: ['/api/payments/config', '/api/payments/create-intent', '/api/payments/transactions'],
            status: 'healthy',
            inspiration: 'Direct Owner Stripe Connect (0% Platform Commission) + Lightspeed KassenSichV Hash',
          },
          {
            id: 'realtime-order-service',
            name: 'Real-Time Order Processor & SSE Event Broadcaster',
            port: 4004,
            routes: ['/api/orders', '/api/realtime/stream', '/api/coupons/validate'],
            status: 'healthy',
            inspiration: 'Uber Eats / Dodo IS Instant Kitchen Gong & Live Customer Order Tracker',
          },
        ],
      });
      return;
    }

    // Dispatch to Microservice 1: Super-Admin & Catalog CMS
    if (await handleAdminCmsService(req, res, url)) return;

    // Dispatch to Microservice 2: Restaurant Owner, KDS, Packing & Stock
    if (await handleOwnerKdsService(req, res, url)) return;

    // Dispatch to Microservice 3: Payment & Direct Stripe Keys
    if (await handlePaymentService(req, res, url)) return;

    // Dispatch to Microservice 4: Real-Time Order Processor & SSE Stream
    if (await handleRealtimeOrderService(req, res, url)) return;

    sendJson(res, 404, {
      error: 'Endpoint not found in API Gateway',
      path: url.pathname,
    });
  } catch (err: any) {
    console.error('[Microservice Gateway Error]:', err);
    sendJson(res, 500, {
      error: err?.message || 'Internal Microservice Error',
    });
  }
}

// Start Main API Gateway (Port 4000)
const gatewayServer = http.createServer(routeRequest);
gatewayServer.listen(GATEWAY_PORT, '0.0.0.0', () => {
  console.log(`🚀 [API Gateway] Multi-Tenant StreetFood SaaS listening on http://localhost:${GATEWAY_PORT}`);
});

// Also bind dedicated microservice ports (4001..4004) so each microservice is independently addressable
const dedicatedServices = [
  { port: 4001, name: 'Admin CMS Microservice', handler: handleAdminCmsService },
  { port: 4002, name: 'Owner & KDS Microservice', handler: handleOwnerKdsService },
  { port: 4003, name: 'Payment Stripe Microservice', handler: handlePaymentService },
  { port: 4004, name: 'Realtime Order & SSE Microservice', handler: handleRealtimeOrderService },
];

for (const svc of dedicatedServices) {
  const srv = http.createServer(async (req, res) => {
    setCorsHeaders(res);
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }
    const url = new URL(req.url || '/', `http://localhost:${svc.port}`);
    if (url.pathname === '/health') {
      sendJson(res, 200, { service: svc.name, port: svc.port, status: 'healthy' });
      return;
    }
    try {
      const handled = await svc.handler(req, res, url);
      if (!handled) {
        sendJson(res, 404, { error: `Route not handled by ${svc.name}`, path: url.pathname });
      }
    } catch (e: any) {
      sendJson(res, 500, { error: e?.message || 'Microservice error' });
    }
  });
  srv.on('error', () => {
    // Ignore port conflict if already bound
  });
  srv.listen(svc.port, '0.0.0.0', () => {
    console.log(`   ├─ ✅ [${svc.name}] active on http://localhost:${svc.port}`);
  });
}
