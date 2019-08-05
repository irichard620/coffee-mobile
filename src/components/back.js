
import React from 'react';
import {
  View, Image, StyleSheet, TouchableOpacity, Dimensions
} from 'react-native';

export default function Back(props) {
  const { type, onBackClick } = props;

  const baseButtonPath = '../assets/buttons/';

  const { height } = Dimensions.get('window');
  const paddingTopStyle = {
    paddingTop: height * 0.04
  };

  return (
    <TouchableOpacity style={[styles.touchable, paddingTopStyle]} onPress={onBackClick}>
      <View>
        {type === 0 && <Image style={styles.back} source={require(`${baseButtonPath}Back_Blue.png`)} />}
        {type === 1 && <Image style={styles.back} source={require(`${baseButtonPath}Back_White.png`)} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  back: {
    width: 10,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    paddingTop: 25,
    paddingBottom: 25,
    paddingRight: 25,
  }
});
