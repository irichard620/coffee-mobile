
import React from 'react';
import {
  SafeAreaView, Text, StyleSheet, Image, TouchableOpacity,
  Dimensions, View
} from 'react-native';

export default function TopHeader(props) {
  const {
    title, onClose, showSeparator, useArrow
  } = props;

  const baseButtonPath = '../assets/buttons/';

  const { width } = Dimensions.get('window');
  const titleWidth = {
    width: width - 32 - 40 - 16
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity style={styles.touchable} onPress={onClose}>
          {!useArrow && <Image style={styles.close} source={require(`${baseButtonPath}Modal_X.png`)} />}
          {useArrow && <Image style={styles.close} source={require(`${baseButtonPath}Brew_Back.png`)} />}
        </TouchableOpacity>
        <Text style={[styles.title, titleWidth]}>{title}</Text>
      </View>
      {showSeparator && <View style={styles.separator} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 8,
    paddingRight: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    width: '100%',
    backgroundColor: '#FFFFFF'
  },
  title: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    textAlign: 'center',
  },
  close: {
    height: 20,
    width: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F3F6',
    width: '100%'
  },
  touchable: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
  }
});
