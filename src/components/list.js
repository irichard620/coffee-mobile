
import React, { Component } from 'react';
import {
  StyleSheet, FlatList
} from 'react-native';
import ListItem from './list-item';
import ListItemPaywall from './list-item-paywall';
import { RECIPE_MENU_DRIPPY_PRO } from '../constants';

class List extends Component {
  keyExtractor = item => item.title;

  renderItem = ({ item }) => {
    const {
      onPressItem, isSettings, onPrimaryButtonClick, onSecondaryButtonClick
    } = this.props;
    if (item.title === RECIPE_MENU_DRIPPY_PRO) {
      return (
        <ListItemPaywall
          description={item.description}
          type={item.type}
          primaryButtonTitle={item.primaryButtonTitle}
          secondaryButtonTitle={item.secondaryButtonTitle}
          onPrimaryButtonClick={onPrimaryButtonClick}
          onSecondaryButtonClick={onSecondaryButtonClick}
          buttonWidth={item.buttonWidth}
        />
      );
    }
    let selected = false;
    if (('selected' in item) && item.selected) {
      selected = true;
    }
    return (
      <ListItem
        onPressItem={onPressItem}
        title={item.title}
        selected={selected}
        isSettings={isSettings}
      />
    );
  };

  render() {
    const { options } = this.props;
    return (
      <FlatList
        data={options}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        style={styles.list}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    width: '100%'
  },
  line: {
    height: 1,
    backgroundColor: '#E3E3E3'
  }
});

export default List;
