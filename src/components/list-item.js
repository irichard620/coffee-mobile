
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MODAL_NEW_STEP = 'modal_new_step';
const MODAL_BREW_VESSEL = 'modal_brew_vessel';
const MODAL_FILTER_TYPE = 'modal_filter_type';

class ListItem extends Component {
	constructor(props) {
    super(props);
  }

  onPress = () => {
    this.props.onPressItem(this.props.id);
  };

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this.onPress}>
        <View style={styles.line}/>
        <View style={styles.textcontainer}>
          <Text style={styles.listtitle}>{this.props.title}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listtitle: {
    fontSize: 16,
    color: '#1D5E9E',
    alignSelf: 'flex-start',
  },
	textcontainer: {
    paddingTop: 15,
    paddingBottom: 15
  },
  line: {
    height: 1,
    backgroundColor: '#E3E3E3'
  }
});

export default ListItem;
