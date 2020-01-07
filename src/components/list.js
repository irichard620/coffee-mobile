
import React, { Component } from 'react';
import {
  StyleSheet, FlatList
} from 'react-native';
import ListItem from './list-item';
import ListItemModalCenter from './list-item-modal-center';

class List extends Component {
  keyExtractor = item => item.title;

  renderItem = ({ item }) => {
    const {
      onPressItem, isSettings, onPrimaryButtonClick, onSecondaryButtonClick,
      isCenterModal
    } = this.props;
    if (isCenterModal) {
      return (
        <ListItemModalCenter
          description={item.description}
          type={item.type}
          primaryButtonTitle={item.primaryButtonTitle}
          secondaryButtonTitle={item.secondaryButtonTitle}
          onPrimaryButtonClick={onPrimaryButtonClick}
          onSecondaryButtonClick={onSecondaryButtonClick}
          buttonWidth={item.buttonWidth}
          disabled={item.disabled}
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
