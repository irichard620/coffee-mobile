
import React from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';

export default function BuilderListHeader(props) {
  const {
    title, textColor
  } = props;

  const titleStyle = {
    color: textColor
  };

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    height: 53,
    backgroundColor: '#FFFFFF'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  }
});
