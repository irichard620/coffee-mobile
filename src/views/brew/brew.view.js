
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, StyleSheet, Dimensions,
  Alert, SafeAreaView
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import ButtonLarge from '../../components/button-large';
import * as constants from '../../constants';
import { favoriteRecipe, unfavoriteRecipe, deleteRecipe } from '../../actions/recipe-actions';
import { brewFinishAnalytics } from '../../actions/analytics-actions';
import CustomModal from '../../components/modal';
import ModalContentBottom from '../../components/modal-content-bottom';
import ModalContentCenter from '../../components/modal-content-center';
import {
  requestPurchaseIAP, restoreIAP
} from '../../actions/user-actions';
import TopHeader from '../../components/top-header';
import BrewContentHome from './brew-content-home';
import BrewContentSteps from './brew-content-steps';

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
      deleteModal: false,
      premium: false
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const recipe = navigation.getParam('recipe', {});
    const premium = navigation.getParam('premium', false);
    this.setState({ recipe, premium });
  }

  componentWillReceiveProps(nextProps) {
    const { recipe } = this.state;
    const { user } = this.props;
    const { recipes } = nextProps;
    const nextUser = nextProps.user;

    if (recipes && !recipes.recipesIsFetching && !recipes.recipeIsSaving
      && !recipes.recipeIsDeleting && recipes.recipes.length !== 0) {
      for (let i = 0; i < recipes.recipes.length; i += 1) {
        // Check IDs and
        if (recipes.recipes[i].recipeId === recipe.recipeId) {
          this.setState({ recipe: recipes.recipes[i] });
        }
      }
    } else if (user && user.iapIsUpgrading && !nextUser.iapIsUpgrading) {
      this.setState({
        premium: nextUser.user.premium
      });
    } else if (user && user.iapIsRestoring && !nextUser.iapIsRestoring) {
      this.setState({
        premium: nextUser.user.premium
      });
    }
  }

  componentDidUpdate() {
    const { timerRemaining } = this.state;
    if (timerRemaining === 0) {
      // Clear and enable next button
      clearInterval(this.interval);
      // TODO: vibrate
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

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
    const { step, recipe } = this.state;
    if (step === -1) {
      // Recipe settings
      this.setState({
        visibleModal: true,
        modalType: constants.MODAL_TYPE_BOTTOM,
        deleteModal: false
      });
    } else {
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

      this.setState({
        step: step - 1
      });
    }
  };

  onBackScreenClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  setupTimer = (newStep, nextStep) => {
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
          modalType: constants.MODAL_TYPE_CENTER
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
    Alert.alert(
      'Coming Soon!',
      `The '${detail}' feature is coming soon. Stay tuned!`,
      [
        {
          text: 'Ok'
        },
      ],
    );
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

  getTimerDisplay = () => {
    const { timerRemaining } = this.state;

    if (timerRemaining === 0) {
      return 'Done!';
    }
    let numMinutes = String(Math.floor(timerRemaining / 60));
    let numSeconds = String(Math.floor(timerRemaining % 60));
    if (numMinutes.length === 1) {
      numMinutes = `0${numMinutes}`;
    }
    if (numSeconds.length === 1) {
      numSeconds = `0${numSeconds}`;
    }
    return `${numMinutes}:${numSeconds}`;
  };

  render() {
    const { navigation } = this.props;
    const {
      step, visibleModal, recipe, deleteModal, modalType, timerTotal, timerRemaining
    } = this.state;
    const { recipeName } = recipe;

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
      if (recipe.brewingVessel === constants.VESSEL_MIZUDASHI) {
        firstButtonTitle = 'Previous';
        secondButtonTitle = 'Finish';
      } else {
        firstButtonTitle = 'Previous';
        secondButtonTitle = 'Next Step';
      }
    } else if (step === recipe.steps.length) {
      firstButtonTitle = 'Previous';
      secondButtonTitle = 'Finish';
    }

    // Icon view styles
    const { width } = Dimensions.get('window');
    const buttonWidth = (width - 16 - 16 - 9) / 2;

    // Modal title
    let modalTitle = 'Recipe Settings';
    if (deleteModal) {
      modalTitle = 'Delete this recipe?';
    }

    // Temp units
    const useMetric = navigation.getParam('useMetric', false);

    return (
      <React.Fragment>
        <SafeAreaView style={[styles.container]}>
          <TopHeader title={recipeName} onClose={this.onBackScreenClick} showSeparator={false} />
          {step === -1 && (
            <BrewContentHome recipe={recipe} onDetailClick={this.onBrewDetailClick} />
          )}
          {step >= 0 && (
            <BrewContentSteps
              recipe={recipe}
              step={step}
              timerTotal={timerTotal}
              timerRemaining={timerRemaining}
              useMetric={useMetric}
            />
          )}
          <View style={styles.buttonView}>
            <ButtonLarge
              onButtonClick={this.onFirstButtonClick}
              title={firstButtonTitle}
              margin={[0, 9, 0, 0]}
              buttonWidth={buttonWidth}
              textColor="#000000"
              backgroundColor="#FFFFFF"
              borderColor="#D3D3D3"
            />
            <ButtonLarge
              onButtonClick={this.onSecondButtonClick}
              title={secondButtonTitle}
              margin={[0, 0, 0, 0]}
              buttonWidth={buttonWidth}
            />
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
            title={constants.POPUP_TITLE_DRIPPY_PRO}
            description={constants.POPUP_DESCRIPTION_DRIPPY_PRO}
            type={0}
            primaryButtonTitle="Get Drippy Pro"
            secondaryButtonTitle="Restore Previous Purchase"
            onCloseClick={this.onCloseModalClick}
            onPrimaryButtonClick={this.alertBuyDrippyPro}
            onSecondaryButtonClick={this.alertRestoreDrippyPro}
          />
          )}
        </CustomModal>
        <KeepAwake />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingLeft: 15,
    paddingRight: 15,
  },
  title: {
    fontSize: 22,
    color: '#1D5E9E',
    alignSelf: 'center',
    fontWeight: '600',
  },
  iconview: {
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    height: '100%',
    resizeMode: 'contain'
  },
  timertext: {
    color: '#727272',
    fontSize: 20,
    fontWeight: '500'
  },
  description: {
    fontSize: 16,
    color: '#727272',
    marginTop: 40
  },
  buttonView: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginTop: 16,
    marginBottom: 16
  },
  mini: {
    height: 40,
    width: 40
  }
});

const mapStateToProps = state => ({
  recipes: state.recipesReducer.recipes,
  user: state.userReducer.user,
});

const mapDispatchToProps = {
  favRecipe: favoriteRecipe,
  unfavRecipe: unfavoriteRecipe,
  delRecipe: deleteRecipe,
  buyDrippyPro: requestPurchaseIAP,
  restoreDrippyPro: restoreIAP,
};

export default connect(mapStateToProps, mapDispatchToProps)(BrewPage);
