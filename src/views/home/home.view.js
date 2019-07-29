
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, LayoutAnimation, View, Dimensions
} from 'react-native';
import Entry from './entry';
import MenuButtons from './menu-buttons';
import SponsorCarousel from './sponsor-carousel';
import { fetchSponsors } from '../../actions/sponsor-actions';
import {
  fetchRecipes, favoriteRecipe, unfavoriteRecipe, deleteRecipe
} from '../../actions/recipe-actions';
import * as recipeModel from '../../storage/recipe';
import * as constants from '../../constants';
import CustomModal from '../../components/modal';

const CustomLayoutSpring = {
  duration: 250,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
    springDamping: 0.6,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
    springDamping: 0.6,
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
      deleteModal: false,
      sponsorIndex: 0
    };
  }

  componentDidMount() {
    const { getSponsors, getRecipes } = this.props;
    getSponsors();
    getRecipes();
  }

  componentWillReceiveProps(nextProps) {
    const { recipes } = nextProps;

    if (recipes && !recipes.recipesIsFetching && !recipes.recipeIsSaving
      && !recipes.recipeIsDeleting) {
      const newSelectedFavorites = [];
      const newSelectedCustoms = [];
      const newFavorites = [];
      const newCustoms = [];

      for (let i = 0; i < recipes.recipes.length; i += 1) {
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
    const { tab } = this.state;
    if (tab !== 0) {
      this.setState({
        tab: 0
      });
    }
  }

  onCustomClick = () => {
    // Switch to custom tab if not there
    const { tab } = this.state;
    if (tab !== 1) {
      this.setState({
        tab: 1
      });
    }
  }

  onAddClick = () => {
    // Pull up add menu
    const { navigation } = this.props;
    navigation.navigate('Builder');
  }

  onSponsorClick = (sponsorId) => {
    // Pull up sponsor page
    const { navigation } = this.props;
    navigation.navigate('Sponsor', {
      sponsorId
    });
  }

  onSnapToItem = (idx) => {
    this.setState({ sponsorIndex: idx });
  }

  onEntryClick = (idx) => {
    const { tab, selectedFavorites, selectedCustoms } = this.state;

    LayoutAnimation.configureNext(CustomLayoutSpring);
    if (tab === 0) {
      this.setState({
        selectedFavorites: selectedFavorites.map((val, i) => (i === idx ? !val : false))
      });
    } else {
      this.setState({
        selectedCustoms: selectedCustoms.map((val, i) => (i === idx ? !val : false))
      });
    }
  }

  onEditClick = (idx) => {
    const { tab, favorites, customs } = this.state;
    let arrToUse = [];
    if (tab === 0) {
      arrToUse = favorites;
    } else {
      arrToUse = customs;
    }
    this.setState({
      visibleModal: true,
      modalRecipeId: arrToUse[idx].recipeId,
      modalRecipeIndex: idx,
      deleteModal: false
    });
  }

  onGoClick = (idx) => {
    const { navigation } = this.props;
    const { tab, favorites, customs } = this.state;
    if (tab === 0) {
      navigation.navigate('Brew', {
        recipe: favorites[idx]
      });
    } else {
      navigation.navigate('Brew', {
        recipe: customs[idx]
      });
    }
  }

  getModalOptions = () => {
    const {
      tab, favorites, customs, deleteModal, modalRecipeIndex
    } = this.state;

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
      ];
    }

    const options = [{
      id: constants.RECIPE_MENU_EDIT,
      title: 'Edit recipe'
    }];

    let arrToSearch = [];
    if (tab === 0) {
      arrToSearch = favorites;
    } else {
      arrToSearch = customs;
    }
    if (modalRecipeIndex !== -1) {
      const recipe = arrToSearch[modalRecipeIndex];
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
    return options;
  }

  onCloseClick = () => {
    // Close and clear modal
    this.setState({
      visibleModal: false,
      modalRecipeId: '',
      modalRecipeIndex: -1,
    });
  }

  onPressItem = (item) => {
    const {
      navigation, favRecipe, unfavRecipe, delRecipe
    } = this.props;
    const {
      tab, deleteModal, modalRecipeId, modalRecipeIndex, favorites, customs
    } = this.state;

    if (item === constants.RECIPE_MENU_EDIT) {
      // Close and clear modal
      this.setState({
        visibleModal: false,
        modalRecipeId: '',
        modalRecipeIndex: -1,
      });
      if (tab === 0) {
        navigation.navigate('Builder', {
          recipe: favorites[modalRecipeIndex]
        });
      } else {
        navigation.navigate('Builder', {
          recipe: customs[modalRecipeIndex]
        });
      }
    } else if (item === constants.RECIPE_MENU_FAVORITE) {
      // Call favorite recipe
      favRecipe(modalRecipeId);
    } else if (item === constants.RECIPE_MENU_UNFAVORITE) {
      // Call unfavorite recipe
      unfavRecipe(modalRecipeId);
    } else if (item === constants.RECIPE_MENU_DELETE) {
      // Call delete recipe
      if (!deleteModal) {
        this.setState({
          deleteModal: true
        });
      } else {
        delRecipe(modalRecipeId);
      }
    } else if (item === constants.RECIPE_MENU_CANCEL) {
      // Call clear
      this.onCloseClick();
    }
  }

  renderEntry = (idx, item) => {
    const { tab, selectedFavorites, selectedCustoms } = this.state;
    let selected = false;
    if (tab === 0) {
      selected = selectedFavorites[idx];
    } else {
      selected = selectedCustoms[idx];
    }
    return (
      <Entry
        key={item.recipeId}
        idx={idx}
        selected={selected}
        vesselId={item.vesselId}
        title={item.recipeName}
        description={recipeModel.getRecipeDescription(item)}
        onEntryClick={this.onEntryClick}
        onEditClick={this.onEditClick}
        onGoClick={this.onGoClick}
      />
    );
  }

  render() {
    const { sponsors } = this.props;
    const {
      tab, customs, favorites, visibleModal, deleteModal, sponsorIndex
    } = this.state;

    let modalTitle = '';
    if (deleteModal) {
      modalTitle = 'Delete this recipe?';
    }

    // Top margin
    const { height } = Dimensions.get('window');
    const topPaddingStyle = {
      paddingTop: height * 0.07
    };

    return (
      <ScrollView style={[styles.container, topPaddingStyle]}>
        {sponsors && !sponsors.sponsorsIsFetching
        && sponsors.sponsors.length !== 0 && (
        <SponsorCarousel
          onSponsorClick={this.onSponsorClick}
          sponsors={sponsors}
          onSnapToItem={this.onSnapToItem}
          index={sponsorIndex}
        />
        )}
        <MenuButtons
          onFavoritesClick={this.onFavoritesClick}
          onCustomClick={this.onCustomClick}
          onAddClick={this.onAddClick}
          selected={tab}
        />

        <View style={styles.entrycontainer}>
          {tab === 0 && favorites.map((favorite, idx) => (
            this.renderEntry(idx, favorite)
          ))}
          {tab === 1 && customs.map((custom, idx) => (
            this.renderEntry(idx, custom)
          ))}
        </View>

        <CustomModal
          visibleModal={visibleModal}
          title={modalTitle}
          onCloseClick={this.onCloseClick}
          onPressItem={this.onPressItem}
          isListModal
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
    backgroundColor: '#F4F4F4',
  },
  entrycontainer: {
    marginBottom: 90
  }
});

const mapStateToProps = state => ({
  sponsors: state.sponsorsReducer.sponsors,
  recipes: state.recipesReducer.recipes
});

const mapDispatchToProps = {
  getSponsors: fetchSponsors,
  getRecipes: fetchRecipes,
  favRecipe: favoriteRecipe,
  unfavRecipe: unfavoriteRecipe,
  delRecipe: deleteRecipe
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
