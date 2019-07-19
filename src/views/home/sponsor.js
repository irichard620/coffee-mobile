
import React from 'react';
import {
  View, Text, StyleSheet, TouchableWithoutFeedback, ImageBackground, Dimensions
} from 'react-native';

export default function Sponsor(props) {
  const { sponsor, onSponsorClick, type } = props;

  // Take care of sponsors
  const sponsorIdToUse = sponsor.sponsorId ? sponsor.sponsorId : '';
  const sponsorImage = sponsor.imageLink ? sponsor.imageLink : '';
  const sponsorThemeColor = sponsor.themeColor ? sponsor.themeColor : '#F46F69';
  const disabled = sponsor.disabled;

  const { height, width } = Dimensions.get('window');
  const widthMultiplier = type === 0 ? 0.88 : 0.9;
  const heightMultiplier1 = type === 0 ? 0.27 : 0.24;
  const heightMultiplier2 = type === 0 ? 0.27 : 0.23;
  const outlineHeight = {
    height: height * heightMultiplier1,
    width: width * widthMultiplier,
    marginLeft: width * 0.05
  };
  const outlineColorOther = {
    height: height * heightMultiplier2,
    marginTop: -(height * heightMultiplier1 * 0.66),
    width: width * widthMultiplier,
    marginRight: width * 0.05,
    backgroundColor: sponsorThemeColor
  };

  return (
    <TouchableWithoutFeedback
      disabled={disabled}
      style={styles.touch}
      onPress={() => onSponsorClick(sponsorIdToUse)}
    >
      <View>
        <ImageBackground
          source={{ uri: sponsorImage }}
          style={[styles.outline, outlineHeight]}
          imageStyle={{ borderRadius: 20 }}
        />
        <View style={[styles.outlinecolor, outlineColorOther]}>
          <Text style={styles.description}>{sponsor.description}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outline: {
    marginLeft: 15,
    marginRight: 15,
    padding: 15,
    resizeMode: 'contain',
    justifyContent: 'space-between',
    zIndex: 3,
    alignSelf: 'flex-start'
  },
  outlinecolor: {
    padding: 15,
    justifyContent: 'flex-end',
    backgroundColor: '#F46F69',
    borderRadius: 20,
    marginLeft: 15,
    marginRight: 15,
    zIndex: 2,
    alignSelf: 'flex-end'
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
