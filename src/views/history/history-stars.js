
import React from 'react';
import {
  View, StyleSheet, Image
} from 'react-native';

export default function HistoryStars(props) {
  const { numStars } = props;

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
      {starValues.map((starValue) => {
        if (starValue) {
          return (
            <Image style={styles.icon} source={require(`${baseBrewPath}Journal_Star_Filled.png`)} />
          );
        }
        return (
          <Image style={styles.icon} source={require(`${baseBrewPath}Journal_Star_Empty.png`)} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  outline: {
    marginTop: 8,
    height: 16,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  icon: {
    height: 16,
    width: 16,
    resizeMode: 'contain',
    marginRight: 6,
  }
});
