
import React from 'react';
import {
  View, StyleSheet
} from 'react-native';

export default function PullDown() {
  return (
    <View style={styles.pulldown} />
  );
}

const styles = StyleSheet.create({
  pulldown: {
    width: 40,
    height: 6,
    borderRadius: 3,
    alignSelf: 'center',
    backgroundColor: '#E3E3E3',
  }
});
