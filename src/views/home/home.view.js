
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, LayoutAnimation, View, Dimensions,
  Animated, Easing
} from 'react-native';
import Entry from './entry';
import FloatingButton from '../../components/floating-button';
import MenuButtons from './menu-buttons';
import SponsorCarousel from './sponsor-carousel';
import { fetchSponsors } from '../../actions/sponsor-actions';
import { brewStartAnalytics } from '../../actions/analytics-actions';
import {
  fetchRecipes, favoriteRecipe, unfavoriteRecipe, deleteRecipe
} from '../../actions/recipe-actions';
import * as recipeModel from '../../storage/recipe';
import * as constants from '../../constants';
import CustomModal from '../../components/modal';

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
      sponsorIndex: 0,
      recipesIsFetching: false,
      recipeIsSaving: false,
      recipeIsDeleting: false,
      userIsSaving: false,
      menuSelected: false,
      spinValue: new Animated.Value(0),
      useMetric: false
    };
  }

  componentDidMount() {
    const { getRecipes, user } = this.props;
    getRecipes();
    // Get temp preference
    if (user && Object.keys(user.user).length !== 0 && ('useMetric' in user.user)) {
      this.setState({
        useMetric: user.user.useMetric
      });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const nextRecipes = nextProps.recipes;
    const nextUser = nextProps.user;

    if (nextRecipes && !prevState.recipesIsFetching && nextRecipes.recipesIsFetching) {
      return {
        recipesIsFetching: true
      };
    } if (nextRecipes && !prevState.recipeIsSaving && nextRecipes.recipeIsSaving) {
      return {
        recipeIsSaving: true
      };
    } if (nextRecipes && !prevState.recipeIsDeleting && nextRecipes.recipeIsDeleting) {
      return {
        recipeIsDeleting: true
      };
    } if (nextUser && !prevState.userIsSaving && nextUser.userIsSaving) {
      return {
        userIsSaving: true
      };
    } if (nextRecipes && ((prevState.recipesIsFetching && !nextRecipes.recipesIsFetching)
    || (prevState.recipeIsSaving && !nextRecipes.recipeIsSaving)
    || (prevState.recipeIsDeleting && !nextRecipes.recipeIsDeleting))) {
      const newSelectedFavorites = [];
      const newSelectedCustoms = [];
      const newFavorites = [];
      const newCustoms = [];

      for (let i = 0; i < nextRecipes.recipes.length; i += 1) {
        // Push to favorite
        if (nextRecipes.recipes[i].favorited) {
          newSelectedFavorites.push(false);
          newFavorites.push(nextRecipes.recipes[i]);
        }
        // Push to all recipes
        newSelectedCustoms.push(false);
        newCustoms.push(nextRecipes.recipes[i]);
      }

      return {
        modalRecipeId: '',
        modalRecipeIndex: -1,
        visibleModal: false,
        deleteModal: false,
        selectedFavorites: newSelectedFavorites,
        favorites: newFavorites,
        selectedCustoms: newSelectedCustoms,
        customs: newCustoms,
        recipesIsFetching: false,
        recipeIsSaving: false,
        recipeIsDeleting: false
      };
    } if (nextUser && prevState.userIsSaving && !nextUser.userIsSaving) {
      return {
        useMetric: nextUser.user.useMetric
      };
    }
    return null;
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
    const { navigation, user } = this.props;
    const { useMetric } = this.state;
    if (('premium' in user && !user.premium)) {
      // Block action
      Alert.alert(
        'Premium Only',
        'Building recipes is a feature for premium users only.',
        [
          {
            text: 'Ok'
          },
        ],
      );
      return;
    }
    navigation.navigate('Builder', {
      useMetric
    });
  }

  onSettingsClick = () => {
    // Pull up settings menu
    const { navigation } = this.props;
    navigation.navigate('Settings');
  }

  onSponsorClick = (sponsor) => {
    // Pull up sponsor page
    const { navigation } = this.props;
    const { useMetric } = this.state;
    navigation.navigate('Sponsor', {
      sponsor,
      useMetric
    });
  }

  onSnapToItem = (idx) => {
    LayoutAnimation.configureNext(constants.CustomLayoutSpring);
    this.setState({ sponsorIndex: idx });
  }

  onEntryClick = (idx) => {
    const { tab, selectedFavorites, selectedCustoms } = this.state;

    LayoutAnimation.configureNext(constants.CustomLayoutSpring);
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
    const {
      tab, favorites, customs, useMetric
    } = this.state;
    let recipeToBrew = {};
    if (tab === 0) {
      recipeToBrew = favorites[idx];
    } else {
      recipeToBrew = customs[idx];
    }

    // Analytics
    brewStartAnalytics(recipeToBrew.recipeId, recipeToBrew.recipeName,
      recipeToBrew.brewingVessel, recipeToBrew.sponsorId);

    // Navigate
    navigation.navigate('Brew', {
      recipe: recipeToBrew,
      useMetric
    });
  }

  getModalOptions = () => {
    const {
      tab, favorites, customs, deleteModal, modalRecipeIndex
    } = this.state;

    if (deleteModal) {
      return [
        {
          title: constants.RECIPE_MENU_CANCEL,
        },
        {
          title: constants.RECIPE_MENU_DELETE,
        },
      ];
    }

    const options = [{
      title: constants.RECIPE_MENU_EDIT,
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
          title: constants.RECIPE_MENU_UNFAVORITE,
        });
      } else {
        options.push({
          title: constants.RECIPE_MENU_FAVORITE,
        });
      }
    }
    options.push({
      title: constants.RECIPE_MENU_DELETE,
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
      tab, deleteModal, modalRecipeId, modalRecipeIndex, favorites,
      customs, useMetric
    } = this.state;

    if (item === constants.RECIPE_MENU_EDIT) {
      // TODO: block action if free user
      // Close and clear modal
      this.setState({
        visibleModal: false,
        modalRecipeId: '',
        modalRecipeIndex: -1,
      });
      if (tab === 0) {
        navigation.navigate('Builder', {
          recipe: favorites[modalRecipeIndex],
          useMetric
        });
      } else {
        navigation.navigate('Builder', {
          recipe: customs[modalRecipeIndex],
          useMetric
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

  startRotateAnimation = (endVal, durationVal) => {
    const { spinValue } = this.state;
    Animated.timing(
      spinValue,
      {
        toValue: endVal,
        duration: durationVal,
        easing: Easing.linear,
        useNativeDriver: true
      }
    ).start();
  }

  onFloatingClick = (type) => {
    const { menuSelected } = this.state;

    if (type === 0) {
      // Update to menu selected or not selected
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      if (!menuSelected) {
        this.startRotateAnimation(1, 300);
      } else {
        this.startRotateAnimation(0, 300);
      }
      this.setState({ menuSelected: !menuSelected });
    } else if (type === 1) {
      // Settings page
      this.startRotateAnimation(0, 1);
      this.setState({ menuSelected: false });
      this.onSettingsClick();
    } else {
      // New recipe
      this.startRotateAnimation(0, 1);
      this.setState({ menuSelected: false });
      this.onAddClick();
    }
  }

  renderEntry = (idx, item) => {
    const {
      tab, selectedFavorites, selectedCustoms, useMetric
    } = this.state;
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
        vessel={item.brewingVessel}
        title={item.recipeName}
        description={recipeModel.getRecipeDescription(item, useMetric)}
        onEntryClick={this.onEntryClick}
        onEditClick={this.onEditClick}
        onGoClick={this.onGoClick}
      />
    );
  }

  render() {
    const { sponsors } = this.props;
    const {
      tab, customs, favorites, visibleModal, deleteModal, sponsorIndex,
      menuSelected, spinValue
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

    // Floating left margin
    const { width } = Dimensions.get('window');
    const marginLeftContainer = {
      left: (width / 2.0) - 31
    };

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg']
    });

    return (
      <View style={styles.outerContainer}>
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
            onAddHold={this.onAddHold}
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
        {menuSelected && <View style={styles.darkBackground} />}
        <View style={[styles.floatingButtons, marginLeftContainer]}>
          <FloatingButton
            onFloatingClick={this.onFloatingClick}
            type={2}
            disabled={!menuSelected}
          />
          <FloatingButton
            onFloatingClick={this.onFloatingClick}
            type={1}
            disabled={!menuSelected}
          />
          <FloatingButton
            onFloatingClick={this.onFloatingClick}
            type={0}
            spinValue={spin}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  entrycontainer: {
    marginBottom: 90
  },
  floatingButtons: {
    position: 'absolute',
    bottom: '5.6%',
  },
  darkBackground: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    opacity: 0.7,
    backgroundColor: 'black',
  }
});

const mapStateToProps = state => ({
  sponsors: state.sponsorsReducer.sponsors,
  recipes: state.recipesReducer.recipes,
  user: state.userReducer.user
});

const mapDispatchToProps = {
  getSponsors: fetchSponsors,
  getRecipes: fetchRecipes,
  favRecipe: favoriteRecipe,
  unfavRecipe: unfavoriteRecipe,
  delRecipe: deleteRecipe
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
