
import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image
} from 'react-native';
import * as constants from '../constants';

export default function ListItem(props) {
  const {
    title, selected, onPressItem, isSettings
  } = props;

  const baseButtonPath = '../assets/buttons/menu/';

  let titleStyle = {};
  let containerStyle = {};
  if (isSettings) {
    titleStyle = {
      fontSize: 14,
      fontWeight: '600',
      color: '#333333',
      alignSelf: 'center'
    };
    containerStyle = {
      paddingTop: 12,
      paddingBottom: 12,
      justifyContent: 'center'
    };
  } else {
    titleStyle = {
      fontSize: 16,
      fontWeight: '600',
      color: '#333333',
      alignSelf: 'flex-start'
    };
    containerStyle = {
      paddingTop: 15,
      paddingBottom: 15,
      justifyContent: 'space-between'
    };
  }

  if (selected) {
    containerStyle.backgroundColor = '#DDF0FF';
  }

  let hasIcon = false;
  if (title === constants.RECIPE_MENU_EDIT || title === constants.RECIPE_MENU_FAVORITE
    || title === constants.RECIPE_MENU_UNFAVORITE || title === constants.RECIPE_MENU_DELETE
    || title === constants.RECIPE_MENU_CANCEL) {
    hasIcon = true;
  }

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPressItem(title)}>
      <View style={[styles.textcontainer, containerStyle]}>
        <View style={styles.leftListItem}>
          {hasIcon && (
            <View style={styles.iconContainer}>
              {title === constants.RECIPE_MENU_EDIT && <Image style={styles.icon} source={require(`${baseButtonPath}Menu_Edit.png`)} />}
              {title === constants.RECIPE_MENU_FAVORITE && <Image style={styles.icon} source={require(`${baseButtonPath}Menu_Favorite.png`)} />}
              {title === constants.RECIPE_MENU_UNFAVORITE && <Image style={styles.icon} source={require(`${baseButtonPath}Menu_Unfavorite.png`)} />}
              {title === constants.RECIPE_MENU_DELETE && <Image style={styles.icon} source={require(`${baseButtonPath}Menu_Delete.png`)} />}
              {title === constants.RECIPE_MENU_CANCEL && <Image style={styles.icon} source={require(`${baseButtonPath}Menu_Cancel.png`)} />}
            </View>
          )}
          <Text style={titleStyle}>{title}</Text>
        </View>
        {selected && <Image style={styles.rightIcon} source={require(`${baseButtonPath}Modal_Check.png`)} />}
      </View>
      {hasIcon && <View style={styles.iconSeparator} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textcontainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  leftListItem: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  icon: {
    height: 18,
    resizeMode: 'contain',
    marginRight: 15,
  },
  iconContainer: {
    width: 39,
    padding: 0,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  rightIcon: {
    height: 19,
    resizeMode: 'contain',
    marginLeft: 15,
    justifyContent: 'flex-end'
  },
  iconSeparator: {
    marginLeft: 55,
    height: 1,
    backgroundColor: '#F1F3F6',
  }
});
