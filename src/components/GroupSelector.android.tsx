import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type IProps = {
  currentValue: number;
  values: number[];
  onValueChange: (_: number) => void;
};

const GroupSelector = ({ currentValue, values, onValueChange }: IProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`Group ${currentValue}`}</Text>
      <Picker
        testID="picker"
        style={styles.picker}
        dropdownIconColor="white"
        selectedValue={currentValue}
        onValueChange={onValueChange}>
        {values.map(ticketSize => {
          return (
            <Picker.Item
              key={ticketSize}
              label={ticketSize.toString()}
              value={ticketSize}
            />
          );
        })}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(55,65,81)',
    borderRadius: 4,
    paddingVertical: 5,
    paddingLeft: 10,
    height: 40,
    width: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontSize: 14,
    marginRight: 5,
  },
  picker: {
    width: 40,
    height: 40,
  },
});

export default GroupSelector;
