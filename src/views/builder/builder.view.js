
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View, Text, ScrollView, StyleSheet, LayoutAnimation, Alert, Keyboard, Dimensions
} from 'react-native';
import update from 'immutability-helper';
import Add from '../../components/add';
import Back from '../../components/back';
import Step from './step';
import Vessel from './vessel';
import * as constants from '../../constants';
import BuilderModal from './builder-modal';
import StepList from './step-list';
import Button from '../../components/button';
import * as stepModel from '../../storage/step';
import * as recipeModel from '../../storage/recipe';
import { saveRecipe } from '../../actions/recipe-actions';

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
      favorited: false,
      brewingVessel: '-',
      filterType: '-',
      orientation: '-',
      totalWater: 0,
      totalCoffee: 0,
      grindSize: '',
      waterTemp: '',
      steps: [],
      selected: []
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const recipe = navigation.getParam('recipe', {});
    if (Object.keys(recipe).length !== 0) {
      // Update params
      const selected = [];
      for (let i = 0; i < recipe.steps.length; i += 1) {
        selected.push(false);
      }
      this.setState({
        recipeId: recipe.recipeId,
        recipeName: recipe.recipeName,
        favorited: recipe.favorited,
        brewingVessel: recipe.brewingVessel,
        filterType: recipe.filterType,
        orientation: recipe.orientation,
        steps: recipe.steps,
        selected
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
          'Could not Save Recipe',
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
  }

  onAddClick = () => {
    const { brewingVessel } = this.state;

    // If no vessel, show alert
    if (brewingVessel === '' || brewingVessel === '-') {
      Alert.alert(
        'Must select vessel',
        'Must select brewing vessel before creating recipe steps',
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
  }

  changeVessel = (vessel) => {
    this.setState({
      brewingVessel: vessel,
      filterType: '-',
      orientation: '-',
      visibleModal: false,
      modalType: '',
      steps: []
    });
  }

  onPressItem = (item) => {
    const {
      steps, selected, brewingVessel, modalType
    } = this.state;
    // Open modal if necessary or add step to screen
    if (item === constants.STEP_HEAT_WATER || item === constants.STEP_GRIND_COFFEE
    || item === constants.STEP_BLOOM_GROUNDS || item === constants.STEP_POUR_WATER
    || item === constants.STEP_WAIT || item === constants.STEP_ADD_ICE) {
      // These require text inputs - open up modal
      this.setState({ visibleModal: true, modalType: item });
    } else if (modalType === constants.VESSEL_ELEM) {
      // If same vessel, return
      if (brewingVessel === item) {
        return;
      }
      // If no vessel, update
      if (brewingVessel === '' || brewingVessel === '-' || steps.length === 0) {
        this.changeVessel(item);
        return;
      }
      // Send alert that this resets steps
      Alert.alert(
        'Are you sure?',
        'Changing the brew vessel will remove all current steps',
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
  }

  onModalSave = () => {
    const {
      modalType, modalText, modalIdx, modalSelect, steps, selected
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
    } else {
      // Validate step
      const result = stepModel.validateStep(modalType, modalText);
      if (result !== '') {
        // Show alert
        Alert.alert(
          'Could not save',
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
          properties: stepModel.getStepProperties(modalType, modalText, modalSelect)
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
                $set: stepModel.getStepProperties(modalType, modalText, modalSelect)
              },
            }
          }),
        });
      }
    }
  }

  onStepClick = (stepId, inList) => {
    if (!inList) {
      // Pull up modify menu
      this.setState({ visibleModal: true, modalType: stepId });
    } else {
      // Update selected
      const { selected } = this.state;
      LayoutAnimation.configureNext(constants.CustomLayoutSpring);
      this.setState({ selected: selected.map((val, i) => (i === stepId ? !val : false)) });
    }
  }

  onPressEdit = (stepIdx, title) => {
    this.setState({ visibleModal: true, modalType: title, modalIdx: stepIdx });
  }

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
  }

  swapInArray = (array, idx1, idx2) => {
    const arrayCopy = [...array];
    const temp = arrayCopy[idx2];
    arrayCopy[idx2] = arrayCopy[idx1];
    arrayCopy[idx1] = temp;
    return arrayCopy;
  }

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
  }

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
  }

  onChangeText = (text) => {
    this.setState({
      modalText: text
    });
  }

  onChangePicker = (val) => {
    this.setState({ modalSelect: val });
  }

  onRecipeSave = () => {
    const { persistRecipe } = this.props;
    const objToUse = this.state;
    // Need to add totalWater, totalCoffee, waterTemp, and grindSize
    for (let i = 0; i < objToUse.steps.length; i += 1) {
      const currentStep = objToUse.steps[i];
      if (currentStep.title === constants.STEP_GRIND_COFFEE) {
        objToUse.grindSize = currentStep.properties.grindSize;
        objToUse.totalCoffee = currentStep.properties.gramsCoffee;
      } else if (currentStep.title === constants.STEP_HEAT_WATER) {
        objToUse.waterTemp = currentStep.properties.waterTemp;
      } else if (currentStep.title === constants.STEP_POUR_WATER
        || currentStep.title === constants.STEP_BLOOM_GROUNDS) {
        objToUse.totalWater = String(Number(currentStep.properties.gramsWater)
        + Number(objToUse.totalWater));
      }
    }
    const newRecipe = recipeModel.Recipe(objToUse);
    persistRecipe(newRecipe);
  }

  render() {
    const {
      recipeName, brewingVessel, filterType, orientation, modalIdx, modalType,
      modalText, modalSelect, steps, selected, visibleModal
    } = this.state;

    // Check if we should disable certain fields
    const filterDisabled = (brewingVessel === '-');
    let orientationDisabled = false;
    if (brewingVessel === '-' || filterType === '-'
    || !(brewingVessel in constants.orientations)) {
      orientationDisabled = true;
    }

    // Top margin - dynamic
    const { height } = Dimensions.get('window');
    const marginTopStyle = {
      marginTop: height * 0.03
    };

    return (
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <View style={[styles.backcontainer, marginTopStyle]}>
          <Back
            onBackClick={this.onBackClick}
            type={0}
          />
        </View>
        <Text style={styles.title}>Recipe Builder</Text>
        <Step
          disabled={false}
          title={recipeName}
          description="Recipe Name"
          onStepClick={() => this.onStepClick(constants.RECIPE_NAME_ELEM)}
          margin={[0, 15, 15, 15]}
        />
        <View style={styles.rowSteps}>
          <View style={styles.vesselContainer}>
            <Vessel
              disabled={false}
              vessel={brewingVessel}
              onStepClick={() => this.onStepClick(constants.VESSEL_ELEM)}
            />
          </View>
          <View style={styles.columnSteps}>
            <Step
              disabled={filterDisabled}
              title={filterType}
              description="Filter Type"
              onStepClick={() => this.onStepClick(constants.FILTER_ELEM)}
              margin={[0, 15, 15, 15]}
            />
            <Step
              disabled={orientationDisabled}
              title={orientation}
              description="Orientation/Size"
              onStepClick={() => this.onStepClick(constants.ORIENTATION_ELEM)}
              margin={[0, 15, 15, 15]}
            />
          </View>
        </View>
        <View style={styles.line} />
        <StepList
          onPressEdit={this.onPressEdit}
          onPressDelete={this.onPressDelete}
          onPressUp={this.onPressUp}
          onPressDown={this.onPressDown}
          onStepClick={this.onStepClick}
          steps={steps}
          selected={selected}
        />
        <View style={styles.addandsave}>
          <Add
            onAddClick={this.onAddClick}
            type={0}
          />
          <Button
            onButtonClick={this.onRecipeSave}
            type={1}
            title="Save"
            width={110}
            margin={[15, 0, 45, 0]}
          />
        </View>
        <BuilderModal
          visibleModal={visibleModal}
          modalIdx={modalIdx}
          modalType={modalType}
          modalText={modalText}
          modalSelect={modalSelect}
          vessel={brewingVessel}
          onCloseClick={this.onCloseClick}
          onPressItem={this.onPressItem}
          onChangeText={this.onChangeText}
          onChangePicker={this.onChangePicker}
          onModalSave={this.onModalSave}
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
  backcontainer: {
    marginLeft: 15,
    alignItems: 'flex-start',
  },
  title: {
    marginLeft: 15,
    marginBottom: 20,
    fontSize: 28,
    fontWeight: '600',
    color: '#1D5E9E',
    alignSelf: 'flex-start',
  },
  content: {
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'flex-start',
    borderRadius: 20,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  rowSteps: {
    flexDirection: 'row'
  },
  vesselContainer: {
    width: '50%',
  },
  columnSteps: {
    width: '50%',
  },
  line: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    height: 1,
    backgroundColor: '#E3E3E3'
  },
  addandsave: {
    marginTop: 15,
    alignSelf: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  recipes: state.recipesReducer.recipes
});

const mapDispatchToProps = { persistRecipe: saveRecipe };

export default connect(mapStateToProps, mapDispatchToProps)(BuilderPage);
