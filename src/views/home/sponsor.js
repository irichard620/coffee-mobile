
import React from 'react';
import {
  View, Text, StyleSheet, TouchableWithoutFeedback, ImageBackground, Image
} from 'react-native';

export default function Sponsor(props) {
  const { sponsors, onSponsorClick } = props;

  // Take care of sponsors
  let sponsorId = '';
  let sponsorDescription = 'Loading Sponsors...';
  let sponsorBackImage = '';
  let sponsorLogoImage = '';
  let disabled = true;
  if (!sponsors || !sponsors.sponsors) {
    sponsorDescription = 'Could not load sponsors';
  } else if (sponsors && !sponsors.sponsorsIsFetching && sponsors.sponsors.length === 0) {
    sponsorDescription = 'No Sponsors to show';
  } else if (sponsors && !sponsors.sponsorsIsFetching && sponsors.sponsors.length !== 0) {
    sponsorDescription = sponsors.sponsors[0].description;
    sponsorId = sponsors.sponsors[0].sponsorId;
    sponsorBackImage = sponsors.sponsors[0].backgroundLink;
    sponsorLogoImage = sponsors.sponsors[0].logoLink;
    disabled = false;
  }
  return (
    <TouchableWithoutFeedback
      disabled={disabled}
      style={styles.touch}
      onPress={() => onSponsorClick(sponsorId)}
    >
      <View>
        <ImageBackground
          source={{ uri: sponsorBackImage }}
          style={styles.outline}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={styles.logocontainer}>
            <Image style={styles.logo} source={{ uri: sponsorLogoImage }} />
          </View>
          <Text style={styles.description}>{sponsorDescription}</Text>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outline: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    padding: 15,
    height: 220,
    resizeMode: 'contain',
    justifyContent: 'space-between'
  },
  logocontainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: '100%'
  },
  logo: {
    height: 85,
    width: '51%',
    resizeMode: 'contain',
  },
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'flex-start',
  }
});
