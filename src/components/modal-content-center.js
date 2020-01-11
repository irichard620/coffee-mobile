
import React from 'react';
import {
  View, Text, StyleSheet, Image, Dimensions, ScrollView
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import List from './list';

export default function ModalContentCenter(props) {
  const {
    onCloseClick, title, description, type, primaryButtonTitle,
    secondaryButtonTitle, onPrimaryButtonClick, onSecondaryButtonClick,
    disabled
  } = props;

  // Max height for modal
  const { height, width } = Dimensions.get('window');
  const modalDimensions = {
    maxHeight: height * 0.85,
    width: width - 48
  };
  const titleWidth = {
    width: width - 48 - 32 - 24
  };
  const buttonWidth = width - 48 - 32;

  const baseButtonPath = '../assets/buttons/';

  const options = [{
    type,
    description,
    primaryButtonTitle,
    secondaryButtonTitle,
    buttonWidth,
    disabled,
  }];

  // Note: for scrolling to fully work, need to wrap content in
  // list item where all content touchable
  return (
    <View style={[styles.content, modalDimensions]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.touchable} onPress={onCloseClick}>
          <Image style={styles.close} source={require(`${baseButtonPath}Modal_X.png`)} />
        </TouchableOpacity>
        <Text style={[styles.title, titleWidth]}>{title}</Text>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <List
          options={options}
          onPrimaryButtonClick={onPrimaryButtonClick}
          onSecondaryButtonClick={onSecondaryButtonClick}
          isCenterModal
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 16,
    borderRadius: 20,
  },
  scrollContainer: {
    marginLeft: 6,
  },
  header: {
    height: 56,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%'
  },
  title: {
    width: '33%',
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    alignSelf: 'center'
  },
  touchable: {
    padding: 6,
  },
  close: {
    height: 14,
    width: 14,
    alignSelf: 'center'
  },
});
