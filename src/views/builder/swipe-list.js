
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import * as constants from './builder-constants';
import Step from './step';
import SwipeListItem from './swipe-list-item';

class SwipeList extends Component {
	constructor(props) {
    super(props);
    this.state = {
      enable: true,
      data: this.props.data,
    };
  }

  renderItem = ({item}) => {
    var type = item['type']
    var canEdit = false;
    if (type == constants.STEP_HEAT_WATER || type == constants.STEP_GRIND_COFFEE
    || type == constants.STEP_BLOOM_GROUNDS || type == constants.STEP_POUR_WATER
    || type == constants.STEP_WAIT) {
      canEdit = true;
    }
    return (<SwipeListItem
      id={item['id']}
      title={item['title']}
      description={item['description']}
      type={type}
      canEdit={canEdit}
      setScrollEnabled={this.setScrollEnabled}
      onPressEdit={this.props.onPressEdit}
      onPressDelete={this.props.onPressDelete}
    />);
  };

  setScrollEnabled = (enable) => {
    this.setState({
      enable,
    });
  }

	render() {
		const { data } = this.props;

    return (
      <FlatList
        style={this.props.list}
        data={data}
        renderItem={this.renderItem}
        scrollEnabled={this.state.enable}
      />
		);
	}
}

const styles = StyleSheet.create({
  list: {

  }
});

export default SwipeList;
