import { Market } from '../types/OrderBookTypes';

export const marketTicketSizes: Map<Market, number[]> = new Map([
  [Market.XBTUSD, [0.5, 1.0, 2.5]],
  [Market.ETHUSD, [0.05, 0.1, 0.25]],
]);
