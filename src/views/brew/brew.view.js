
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, Dimensions,
  Alert, SafeAreaView
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import KeepAwake from 'react-native-keep-awake';
import Button from '../../components/button';
import Back from '../../components/back';
import * as constants from '../../constants';
import * as recipeModel from '../../storage/recipe';
import * as stepModel from '../../storage/step';
import { favoriteRecipe, unfavoriteRecipe, deleteRecipe } from '../../actions/recipe-actions';
import { brewFinishAnalytics } from '../../actions/analytics-actions';
import CustomModal from '../../components/modal';
import ModalContentBottom from '../../components/modal-content-bottom';
import ModalContentCenter from '../../components/modal-content-center';
import Pagination from '../../components/pagination';
import {
  requestPurchaseIAP, restoreIAP
} from '../../actions/user-actions';

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

  onBrewClick = () => {
    const { navigation } = this.props;
    const { step, recipe } = this.state;

    // Clear interval
    clearInterval(this.interval);

    // Check step
    // TODO: mizudashi nav's away at last recipe step
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
  }

  onEditClick = () => {
    this.setState({
      visibleModal: true,
      modalType: constants.MODAL_TYPE_BOTTOM,
      deleteModal: false
    });
  }

  onBackClick = () => {
    const { step, recipe } = this.state;

    // Clear interval
    clearInterval(this.interval);

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

  onBackScreenClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
  }

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
  }

  clearTimer = (newStep) => {
    this.setState({
      step: newStep,
      timerRemaining: -1,
      timerTotal: -1,
    });
  }

  onCloseModalClick = () => {
    // Close and clear modal
    this.setState({
      visibleModal: false
    });
  }

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
  }

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
  }

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
  }

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
  }

  getVesselIcon = (vessel) => {
    const baseBrewPath = '../../assets/brew/';

    if (vessel === constants.VESSEL_AEROPRESS) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}Vessel_Aero.png`)} />);
    } if (vessel === constants.VESSEL_CHEMEX) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}Vessel_Chemex.png`)} />);
    } if (vessel === constants.VESSEL_FRENCH_PRESS) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}Vessel_FP.png`)} />);
    } if (vessel === constants.VESSEL_MIZUDASHI) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}Vessel_Mizudashi.png`)} />);
    } if (vessel === constants.VESSEL_KALITA_WAVE) {
      return (<Image style={styles.icon} source={require(`${baseBrewPath}Vessel_KalitaWave.png`)} />);
    }
    return (<Image style={styles.icon} source={require(`${baseBrewPath}Vessel_V60.png`)} />);
  }

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
  }

  getIcon = (recipe) => {
    const { step, timerRemaining, timerTotal } = this.state;

    const baseBrewPath = '../../assets/brew/';

    if (step === -1) {
      return this.getVesselIcon(recipe.brewingVessel);
    }
    if (step < recipe.steps.length) {
      // Get step
      const stepObj = recipe.steps[step];
      if (stepObj.title === constants.STEP_HEAT_WATER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}HeatWater.png`)} />);
      } if (stepObj.title === constants.STEP_CHILL_WATER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}ChillWater.png`)} />);
      } if (stepObj.title === constants.STEP_INSERT_FILTER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}InsertFilter.png`)} />);
      } if (stepObj.title === constants.STEP_RINSE_FILTER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}RinseFilter.png`)} />);
      } if (stepObj.title === constants.STEP_BLOOM_GROUNDS
        || stepObj.title === constants.STEP_POUR_WATER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}PourWater.png`)} />);
      } if (stepObj.title === constants.STEP_GRIND_COFFEE
        || stepObj.title === constants.STEP_ADD_GROUNDS) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}GrindBeans.png`)} />);
      } if (stepObj.title === constants.STEP_ADD_ICE) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}AddIce.png`)} />);
      } if (stepObj.title === constants.STEP_STIR) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}Stir.png`)} />);
      } if (stepObj.title === constants.STEP_INSERT_PLUNGER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}InsertPlunger_Aero.png`)} />);
      } if (stepObj.title === constants.STEP_PUSH_PLUNGER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}Plunge_Aero.png`)} />);
      } if (stepObj.title === constants.STEP_PUSH_FILTER) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}Plunge_FP.png`)} />);
      } if (stepObj.title === constants.STEP_STEEP) {
        return (<Image style={styles.icon} source={require(`${baseBrewPath}Steep.png`)} />);
      } if (stepObj.title === constants.STEP_WAIT) {
        // Get fill number
        const fill = Math.round((timerRemaining / timerTotal) * 100);
        const { height } = Dimensions.get('window');
        const timerSize = height * 0.34;

        return (
          <AnimatedCircularProgress
            size={timerSize}
            width={15}
            fill={fill}
            tintColor="#a7d2ea"
            backgroundColor="#F4F4F4"
          >
            {
              () => (
                <Text style={styles.timertext}>
                  { this.getTimerDisplay() }
                </Text>
              )
            }
          </AnimatedCircularProgress>
        );
      }
      return this.getVesselIcon(recipe.brewingVessel);
    }
    // End image
    return (<Image style={styles.icon} source={require(`${baseBrewPath}Complete.png`)} />);
  }

  render() {
    const { navigation } = this.props;
    const {
      step, visibleModal, recipe, deleteModal, modalType
    } = this.state;
    const { recipeName, steps } = recipe;

    const baseButtonPath = '../../assets/buttons/';

    // Button styles
    let buttonTitle = 'Brew';
    if (!('steps' in recipe)) {
      buttonTitle = 'Loading...';
    } else if (step >= 0 && step < recipe.steps.length - 1) {
      buttonTitle = 'Next';
    } else if (step === recipe.steps.length - 1) {
      if (recipe.brewingVessel === constants.VESSEL_MIZUDASHI) {
        buttonTitle = 'Finish';
      } else {
        buttonTitle = 'Next';
      }
    } else if (step === recipe.steps.length) {
      buttonTitle = 'Finish';
    }
    const backStyle = {
      marginRight: 15,
    };

    // Icon view styles
    const { height } = Dimensions.get('window');
    const iconViewSize = {
      height: height * 0.34,
      marginTop: height * 0.07
    };

    // Modal title
    let modalTitle = '';
    if (deleteModal) {
      modalTitle = 'Delete this recipe?';
    }

    // Title
    let titleToUse = '';
    if (step === -1) {
      titleToUse = recipeName;
    } else if (step < steps.length) {
      const { title } = steps[step];
      titleToUse = title;
    } else {
      titleToUse = 'Serve';
    }

    // Temp units
    const useMetric = navigation.getParam('useMetric', false);

    // Description
    let description = '';
    let stepNote = '';
    if (step === -1) {
      description = recipeModel.getRecipeDescription(recipe, useMetric);
    } else if (step < steps.length) {
      const currentStepObj = steps[step];
      description = stepModel.getStepDescription(currentStepObj, useMetric, recipe.brewingVessel);
      // Optional step notes
      if (('notes' in currentStepObj) && currentStepObj.notes !== '') {
        stepNote = currentStepObj.notes;
      }
    } else {
      description = 'Enjoy your coffee!';
    }

    // Pagination
    let stepsLength = 0;
    if (steps && steps.length > 0) {
      if (recipe.brewingVessel === constants.VESSEL_MIZUDASHI) {
        stepsLength = steps.length;
      } else {
        stepsLength = steps.length + 1;
      }
    }

    return (
      <React.Fragment>
        <SafeAreaView style={[styles.container]}>
          <View style={styles.backcontainer}>
            <Back
              onBackClick={this.onBackScreenClick}
              type={0}
              noTopPadding
            />
          </View>
          <Text style={styles.title}>{titleToUse}</Text>
          <View style={[styles.iconview, iconViewSize]}>
            {this.getIcon(recipe)}
          </View>
          <Pagination
            total={stepsLength}
            index={step}
            activeColor="#1D5E9E"
          />
          <Text style={styles.description}>
            {description}
            {' '}
            {stepNote}
          </Text>
          <View style={styles.buttonview}>
            {step !== -1 && (
            <TouchableOpacity onPress={this.onBackClick}>
              <Image style={[styles.mini, backStyle]} source={require(`${baseButtonPath}Previous_Gray.png`)} />
            </TouchableOpacity>
            )}
            {step === -1 && (
            <TouchableOpacity onPress={this.onEditClick}>
              <Image style={[styles.mini, backStyle]} source={require(`${baseButtonPath}Edit.png`)} />
            </TouchableOpacity>
            )}
            <Button
              onButtonClick={this.onBrewClick}
              type={0}
              title={buttonTitle}
              margin={[0, 0, 0, 0]}
              isGlyph
              glyphType={0}
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
  backcontainer: {
    marginTop: 16,
    marginLeft: 15,
    alignItems: 'flex-start',
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
  buttonview: {
    position: 'absolute',
    top: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'nowrap',
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
