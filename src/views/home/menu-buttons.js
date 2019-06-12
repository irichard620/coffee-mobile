
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';

class MenuButtons extends Component {
	constructor(props){
		super(props);
		this.onFavoritesClick = this.onFavoritesClick.bind(this);
		this.onCustomClick = this.onCustomClick.bind(this);
		this.onAddClick = this.onAddClick.bind(this);
	}
	onFavoritesClick() {
		this.props.onFavoritesClick();
	}
	onCustomClick() {
		this.props.onCustomClick();
	}
	onAddClick() {
		this.props.onAddClick();
	}
	render() {
		favoritesColor = {};
		customColor = {};
		favoritesTitleColor = {};
		customTitleColor = {};
		if (this.props.selected == 0) {
			favoritesColor = {
				backgroundColor: '#1D5E9E',
			};
			favoritesTitleColor = {
				color: '#FFFFFF'
			};
			customColor = {
				backgroundColor: '#FFFFFF',
			};
			customTitleColor = {
				color: '#1D5E9E'
			};
		} else {
			favoritesColor = {
				backgroundColor: '#FFFFFF',
			};
			favoritesTitleColor = {
				color: '#1D5E9E'
			};
			customColor = {
				backgroundColor: '#1D5E9E',
			};
			customTitleColor = {
				color: '#FFFFFF'
			};
    }

		return (
			<View style={styles.outline}>
				<TouchableHighlight style={[styles.favorites, favoritesColor]} onPress = { this.onFavoritesClick }>
					<View>
						<Text style={[styles.title, favoritesTitleColor]}>Favorites</Text>
					</View>
				</TouchableHighlight>
				<TouchableHighlight style={[styles.custom, customColor]} onPress = { this.onCustomClick }>
					<View>
						<Text style={[styles.title, customTitleColor]}>Custom</Text>
					</View>
				</TouchableHighlight>
				<TouchableHighlight style={styles.add} onPress = { this.onAddClick }>
					<View>
						<Text style={styles.title}>+</Text>
					</View>
				</TouchableHighlight>
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
	},
	title: {
    fontSize: 14,
  },
	favorites: {
		width: '39%',
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
    justifyContent: 'center',
		marginRight: '5%',
  },
  custom: {
		width: '39%',
		height: 40,
		borderRadius: 20,
		alignItems: 'center',
    justifyContent: 'center',
		marginRight: '5%',
  },
	add: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#FFFFFF',
		alignItems: 'center',
    justifyContent: 'center',
	}
});

export default MenuButtons;
