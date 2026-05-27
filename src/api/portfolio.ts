import { apiRequest } from './client';
import type { PortfolioItem } from '../types';

export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  const data = await apiRequest<{ portfolio: PortfolioItem[] }>('/portfolio');
  return data.portfolio ?? [];
}
