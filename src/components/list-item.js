
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import * as constants from '../constants';

export default function ListItem(props) {
  const { title, onPressItem } = props;

  const baseButtonPath = '../assets/buttons/menu/';

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPressItem(title)}>
      <View style={styles.textcontainer}>
        {title === constants.RECIPE_MENU_EDIT && <Image style={styles.icon} source={require(`${baseButtonPath}Menu_Edit.png`)} />}
        {title === constants.RECIPE_MENU_FAVORITE && <Image style={styles.icon} source={require(`${baseButtonPath}Menu_Favorite.png`)} />}
        {title === constants.RECIPE_MENU_UNFAVORITE && <Image style={styles.icon} source={require(`${baseButtonPath}Menu_Unfavorite.png`)} />}
        {title === constants.RECIPE_MENU_DELETE && <Image style={styles.icon} source={require(`${baseButtonPath}Menu_Delete.png`)} />}
        {title === constants.RECIPE_MENU_CANCEL && <Image style={styles.icon} source={require(`${baseButtonPath}Menu_Cancel.png`)} />}
        <Text style={styles.listtitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D5E9E',
    alignSelf: 'flex-start',
  },
  textcontainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingTop: 15,
    paddingBottom: 15,
    alignItems: 'center'
  },
  icon: {
    height: 18,
    resizeMode: 'contain',
    marginRight: 15,
  }
});
