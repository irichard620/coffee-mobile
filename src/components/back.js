
import React from 'react';
import {
  View, Image, StyleSheet, TouchableOpacity
} from 'react-native';

export default function Back(props) {
  const { type, onBackClick } = props;

  const baseButtonPath = '../assets/buttons/';

  return (
    <TouchableOpacity style={[styles.touchable]} onPress={onBackClick}>
      <View>
        {type === 0 && <Image style={styles.back} source={require(`${baseButtonPath}Back_Blue.png`)} />}
        {type === 1 && <Image style={styles.back} source={require(`${baseButtonPath}Back_White.png`)} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  back: {
    height: 20,
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    paddingBottom: 25,
    paddingRight: 25,
  }
});
