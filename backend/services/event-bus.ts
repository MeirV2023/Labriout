import { EventEmitter } from 'node:events';
import type { ServerResponse } from 'node:http';

export interface RealtimeEventPayload {
  type:
    | 'ORDER_CREATED'
    | 'ORDER_STATUS_UPDATED'
    | 'ORDER_PACKING_UPDATED'
    | 'MENU_UPDATED'
    | 'INVENTORY_UPDATED'
    | 'STRIPE_CONFIG_UPDATED';
  tenantId: string;
  timestamp: number;
  data: any;
}

class RealtimeBus extends EventEmitter {
  private clients: Set<{ id: string; tenantId: string; res: ServerResponse }> = new Set();

  addClient(id: string, tenantId: string, res: ServerResponse) {
    const client = { id, tenantId, res };
    this.clients.add(client);
    res.on('close', () => {
      this.clients.delete(client);
    });
  }

  broadcast(event: RealtimeEventPayload) {
    this.emit('event', event);
    const payloadStr = `data: ${JSON.stringify(event)}\n\n`;
    for (const client of this.clients) {
      if (client.tenantId === '*' || client.tenantId === event.tenantId) {
        try {
          client.res.write(payloadStr);
        } catch {
          this.clients.delete(client);
        }
      }
    }
  }

  getConnectedCount(tenantId?: string): number {
    if (!tenantId) return this.clients.size;
    let count = 0;
    for (const c of this.clients) {
      if (c.tenantId === tenantId || c.tenantId === '*') count++;
    }
    return count;
  }
}

export const realtimeBus = new RealtimeBus();
