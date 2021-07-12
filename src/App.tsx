import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import throttle from 'lodash.throttle';

import { Market, OrderBookViewModel } from './types/OrderBookTypes';

import GroupSelector from './components/GroupSelector';
import OrderBookContainer from './components/OrderBookContainer';
import { processDelta, updateOrderBook } from './utils/OrderBook';
import { marketTicketSizes } from './constants';
import { DeltaMessage, SnapshotMessage } from './types/MessageTypes';

const App = () => {
  const ws = useRef<WebSocket>();
  const asks = useRef<Map<number, number>>(new Map());
  const bids = useRef<Map<number, number>>(new Map());
  const [orderBook, setOrderBook] = useState<OrderBookViewModel>({
    asks: [],
    bids: [],
  });
  const [selectedMarket, setSelectedMarket] = useState(Market.XBTUSD);
  const ticketSizes = marketTicketSizes.get(selectedMarket) || [];
  const [ticketSize, setTicketSize] = useState(ticketSizes[0]);
  const hasKilledFeed = useRef(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    setupSocket();
    return () => {
      closeSocket();
    };
  }, []);

  useEffect(() => {
    updateOrderBook(asks.current, bids.current, ticketSize);
    if (ws && ws.current) {
      ws.current.onmessage = processMessage;
    }
  }, [ticketSize]);

  function setupSocket() {
    ws.current = new WebSocket('wss://www.cryptofacilities.com/ws/v1');
    ws.current.onopen = () => subscribe(selectedMarket);
    ws.current.onclose = () => console.log('ws closed');
    ws.current.onerror = handleError;
    ws.current.onmessage = processMessage;
  }

  function subscribe(market: Market) {
    if (!ws || !ws.current) {
      return;
    }

    const subscribeMsg = {
      event: 'subscribe',
      feed: 'book_ui_1',
      product_ids: [market],
    };
    ws.current.send(JSON.stringify(subscribeMsg));
  }

  function unsubscribe(market: Market) {
    if (!ws || !ws.current) {
      return;
    }

    const unsubscribeMsg = {
      event: 'unsubscribe',
      feed: 'book_ui_1',
      product_ids: [market],
    };
    ws.current.send(JSON.stringify(unsubscribeMsg));
  }

  function closeSocket() {
    if (!ws || !ws.current) {
      return;
    }
    ws.current.close();
  }

  function handleError(errorEvent: WebSocketErrorEvent) {
    closeSocket();
    setError(new Error(errorEvent.message));
  }

  const processMessage = (message: WebSocketMessageEvent) => {
    let parsedData;
    try {
      parsedData = JSON.parse(message.data);
    } catch (parsingError) {
      return;
    }

    if (parsedData.event && parsedData.event == 'subscribed') {
      console.log('subscribed');
    } else if (parsedData.event && parsedData.event == 'unsubscribed') {
      console.log('unsubscribed');
    } else if (parsedData.feed && parsedData.feed == 'book_ui_1_snapshot') {
      const snapshot = parsedData as SnapshotMessage;
      asks.current = new Map(snapshot.asks);
      bids.current = new Map(snapshot.bids);
      refreshOrderBook();
    } else if (parsedData.feed && parsedData.feed == 'book_ui_1') {
      const update = processDelta(
        parsedData as DeltaMessage,
        asks.current,
        bids.current,
      );
      asks.current = update.asks;
      bids.current = update.bids;
      throttledRefreshOrderBook();
    }
  };

  const refreshOrderBook = () => {
    const updated = updateOrderBook(asks.current, bids.current, ticketSize);
    setOrderBook(updated);
  };

  const throttledRefreshOrderBook = useMemo(
    () => throttle(refreshOrderBook, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [asks, bids, ticketSize],
  );

  const toggleFeed = () => {
    const newMarket =
      selectedMarket == Market.XBTUSD ? Market.ETHUSD : Market.XBTUSD;
    unsubscribe(selectedMarket);
    subscribe(newMarket);
    setSelectedMarket(newMarket);

    const ticketSizes = marketTicketSizes.get(newMarket) || [];
    setTicketSize(ticketSizes[0]);
  };

  const killFeed = () => {
    if (hasKilledFeed.current) {
      setupSocket();
      hasKilledFeed.current = false;
      return;
    }

    hasKilledFeed.current = true;
    handleError(new Error('Error generated from Kill feed'));
  };

  if (error) {
    return (
      <SafeAreaView style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Order Book</Text>
        </View>
        <View style={styles.errorContent}>
          <View>
            <Text style={styles.errorTitle}>
              There was an error retrieving the data.
            </Text>
            <TouchableOpacity onPress={() => setError(undefined)}>
              <View style={styles.errorButton}>
                <Text style={styles.buttonText}>Reconnect</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Order Book</Text>
        <GroupSelector
          currentValue={ticketSize}
          values={ticketSizes}
          onValueChange={setTicketSize}
        />
      </View>
      <OrderBookContainer orderBook={orderBook} />
      <View style={styles.footer}>
        <TouchableOpacity onPress={toggleFeed}>
          <View style={styles.toggleButton}>
            <Text style={styles.buttonText}>Toggle Feed</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={killFeed}>
          <View style={styles.killButton}>
            <Text style={styles.buttonText}>Kill Feed</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#121826',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomColor: '#252D3B',
    borderBottomWidth: 1,
  },
  headerText: {
    color: 'white',
    fontSize: 16,
  },
  footer: {
    backgroundColor: '#252D3B',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  toggleButton: {
    height: 40,
    backgroundColor: 'rgb(81,71,207)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 4,
    marginRight: 20,
  },
  killButton: {
    height: 40,
    backgroundColor: 'rgb(170,46,39)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
  },
  errorContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  errorButton: {
    height: 40,
    backgroundColor: 'rgb(81,71,207)',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
});

export default App;
