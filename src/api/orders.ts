import { apiRequest } from './client';
import type { OrderHistoryItem } from '../types';

export async function createOrder(body: {
  customerName: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage?: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  itemsSummary?: string;
}): Promise<OrderHistoryItem> {
  const data = await apiRequest<{ order: Record<string, unknown> }>('/orders', {
    method: 'POST',
    auth: true,
    body,
  });
  const o = data.order;
  return {
    id: String(o.orderId ?? o.id ?? ''),
    restaurantName: String(o.restaurantName ?? body.restaurantName),
    restaurantImage: String(o.restaurantImage ?? body.restaurantImage ?? ''),
    date: String(o.date ?? new Date().toISOString().slice(0, 16).replace('T', ' ')),
    status: (o.status as OrderHistoryItem['status']) ?? 'Pending',
    items: body.items,
    totalAmount: Number(o.totalAmount ?? body.totalAmount),
  };
}
