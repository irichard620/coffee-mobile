
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
  const titleWidth = {
    width: width - 48 - 32 - 48
  };

  const baseButtonPath = '../assets/buttons/';
  const baseTutorialPath = '../assets/tutorial/';

  return (
    <View style={[styles.content, modalDimensions]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCloseClick}>
          <Image style={styles.close} source={require(`${baseButtonPath}XButton.png`)} />
        </TouchableOpacity>
        <Text style={[styles.title, titleWidth]}>{title}</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.containerScrollView}>
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
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%'
  },
  title: {
    width: '33%',
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    alignSelf: 'center'
  },
  description: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '400',
    color: '#333333',
  },
  close: {
    height: 24,
    width: 24
  },
  scrollView: {
    paddingTop: 16,
  },
  containerScrollView: {
    alignItems: 'center'
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    marginBottom: 32
  }
});
