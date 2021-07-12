import React from 'react';
import { View, StyleSheet } from 'react-native';

import OrderBookRow from './OrderBookRow';
import { OrderSide, OrderLevel } from '../types/OrderBookTypes';

type SideProps = {
  side: OrderSide;
  levels: OrderLevel[];
};

const OrderBookSide = ({ side, levels }: SideProps) => {
  return (
    <View style={styles.side}>
      {levels &&
        levels.map(level => (
          <OrderBookRow key={level.price} level={level} side={side} />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  side: {
    marginBottom: 20,
  },
});

export default OrderBookSide;
