
import React from 'react';
import {
  View, Text, StyleSheet
} from 'react-native';

export default function BrewStep(props) {
  const {
    title, description, activeStep
  } = props;

  const titleColor = {
    color: '#2D8CD3'
  };
  if (!activeStep) {
    titleColor.color = '#898989';
  }

  return (
    <View style={styles.outline}>
      <Text style={[styles.title, titleColor]}>{title}</Text>
      {activeStep && <Text style={styles.description}>{description}</Text>}
      <View style={styles.mainSeparator} />
    </View>
  );
}

const styles = StyleSheet.create({
  outline: {
    alignItems: 'center',
    paddingTop: 16,
    width: '100%'
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    marginTop: 4,
    color: '#000000',
    fontSize: 16,
    textAlign: 'center'
  },
  mainSeparator: {
    marginTop: 16,
    height: 1,
    width: '100%',
    backgroundColor: '#F1F3F6',
  },
});
