
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity
} from 'react-native';

export default function Close(props) {
  const { onCloseClick } = props;
  const closeBackgroundColor = {
    backgroundColor: '#E3E3E3'
  };
  const closeTextColor = {
    color: '#FFFFFF'
  };
  return (
    <TouchableOpacity style={[styles.close, closeBackgroundColor]} onPress={onCloseClick}>
      <View>
        <Text style={[styles.title, closeTextColor]}>x</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
  },
  close: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
  }
});
