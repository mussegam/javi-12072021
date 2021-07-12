export enum Market {
  XBTUSD = 'PI_XBTUSD',
  ETHUSD = 'PI_ETHUSD',
}

export type OrderLevel = {
  price: number;
  size: number;
  total: number;
  depth: number;
};

export type OrderSide = 'buy' | 'sell';

export type OrderBookViewModel = {
  asks: OrderLevel[];
  bids: OrderLevel[];
};
