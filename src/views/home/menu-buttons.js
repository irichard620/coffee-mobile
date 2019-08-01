
import React from 'react';
import {
  View, StyleSheet
} from 'react-native';
import Button from '../../components/button';
import Add from '../../components/add';

export default function MenuButtons(props) {
  const {
    selected, onFavoritesClick, onCustomClick, onAddClick, onAddHold
  } = props;

  // Get button styles
  let favoritesStyle = 0;
  let customStyle = 1;
  if (selected !== 0) {
    favoritesStyle = 1;
    customStyle = 0;
  }
  return (
    <View style={styles.outline}>
      <Button
        onButtonClick={onFavoritesClick}
        type={favoritesStyle}
        title="Favorites"
        width="39%"
        margin={[0, '5%', 0, 0]}
      />
      <Button
        onButtonClick={onCustomClick}
        type={customStyle}
        title="All Recipes"
        width="39%"
        margin={[0, '5%', 0, 0]}
      />
      <Add
        onAddClick={onAddClick}
        onAddHold={onAddHold}
        type={1}
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
