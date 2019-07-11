
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

class Button extends Component {
	constructor(props){
		super(props);
	}

	render() {
    const { onButtonClick, type, title, width, margin, disabled } = this.props

		backgroundStyle = {
      marginTop: margin[0],
      marginRight: margin[1],
      marginBottom: margin[2],
      marginLeft: margin[3],
      width: width,
    };
		titleStyle = {};
		if (type == 0) {
			backgroundStyle['backgroundColor'] = '#1D5E9E';
			titleStyle = {
				color: '#FFFFFF'
			};
		} else {
      backgroundStyle['backgroundColor'] = '#FFFFFF';
			titleStyle = {
				color: '#1D5E9E'
			};
    }

		return (
			<TouchableHighlight style={[styles.button, backgroundStyle]} onPress = { onButtonClick } disabled={disabled}>
				<View>
					<Text style={[styles.title, titleStyle]}>{title}</Text>
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	title: {
    fontSize: 14,
    fontWeight: '600'
  },
	button: {
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
