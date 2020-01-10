
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
    </View>
  );
}

const styles = StyleSheet.create({
  outline: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
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
});
