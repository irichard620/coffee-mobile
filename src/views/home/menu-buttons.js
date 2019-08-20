
import React from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity
} from 'react-native';

export default function MenuButtons(props) {
  const {
    selected, menuSelected, onItemClick
  } = props;

  let renderOrder = [selected];
  if (menuSelected) {
    if (selected === 0) {
      renderOrder = [0, 1, 2];
    } else if (selected === 1) {
      renderOrder = [1, 0, 2];
    } else {
      renderOrder = [2, 0, 1];
    }
  }

  return (
    <View style={styles.outline}>
      {renderOrder.map((item, idx) => (
        <TouchableOpacity key={item} style={styles.touchable} onPress={() => onItemClick(item)}>
          {(idx === 1 || idx === 2) && <View style={styles.separator} />}
          <View style={styles.textOutline}>
            <Text style={styles.text}>
              {item === 0 && 'All Recipes'}
              {item === 1 && 'Favorites'}
              {item === 2 && 'Featured'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  outline: {
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 20,
    width: 125,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  textOutline: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D5E9E'
  },
  separator: {
    height: 1,
    backgroundColor: '#E3E3E3',
    marginLeft: 10,
    marginRight: 10
  }
});
