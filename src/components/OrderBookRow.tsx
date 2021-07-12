import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { OrderLevel, OrderSide } from '../types/OrderBookTypes';

type IProps = {
  level: OrderLevel;
  side: OrderSide;
};

const OrderBookRow = ({ level, side }: IProps) => {
  const { height, width } = useWindowDimensions();
  const isLandscape = height < width;

  const color = side == 'buy' ? 'green' : 'red';
  const levelWidth = level.depth.toFixed() + '%';

  const depthPosition = () => {
    if (isLandscape && side == 'buy') {
      return { left: 0 };
    }

    return { right: 0 };
  };

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.depthLevel,
          { backgroundColor: color, width: levelWidth },
          depthPosition(),
        ]}
      />
      <View style={styles.container}>
        <Text style={[styles.orderText, { color: color }]}>
          {level.price.toFixed(2)}
        </Text>
        <Text style={styles.orderText}>{level.size}</Text>
        <Text style={styles.orderText}>{level.total}</Text>
      </View>
    </View>
  );
};

const fontFamily = Platform.OS == 'ios' ? 'Menlo' : 'monospace';

const styles = StyleSheet.create({
  row: {
    height: 25,
  },
  depthLevel: {
    position: 'absolute',
    zIndex: -10,
    height: '100%',
    opacity: 0.2,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
  buyText: {
    color: 'green',
  },
  sellText: {
    color: 'red',
  },
  orderText: {
    width: '33%',
    color: 'white',
    textAlign: 'right',
    fontFamily: fontFamily,
  },
});

export default OrderBookRow;
