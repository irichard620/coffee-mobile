
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity
} from 'react-native';

export default function Detail(props) {
  const {
    onDetailClick, disabled, title, value, modalId
  } = props;

  const baseButtonPath = '../../assets/buttons/';

  return (
    <TouchableOpacity onPress={() => onDetailClick(modalId)} disabled={disabled}>
      <View style={styles.outline}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rightView}>
          {value !== '' && (
            <Text style={styles.description}>
              {value}
            </Text>
          )}
          <Image style={styles.icon} source={require(`${baseButtonPath}Modal_Arrow.png`)} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outline: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
    height: 48,
    backgroundColor: '#FFFFFF',
  },
  title: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: '#1D5E9E',
    fontSize: 16,
    marginRight: 12
  },
  rightView: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  icon: {
    height: 18,
    resizeMode: 'contain',
  },
});
