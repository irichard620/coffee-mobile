
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, LayoutAnimation, View, Dimensions,
  Animated, Easing, Alert
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
      tab: 1,
      tabMenuSelected: false,
      selectedFavorites: [],
      selectedCustoms: [],
      selectedFeatured: [],
      favorites: [],
      customs: [],
      featured: [],
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
      useMetric: false,
      iapIsRestoring: false,
      iapIsUpgrading: false,
      premium: false
    };
  }

  componentDidMount() {
    const { getRecipes, user } = this.props;
    getRecipes();
    // Get temp and premium preference
    if (user && Object.keys(user.user).length !== 0 && ('useMetric' in user.user)) {
      const stateToSet = {};
      if (('useMetric' in user.user)) {
        stateToSet.useMetric = user.user.useMetric;
      } if (('premium' in user.user)) {
        stateToSet.premium = user.user.premium;
      }
      this.setState(stateToSet);
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
    } if (nextUser && !prevState.iapIsRestoring && nextUser.iapIsRestoring) {
      return {
        iapIsRestoring: true
      };
    } if (nextUser && !prevState.iapIsUpgrading && nextUser.iapIsUpgrading) {
      return {
        iapIsUpgrading: true
      };
    } if (nextRecipes && ((prevState.recipesIsFetching && !nextRecipes.recipesIsFetching)
    || (prevState.recipeIsSaving && !nextRecipes.recipeIsSaving)
    || (prevState.recipeIsDeleting && !nextRecipes.recipeIsDeleting))) {
      const newSelectedFavorites = [];
      const newSelectedCustoms = [];
      const newSelectedFeatured = [];
      const newFavorites = [];
      const newCustoms = [];
      const newFeatured = [];

      for (let i = 0; i < nextRecipes.recipes.length; i += 1) {
        const nextRecipe = nextRecipes.recipes[i];
        // Push to favorite
        if (nextRecipe.favorited) {
          newSelectedFavorites.push(false);
          newFavorites.push(nextRecipe);
        }
        // Push to featured
        if (nextRecipe.sponsorId && nextRecipe.sponsorId !== '') {
          newSelectedFeatured.push(false);
          newFeatured.push(nextRecipe);
        }
        // Push to all recipes
        newSelectedCustoms.push(false);
        newCustoms.push(nextRecipe);
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
        selectedFeatured: newSelectedFeatured,
        featured: newFeatured,
        recipesIsFetching: false,
        recipeIsSaving: false,
        recipeIsDeleting: false
      };
    } if (nextUser && prevState.userIsSaving && !nextUser.userIsSaving) {
      return {
        useMetric: nextUser.user.useMetric
      };
    } if (nextUser && prevState.iapIsRestoring && !nextUser.iapIsRestoring) {
      return {
        premium: nextUser.user.premium
      };
    } if (nextUser && prevState.iapIsUpgrading && !nextUser.iapIsUpgrading) {
      return {
        premium: nextUser.user.premium
      };
    }
    return null;
  }

  switchTab = (index) => {
    const { tab } = this.state;
    if (tab !== index) {
      LayoutAnimation.configureNext(constants.CustomLayoutSpring);
      this.setState({
        tab: index,
      });
    }
  }

  onAddClick = () => {
    // Pull up add menu
    const { navigation } = this.props;
    const { useMetric, premium } = this.state;
    if (!premium) {
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
    const { useMetric, premium } = this.state;
    navigation.navigate('Sponsor', {
      sponsor,
      premium,
      useMetric
    });
  }

  onSnapToItem = (idx) => {
    this.setState({ sponsorIndex: idx });
  }

  onEntryClick = (idx) => {
    const {
      tab, selectedFavorites, selectedCustoms, selectedFeatured
    } = this.state;

    LayoutAnimation.configureNext(constants.CustomLayoutSpring);
    if (tab === 0) {
      this.setState({
        selectedCustoms: selectedCustoms.map((val, i) => (i === idx ? !val : false))
      });
    } else if (tab === 1) {
      this.setState({
        selectedFavorites: selectedFavorites.map((val, i) => (i === idx ? !val : false))
      });
    } else {
      this.setState({
        selectedFeatured: selectedFeatured.map((val, i) => (i === idx ? !val : false))
      });
    }
  }

  onEditClick = (idx) => {
    const {
      tab, favorites, customs, featured
    } = this.state;
    let arrToUse = [];
    if (tab === 0) {
      arrToUse = customs;
    } else if (tab === 1) {
      arrToUse = favorites;
    } else {
      arrToUse = featured;
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
      tab, favorites, customs, featured, useMetric, premium
    } = this.state;
    let recipeToBrew = {};
    if (tab === 0) {
      recipeToBrew = customs[idx];
    } else if (tab === 1) {
      recipeToBrew = favorites[idx];
    } else {
      recipeToBrew = featured[idx];
    }

    // Analytics
    brewStartAnalytics(recipeToBrew.recipeId, recipeToBrew.recipeName,
      recipeToBrew.brewingVessel, recipeToBrew.sponsorId);

    // Navigate
    navigation.navigate('Brew', {
      recipe: recipeToBrew,
      useMetric,
      premium
    });
  }

  getModalOptions = () => {
    const {
      tab, favorites, customs, featured, deleteModal, modalRecipeIndex
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
      arrToSearch = customs;
    } else if (tab === 1) {
      arrToSearch = favorites;
    } else {
      arrToSearch = featured;
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
      customs, featured, useMetric, premium
    } = this.state;

    if (item === constants.RECIPE_MENU_EDIT) {
      // block action if free user
      if (!premium) {
        // Block action
        Alert.alert(
          'Premium Only',
          'Editing recipes is a feature for premium users only.',
          [
            {
              text: 'Ok'
            },
          ],
        );
        return;
      }
      // Close and clear modal
      this.setState({
        visibleModal: false,
        modalRecipeId: '',
        modalRecipeIndex: -1,
      });
      if (tab === 0) {
        navigation.navigate('Builder', {
          recipe: customs[modalRecipeIndex],
          useMetric
        });
      } else if (tab === 1) {
        navigation.navigate('Builder', {
          recipe: favorites[modalRecipeIndex],
          useMetric
        });
      } else {
        navigation.navigate('Builder', {
          recipe: featured[modalRecipeIndex],
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
      LayoutAnimation.configureNext(constants.CustomLayoutEaseIn);
      if (!menuSelected) {
        this.startRotateAnimation(1, 100);
      } else {
        this.startRotateAnimation(0, 100);
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
      tab, selectedFavorites, selectedCustoms, useMetric, selectedFeatured
    } = this.state;
    let selected = false;
    if (tab === 0) {
      selected = selectedCustoms[idx];
    } else if (tab === 1) {
      selected = selectedFavorites[idx];
    } else {
      selected = selectedFeatured[idx];
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
      tab, customs, favorites, featured, visibleModal, deleteModal, sponsorIndex,
      menuSelected, spinValue, tabMenuSelected
    } = this.state;

    let modalTitle = '';
    if (deleteModal) {
      modalTitle = 'Delete this recipe?';
    }

    // Top margin
    const { width, height } = Dimensions.get('window');
    const topPaddingStyle = {
      paddingTop: height * 0.07
    };

    // Floating left margin
    const marginLeftContainer = {
      left: (width / 2.0) - 31
    };

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '45deg']
    });

    // Bottom dynamic
    const entryContainerBottom = {
      marginBottom: height * 0.2
    };

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
            onItemClick={this.switchTab}
            onAddHold={this.onAddHold}
            selected={tab}
            menuSelected={tabMenuSelected}
          />

          <View style={entryContainerBottom}>
            {tab === 0 && customs.map((custom, idx) => (
              this.renderEntry(idx, custom)
            ))}
            {tab === 1 && favorites.map((favorite, idx) => (
              this.renderEntry(idx, favorite)
            ))}
            {tab === 2 && featured.map((feature, idx) => (
              this.renderEntry(idx, feature)
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
