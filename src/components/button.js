
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity
} from 'react-native';

export default function Button(props) {
  const {
    onButtonClick, type, title, width, margin, disabled
  } = props;

  const backgroundStyle = {
    marginTop: margin[0],
    marginRight: margin[1],
    marginBottom: margin[2],
    marginLeft: margin[3],
    width,
  };
  let titleStyle = {};
  if (type === 0) {
    backgroundStyle.backgroundColor = '#1D5E9E';
    titleStyle = {
      color: '#FFFFFF'
    };
  } else {
    backgroundStyle.backgroundColor = '#FFFFFF';
    titleStyle = {
      color: '#1D5E9E'
    };
  }
  return (
    <TouchableOpacity
      style={[styles.button, backgroundStyle]}
      onPress={onButtonClick}
      disabled={disabled}
    >
      <View>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: '600'
  },
  button: {
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
