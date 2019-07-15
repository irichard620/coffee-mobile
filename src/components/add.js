
import React from 'react';
import {
  View, StyleSheet, TouchableOpacity, Image
} from 'react-native';

export default function Add(props) {
  const { type, onAddClick, disabled } = props;

  const baseButtonPath = '../assets/buttons/';

  return (
    <TouchableOpacity onPress={onAddClick} disabled={disabled}>
      <View>
        {type === 0 && <Image style={styles.add} source={require(`${baseButtonPath}Add_Button.png`)} />}
        {type === 1 && <Image style={styles.add} source={require(`${baseButtonPath}Add_Button_White.png`)} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  add: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
