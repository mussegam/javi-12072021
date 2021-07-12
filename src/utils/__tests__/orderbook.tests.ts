import { DeltaMessage } from '../../types/MessageTypes';
import { processDelta, updateOrderBook } from '../OrderBook';

describe('orderbook utils', () => {
  describe('processDelta', () => {
    it('should add a new level', () => {
      const delta: DeltaMessage = {
        asks: [[1200, 10]],
        bids: [[1000, 20]],
        feed: 'book_ui_1',
        product_id: 'foo',
      };
      const { asks, bids } = processDelta(delta, new Map(), new Map());
      expect(asks.has(1200)).toBeTruthy();
      expect(asks.get(1200)).toEqual(10);
      expect(bids.has(1000)).toBeTruthy();
      expect(bids.get(1000)).toEqual(20);
    });

    it('should update the size of an existing level', () => {
      const prevAsks = new Map([
        [1200, 50],
        [1205, 20],
      ]);
      const prevBids = new Map([
        [1000, 40],
        [1005, 10],
      ]);
      const delta: DeltaMessage = {
        asks: [[1200, 10]],
        bids: [[1000, 20]],
        feed: 'book_ui_1',
        product_id: 'foo',
      };

      const { asks, bids } = processDelta(delta, prevAsks, prevBids);
      expect(asks.get(1200)).toEqual(10);
      expect(asks.get(1205)).toEqual(20);
      expect(bids.get(1000)).toEqual(20);
      expect(bids.get(1005)).toEqual(10);
    });

    it('should delete the level when the delta size is 0', () => {
      const prevAsks = new Map([
        [1200, 50],
        [1205, 20],
      ]);
      const prevBids = new Map([
        [1000, 40],
        [1005, 10],
      ]);
      const delta: DeltaMessage = {
        asks: [[1200, 0]],
        bids: [[1000, 0]],
        feed: 'book_ui_1',
        product_id: 'foo',
      };

      const { asks, bids } = processDelta(delta, prevAsks, prevBids);
      expect(asks.has(1200)).toBeFalsy();
      expect(asks.get(1205)).toEqual(20);
      expect(bids.has(1000)).toBeFalsy();
      expect(bids.get(1005)).toEqual(10);
    });
  });

  describe('updateOrderBook', () => {
    const askData = new Map([
      [1200, 50],
      [1205, 20],
    ]);
    const bidData = new Map([
      [1000, 40],
      [1005, 10],
    ]);

    it('should return arrays of levels sorted by desc price', () => {
      const { asks, bids } = updateOrderBook(askData, bidData, 0.5);

      expect(asks.length).toEqual(2);
      expect(asks[0].price).toEqual(1205);
      expect(bids.length).toEqual(2);
      expect(bids[0].price).toEqual(1005);
    });

    it('should calculate the total for each level', () => {
      const { asks, bids } = updateOrderBook(askData, bidData, 0.5);

      expect(asks.length).toEqual(2);
      expect(asks[0].total).toEqual(20);
      expect(asks[1].total).toEqual(70);

      expect(bids.length).toEqual(2);
      expect(bids[0].total).toEqual(50);
      expect(bids[1].total).toEqual(40);
    });

    it('should calculate the depth for each level', () => {
      const { asks, bids } = updateOrderBook(askData, bidData, 0.5);

      expect(asks.length).toEqual(2);
      expect(asks[0].depth).toEqual((20 / 70) * 100);
      expect(asks[1].depth).toEqual(100);

      expect(bids.length).toEqual(2);
      expect(bids[0].depth).toEqual((50 / 70) * 100);
      expect(bids[1].depth).toEqual((40 / 70) * 100);
    });

    it('should group levels by ticket size', () => {
      const askData = new Map([
        [1200.5, 50],
        [1200, 20],
      ]);
      const bidData = new Map([
        [1000, 40],
        [1000.5, 10],
      ]);
      const { asks, bids } = updateOrderBook(askData, bidData, 1);

      expect(asks.length).toEqual(1);
      expect(asks[0].price).toEqual(1200);
      expect(asks[0].size).toEqual(70);
      expect(bids.length).toEqual(1);
      expect(bids[0].price).toEqual(1000);
      expect(bids[0].size).toEqual(50);
    });
  });
});
