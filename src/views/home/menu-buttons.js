
import React from 'react';
import {
  View, StyleSheet, Text, TouchableWithoutFeedback
} from 'react-native';

export default function MenuButtons(props) {
  const {
    selected, onItemClick
  } = props;

  const renderOrder = [1, 0, 2];

  return (
    <View style={styles.outline}>
      {renderOrder.map((item) => {
        // style of button
        let titleStyle = {
          color: '#B1B1B1'
        };
        let buttonStyle = {
          backgroundColor: '#F4F4F4',
          marginRight: 0
        };
        if (selected === item) {
          titleStyle = {
            color: '#399DFF'
          };
          buttonStyle = {
            backgroundColor: '#DAE8F5'
          };
        }

        // Add margin
        if (item !== 2) {
          buttonStyle.marginRight = 5;
        }

        // Title of button
        let title = '';
        if (item === 1) {
          title = 'Favorites';
        } else if (item === 0) {
          title = 'All Recipes';
        } else {
          title = 'Featured';
        }
        return (
          <TouchableWithoutFeedback
            onPress={() => onItemClick(item)}
          >
            <View style={[styles.buttonOutline, buttonStyle]}>
              <Text style={[styles.title, titleStyle]}>{title}</Text>
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  outline: {
    marginBottom: 15,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  buttonOutline: {
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
  },
});
