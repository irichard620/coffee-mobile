
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ListItem from './list-item';

class List extends Component {
	constructor(props) {
    super(props);
  }

  keyExtractor = (item, index) => item.id;

	renderItem = ({item}) => (
    <ListItem
      id={item.id}
      onPressItem={this.props.onPressItem}
      title={item.title}
    />
  );

	render() {
		return (
      <FlatList
  			data={this.props.options}
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
  }
});

export default List;
