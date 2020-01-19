
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, StyleSheet, Dimensions, LayoutAnimation,
  Alert, Linking, Vibration
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import KeepAwake from 'react-native-keep-awake';
import ButtonLarge from '../../components/button-large';
import * as constants from '../../constants';
import { favoriteRecipe, unfavoriteRecipe, deleteRecipe } from '../../actions/recipe-actions';
import { brewFinishAnalytics } from '../../actions/analytics-actions';
import { fetchVessel } from '../../actions/vessel-actions';
import CustomModal from '../../components/modal';
import ModalContentBottom from '../../components/modal-content-bottom';
import ModalContentCenter from '../../components/modal-content-center';
import {
  requestPurchaseIAP, restoreIAP
} from '../../actions/user-actions';
import TopHeader from '../../components/top-header';
import BrewContentHome from './brew-content-home';
import BrewContentSteps from './brew-content-steps';
import BrewContentComplete from './brew-content-complete';
import History from '../../storage/history';
import { saveHistory } from '../../actions/history-actions';

class BrewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: -1,
      recipe: {},
      timerRemaining: -1,
      timerTotal: -1,
      visibleModal: false,
      modalType: '',
      modalCenterTitle: '',
      modalCenterDescription: '',
      modalCenterType: 1,
      modalCenterPrimaryButtonText: '',
      modalCenterSecondayButtonText: '',
      modalCenterDisabled: false,
      deleteModal: false,
      premium: false,
      vesselLink: '',
      vesselDescription: '',
      numStars: 0,
      beansText: '',
      notesText: ''
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const recipe = navigation.getParam('recipe', {});
    const premium = navigation.getParam('premium', false);
    this.setState({ recipe, premium });
  }

  componentWillReceiveProps(nextProps) {
    const {
      user, vessels, recipes, histories
    } = this.props;

    const nextUser = nextProps.user;
    const nextVessels = nextProps.vessels;
    const nextRecipes = nextProps.recipes;
    const nextHistories = nextProps.histories;
    if (recipes && recipes.recipesIsFetching && !nextRecipes.recipesIsFetching) {
      this.updateRecipe(nextRecipes);
    } else if (recipes && recipes.recipeIsSaving && !nextRecipes.recipeIsSaving) {
      this.updateRecipe(nextRecipes);
    } else if (recipes && recipes.recipeIsDeleting && !nextRecipes.recipeIsDeleting) {
      this.updateRecipe(nextRecipes);
    } else if (user && user.iapIsUpgrading && !nextUser.iapIsUpgrading) {
      this.setState({
        premium: nextUser.user.premium
      });
    } else if (user && user.iapIsRestoring && !nextUser.iapIsRestoring) {
      this.setState({
        premium: nextUser.user.premium
      });
    } else if (vessels && vessels.vesselIsFetching && !nextVessels.vesselIsFetching) {
      // Update vessel link and description
      if (nextVessels.error !== '') {
        // Show alert
        Alert.alert(
          'Error Occurred',
          'Could not fetch vessel info from server.',
          [
            {
              text: 'OK'
            },
          ],
        );
      } else {
        this.setState({
          vesselLink: nextVessels.vessel.vesselLink,
          vesselDescription: nextVessels.vessel.vesselDescription,
          modalCenterTitle: 'Learn More',
          modalCenterDescription: nextVessels.vessel.vesselDescription,
          modalCenterType: 1,
          modalCenterPrimaryButtonText: `Shop ${nextVessels.vesselName}`,
          modalCenterDisabled: false,
        });
      }
    } else if (histories && histories.historyIsSaving && !nextHistories.historyIsSaving) {
      this.onBackScreenClick();
    }
  }

  componentDidUpdate() {
    const { timerRemaining } = this.state;
    if (timerRemaining === 0) {
      // Clear and enable next button
      clearInterval(this.interval);
      Vibration.vibrate();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateRecipe = (nextRecipes) => {
    const { recipe } = this.state;
    for (let i = 0; i < nextRecipes.recipes.length; i += 1) {
      // Check IDs and
      if (nextRecipes.recipes[i].recipeId === recipe.recipeId) {
        this.setState({ recipe: nextRecipes.recipes[i] });
      }
    }
  };

  onSecondButtonClick = () => {
    const { navigation } = this.props;
    const { step, recipe } = this.state;

    // Clear interval
    clearInterval(this.interval);

    // Check step
    if (step !== recipe.steps.length) {
      // Check if next one is a timer
      if (step + 1 === recipe.steps.length) {
        // If cold brew, no serve step at end - skip
        if (recipe.brewingVessel === constants.VESSEL_MIZUDASHI) {
          // Analytics
          brewFinishAnalytics(recipe.recipeId, recipe.recipeName,
            recipe.brewingVessel, recipe.sponsorId);

          navigation.goBack();
        } else {
          this.clearTimer(step + 1);
        }
      } else {
        const nextStep = recipe.steps[step + 1];
        if (nextStep.title === constants.STEP_WAIT) {
          this.setupTimer(step + 1, nextStep);
        } else {
          this.clearTimer(step + 1);
        }
      }
    } else {
      // Analytics
      brewFinishAnalytics(recipe.recipeId, recipe.recipeName,
        recipe.brewingVessel, recipe.sponsorId);

      navigation.goBack();
    }
  };

  onFirstButtonClick = () => {
    const {
      step, recipe, numStars, beansText, notesText
    } = this.state;
    const { steps } = recipe;
    if (step === -1) {
      // Recipe settings
      this.setState({
        visibleModal: true,
        modalType: constants.MODAL_TYPE_BOTTOM,
        deleteModal: false
      });
    } else if (step < steps.length) {
      // Clear interval
      clearInterval(this.interval);

      // Go back
      if (step > 0) {
        const prevStep = recipe.steps[step - 1];
        if (prevStep.title === constants.STEP_WAIT) {
          this.setupTimer(step - 1, prevStep);
        } else {
          this.clearTimer(step - 1);
        }
      } else {
        this.clearTimer(step - 1);
      }
    } else {
      // Save brew history
      const { persistHistory } = this.props;
      const objToUse = {};
      objToUse.recipeId = recipe.recipeId;
      objToUse.numStars = numStars;
      objToUse.beans = beansText;
      objToUse.notes = notesText;
      const newHistory = History(objToUse);
      persistHistory(newHistory);
    }
  };

  onBackScreenClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  setupTimer = (newStep, nextStep) => {
    const { step } = this.state;
    if (!(step === -1 && newStep === 0)) {
      LayoutAnimation.configureNext(constants.CustomLayoutEaseIn);
    }
    this.setState({
      step: newStep,
      timerRemaining: nextStep.properties.seconds,
      timerTotal: nextStep.properties.seconds,
    }, () => {
      // Start timer
      this.interval = setInterval(
        () => this.setState(prevState => ({ timerRemaining: prevState.timerRemaining - 1 })),
        1000
      );
    });
  };

  clearTimer = (newStep) => {
    const { step } = this.state;
    if (!((step === -1 && newStep === 0) || (step === 0 && newStep === -1))) {
      LayoutAnimation.configureNext(constants.CustomLayoutEaseIn);
    }
    this.setState({
      step: newStep,
      timerRemaining: -1,
      timerTotal: -1,
    });
  };

  onCloseModalClick = () => {
    // Close and clear modal
    this.setState({
      visibleModal: false
    });
  };

  onModalCenterPrimaryClicked = () => {
    const { modalCenterType, vesselLink } = this.state;

    if (modalCenterType === 0) {
      // Alert drippy
      this.alertBuyDrippyPro();
    } else {
      // Open link
      Linking.canOpenURL(vesselLink).then((supported) => {
        if (supported) {
          Linking.openURL(vesselLink);
        } else {
          // Open error alert
          Alert.alert(
            'Error Occurred',
            'The URL could not be opened.',
            [
              {
                text: 'OK'
              },
            ],
          );
        }
      });
    }
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
    const { recipe, deleteModal, premium } = this.state;

    if (item === constants.RECIPE_MENU_EDIT) {
      // block action if free user
      if (!premium) {
        // Block action
        this.setState({
          visibleModal: true,
          modalType: constants.MODAL_TYPE_CENTER,
          modalCenterTitle: constants.POPUP_TITLE_DRIPPY_PRO,
          modalCenterDescription: constants.POPUP_DESCRIPTION_DRIPPY_PRO,
          modalCenterType: 0,
          modalCenterPrimaryButtonText: 'Get Drippy Pro',
          modalCenterSecondayButtonText: 'Restore Previous Purchase',
          modalCenterDisabled: false,
        });
        return;
      }
      this.setState({
        visibleModal: false
      });
      navigation.navigate('Builder', {
        recipe
      });
    } else if (item === constants.RECIPE_MENU_FAVORITE) {
      // Call favorite recipe
      favRecipe(recipe.recipeId);
    } else if (item === constants.RECIPE_MENU_UNFAVORITE) {
      // Call unfavorite recipe
      unfavRecipe(recipe.recipeId);
    } else if (item === constants.RECIPE_MENU_DELETE) {
      // Call delete recipe
      if (!deleteModal) {
        this.setState({
          deleteModal: true
        });
      } else {
        delRecipe(recipe.recipeId);
        // Hide modal
        this.setState({
          visibleModal: false
        });
        // Go back
        navigation.goBack();
      }
    } else if (item === constants.RECIPE_MENU_CANCEL) {
      // Call clear
      this.onCloseModalClick();
    }
  };

  onBrewDetailClick = (detail) => {
    const { getVessel } = this.props;
    const { recipe, vesselLink, vesselDescription } = this.state;
    if (detail === constants.BREW_LEARN_MORE_DETAIL) {
      // Get vessel if needed - else show modal
      if (vesselLink === '' || vesselDescription === '') {
        // Fetch
        getVessel(recipe.brewingVessel);
        // Show modal but it will just be loading
        this.setState({
          visibleModal: true,
          modalType: constants.MODAL_TYPE_CENTER,
          modalCenterTitle: 'Loading...',
          modalCenterDescription: 'Vessel information is loading',
          modalCenterType: 1,
          modalCenterPrimaryButtonText: `Shop ${recipe.brewingVessel}`,
          modalCenterDisabled: true,
        });
      } else {
        // Show modal
        this.setState({
          visibleModal: true,
          modalType: constants.MODAL_TYPE_CENTER,
          modalCenterTitle: 'Learn More',
          modalCenterDescription: vesselDescription,
          modalCenterType: 1,
          modalCenterPrimaryButtonText: `Shop ${recipe.brewingVessel}`,
          modalCenterDisabled: false,
        });
      }
    } else {
      Alert.alert(
        'Coming Soon!',
        `The '${detail}' feature is coming soon. Stay tuned!`,
        [
          {
            text: 'Ok'
          },
        ],
      );
    }
  };

  getModalOptions = () => {
    const { recipe, deleteModal } = this.state;

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

    if (recipe.favorited) {
      options.push({
        title: constants.RECIPE_MENU_UNFAVORITE,
      });
    } else {
      options.push({
        title: constants.RECIPE_MENU_FAVORITE,
      });
    }
    options.push({
      title: constants.RECIPE_MENU_DELETE,
    });
    return options;
  };

  onChangeText = (text, isBeans) => {
    if (isBeans) {
      this.setState({
        beansText: text
      });
    } else {
      this.setState({
        notesText: text
      });
    }
  };

  onStarClicked = (starNum) => {
    const { numStars } = this.state;
    let starToUse = starNum;
    if (starNum === 1 && numStars === 1) {
      starToUse = 0;
    }
    this.setState({
      numStars: starToUse
    });
  };

  render() {
    const { navigation } = this.props;
    const {
      step, visibleModal, recipe, deleteModal, modalType, timerTotal, timerRemaining,
      modalCenterTitle, modalCenterDescription, modalCenterType, modalCenterPrimaryButtonText,
      modalCenterSecondayButtonText, modalCenterDisabled, numStars, beansText, notesText
    } = this.state;
    const { recipeName, steps } = recipe;

    // Button styles
    let firstButtonTitle = 'Recipe Settings';
    let secondButtonTitle = 'Start Recipe';
    if (!('steps' in recipe)) {
      firstButtonTitle = 'Loading...';
      secondButtonTitle = 'Loading...';
    } else if (step >= 0 && step < recipe.steps.length - 1) {
      firstButtonTitle = 'Previous';
      secondButtonTitle = 'Next Step';
    } else if (step === recipe.steps.length - 1) {
      firstButtonTitle = 'Previous';
      secondButtonTitle = 'Finish';
    } else if (step === recipe.steps.length) {
      firstButtonTitle = 'Save to Brew History';
    }

    // Icon view styles
    const { width } = Dimensions.get('window');
    const buttonWidth = (width - 16 - 16 - 9) / 2;
    const largeButtonWidth = (width - 16 - 16);

    // Modal title
    let modalTitle = 'Recipe Settings';
    if (deleteModal) {
      modalTitle = 'Delete this recipe?';
    }

    // Temp units
    const useMetric = navigation.getParam('useMetric', false);

    return (
      <View style={styles.outerContainer}>
        <SafeAreaView style={[styles.container]}>
          <TopHeader title={recipeName} onClose={this.onBackScreenClick} showSeparator={false} />
          {step === -1 && (
            <BrewContentHome recipe={recipe} onDetailClick={this.onBrewDetailClick} />
          )}
          {steps && step >= 0 && step < steps.length && (
            <BrewContentSteps
              recipe={recipe}
              step={step}
              timerTotal={timerTotal}
              timerRemaining={timerRemaining}
              useMetric={useMetric}
            />
          )}
          {steps && step >= steps.length && (
            <BrewContentComplete
              numStars={numStars}
              beansText={beansText}
              notesText={notesText}
              onChangeText={this.onChangeText}
              onStarClicked={this.onStarClicked}
            />
          )}
          <View style={styles.gradientContainer}>
            <LinearGradient
              colors={['#FFFFFF', '#ffffff00']}
              style={styles.linearGradient}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
            />
          </View>
          <View style={styles.buttonView}>
            {steps && step < steps.length && (
              <ButtonLarge
                onButtonClick={this.onFirstButtonClick}
                title={firstButtonTitle}
                margin={[0, 9, 0, 0]}
                buttonWidth={buttonWidth}
                textColor="#000000"
                backgroundColor="#FFFFFF"
                borderColor="#D3D3D3"
              />
            )}
            {steps && step < steps.length && (
              <ButtonLarge
                onButtonClick={this.onSecondButtonClick}
                title={secondButtonTitle}
                margin={[0, 0, 0, 0]}
                buttonWidth={buttonWidth}
              />
            )}
            {steps && step === steps.length && (
              <ButtonLarge
                onButtonClick={this.onFirstButtonClick}
                title="Save to Brew History"
                margin={[0, 0, 0, 0]}
                buttonWidth={largeButtonWidth}
              />
            )}
          </View>
        </SafeAreaView>
        <CustomModal
          visibleModal={visibleModal}
          onCloseClick={this.onCloseModalClick}
          type={modalType}
        >
          {modalType === constants.MODAL_TYPE_BOTTOM
          && (
            <ModalContentBottom
              onPressItem={this.onPressItem}
              title={modalTitle}
              isListModal
              isSelectInput={false}
              options={this.getModalOptions()}
            />
          )}
          {modalType === constants.MODAL_TYPE_CENTER
          && (
            <ModalContentCenter
              title={modalCenterTitle}
              description={modalCenterDescription}
              type={modalCenterType}
              primaryButtonTitle={modalCenterPrimaryButtonText}
              secondaryButtonTitle={modalCenterSecondayButtonText}
              onCloseClick={this.onCloseModalClick}
              onPrimaryButtonClick={this.onModalCenterPrimaryClicked}
              onSecondaryButtonClick={this.alertRestoreDrippyPro}
              disabled={modalCenterDisabled}
            />
          )}
        </CustomModal>
        <KeepAwake />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    color: '#1D5E9E',
    alignSelf: 'center',
    fontWeight: '600',
  },
  gradientContainer: {
    marginTop: -24,
    height: 24,
    backgroundColor: 'transparent',
    width: '100%'
  },
  linearGradient: {
    flex: 1,
  },
  buttonView: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 16
  },
});

const mapStateToProps = state => ({
  recipes: state.recipesReducer.recipes,
  user: state.userReducer.user,
  vessels: state.vesselsReducer.vessels,
  histories: state.historiesReducer.histories,
});

const mapDispatchToProps = {
  favRecipe: favoriteRecipe,
  unfavRecipe: unfavoriteRecipe,
  delRecipe: deleteRecipe,
  buyDrippyPro: requestPurchaseIAP,
  restoreDrippyPro: restoreIAP,
  getVessel: fetchVessel,
  persistHistory: saveHistory,
};

export default connect(mapStateToProps, mapDispatchToProps)(BrewPage);
