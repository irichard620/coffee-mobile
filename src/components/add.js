
import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';

class Add extends Component {
	constructor(props){
		super(props);
  }
	render() {
		const { type } = this.props;

    const baseButtonPath = "../assets/buttons/";

		return (
			<TouchableWithoutFeedback onPress = {this.props.onAddClick} disabled={this.props.disabled}>
				<View>
					{type == 0 && <Image style={styles.add} source={require(baseButtonPath + "Add_Button.png")} />}
					{type == 1 && <Image style={styles.add} source={require(baseButtonPath + "Add_Button_White.png")} />}
				</View>
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
