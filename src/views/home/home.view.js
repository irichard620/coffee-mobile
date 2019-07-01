
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Text, ScrollView, StyleSheet, LayoutAnimation } from 'react-native';
import Entry from './entry';
import MenuButtons from './menu-buttons';
import Sponsor from './sponsor';
import { fetchSponsors } from '../../actions/sponsor-actions';
import { fetchRecipes } from '../../actions/recipe-actions';
import update from 'immutability-helper';
import * as recipeModel from '../../storage/recipe';

class HomePage extends Component {
	constructor(props) {
    super(props);
    this.state = {
			tab: 0,
			selectedFavorites: [],
			selectedCustoms: [],
			favorites: [],
			customs: [],
		};
  }

	componentDidMount() {
		this.props.getSponsors();
		this.props.getRecipes();
	}

	componentWillReceiveProps(nextProps) {
	  const recipes = nextProps.recipes;

		newSelectedFavorites = []
		newSelectedCustoms = []
		newFavorites = []
		newCustoms = []

		if (recipes && !recipes.recipesIsFetching && recipes.recipes.length != 0) {
			for (i = 0; i < recipes.recipes.length; i++) {
				// Push to custom
				newSelectedCustoms.push(false);
				newCustoms.push(recipes.recipes[i]);

				// Push to favorite
				if (recipes.recipes[i].favorited) {
					newSelectedFavorites.push(false);
					newFavorites.push(recipes.recipes[i]);
				}
			}
		}
		this.setState({
			selectedFavorites: newSelectedFavorites,
			favorites: newFavorites,
			selectedCustoms: newSelectedCustoms,
			customs: newCustoms,
		});
	}

	onFavoritesClick = () => {
		// Switch to favorites tab if not there
		if (this.state.tab != 0) {
			this.setState({
				tab: 0
			})
		}
	}

	onCustomClick = () => {
		// Switch to custom tab if not there
		if (this.state.tab != 1) {
			this.setState({
				tab: 1
			})
		}
	}

	onAddClick = () => {
		// Pull up add menu
		this.props.navigation.navigate('Builder')
	}

	onSponsorClick = (sponsorId) => {
		// Pull up sponsor page
		this.props.navigation.navigate('Sponsor', {
      sponsorId: sponsorId
    })
	}

	onEntryClick = (idx) => {
		const { tab, selectedFavorites, selectedCustoms } = this.state;
		var CustomLayoutSpring = {
	    duration: 400,
	    create: {
	      type: LayoutAnimation.Types.spring,
	      property: LayoutAnimation.Properties.scaleY,
	      springDamping: 0.7,
	    },
	    update: {
	      type: LayoutAnimation.Types.spring,
	      springDamping: 0.7,
	    },
	  };
		LayoutAnimation.configureNext(CustomLayoutSpring);
		if (this.state.tab == 0) {
			this.setState({selectedFavorites: selectedFavorites.map((val, i) => i === idx ? !val : val)})
		} else {
			this.setState({selectedCustoms: selectedCustoms.map((val, i) => i === idx ? !val : val)})
		}
	}

	onEditClick = (idx) => {

	}

	onGoClick = (idx) => {
		if (this.state.tab == 0) {
			this.props.navigation.navigate('Brew', {
	      recipe: this.state.favorites[idx]
	    })
		} else {
			this.props.navigation.navigate('Brew', {
	      recipe: this.state.customs[idx]
	    })
		}
	}

	renderEntry = (idx, item) => {
		const { tab, selectedFavorites, selectedCustoms } = this.state;
		var selected = false;
		if (tab == 0) {
			selected = selectedFavorites[idx]
		} else {
			selected = selectedCustoms[idx]
		}
		return (<Entry
			key={item.id}
			idx={idx}
			selected={selected}
			vesselId={item.vesselId}
			title={item.recipeName}
			description={recipeModel.getRecipeDescription(item)}
			onEntryClick={this.onEntryClick}
			onEditClick={this.onEditClick}
			onGoClick={this.onGoClick}
		/>);
	}

	render() {
		const { sponsors, recipes } = this.props
		const { tab, customs, favorites, selectedFavorites, selectedCustoms } = this.state;

		// Take care of sponsors
		let sponsorID = ""
		let sponsorTitle = ""
		let sponsorDescription = "Loading Sponsors..."
		let disabled = true
		if (!sponsors || !sponsors.sponsors) {
			sponsorDescription = "Could not load sponsors"
		} else if (sponsors && !sponsors.sponsorsIsFetching && sponsors.sponsors.length == 0) {
			sponsorDescription = "No Sponsors to show"
		} else if (sponsors && !sponsors.sponsorsIsFetching && sponsors.sponsors.length != 0) {
			sponsorTitle = sponsors.sponsors[0]["company"]
			sponsorDescription = sponsors.sponsors[0]["description"]
			sponsorID = sponsors.sponsors[0]["_id"]
			disabled = false
		}

		return (
			<ScrollView style={styles.container}>
        <Text style={styles.title}>Good Morning, Emile.</Text>
				<Sponsor
					disabled={disabled}
					onSponsorClick={this.onSponsorClick}
					_id={sponsorID}
					title={sponsorTitle}
					description={sponsorDescription}
				/>
				<MenuButtons
					onFavoritesClick={this.onFavoritesClick}
					onCustomClick={this.onCustomClick}
					onAddClick={this.onAddClick}
					selected={this.state.tab}
				/>

				{tab == 0 && favorites.map((favorite, idx) => (
					this.renderEntry(idx, favorite)
				))}
				{tab == 1 && customs.map((custom, idx) => (
					this.renderEntry(idx, custom)
				))}
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
		fontWeight: '600',
  }
});

const mapStateToProps = (state) => ({
	sponsors: state.sponsorsReducer.sponsors,
	recipes: state.recipesReducer.recipes
});

const mapDispatchToProps = { getSponsors: fetchSponsors, getRecipes: fetchRecipes }

HomePage = connect(mapStateToProps,mapDispatchToProps)(HomePage)

export default HomePage;
