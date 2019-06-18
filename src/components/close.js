
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

class Close extends Component {
	constructor(props){
		super(props);
  }
	render() {
    closeBackgroundColor = {
      backgroundColor: '#E3E3E3'
    }
    closeTextColor = {
      color: '#FFFFFF'
    }
		return (
			<TouchableHighlight style={[styles.close, closeBackgroundColor]} onPress = { this.props.onCloseClick }>
				<View>
					<Text style={[styles.title, closeTextColor]}>x</Text>
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	title: {
    fontSize: 14,
  },
	close: {
		width: 25,
		height: 25,
		borderRadius: 12.5,
		alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15
	}
});

export default Close;
