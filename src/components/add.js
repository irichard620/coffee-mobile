
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

class Add extends Component {
	constructor(props){
		super(props);
  }
	render() {
    addBackgroundColor = {
      backgroundColor: this.props.backgroundColor
    }
    addTextColor = {
      color: this.props.textColor
    }
		return (
			<TouchableHighlight style={[styles.add, addBackgroundColor]} onPress = { this.props.onAddClick }>
				<View>
					<Text style={[styles.title, addTextColor]}>+</Text>
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	title: {
    fontSize: 14,
  },
	add: {
		width: 40,
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
    justifyContent: 'center',
	}
});

export default Add;
