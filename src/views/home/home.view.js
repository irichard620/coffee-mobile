
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ScrollView, StyleSheet, LayoutAnimation, View, Dimensions,
  Alert, Platform
} from 'react-native';
import RNIap, {
  purchaseErrorListener,
  purchaseUpdatedListener
} from 'react-native-iap';
import Entry from './entry';
import AdEntry from './ad-entry';
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
import ModalContentBottom from '../../components/modal-content-bottom';
import ModalContentCenter from '../../components/modal-content-center';
import {
  requestPurchaseIAP, restoreIAP, upgradeIAP, updateLastAdShown
} from '../../actions/user-actions';

class HomePage extends Component {
  purchaseUpdatePro = null;

  purchaseErrorPro = null;

  constructor(props) {
    super(props);
    this.state = {
      tab: 0,
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
      modalType: '',
      popupModalTitle: '',
      deleteModal: false,
      sponsorIndex: 0,
      recipesIsFetching: false,
      recipeIsSaving: false,
      recipeIsDeleting: false,
      userIsSaving: false,
      menuSelected: false,
      useMetric: false,
      iapIsRestoring: false,
      iapIsUpgrading: false,
      premium: false,
      lastAdShown: null
    };
  }

  componentDidMount() {
    const { getRecipes, user, upgradeDrippyPro } = this.props;

    // Purchase success handler
    this.purchaseUpdatePro = purchaseUpdatedListener((purchase) => {
      const receipt = purchase.transactionReceipt;
      if (receipt) {
        // Update in our system - wait for callback
        upgradeDrippyPro(purchase);
      }
    });

    // Purchase error handler
    this.purchaseErrorPro = purchaseErrorListener(() => {
      // Show alert
      Alert.alert(
        'Error purchasing Drippy Pro',
        'An error occurred purchasing pro version of Drippy.',
        [
          {
            text: 'OK',
          },
        ],
      );
    });

    // Get all recipes when page loads
    getRecipes();

    // Get temp and premium preference
    if (user && Object.keys(user.user).length !== 0 && ('useMetric' in user.user)) {
      const stateToSet = {};
      if (('useMetric' in user.user)) {
        stateToSet.useMetric = user.user.useMetric;
      } if (('premium' in user.user)) {
        stateToSet.premium = user.user.premium;
      } if (('lastAdShown' in user.user && user.user.lastAdShown !== null)) {
        stateToSet.lastAdShown = new Date(user.user.lastAdShown);
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
        useMetric: nextUser.user.useMetric,
        userIsSaving: false
      };
    } if (nextUser && prevState.iapIsRestoring && !nextUser.iapIsRestoring) {
      // Update user
      if (!nextUser.user.premium) {
        Alert.alert(
          'Problem restoring Drippy Pro',
          'There was an issue restoring your Drippy Pro. '
          + 'It might be an issue with your connection, or no past purchase was found.',
          [
            {
              text: 'OK',
            },
          ],
        );
        return {
          iapIsRestoring: false
        };
      }
      Alert.alert(
        'Drippy Pro Restored',
        'Thanks for your continued support as a Drippy Pro user!',
        [
          {
            text: 'OK',
          },
        ],
      );
      return {
        premium: true,
        iapIsRestoring: false
      };
    } if (nextUser && prevState.iapIsUpgrading && !nextUser.iapIsUpgrading) {
      // Finish transaction
      if (Platform.OS === 'ios') {
        RNIap.finishTransactionIOS(nextUser.purchase.transactionId);
      } else if (Platform.OS === 'android') {
        RNIap.acknowledgePurchaseAndroid(nextUser.purchase.purchaseToken);
      }
      return {
        premium: nextUser.user.premium,
        iapIsUpgrading: false
      };
    }
    return null;
  }

  componentWillUnmount() {
    if (this.purchaseUpdatePro) {
      this.purchaseUpdatePro.remove();
      this.purchaseUpdatePro = null;
    }
    if (this.purchaseErrorPro) {
      this.purchaseErrorPro.remove();
      this.purchaseErrorPro = null;
    }
  }

  switchTab = (index) => {
    const { tab } = this.state;
    if (tab !== index) {
      LayoutAnimation.configureNext(constants.CustomLayoutEaseIn);
      this.setState({
        tab: index,
      });
    }
  };

  onAddClick = () => {
    // Pull up add menu
    const { navigation } = this.props;
    const { useMetric, premium } = this.state;
    if (!premium) {
      // Block action
      this.setState({
        visibleModal: true,
        modalType: constants.MODAL_TYPE_CENTER,
        popupModalTitle: constants.POPUP_TITLE_DRIPPY_PRO
      });
      return;
    }
    navigation.navigate('Builder', {
      useMetric
    });
  };

  onSettingsClick = () => {
    // Pull up settings menu
    const { navigation } = this.props;
    navigation.navigate('Settings');
  };

  onSponsorClick = (sponsor) => {
    // Pull up sponsor page
    const { navigation } = this.props;
    const { useMetric, premium } = this.state;
    navigation.navigate('Sponsor', {
      sponsor,
      premium,
      useMetric
    });
  };

