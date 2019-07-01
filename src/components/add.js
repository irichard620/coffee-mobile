
import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';

class Add extends Component {
	constructor(props){
		super(props);
  }
	render() {
    const baseButtonPath = "../assets/buttons/";

		return (
      <TouchableWithoutFeedback onPress = {this.props.onAddClick}>
        <Image style={styles.add} source={require(baseButtonPath + "Add_Button.png")} />
      </TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
	add: {
		width: 40,
		height: 40,
		alignItems: 'center',
    justifyContent: 'center',
	}
});

export default Add;
