
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity
} from 'react-native';

export default function ButtonLarge(props) {
  const {
    onButtonClick, title, margin, disabled, buttonWidth,
    buttonHeight, textColor, backgroundColor
  } = props;

  const backgroundStyle = {
    marginTop: margin[0],
    marginRight: margin[1],
    marginBottom: margin[2],
    marginLeft: margin[3],
    backgroundColor: '#2D8CD3',
  };
  if (buttonWidth) {
    backgroundStyle.width = buttonWidth;
  }
  if (buttonHeight) {
    backgroundStyle.height = buttonHeight;
  }
  if (backgroundColor) {
    backgroundStyle.backgroundColor = backgroundColor;
  }
  const titleStyle = {
    color: '#FFFFFF'
  };
  if (textColor) {
    titleStyle.color = textColor;
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
    fontSize: 16,
    fontWeight: '600'
  },
  button: {
    height: 48,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
