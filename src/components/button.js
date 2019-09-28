
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image
} from 'react-native';

export default function Button(props) {
  const {
    onButtonClick, type, title, margin, disabled, isGlyph, glyphType
  } = props;

  const baseButtonPath = '../assets/buttons/';

  const backgroundStyle = {
    marginTop: margin[0],
    marginRight: margin[1],
    marginBottom: margin[2],
    marginLeft: margin[3],
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
  if (isGlyph) {
    titleStyle.marginRight = 8;
  }
  return (
    <TouchableOpacity
      style={[styles.button, backgroundStyle]}
      onPress={onButtonClick}
      disabled={disabled}
    >
      <View style={styles.glyphContainer}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {isGlyph && glyphType === 0 && (
          <Image style={styles.glyph} source={require(`${baseButtonPath}WhiteArrow.png`)} />
        )}
        {isGlyph && glyphType === 1 && (
          <Image style={styles.glyph} source={require(`${baseButtonPath}WhiteDownArrow.png`)} />
        )}
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
    paddingLeft: 18,
    paddingRight: 18,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    justifyContent: 'center'
  },
  glyphContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  glyph: {
    width: 12,
    height: 12
  }
});
