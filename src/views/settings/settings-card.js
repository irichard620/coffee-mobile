
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableWithoutFeedback
} from 'react-native';
import {
  SETTINGS_PRO, SETTINGS_PROFILE, SETTINGS_DEFAULT_RECIPES
} from '../../constants';
import List from '../../components/list';

export default function SettingsCard(props) {
  const {
    idx, description, type, disabled, onCardClick, selected,
    onPressItem, options
  } = props;

  const basePath = '../../assets/mini-vessel-icons/';

  let logoBackgroundColor = '';
  if (type === SETTINGS_PRO) {
    logoBackgroundColor = '#1D5E9E';
  } else if (type === SETTINGS_PROFILE) {
    logoBackgroundColor = '#767676';
  } else {
    logoBackgroundColor = '#FFBB22';
  }
  const logoBackgroundStyle = {
    backgroundColor: logoBackgroundColor
  };

  let cardPaddingBottom = {};
  if (!selected) {
    cardPaddingBottom = {
      paddingBottom: 15
    };
  }
  return (
    <TouchableWithoutFeedback onPress={() => onCardClick(idx)} disabled={disabled}>
      <View style={[styles.outline, cardPaddingBottom]}>
        <View style={styles.topview}>
          <View style={[styles.logoview, logoBackgroundStyle]}>
            {type === SETTINGS_PRO
              && <Image style={styles.image} source={require(`${basePath}Settings_DrippyPro.png`)} />}
            {type === SETTINGS_PROFILE
              && <Image style={styles.image} source={require(`${basePath}Settings_UserProfile.png`)} />}
            {type === SETTINGS_DEFAULT_RECIPES
              && <Image style={styles.image} source={require(`${basePath}Settings_DefaultRecipes.png`)} />}
          </View>
          <View style={styles.titleView}>
            <Text
              numberOfLines={1}
              style={styles.title}
            >
              {type}
            </Text>
          </View>
        </View>
        {selected && description !== '' && (
          <View style={styles.descriptionView}>
            <View style={styles.separator} />
            <Text style={styles.description}>{description}</Text>
          </View>
        )}
        {selected && options.length > 0 && <View style={styles.listSeparator} />}
        {selected && (
          <List
            options={options}
            onPressItem={onPressItem}
            isSettings
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outline: {
    borderRadius: 20,
    paddingTop: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 0,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  topview: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingLeft: 15,
    paddingRight: 15,
  },
  logoview: {
    height: 45,
    width: 45,
    borderRadius: 28,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 20,
    resizeMode: 'contain',
  },
  titleView: {
    height: 45,
    justifyContent: 'center',
    flex: 1
  },
  title: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
    justifyContent: 'center',
  },
  descriptionView: {
    alignItems: 'flex-start',
    paddingLeft: 15,
    paddingRight: 15,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#E3E3E3',
    marginTop: 15,
    marginBottom: 15
  },
  listSeparator: {
    height: 1,
    width: '100%',
    backgroundColor: '#E3E3E3',
    marginTop: 15,
  },
  description: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400'
  }
});
