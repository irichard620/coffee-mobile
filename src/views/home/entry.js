
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableWithoutFeedback, TouchableOpacity
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Button from '../../components/button';
import * as constants from '../../constants';

export default function Entry(props) {
  const {
    title, description, vessel, selected, onEntryClick, onEditClick,
    onGoClick, idx, isSponsor, onDownloadClick, disabled, isBean, onExploreClick,
    isMap, latitude, longitude, onMapClick
  } = props;

  const basePath = '../../assets/mini-vessel-icons/';
  const baseButtonPath = '../../assets/buttons/';

  const textviewDynamic = {};
  let titleMargin = 0;
  if (selected) {
    textviewDynamic.flexDirection = 'column';
    textviewDynamic.flex = 1;
    titleMargin = 4;
  } else {
    textviewDynamic.justifyContent = 'center';
    textviewDynamic.height = 55;
    textviewDynamic.flex = 1;
  }

  const titleAdditional = {
    marginBottom: titleMargin,
  };

  return (
    <TouchableWithoutFeedback onPress={() => onEntryClick(idx)} disabled={disabled}>
      <View style={styles.outline}>
        <View style={styles.topview}>
          {vessel === constants.VESSEL_AEROPRESS
            && <Image style={styles.image} source={require(`${basePath}Aeropress.png`)} />}
          {vessel === constants.VESSEL_CHEMEX
            && <Image style={styles.image} source={require(`${basePath}Chemex.png`)} />}
          {vessel === constants.VESSEL_FRENCH_PRESS
            && <Image style={styles.image} source={require(`${basePath}FrenchPress.png`)} />}
          {vessel === constants.VESSEL_POUROVER
            && <Image style={styles.image} source={require(`${basePath}V60.png`)} />}
          {vessel === constants.VESSEL_KALITA_WAVE
            && <Image style={styles.image} source={require(`${basePath}Kalita.png`)} />}
          {vessel === constants.VESSEL_MIZUDASHI
            && <Image style={styles.image} source={require(`${basePath}Mizudashi.png`)} />}
          {isBean
            && <Image style={styles.image} source={require(`${basePath}CoffeeBeans.png`)} />}
          {isMap
            && <Image style={styles.image} source={require(`${basePath}LocationPin.png`)} />}
          <View style={textviewDynamic}>
            {!selected && (
            <Text
              key={idx}
              numberOfLines={1}
              style={[styles.title, titleAdditional]}
            >
              {title}
            </Text>
            )}
            {selected && <Text key={idx} style={[styles.title, titleAdditional]}>{title}</Text>}
            {selected && <Text style={styles.description}>{description}</Text>}
          </View>
        </View>
        {selected && !isBean && !isMap && (
        <View style={styles.buttonview}>
          <View style={styles.rightbuttonview}>
            {!isSponsor && (
            <TouchableOpacity onPress={() => onEditClick(idx)} disabled={disabled}>
              <Image style={styles.edit} source={require(`${baseButtonPath}Edit.png`)} />
            </TouchableOpacity>
            )}
            {!isSponsor && (
            <Button
              onButtonClick={() => onGoClick(idx)}
              type={0}
              title="Brew"
              margin={[0, 0, 0, 0]}
              isGlyph
              glyphType={0}
              disabled={disabled}
            />
            )}
            {isSponsor && (
            <Button
              onButtonClick={() => onDownloadClick(idx)}
              type={0}
              title="Save"
              margin={[0, 0, 0, 0]}
              isGlyph
              glyphType={1}
              disabled={disabled}
            />
            )}
          </View>
        </View>
        )}
        {selected && isBean && (
        <View style={styles.beanbuttonview}>
          <Button
            onButtonClick={() => onExploreClick(idx)}
            type={0}
            title="Explore the coffee"
            margin={[0, 0, 0, 0]}
          />
        </View>
        )}
        {selected && isMap && (
        <TouchableWithoutFeedback onPress={() => onMapClick()}>
          <View style={styles.mapview}>
            <MapView
              provider={PROVIDER_DEFAULT}
              style={{ flex: 1, height: 125 }}
              region={{
                latitude,
                longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0075,
              }}
              pitchEnabled={false}
              scrollEnabled={false}
              rotateEnabled={false}
              zoomControlEnabled={false}
              showsPointsOfInterest={false}
              showsBuildings={false}
              showsTraffic={false}
              onPress={() => onMapClick()}
            >
              <Marker
                coordinate={{
                  latitude,
                  longitude
                }}
              />
            </MapView>
          </View>
        </TouchableWithoutFeedback>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outline: {
    borderRadius: 20,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 0,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  topview: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  image: {
    height: 53,
    width: 53,
    borderRadius: 20,
    marginRight: 16,
    resizeMode: 'contain',
  },
  title: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
    justifyContent: 'center',
    lineHeight: 16,
  },
  description: {
    color: '#727272',
    fontSize: 14,
    lineHeight: 16
  },
  buttonview: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-end'
  },
  beanbuttonview: {
    marginTop: 24,
    alignItems: 'center'
  },
  rightbuttonview: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start'
  },
  mapview: {
    marginTop: 16,
    height: 125,
    marginLeft: -16,
    marginRight: -16,
    marginBottom: -15,
  },
  edit: {
    height: 40,
    width: 40,
    marginRight: 15
  },
  use: {
    height: 40,
    width: 40,
  }
});
