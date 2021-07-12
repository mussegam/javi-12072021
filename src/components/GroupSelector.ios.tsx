import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type IProps = {
  currentValue: number;
  values: number[];
  onValueChange: (_: number) => void;
};

const GroupSelector = ({ currentValue, values, onValueChange }: IProps) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const togglePicker = () => {
    setIsPickerVisible(isVisible => !isVisible);
  };

  return (
    <>
      <TouchableOpacity onPress={togglePicker}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{`Group ${currentValue}`}</Text>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPickerVisible}
        onRequestClose={() => {
          setIsPickerVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select ticket size:</Text>
            <Picker
              testID="picker"
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
            <TouchableOpacity onPress={togglePicker}>
              <View style={styles.modalButton}>
                <Text style={styles.modalButtonText}>OK</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgb(55,65,81)',
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 14,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  modalTitle: {
    fontSize: 18,
  },
  modalButton: {
    height: 40,
    backgroundColor: 'rgb(81,71,207)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default GroupSelector;
