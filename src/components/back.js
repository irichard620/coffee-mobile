
import React, { Component } from 'react';
import { View, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native';

class Back extends Component {
	constructor(props){
		super(props);
  }
	render() {
    const { type, onBackClick } = this.props;

    const baseButtonPath = "../assets/buttons/";

		return (
			<TouchableWithoutFeedback onPress = { onBackClick }>
				{type == 0 &&
          <Image style={styles.back} source={require(baseButtonPath + "Back_Blue.png")} />}
			</TouchableWithoutFeedback>
		);
	}
}

const styles = StyleSheet.create({
  back: {
		width: 10,
		height: 20,
		alignItems: 'center',
    justifyContent: 'center',
	}
});

export default Back;
