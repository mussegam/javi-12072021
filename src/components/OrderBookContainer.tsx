import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';

import OrderBookSide from './OrderBookSide';
import { OrderBookViewModel } from '../types/OrderBookTypes';

type IProps = {
  orderBook: OrderBookViewModel;
};
const OrderBookContainer = ({ orderBook }: IProps) => {
  const { height, width } = useWindowDimensions();
  const isLandscape = height < width;

  if (isLandscape) {
    return (
      <View style={styles.containerLandscape}>
        <View style={styles.sideLandscape}>
          <View style={styles.header}>
            <Text style={styles.headerText}>PRICE</Text>
            <Text style={styles.headerText}>SIZE</Text>
            <Text style={styles.headerText}>TOTAL</Text>
          </View>
          <OrderBookSide side="sell" levels={orderBook.asks} />
        </View>
        <View style={styles.sideLandscape}>
          <View style={styles.header}>
            <Text style={styles.headerText}>PRICE</Text>
            <Text style={styles.headerText}>SIZE</Text>
            <Text style={styles.headerText}>TOTAL</Text>
          </View>
          <OrderBookSide side="buy" levels={orderBook.bids.reverse()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PRICE</Text>
        <Text style={styles.headerText}>SIZE</Text>
        <Text style={styles.headerText}>TOTAL</Text>
      </View>
      <OrderBookSide side="buy" levels={orderBook.bids} />
      <OrderBookSide side="sell" levels={orderBook.asks} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLandscape: {
    flex: 1,
    flexDirection: 'row',
  },
  sideLandscape: {
    width: '50%',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 30,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  headerText: {
    width: '33%',
    color: 'white',
    textAlign: 'right',
  },
});

export default OrderBookContainer;
