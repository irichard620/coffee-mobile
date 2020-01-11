
import React from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity
} from 'react-native';
import * as constants from '../../constants';

export default function Detail(props) {
  const {
    onDetailClick, disabled, title, value, modalId,
    showArrow, showSeparator, descriptionColor
  } = props;

  const baseButtonPath = '../../assets/buttons/';

  let descriptionValue = value;
  if (
    (
      title === constants.BUILDER_DESCRIPTION_DETAIL
      || title === constants.BUILDER_RECIPE_NAME_DETAIL
    )
    && descriptionValue && descriptionValue.length > 22
  ) {
    descriptionValue = `${value.slice(0, 22)}...`;
  }

  const descriptionColorStyle = {
    color: '#1D5E9E'
  };
  if (descriptionColor) {
    descriptionColorStyle.color = descriptionColor;
  }

  return (
    <TouchableOpacity onPress={() => onDetailClick(modalId)} disabled={disabled}>
      <View style={styles.outline}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rightView}>
          {descriptionValue !== '' && (
            <Text style={[styles.description, descriptionColorStyle]}>
              {descriptionValue}
            </Text>
          )}
          {showArrow && <Image style={styles.icon} source={require(`${baseButtonPath}Modal_Arrow.png`)} />}
        </View>
      </View>
      {showSeparator && (
        <View style={styles.separator} />
      )}
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
  separator: {
    height: 1,
    backgroundColor: '#F1F3F6',
    marginLeft: 16
  }
});
