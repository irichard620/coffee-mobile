
import React from 'react';
import {
  View, Text, StyleSheet, Image, Dimensions, TouchableWithoutFeedback
} from 'react-native';
import ButtonLarge from './button-large';
import ButtonLargeText from './button-large-text';

export default function ListItemPaywall(props) {
  const {
    description, type, primaryButtonTitle,
    secondaryButtonTitle, onPrimaryButtonClick, onSecondaryButtonClick
  } = props;

  // Max height for modal
  const { height } = Dimensions.get('window');
  const imageHeight = {
    height: height * 0.175
  };

  const baseTutorialPath = '../assets/tutorial/';

  return (
    <TouchableWithoutFeedback style={styles.touchableContent}>
      <View style={styles.content}>
        {type === 0 && (
          <Image
            style={[styles.image, imageHeight]}
            source={require(`${baseTutorialPath}ImageModal.png`)}
          />
        )}
        <Text style={styles.description}>{description}</Text>
        <ButtonLarge
          onButtonClick={onPrimaryButtonClick}
          type={0}
          title={primaryButtonTitle}
          margin={[32, 0, 0, 0]}
        />
        {type === 0 && (
          <ButtonLargeText
            onButtonClick={onSecondaryButtonClick}
            title={secondaryButtonTitle}
            margin={[16, 0, 0, 0]}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  touchableContent: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '400',
    color: '#333333',
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    marginBottom: 32
  }
});
