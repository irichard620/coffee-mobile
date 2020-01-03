
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableHighlight
} from 'react-native';
import * as constants from '../../constants';

export default function BrewDetail(props) {
  const {
    onDetailClick, disabled, title, value
  } = props;

  const baseButtonPath = '../../assets/buttons/details/';

  return (
    <TouchableHighlight underlayColor="#F1F3F6" onPress={() => onDetailClick(title)} disabled={disabled}>
      <View style={styles.outline}>
        <View style={styles.leftView}>
          {title === constants.BREW_BREW_SIZE_DETAIL && <Image style={styles.leftIcon} source={require(`${baseButtonPath}Icon_BrewSize.png`)} />}
          {title === constants.BREW_LEARN_MORE_DETAIL && <Image style={styles.leftIcon} source={require(`${baseButtonPath}Icon_LearnMore.png`)} />}
          {title === constants.BREW_HISTORY_DETAIL && <Image style={styles.leftIcon} source={require(`${baseButtonPath}Icon_History.png`)} />}
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.rightView}>
          {value !== '' && (
            <Text style={styles.description}>
              {value}
            </Text>
          )}
          <Image style={styles.icon} source={require(`${baseButtonPath}Brew_Arrow.png`)} />
        </View>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  outline: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 2,
    paddingRight: 2,
    height: 77,
    backgroundColor: '#FFFFFF',
  },
  title: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: '#1D5E9E',
    fontSize: 16,
    marginRight: 16
  },
  leftView: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  rightView: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  leftIcon: {
    height: 53,
    resizeMode: 'contain',
    marginRight: 16
  },
  icon: {
    height: 14,
    resizeMode: 'contain',
  },
});
