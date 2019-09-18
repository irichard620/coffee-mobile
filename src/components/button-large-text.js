
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity
} from 'react-native';

export default function ButtonLargeText(props) {
  const {
    onButtonClick, title, margin, disabled
  } = props;

  const backgroundStyle = {
    marginTop: margin[0],
    marginRight: margin[1],
    marginBottom: margin[2],
    marginLeft: margin[3],
  };
  return (
    <TouchableOpacity
      style={[styles.button, backgroundStyle]}
      onPress={onButtonClick}
      disabled={disabled}
    >
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#727272',
    fontSize: 16,
    fontWeight: '600'
  },
  button: {
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
