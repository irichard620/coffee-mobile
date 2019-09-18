
import React from 'react';
import {
  View, Text, StyleSheet, Image, Dimensions, ScrollView
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ButtonLarge from './button-large';
import ButtonLargeText from './button-large-text';

export default function ModalContentCenter(props) {
  const {
    onCloseClick, title, description, type, primaryButtonTitle,
    secondaryButtonTitle, onPrimaryButtonClick, onSecondaryButtonClick
  } = props;

  // Max height for modal
  const { height, width } = Dimensions.get('window');
  const modalDimensions = {
    maxHeight: height * 0.7,
    width: width - 48
  };
  const imageHeight = {
    height: height * 0.175
  };

  const baseButtonPath = '../assets/buttons/';
  const baseTutorialPath = '../assets/tutorial/';

  return (
    <View style={[styles.content, modalDimensions]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.buttonContainer} onPress={onCloseClick}>
          <Image style={styles.close} source={require(`${baseButtonPath}XButton.png`)} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: '33%', }} />
      </View>
      <ScrollView style={styles.ScrollView}>
        {type === 0 && (
          <Image
            style={[styles.image, imageHeight]}
            source={require(`${baseTutorialPath}Tutorial_1.png`)}
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 24,
    borderRadius: 20,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%'
  },
  title: {
    width: '33%',
    fontSize: 18,
    fontWeight: '600',
    color: '#1D5E9E',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    width: '33%',
    alignItems: 'flex-start'
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '400'
  },
  close: {
    height: 24,
    width: 24
  },
  ScrollView: {
    paddingTop: 16
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    paddingBottom: 32
  }
});
