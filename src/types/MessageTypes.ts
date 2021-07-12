export type RawOrder = [number, number];

export type SnapshotMessage = {
  numLevels: number;
  feed: string;
  bids: RawOrder[];
  asks: RawOrder[];
  product_id: string;
};

export type DeltaMessage = {
  feed: string;
  bids: RawOrder[];
  asks: RawOrder[];
  product_id: string;
};
