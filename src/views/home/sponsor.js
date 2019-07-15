
import React from 'react';
import {
  View, Text, StyleSheet, TouchableWithoutFeedback, ImageBackground, Image, Dimensions
} from 'react-native';

export default function Sponsor(props) {
  const { sponsors, onSponsorClick } = props;

  // Take care of sponsors
  let sponsorIdToUse = '';
  let sponsorDescription = 'Loading Sponsors...';
  let sponsorBackImage = '';
  let sponsorLogoImage = '';
  let disabled = true;
  if (!sponsors || !sponsors.sponsors) {
    sponsorDescription = 'Could not load sponsors';
  } else if (sponsors && !sponsors.sponsorsIsFetching && sponsors.sponsors.length === 0) {
    sponsorDescription = 'No Sponsors to show';
  } else if (sponsors && !sponsors.sponsorsIsFetching && sponsors.sponsors.length !== 0) {
    const {
      description, sponsorId, backgroundLink, logoLink
    } = sponsors.sponsors[0];
    sponsorDescription = description;
    sponsorIdToUse = sponsorId;
    sponsorBackImage = backgroundLink;
    sponsorLogoImage = logoLink;
    disabled = false;
  }

  const { height } = Dimensions.get('window');
  const outlineHeight = {
    height: height * 0.24
  }

  return (
    <TouchableWithoutFeedback
      disabled={disabled}
      style={styles.touch}
      onPress={() => onSponsorClick(sponsorIdToUse)}
    >
      <View>
        <ImageBackground
          source={{ uri: sponsorBackImage }}
          style={[styles.outline, outlineHeight]}
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
    resizeMode: 'contain',
    justifyContent: 'space-between'
  },
  logocontainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '68%',
    width: '100%'
  },
  logo: {
    height: '57%',
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
