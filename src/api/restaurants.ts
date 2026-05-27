import { apiRequest } from './client';
import type { Restaurant } from '../types';

export async function fetchRestaurants(params?: {
  q?: string;
  cuisine?: string;
  isVeg?: boolean;
}): Promise<Restaurant[]> {
  const data = await apiRequest<{ restaurants: Restaurant[] }>('/restaurants', {
    query: {
      q: params?.q,
      cuisine: params?.cuisine,
      isVeg: params?.isVeg,
    },
  });
  return data.restaurants ?? [];
}

export async function fetchRestaurant(id: string): Promise<Restaurant | null> {
  try {
    const data = await apiRequest<{ restaurant: Restaurant }>(`/restaurants/${id}`);
    return data.restaurant ?? null;
  } catch {
    return null;
  }
}
