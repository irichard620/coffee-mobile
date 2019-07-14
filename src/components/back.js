
import React from 'react';
import {
  View, Image, StyleSheet, TouchableWithoutFeedback
} from 'react-native';

export default function Back(props) {
  const { type, onBackClick } = props;

  const baseButtonPath = '../assets/buttons/';

  return (
    <TouchableWithoutFeedback style={styles.touchable} onPress={onBackClick}>
      <View>
        {type === 0 && <Image style={styles.back} source={require(`${baseButtonPath}Back_Blue.png`)} />}
        {type === 1 && <Image style={styles.back} source={require(`${baseButtonPath}Back_White.png`)} />}
      </View>
    </TouchableWithoutFeedback>
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
    paddingTop: 15,
    paddingBottom: 15,
    paddingRight: 15,
  }
});
