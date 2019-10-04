
import React from 'react';
import {
  View, Text, StyleSheet, Image, Dimensions, ScrollView
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import List from './list';
import { RECIPE_MENU_DRIPPY_PRO } from '../constants';

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
  const titleWidth = {
    width: width - 48 - 32 - 48
  };

  const baseButtonPath = '../assets/buttons/';

  const options = [{
    title: RECIPE_MENU_DRIPPY_PRO,
    type,
    description,
    primaryButtonTitle,
    secondaryButtonTitle,
  }];

  // Note: for scrolling to fully work, need to wrap content in
  // list item where all content touchable
  return (
    <View style={[styles.content, modalDimensions]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCloseClick}>
          <Image style={styles.close} source={require(`${baseButtonPath}XButton.png`)} />
        </TouchableOpacity>
        <Text style={[styles.title, titleWidth]}>{title}</Text>
      </View>
      <ScrollView>
        <List
          options={options}
          onPrimaryButtonClick={onPrimaryButtonClick}
          onSecondaryButtonClick={onSecondaryButtonClick}
        />
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
  close: {
    height: 24,
    width: 24
  },
});
