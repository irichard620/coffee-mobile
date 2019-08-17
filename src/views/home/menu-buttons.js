
import React from 'react';
import {
  View, StyleSheet, Dimensions
} from 'react-native';
import Button from '../../components/button';

export default function MenuButtons(props) {
  const {
    selected, onFavoritesClick, onCustomClick
  } = props;

  // Get button styles
  let favoritesStyle = 0;
  let customStyle = 1;
  if (selected !== 0) {
    favoritesStyle = 1;
    customStyle = 0;
  }

  // Get button widths
  const { width } = Dimensions.get('window');
  const buttonWidth = (width - 45) / 2;

  return (
    <View style={styles.outline}>
      <Button
        onButtonClick={onFavoritesClick}
        type={favoritesStyle}
        title="Favorites"
        width={buttonWidth}
        margin={[0, 15, 0, 0]}
      />
      <Button
        onButtonClick={onCustomClick}
        type={customStyle}
        title="All Recipes"
        width={buttonWidth}
        margin={[0, 0, 0, 0]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    alignSelf: 'flex-start',
  }
});
