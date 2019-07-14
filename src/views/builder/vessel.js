
import React from 'react';
import {
  View, Text, StyleSheet, TouchableWithoutFeedback, Image
} from 'react-native';
import {
  vesselLabels, VESSEL_AEROPRESS, VESSEL_CHEMEX, VESSEL_FRENCH_PRESS,
  VESSEL_POUROVER
} from '../../constants';

export default function Vessel(props) {
  const { vesselId, onStepClick } = props;

  const basePath = '../../assets/mini-vessel-icons/';

  let title = '-';
  if (vesselId !== '') {
    title = vesselLabels[vesselId];
  }

  return (
    <TouchableWithoutFeedback onPress={onStepClick}>
      <View style={styles.outline}>
        <View style={styles.logoview}>
          {vesselId === VESSEL_AEROPRESS
            && <Image style={styles.image} source={require(`${basePath}Aeropress_Minicon.png`)} />}
          {vesselId === VESSEL_CHEMEX
            && <Image style={styles.image} source={require(`${basePath}Chemex_Minicon.png`)} />}
          {vesselId === VESSEL_FRENCH_PRESS
            && <Image style={styles.image} source={require(`${basePath}FrenchPress_Minicon.png`)} />}
          {vesselId === VESSEL_POUROVER
            && <Image style={styles.image} source={require(`${basePath}V60_Minicon.png`)} />}
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>Brewing Vessel</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outline: {
    alignItems: 'flex-start',
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 0,
    marginBottom: 15,
    backgroundColor: '#FFFFFF'
  },
  title: {
    color: '#1D5E9E',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: '#727272',
    fontSize: 14,
  },
  logoview: {
    height: 55,
    width: 55,
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25
  },
  image: {
    height: 35,
    resizeMode: 'contain',
  },
});
