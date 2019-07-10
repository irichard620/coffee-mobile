
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Text, ScrollView, StyleSheet, LayoutAnimation } from 'react-native';
import Entry from './entry';
import MenuButtons from './menu-buttons';
import Sponsor from './sponsor';
import { fetchSponsors } from '../../actions/sponsor-actions';
import { fetchRecipes, favoriteRecipe, unfavoriteRecipe, deleteRecipe } from '../../actions/recipe-actions';
import update from 'immutability-helper';
import * as recipeModel from '../../storage/recipe';
import * as constants from '../../constants';
import CustomModal from "../../components/modal";
import { withNavigationFocus } from "react-navigation";

const CustomLayoutSpring = {
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

class HomePage extends Component {
	constructor(props) {
    super(props);
    this.state = {
			tab: 0,
			selectedFavorites: [],
			selectedCustoms: [],
			favorites: [],
			customs: [],
			modalRecipeId: '',
			modalRecipeIndex: -1,
			visibleModal: false,
			deleteModal: false
		};
  }

	componentDidMount() {
		this.props.getSponsors();
		this.props.getRecipes();
	}

	componentWillReceiveProps(nextProps) {
	  const recipes = nextProps.recipes;

		if (recipes && !recipes.recipesIsFetching && !recipes.recipeIsSaving &&
			!recipes.recipeIsDeleting) {
			newSelectedFavorites = []
			newSelectedCustoms = []
			newFavorites = []
			newCustoms = []

			for (i = 0; i < recipes.recipes.length; i++) {
				// Push to favorite
				if (recipes.recipes[i].favorited) {
					newSelectedFavorites.push(false);
					newFavorites.push(recipes.recipes[i]);
				} else {
					// Push to custom
					newSelectedCustoms.push(false);
					newCustoms.push(recipes.recipes[i]);
				}
			}

			this.setState({
				modalRecipeId: '',
				modalRecipeIndex: -1,
				visibleModal: false,
				deleteModal: false,
				selectedFavorites: newSelectedFavorites,
				favorites: newFavorites,
				selectedCustoms: newSelectedCustoms,
				customs: newCustoms,
			});
		}
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
		console.log("sponsor click " + sponsorId)
		this.props.navigation.navigate('Sponsor', {
      sponsorId: sponsorId
    })
	}

	onEntryClick = (idx) => {
		const { tab, selectedFavorites, selectedCustoms } = this.state;

		LayoutAnimation.configureNext(CustomLayoutSpring);
		if (this.state.tab == 0) {
			this.setState({selectedFavorites: selectedFavorites.map((val, i) => i === idx ? !val : false)})
		} else {
			this.setState({selectedCustoms: selectedCustoms.map((val, i) => i === idx ? !val : false)})
		}
	}

	onEditClick = (idx) => {
		var arrToUse = []
		if (this.state.tab == 0) {
			arrToUse = this.state.favorites;
		} else {
			arrToUse = this.state.customs;
		}
		this.setState({
			visibleModal: true,
			modalRecipeId: arrToUse[idx].recipeId,
			modalRecipeIndex: idx,
			deleteModal: false
		});
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

	getModalOptions = () => {
		const { favorites, customs, deleteModal, modalRecipeId, modalRecipeIndex } = this.state;

		if (deleteModal) {
			return [
				{
					id: constants.RECIPE_MENU_CANCEL,
					title: 'Cancel'
				},
				{
					id: constants.RECIPE_MENU_DELETE,
					title: 'Delete'
				},
			]
		}

		options = [{
			id: constants.RECIPE_MENU_EDIT,
			title: 'Edit recipe'
		}];

		var arrToSearch = []
		if (this.state.tab == 0) {
			arrToSearch = favorites
		} else {
			arrToSearch = customs
		}
		if (modalRecipeIndex != -1) {
			var recipe = arrToSearch[modalRecipeIndex];
			if (recipe.favorited) {
				options.push({
					id: constants.RECIPE_MENU_UNFAVORITE,
					title: 'Unfavorite recipe'
				});
			} else {
				options.push({
					id: constants.RECIPE_MENU_FAVORITE,
					title: 'Favorite recipe'
				});
			}
		}
		options.push({
			id: constants.RECIPE_MENU_DELETE,
			title: 'Delete'
		});
		return options
	}

	onCloseClick = () => {
		// Close and clear modal
		this.setState({
			visibleModal: false,
			modalRecipeId: "",
			modalRecipeIndex: -1,
		});
	}

	onPressItem = (item) => {
		const { tab, deleteModal, modalRecipeId, modalRecipeIndex, favorites, customs } = this.state;

		if (item == constants.RECIPE_MENU_EDIT) {
			// TODO: go to builder page and pass in this recipe
			if (tab == 0) {
				this.props.navigation.navigate('Builder', {
		      recipe: favorites[modalRecipeIndex]
				})
			} else {
				this.props.navigation.navigate('Builder', {
		      recipe: customs[modalRecipeIndex]
				})
			}
		} else if (item == constants.RECIPE_MENU_FAVORITE) {
			// Call favorite recipe
			this.props.favoriteRecipe(modalRecipeId);
		} else if (item == constants.RECIPE_MENU_UNFAVORITE) {
			// Call unfavorite recipe
			this.props.unfavoriteRecipe(modalRecipeId);
		} else if (item == constants.RECIPE_MENU_DELETE) {
			// Call delete recipe
			if (!deleteModal) {
				this.setState({
					deleteModal: true
				});
			} else {
				this.props.deleteRecipe(modalRecipeId);
			}
		} else if (item == constants.RECIPE_MENU_CANCEL) {
			// Call clear
			this.onCloseClick();
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
			key={item.recipeId}
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
		const { sponsors } = this.props
		const { tab, customs, favorites, selectedFavorites, selectedCustoms, visibleModal, deleteModal } = this.state;

		var modalTitle = ""
		if (deleteModal) {
			modalTitle = "Delete this recipe?"
		}

		return (
			<ScrollView style={styles.container}>
        <Text style={styles.title}>Good Morning, Emile.</Text>
				<Sponsor
					onSponsorClick={this.onSponsorClick}
					sponsors={sponsors}
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

				<CustomModal
					visibleModal={visibleModal}
					title={modalTitle}
					onCloseClick={this.onCloseClick}
		      onPressItem={this.onPressItem}
					isListModal={true}
		      isSelectInput={false}
					options={this.getModalOptions()}
				/>
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

const mapDispatchToProps = { getSponsors: fetchSponsors, getRecipes: fetchRecipes,
	favoriteRecipe: favoriteRecipe, unfavoriteRecipe: unfavoriteRecipe, deleteRecipe: deleteRecipe }

HomePage = connect(mapStateToProps,mapDispatchToProps)(HomePage)

export default withNavigationFocus(HomePage);
