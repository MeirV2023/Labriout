import type { IncomingMessage, ServerResponse } from 'node:http';

export function setCorsHeaders(res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Tenant-Id, X-Role');
}

export function sendJson(res: ServerResponse, statusCode: number, payload: any) {
  setCorsHeaders(res);
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

export function readJsonBody<T = any>(req: IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({} as T);
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export function getTenantId(req: IncomingMessage, url: URL): string {
  const fromQuery = url.searchParams.get('tenantId');
  const fromHeader = req.headers['x-tenant-id'];
  if (fromQuery && fromQuery.trim()) return fromQuery.trim();
  if (typeof fromHeader === 'string' && fromHeader.trim()) return fromHeader.trim();
  return 'panzarotto-pompei';
}
