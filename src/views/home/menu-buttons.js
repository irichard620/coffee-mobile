
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import Button from '../../components/button';
import Add from '../../components/add';

class MenuButtons extends Component {
	constructor(props){
		super(props);
	}

	render() {
		// Get button styles
		favoritesStyle = 0;
		customStyle = 1;
		if (this.props.selected != 0) {
			favoritesStyle = 1;
			customStyle = 0;
    }

		return (
			<View style={styles.outline}>
				<Button
					onButtonClick={this.props.onFavoritesClick}
					type={favoritesStyle}
					title={'Favorites'}
					width={'39%'}
					margin={[0, '5%', 0, 0]}
				/>
				<Button
					onButtonClick={this.props.onCustomClick}
					type={customStyle}
					title={'Custom'}
					width={'39%'}
					margin={[0, '5%', 0, 0]}
				/>
				<Add
					onAddClick={this.props.onAddClick}
					type={1}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	outline: {
		flexDirection:'row',
    flexWrap:'wrap',
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 15,
		alignSelf: 'flex-start',
	}
});

export default MenuButtons;
