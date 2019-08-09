
import React from 'react';
import {
  View, StyleSheet, Text
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function Map(props) {
  const {
    latitude, longitude, fullAddress, themeColor
  } = props;

  const themeBackground = {
    backgroundColor: themeColor
  };

  return (
    <View style={styles.outline}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1, height: 150 }}
        region={{
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        pitchEnabled={false}
        scrollEnabled={false}
        rotateEnabled={false}
        zoomEnabled={false}
        zoomTapEnabled={false}
        zoomControlEnabled={false}
      >
        <Marker
          coordinate={{
            latitude,
            longitude
          }}
        />
      </MapView>
      <View style={[styles.addressDisplay, themeBackground]}>
        <Text style={[styles.address]}>{fullAddress}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outline: {
    height: 215,
    borderRadius: 20,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 15,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden'
  },
  addressDisplay: {
    height: 65,
    margin: 0,
    padding: 15
  },
  address: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  }
});
