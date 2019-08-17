
import React, { Component } from 'react';
import {
  View, StyleSheet, FlatList
} from 'react-native';
import ListItem from './list-item';

class List extends Component {
  keyExtractor = item => item.title;

  renderItem = ({ item }) => {
    const { onPressItem, isSettings } = this.props;
    return (
      <ListItem
        onPressItem={onPressItem}
        title={item.title}
        isSettings={isSettings}
      />
    );
  }

  renderSeparator = () => (<View style={styles.line} />)

  render() {
    const { options } = this.props;
    return (
      <FlatList
        data={options}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        style={styles.list}
        ItemSeparatorComponent={this.renderSeparator}
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