  onSnapToItem = (idx) => {
    this.setState({ sponsorIndex: idx });
  };

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
  };

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
      modalType: constants.MODAL_TYPE_BOTTOM,
      modalRecipeId: arrToUse[idx].recipeId,
      modalRecipeIndex: idx,
      deleteModal: false
    });
  };

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
  };

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
  };

  onCloseClick = () => {
    // Close and clear modal
    this.setState({
      visibleModal: false,
      modalType: '',
      modalRecipeId: '',
      modalRecipeIndex: -1,
    });
  };

  alertBuyDrippyPro = () => {
    const { buyDrippyPro } = this.props;
    // Prompt if they want to purchase
    Alert.alert(
      'Buy Drippy Pro',
      'Would you like to purchase the pro version of Drippy? This will give you '
      + 'the ability to create and edit recipes, and will unlock unlimited recipe storage.',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'Buy',
          onPress: () => {
            buyDrippyPro();
            this.setState({
              visibleModal: false
            });
          }
        },
      ],
    );
  };

  alertRestoreDrippyPro = () => {
    const { restoreDrippyPro } = this.props;
    // prompt if they want to restore
    Alert.alert(
      'Restore Drippy Pro',
      'Would you like to restore the pro version of Drippy?',
      [
        {
          text: 'Cancel'
        },
        {
          text: 'Restore',
          onPress: () => {
            restoreDrippyPro();
            this.setState({
              visibleModal: false
            });
          }
        },
      ],
    );
  };

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
        this.setState({
          visibleModal: true,
          modalType: constants.MODAL_TYPE_CENTER,
          popupModalTitle: constants.POPUP_TITLE_DRIPPY_PRO
        });
        return;
      }
      // Close and clear modal
      this.setState({
        visibleModal: false,
        modalType: '',
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

  onFloatingClick = (type) => {
    const { menuSelected } = this.state;

    if (type === 0) {
      // Update to menu selected or not selected
      LayoutAnimation.configureNext(constants.CustomLayoutEaseIn);
      this.setState({ menuSelected: !menuSelected });
    } else if (type === 1) {
      // Settings page
      this.setState({ menuSelected: false });
      this.onSettingsClick();
    } else {
      // New recipe
      this.setState({ menuSelected: false });
      this.onAddClick();
    }
  };

  onDrippyProAdClose = () => {
    const { updateLastAdTime } = this.props;
    // Update timestamp in state - should remove from view - 7 days later
    const updatedDate = new Date();
    updateLastAdTime(updatedDate);
    this.setState({
      lastAdShown: updatedDate,
    });
  };

  onDrippyProAdClicked = () => {
    // Open center modal
    this.setState({
      visibleModal: true,
      modalType: constants.MODAL_TYPE_CENTER,
      popupModalTitle: constants.POPUP_TITLE_DRIPPY_PRO_AD
    });
  };

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
      tab, customs, favorites, featured, visibleModal, modalType, lastAdShown,
      deleteModal, sponsorIndex, menuSelected, tabMenuSelected, popupModalTitle,
      premium
    } = this.state;

    let modalTitle = 'Recipe Settings';
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

    // Bottom dynamic
    const entryContainerBottom = {
      marginBottom: height * 0.2
    };

    // Show ad if non-premium and hasn't shown in 7 days
    let showAd = false;
    if (!premium && lastAdShown === null) {
      showAd = true;
    } else if (!premium) {
      const timeDiff = new Date().getTime() - lastAdShown.getTime();
      const dayDiff = timeDiff / (1000 * 3600 * 24);
      if (dayDiff >= 7) {
        showAd = true;
      }
    }

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
          {showAd && (
            <AdEntry
              title={constants.AD_TITLE_DRIPPY_PRO}
              description={constants.AD_DESCRIPTION_DRIPPY_PRO}
              onClose={this.onDrippyProAdClose}
              onAdClicked={this.onDrippyProAdClicked}
            />
          )}
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
            onCloseClick={this.onCloseClick}
            type={modalType}
          >
            {modalType === constants.MODAL_TYPE_BOTTOM
            && (
            <ModalContentBottom
              title={modalTitle}
              onPressItem={this.onPressItem}
              isListModal
              isSelectInput={false}
              options={this.getModalOptions()}
            />
            )}
            {modalType === constants.MODAL_TYPE_CENTER
            && (
            <ModalContentCenter
              title={popupModalTitle}
              description={constants.POPUP_DESCRIPTION_DRIPPY_PRO}
              type={0}
              primaryButtonTitle="Get Drippy Pro"
              secondaryButtonTitle="Restore Previous Purchase"
              onCloseClick={this.onCloseClick}
              onPrimaryButtonClick={this.alertBuyDrippyPro}
              onSecondaryButtonClick={this.alertRestoreDrippyPro}
            />
            )}
          </CustomModal>
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
            disabled={!menuSelected}
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
    backgroundColor: '#F1F3F6',
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
  delRecipe: deleteRecipe,
  buyDrippyPro: requestPurchaseIAP,
  restoreDrippyPro: restoreIAP,
  upgradeDrippyPro: upgradeIAP,
  updateLastAdTime: updateLastAdShown,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
