
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import {
  VESSEL_AEROPRESS, VESSEL_CHEMEX, VESSEL_FRENCH_PRESS,
  VESSEL_POUROVER
} from '../../constants';

export default function Vessel(props) {
  const { vessel, onStepClick } = props;

  const basePath = '../../assets/mini-vessel-icons/';

  return (
    <TouchableOpacity onPress={onStepClick}>
      <View style={styles.outline}>
        <View style={styles.logoview}>
          {vessel === VESSEL_AEROPRESS
            && <Image style={styles.image} source={require(`${basePath}Aeropress_Minicon.png`)} />}
          {vessel === VESSEL_CHEMEX
            && <Image style={styles.image} source={require(`${basePath}Chemex_Minicon.png`)} />}
          {vessel === VESSEL_FRENCH_PRESS
            && <Image style={styles.image} source={require(`${basePath}FrenchPress_Minicon.png`)} />}
          {vessel === VESSEL_POUROVER
            && <Image style={styles.image} source={require(`${basePath}V60_Minicon.png`)} />}
        </View>
        <Text style={styles.title}>{vessel}</Text>
        <Text style={styles.description}>Brewing Vessel</Text>
      </View>
    </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
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
