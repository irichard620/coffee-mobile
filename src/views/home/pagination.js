
import React from 'react';
import {
  View, StyleSheet
} from 'react-native';

export default function Pagination(props) {
  const {
    total, index, activeColor
  } = props;

  const items = [];
  for (let i = 0; i < total; i += 1) {
    let marginToUse = 0;
    if (i < total - 1) {
      marginToUse = 5;
    }
    const marginStyle = {
      marginRight: marginToUse
    };
    if (i === index) {
      const activeStyle = {
        backgroundColor: activeColor
      };
      items.push(<View key={i} style={[styles.activeDot, activeStyle, marginStyle]} />);
    } else {
      items.push(<View key={i} style={[styles.inactiveDot, marginStyle]} />);
    }
  }

  return (
    <View style={styles.outline}>
      {items}
    </View>
  );
}

const styles = StyleSheet.create({
  outline: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingBottom: 5
  },
  inactiveDot: {
    backgroundColor: '#E3E3E3',
    width: 5,
    height: 5,
    borderRadius: 3
  },
  activeDot: {
    width: 15,
    height: 5,
    borderRadius: 3
  }
});
