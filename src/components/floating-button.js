
import React from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image, Text, Dimensions
} from 'react-native';

export default function FloatingButton(props) {
  const {
    type, onFloatingClick, disabled, transform
  } = props;

  const baseButtonPath = '../assets/buttons/';

  let transformStyle = {};
  if (transform) {
      transformStyle = {
          transform: [{ rotate: '45deg' }]
      };
  }

  const { width } = Dimensions.get('window');
  const marginLeftContainer = {
    marginLeft: (width / 2.0) - 31
  };

  return (
    <TouchableOpacity onPress={() => onFloatingClick(type)} disabled={disabled}>
      <View style={[styles.container, marginLeftContainer]}>
        {type === 0 && <Image style={[styles.icon, transformStyle]} source={require(`${baseButtonPath}Add_Button.png`)} />}
        {type === 1 && <Image style={[styles.icon, transformStyle]} source={require(`${baseButtonPath}Add_Button_White.png`)} />}
        {type === 1 && <Text style={styles.textStyle}>{'Settings'}</Text>}
        {type === 2 && <Image style={[styles.icon, transformStyle]} source={require(`${baseButtonPath}Add_Button_White.png`)} />}
        {type === 2 && <Text style={styles.textStyle}>{'New Recipe'}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  icon: {
    width: 62,
    height: 62
  },
  textStyle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  }
});
