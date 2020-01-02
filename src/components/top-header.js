
import React from 'react';
import {
  SafeAreaView, Text, StyleSheet, Image, TouchableOpacity,
  Dimensions, View
} from 'react-native';

export default function TopHeader(props) {
  const {
    title, onClose, showSeparator
  } = props;

  const baseButtonPath = '../assets/buttons/';

  const { width } = Dimensions.get('window');
  const titleWidth = {
    width: width - 32 - 40
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Image style={styles.close} source={require(`${baseButtonPath}Modal_X.png`)} />
        </TouchableOpacity>
        <Text style={[styles.title, titleWidth]}>{title}</Text>
      </View>
      {showSeparator && <View style={styles.separator} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 13,
    paddingBottom: 13,
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
  }
});
