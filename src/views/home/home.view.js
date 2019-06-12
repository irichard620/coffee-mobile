
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Entry from './entry';
import MenuButtons from './menu-buttons';
import Sponsor from './sponsor';

class HomePage extends Component {
	constructor(props) {
    super(props);
    this.state = {
			tab: 0
		};
		this.onFavoritesClick = this.onFavoritesClick.bind(this);
		this.onCustomClick = this.onCustomClick.bind(this);
		this.onAddClick = this.onAddClick.bind(this);
  }
	onFavoritesClick() {
		// Switch to favorites tab if not there
		if (this.state.tab != 0) {
			this.setState({
				tab: 0
			})
		}
	}
	onCustomClick() {
		// Switch to custom tab if not there
		if (this.state.tab != 1) {
			this.setState({
				tab: 1
			})
		}
	}
	onAddClick() {
		// Pull up add menu
	}
	render() {
		const { tab } = this.state;
		return (
			<ScrollView style={styles.container}>
        <Text style={styles.title}>Good Morning, Emile.</Text>
				<Sponsor
					description={'Recipes perfected in Santa Cruz cafes. Bring the flavors home today.'}
				/>
				<MenuButtons
					onFavoritesClick={this.onFavoritesClick}
					onCustomClick={this.onCustomClick}
					onAddClick={this.onAddClick}
					selected={this.state.tab}
				/>

				{tab == 0 &&
					<React.Fragment>
						<Entry
		          title={'Aeropress - Standard Recipe'}
		          description={'Inverted orientation with a paper filter\n17 grams coffee, medium grind\n230 grams of water at 205°F'}
		        />
		        <Entry
		          title={'Chemex - Standard Recipe'}
		          description={'Paper Chemex filter\n36 grams coffee, medium-coarse grind with tons of Emile\n600 grams of water at 205°F'}
		        />
		        <Entry
		          title={'French Press - Standard Recipe'}
		          description={'8 cup French Press\n55 grams coffee, coarse grind\n850 grams of water at 205°F'}
		        />
					</React.Fragment>}
				{tab == 1 &&
					<React.Fragment>
						<Entry
		          title={'Aeropress World Champion 2018'}
		          description={'Inverted orientation with a paper filter\n35 grams coffee, medium-coarse grind\n200 grams of water at 185°F'}
		        />
		        <Entry
		          title={'Aeropress World Champion 2017'}
		          description={'Inverted orientation with a paper filter\n35 grams coffee, medium-coarse grind\n370 grams of water at 183°F'}
		        />
					</React.Fragment>}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
    backgroundColor: '#F4F4F4'
	},
  title: {
		marginTop: 70,
    marginLeft: 15,
		marginBottom: 20,
    fontSize: 28,
    color: '#1D5E9E',
    alignSelf: 'flex-start',
  }
});

export default HomePage;
