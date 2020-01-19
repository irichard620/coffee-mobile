
import React from 'react';
import {
  View, StyleSheet, Image, TouchableWithoutFeedback
} from 'react-native';

export default function BrewStars(props) {
  const {
    numStars, onStarClicked
  } = props;

  const starValues = [];
  for (let i = 1; i < 6; i += 1) {
    if (numStars >= i) {
      starValues.push(true);
    } else {
      starValues.push(false);
    }
  }

  const baseBrewPath = '../../assets/brew/';

  return (
    <View style={styles.outline}>
      {starValues.map((starValue, index) => {
        if (starValue) {
          return (
            <TouchableWithoutFeedback onPress={() => onStarClicked(index + 1)}>
              <Image style={styles.icon} source={require(`${baseBrewPath}Journal_Star_Filled.png`)} />
            </TouchableWithoutFeedback>
          );
        }
        return (
          <TouchableWithoutFeedback onPress={() => onStarClicked(index + 1)}>
            <Image style={styles.icon} source={require(`${baseBrewPath}Journal_Star_Empty.png`)} />
          </TouchableWithoutFeedback>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  outline: {
    height: 32,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 8,
  },
  icon: {
    height: 32,
    resizeMode: 'contain',
    marginRight: 12,
  }
});
