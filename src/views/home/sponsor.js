
import React from 'react';
import {
  View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions
} from 'react-native';
import FastImage from 'react-native-fast-image';

export default function Sponsor(props) {
  const { sponsor, onSponsorClick } = props;

  // Take care of sponsors
  const sponsorImage = sponsor.imageLink ? sponsor.imageLink : '';
  const sponsorTextColor = sponsor.textColor ? sponsor.textColor : '#F46F69';
  const disabled = sponsor.disabled;

  const { width } = Dimensions.get('window');

  const descriptionTextColor = {
    color: sponsorTextColor
  }

  return (
    <TouchableWithoutFeedback
      disabled={disabled}
      style={styles.touch}
      onPress={() => onSponsorClick(sponsor)}
    >
      <View>
        <View style={styles.outline}>
          {sponsorImage !== '' && (
          <FastImage
            style={{
              width: width - 30,
              height: 215,
              borderRadius: 20
            }}
            source={{
              uri: sponsorImage,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          )}
          <View style={styles.descriptionOutline}>
            <Text style={[styles.description, descriptionTextColor]}>{sponsor.description}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outline: {
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#727272',
    borderRadius: 20,
    alignSelf: 'center',
    height: 215,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  descriptionOutline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignItems: 'flex-start',
    padding: 15
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
  }
});
