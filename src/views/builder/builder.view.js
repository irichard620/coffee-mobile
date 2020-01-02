
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, ScrollView, StyleSheet, LayoutAnimation, Alert, Keyboard, Dimensions
} from 'react-native';
import update from 'immutability-helper';
import TopHeader from '../../components/top-header';
import * as constants from '../../constants';
import BuilderModal from './builder-modal';
import StepList from './step-list';
import DetailsList from './details-list';
import * as stepModel from '../../storage/step';
import * as recipeModel from '../../storage/recipe';
import { saveRecipe } from '../../actions/recipe-actions';
import ButtonLarge from '../../components/button-large';

class BuilderPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeId: '',
      visibleModal: false,
      modalIdx: -1,
      modalType: '',
      modalText: '',
      modalSelect: constants.GRIND_MEDIUM,
      recipeName: 'New Recipe',
      recipeDescription: '',
      favorited: false,
      brewingVessel: '',
      filterType: '',
      orientation: '',
      totalWater: 0,
      totalCoffee: 0,
      grindSize: '',
      waterTemp: '',
      steps: [],
      selected: [],
      useMetric: false
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const recipe = navigation.getParam('recipe', {});
    const useMetric = navigation.getParam('useMetric', false);
    if (Object.keys(recipe).length !== 0) {
      // Update params
      const selected = [];
      for (let i = 0; i < recipe.steps.length; i += 1) {
        selected.push(false);
      }
      this.setState({
        recipeId: recipe.recipeId,
        recipeName: recipe.recipeName,
        recipeDescription: recipe.recipeDescription,
        favorited: recipe.favorited,
        brewingVessel: recipe.brewingVessel,
        filterType: recipe.filterType,
        orientation: recipe.orientation,
        steps: recipe.steps,
        selected,
        useMetric
      });
    } else {
      this.setState({
        useMetric
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { recipes, navigation } = this.props;
    const nextRecipes = nextProps.recipes;

    // Check if error in saving
    if (recipes && !nextRecipes.recipeIsSaving) {
      if (nextRecipes.error !== '') {
        // Show error in alert
        Alert.alert(
          'Could Not Save Recipe',
          nextRecipes.error,
          [
            {
              text: 'OK'
            },
          ],
        );
      } else {
        // Go back in nav
        navigation.goBack();
      }
    }
  }

  onBackClick = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  onAddClick = () => {
    const { brewingVessel } = this.state;

    // If no vessel, show alert
    if (brewingVessel === '') {
      Alert.alert(
        'Choose a Brew Method',
        'You need to select a brewing vessel before you can add any steps.',
        [
          {
            text: 'OK',
          }
        ],
      );
      return;
    }
    // Pull up add menu
    this.setState({ visibleModal: true, modalType: constants.NEW_STEP_ELEM });
  };

  changeVessel = (vessel) => {
    this.setState({
      brewingVessel: vessel,
      filterType: '',
      orientation: '',
      visibleModal: false,
      modalType: '',
      steps: []
    });
  };

  onPressItem = (item) => {
    const {
      steps, selected
    } = this.state;
    // Open modal if necessary or add step to screen
    if (item === constants.STEP_HEAT_WATER || item === constants.STEP_GRIND_COFFEE
    || item === constants.STEP_BLOOM_GROUNDS || item === constants.STEP_POUR_WATER
    || item === constants.STEP_WAIT || item === constants.STEP_ADD_ICE
    || item === constants.STEP_CHILL_WATER || item === constants.STEP_STEEP) {
      // These require text inputs - open up modal
      this.setState({ visibleModal: true, modalType: item });
    } else {
      // Add new step
      const newStep = stepModel.Step({
        title: item,
      });
      this.setState({
        visibleModal: false,
        modalType: '',
        steps: [
          ...steps,
          newStep
        ],
        selected: [
          ...selected,
          false
        ]
      });
    }
  };

  onCloseClick = () => {
    // Close and clear modal
    this.setState({
      visibleModal: false,
      modalType: '',
      modalText: '',
      modalIdx: -1
    });
  };

  onModalSave = (item) => {
    const {
      modalType, modalText, modalIdx, modalSelect, steps, selected, useMetric,
      brewingVessel
    } = this.state;

    // Dismiss keyboard for modal
    Keyboard.dismiss();

    // If modal was for recipe name, just update that
    if (modalType === constants.RECIPE_NAME_ELEM) {
      this.setState({
        recipeName: modalText,
        visibleModal: false,
        modalType: '',
        modalText: ''
      });
    } else if (modalType === constants.VESSEL_ELEM) {
      // If same vessel, return
      if (brewingVessel === item) {
        return;
      }
      // If no vessel, update
      if (brewingVessel === '' || steps.length === 0) {
        this.changeVessel(item);
        return;
      }
      // Send alert that this resets steps
      Alert.alert(
        'Are you sure?',
        'Changing the brewing vessel will clear all current steps.',
        [
          {
            text: 'OK',
            onPress: () => {
              this.changeVessel(item);
            }
          },
          {
            text: 'Cancel'
          },
        ],
      );
    } else if (modalType === constants.FILTER_ELEM) {
      // Update filter
      this.setState({
        filterType: item,
        visibleModal: false,
        modalType: ''
      });
    } else if (modalType === constants.ORIENTATION_ELEM) {
      // Update orientation
      this.setState({
        orientation: item,
        visibleModal: false,
        modalType: ''
      });
    } else if (modalType === constants.RECIPE_DESCRIPTION_ELEM) {
      // Update orientation
      this.setState({
        recipeDescription: modalText,
        visibleModal: false,
        modalType: '',
        modalText: ''
      });
    } else {
      // Validate step
      const result = stepModel.validateStep(modalType, modalText, useMetric);
      if (result !== '') {
        // Show alert
        Alert.alert(
          'Could Not Save',
          `${result}`,
          [
            {
              text: 'OK'
            }
          ]
        );
        return;
      }

      // Check if new or update
      if (modalIdx === -1) {
        // Add new step and update state
        const newStep = stepModel.Step({
          title: modalType,
          properties: stepModel.getStepProperties(modalType, modalText, modalSelect, useMetric)
        });
        this.setState({
          visibleModal: false,
          modalType: '',
          modalText: '',
          modalIdx: -1,
          steps: [
            ...steps,
            newStep
          ],
          selected: [
            ...selected,
            false
          ]
        });
      } else if (modalIdx !== -1) {
        // Replace at index
        this.setState({
          visibleModal: false,
          modalType: '',
          modalText: '',
          modalIdx: -1,
          steps: update(steps, {
            [modalIdx]: {
              properties: {
                $set: stepModel.getStepProperties(modalType, modalText, modalSelect, useMetric)
              },
            }
          }),
        });
      }
    }
  };

  onStepClick = (stepId) => {
    // Update selected
    const { selected } = this.state;
    LayoutAnimation.configureNext(constants.CustomLayoutSpring);
    this.setState({ selected: selected.map((val, i) => (i === stepId ? !val : false)) });
  };

  onPressEdit = (stepIdx, title) => {
    const { steps, useMetric } = this.state;
    if (stepIdx !== -1) {
      const currentStep = steps[stepIdx];
      this.setState({
        visibleModal: true,
        modalType: title,
        modalIdx: stepIdx,
        modalText: stepModel.getModalTextProperty(currentStep, useMetric),
        modalSelect: stepModel.getModalSelectProperty(currentStep)
      });
    }
  };

  onPressDelete = (stepIdx) => {
    const { steps, selected } = this.state;
    // make a separate copy of the array
    const array = [...steps];
    const newSelected = [...selected];
    // Find index
    if (stepIdx !== -1) {
      array.splice(stepIdx, 1);
      newSelected.splice(stepIdx, 1);
      LayoutAnimation.configureNext(constants.CustomLayoutSpring);
      this.setState({
        steps: array,
        selected: newSelected,
      });
    }
  };

  swapInArray = (array, idx1, idx2) => {
    const arrayCopy = [...array];
    const temp = arrayCopy[idx2];
    arrayCopy[idx2] = arrayCopy[idx1];
    arrayCopy[idx1] = temp;
    return arrayCopy;
  };

  onPressUp = (stepIdx) => {
    const { steps, selected } = this.state;
    // make a separate copy of the array
    let array = [...steps];
    let newSelected = [...selected];
    // Find index
    if (stepIdx !== -1) {
      array = this.swapInArray(array, stepIdx - 1, stepIdx);
      newSelected = this.swapInArray(newSelected, stepIdx - 1, stepIdx);
      LayoutAnimation.configureNext(constants.CustomLayoutSpring);
      this.setState({
        steps: array,
        selected: newSelected,
      });
    }
  };

  onPressDown = (stepIdx) => {
    const { steps, selected } = this.state;
    // make a separate copy of the array
    let array = [...steps];
    let newSelected = [...selected];
    // Find index
    if (stepIdx !== -1) {
      array = this.swapInArray(array, stepIdx, stepIdx + 1);
      newSelected = this.swapInArray(newSelected, stepIdx, stepIdx + 1);
      LayoutAnimation.configureNext(constants.CustomLayoutSpring);
      this.setState({
        steps: array,
        selected: newSelected,
      });
    }
  };

  getDetailsList = () => {
    const {
      recipeName, brewingVessel, filterType, orientation,
      recipeDescription, totalWater, totalCoffee
    } = this.state;
    const arrToUse = [];
    constants.details.forEach((detail) => {
      let detailValue = '';
      let detailDisabled = false;
      let detailModalId = '';
      if (detail === constants.BUILDER_RECIPE_NAME_DETAIL) {
        detailValue = recipeName;
        detailModalId = constants.RECIPE_NAME_ELEM;
      } else if (detail === constants.BUILDER_VESSEL_DETAIL) {
        detailValue = brewingVessel;
        detailModalId = constants.VESSEL_ELEM;
      } else if (detail === constants.BUILDER_VESSEL_SIZE_DETAIL) {
        detailDisabled = (brewingVessel === '' || !(brewingVessel in constants.orientations));
        detailValue = orientation;
        detailModalId = constants.ORIENTATION_ELEM;
      } else if (detail === constants.BUILDER_FILTER_DETAIL) {
        detailDisabled = (brewingVessel === '');
        detailValue = filterType;
        detailModalId = constants.FILTER_ELEM;
      } else if (detail === constants.BUILDER_DESCRIPTION_DETAIL) {
        detailValue = recipeDescription;
        detailModalId = constants.RECIPE_DESCRIPTION_ELEM;
      } else if (detail === constants.BUILDER_RATIO) {
        if (totalWater !== 0 && totalCoffee !== 0) {
          detailValue = Math.round((totalCoffee / totalWater) * 100) / 100;
        }
        detailDisabled = true;
      }
      arrToUse.push({
        title: detail, value: detailValue, disabled: detailDisabled, modalId: detailModalId
      });
    });
    return arrToUse;
  };

  onDetailClick = (modalId) => {
    const { recipeName, recipeDescription } = this.state;
    if (modalId === constants.RECIPE_NAME_ELEM) {
      // Recipe edit modal with name prepopulated
      this.setState({ visibleModal: true, modalType: modalId, modalText: recipeName });
    } else if (modalId === constants.RECIPE_DESCRIPTION_ELEM) {
      // Recipe edit modal with name prepopulated
      this.setState({ visibleModal: true, modalType: modalId, modalText: recipeDescription });
    } else {
      // Pull up modify menu
      this.setState({ visibleModal: true, modalType: modalId });
    }
  };

  onChangeText = (text) => {
    this.setState({
      modalText: text
    });
  };

  onChangePicker = (val) => {
    this.setState({ modalSelect: val });
  };

  getTotalWaterAndCoffeeDetails = () => {
    const { steps } = this.state;
    let totalCoffee = 0;
    let totalWater = 0;
    let waterTempTotal = '';
    let grindSizeTotal = '';
    for (let i = 0; i < steps.length; i += 1) {
      const currentStep = steps[i];
      if (currentStep.title === constants.STEP_GRIND_COFFEE) {
        totalCoffee += Number(currentStep.properties.gramsCoffee);
        grindSizeTotal = currentStep.properties.grindSize;
      } else if (currentStep.title === constants.STEP_HEAT_WATER) {
        waterTempTotal = currentStep.properties.waterTemp;
      } else if (currentStep.title === constants.STEP_POUR_WATER
        || currentStep.title === constants.STEP_BLOOM_GROUNDS) {
        totalWater = Number(currentStep.properties.gramsWater)
          + Number(totalWater);
      }
    }
    return [totalCoffee, totalWater, grindSizeTotal, waterTempTotal];
  };

  onRecipeSave = () => {
    const { persistRecipe } = this.props;
    const objToUse = this.state;
    // Need to add totalWater, totalCoffee, waterTemp, and grindSize
    const [totalCoffee, totalWater, grindSize, waterTemp] = this.getTotalWaterAndCoffeeDetails();
    objToUse.totalCoffee = String(totalCoffee);
    objToUse.totalWater = String(totalWater);
    objToUse.grindSize = grindSize;
    objToUse.waterTemp = waterTemp;
    const newRecipe = recipeModel.Recipe(objToUse);
    persistRecipe(newRecipe, true);
  };

  render() {
    const {
      recipeName, brewingVessel, filterType, orientation, modalIdx, modalType,
      modalText, modalSelect, steps, selected, visibleModal, useMetric
    } = this.state;

    // Top margin - dynamic
    const { width } = Dimensions.get('window');

    return (
      <View style={styles.container}>
        <TopHeader title={recipeName} onClose={this.onBackClick} showSeparator />
        <ScrollView style={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <DetailsList
            details={this.getDetailsList()}
            onDetailClick={this.onDetailClick}
          />
          <StepList
            onPressEdit={this.onPressEdit}
            onPressDelete={this.onPressDelete}
            onPressUp={this.onPressUp}
            onPressDown={this.onPressDown}
            onStepClick={this.onStepClick}
            steps={steps}
            selected={selected}
            useMetric={useMetric}
          />
          <View style={styles.addandsave}>
            <ButtonLarge
              onButtonClick={this.onAddClick}
              title="Add Step"
              margin={[0, 16, 16, 16]}
              buttonWidth={width - 32}
              buttonHeight={40}
              textColor="#2D8CD3"
              backgroundColor="#2D8CD321"
            />
            <ButtonLarge
              onButtonClick={this.onRecipeSave}
              title="Save Recipe"
              margin={[0, 16, 32, 16]}
              buttonWidth={width - 32}
              buttonHeight={40}
              textColor="#40B90B"
              backgroundColor="#40B90B22"
            />
          </View>
          <BuilderModal
            visibleModal={visibleModal}
            modalIdx={modalIdx}
            modalType={modalType}
            modalText={modalText}
            modalSelect={modalSelect}
            vessel={brewingVessel}
            filterType={filterType}
            orientation={orientation}
            onCloseClick={this.onCloseClick}
            onPressItem={this.onPressItem}
            onChangeText={this.onChangeText}
            onChangePicker={this.onChangePicker}
            onModalSave={this.onModalSave}
            useMetric={useMetric}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#F1F3F6'
  },
  line: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    height: 1,
    backgroundColor: '#E3E3E3'
  },
  addandsave: {
    marginTop: 16,
    alignSelf: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  recipes: state.recipesReducer.recipes
});

const mapDispatchToProps = { persistRecipe: saveRecipe };

export default connect(mapStateToProps, mapDispatchToProps)(BuilderPage);
