import { UserProfile } from './types';

export const FESTIVE_COLORS = {
  saffron: '#fff',
  marigold: 'secondary',
  red: '#E53935',
  green: '#2E7D32',
  bg: '#ffffff',
};

/** Empty profile used before login or after logout — no demo customer data. */
export const EMPTY_USER_PROFILE: UserProfile = {
  name: '',
  email: '',
  phone: '',
  customerType: 'standard',
  walletBalance: 0,
  royaltyPoints: 0,
  addresses: [],
  orders: [],
  supportTickets: [],
};
