import { DeltaMessage, RawOrder } from '../types/MessageTypes';
import { OrderBookViewModel, OrderLevel } from '../types/OrderBookTypes';

export function processDelta(
  delta: DeltaMessage,
  asks: Map<number, number>,
  bids: Map<number, number>,
): { asks: Map<number, number>; bids: Map<number, number> } {
  delta.asks.forEach(ask => {
    if (ask[1] == 0) {
      asks.delete(ask[0]);
    } else {
      asks.set(ask[0], ask[1]);
    }
  });

  delta.bids.forEach(bid => {
    if (bid[1] == 0) {
      bids.delete(bid[0]);
    } else {
      bids.set(bid[0], bid[1]);
    }
  });

  return { asks, bids };
}

function groupByTicketSize(levels: RawOrder[], ticketSize: number): RawOrder[] {
  const grouped = levels.reduce((map, level) => {
    const roundedPrice = Math.floor(level[0] / ticketSize) * ticketSize;
    const size = map.get(roundedPrice) || 0;
    map.set(roundedPrice, size + level[1]);
    return map;
  }, new Map());

  return Array.from(grouped);
}

function calculateTotalsForBids(
  levels: RawOrder[],
  bidsTotal: number,
  maxTotal: number,
): OrderLevel[] {
  let acum = bidsTotal;
  const updated = levels.map(level => {
    const bid = {
      price: level[0],
      size: level[1],
      total: acum,
      depth: (acum / maxTotal) * 100,
    };
    acum -= level[1];
    return bid;
  });

  return updated;
}

function calculateTotalsForAsks(
  levels: RawOrder[],
  maxTotal: number,
): OrderLevel[] {
  let acum = 0;
  const updated = levels.map(level => {
    acum += level[1];
    return {
      price: level[0],
      size: level[1],
      total: acum,
      depth: (acum / maxTotal) * 100,
    };
  });

  return updated;
}

export function updateOrderBook(
  asks: Map<number, number>,
  bids: Map<number, number>,
  ticketSize: number,
): OrderBookViewModel {
  const sortedAsks = Array.from(asks).sort((a, b) => b[0] - a[0]);
  const sortedBids = Array.from(bids).sort((a, b) => b[0] - a[0]);

  const groupedAsks = groupByTicketSize(sortedAsks, ticketSize).slice(-10);
  const groupedBids = groupByTicketSize(sortedBids, ticketSize).slice(0, 10);

  const askTotal = groupedAsks.reduce((sum, level) => sum + level[1], 0);
  const bidTotal = groupedBids.reduce((sum, level) => sum + level[1], 0);
  const maxTotal = Math.max(askTotal, bidTotal);

  const processedAsks = calculateTotalsForAsks(groupedAsks, maxTotal);
  const processedBids = calculateTotalsForBids(groupedBids, bidTotal, maxTotal);

  return { asks: processedAsks, bids: processedBids };
}
