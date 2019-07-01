
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Text, ScrollView, StyleSheet, LayoutAnimation } from 'react-native';
import uuidv4 from 'uuid/v4';
import Modal from "react-native-modal";
import Add from '../../components/add';
import List from '../../components/list';
import Close from '../../components/close';
import Step from './step';
import Vessel from './vessel';
import * as constants from './builder-constants';
import BuilderModal from './modal';
import StepList from './step-list';
import update from 'immutability-helper';
import Button from '../../components/button';
import * as stepModel from '../../storage/step';
import * as recipeModel from '../../storage/recipe';
import { saveRecipe } from '../../actions/recipe-actions';

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

class BuilderPage extends Component {
	constructor(props) {
    super(props);
		this.state = {
			visibleModal: false,
			modalId: "",
			modalType: "",
			modalText: "",
			modalSelect: constants.GRIND_MEDIUM,
			recipeName: "New Recipe",
			vesselId: "",
			brewingVessel: "-",
			filterType: "-",
			orientation: "-",
			totalWater: 0,
			totalCoffee: 0,
			grindSize: "",
			waterTemp: "",
			steps: [],
			selected: []
		}
  }

	onAddClick = () => {
		// Pull up add menu
		this.setState({ visibleModal: true, modalType: constants.NEW_STEP_ELEM })
	}

	onPressItem = (id) => {
		// Open modal if necessary or add step to screen
		if (id == constants.STEP_HEAT_WATER || id == constants.STEP_GRIND_COFFEE
		|| id == constants.STEP_BLOOM_GROUNDS || id == constants.STEP_POUR_WATER || id == constants.STEP_WAIT ) {
			// These require text inputs - open up modal
			this.setState({ visibleModal: true, modalType: id });
		} else if (id.includes(constants.VESSEL_ELEM)) {
			// Update vessel
			this.setState({
				brewingVessel: constants.vesselLabels[id],
				vesselId: id,
				filterType: "-",
				orientation: "-",
				visibleModal: false,
				modalType: ""
			});
		} else if (id.includes(constants.FILTER_ELEM)) {
			// Update filter
			this.setState({
				filterType: constants.filterLabels[id],
				visibleModal: false,
				modalType: ""
			});
		} else if (id.includes(constants.ORIENTATION_ELEM)) {
			// Update orientation
			this.setState({
				orientation: constants.orientationLabels[id],
				visibleModal: false,
				modalType: ""
			});
		} else {
			// Add new step
			newStep = stepModel.Step({
				type: id,
				title: constants.stepLabels[id],
			});
			this.setState({
				visibleModal: false,
				modalType: "",
				steps: [
					...this.state.steps,
					newStep
				],
				selected: [
					...this.state.selected,
					false
				]
			})
		}
  };

	onCloseClick = () => {
		// Close and clear modal
		this.setState({
			visibleModal: false,
			modalType: "",
			modalText: "",
		});
	}

	onModalSave = (id) => {
		const { modalType, modalText, modalSelect, steps } = this.state

		// If modal was for recipe name, just update that
		if (modalType == constants.RECIPE_NAME_ELEM) {
			this.setState({
				recipeName: modalText,
				visibleModal: false,
				modalType: "",
				modalText: ""
			});
		} else if (id == '') {
			// TODO: Update totalWater, totalCoffee, etc
			// Get title label
			titleLabel = constants.stepLabels[modalType];;

			// Add new step and update state
			newStep = stepModel.Step({
				type: modalType,
				title: titleLabel,
				properties: stepModel.getStepProperties(modalType, modalText, modalSelect)
			});
			this.setState({
				visibleModal: false,
				modalType: "",
				modalText: "",
				steps: [
					...steps,
					newStep
				],
				selected: [
					...this.state.selected,
					false
				]
			})
		} else if (id != '') {
			// TODO: Update totalWater, totalCoffee, etc
			// Find index
			var index = this.findIndexOfId(id, steps);
			if (index !== -1) {
				this.setState({
					visibleModal: false,
					modalType: "",
					modalText: "",
					modalId: "",
					steps: update(steps, {[index]: {
						properties: {$set: stepModel.getStepProperties(modalType, modalText, modalSelect)},
					}}),
				})
		  }
		}
	}

	onStepClick = (id, inList) => {
		if (!inList) {
			// Pull up modify menu
			this.setState({ visibleModal: true, modalType: id })
		} else {
			// Update selected
			const { selected } = this.state;
			LayoutAnimation.configureNext(CustomLayoutSpring);
			this.setState({selected: selected.map((val, i) => i === id ? !val : val)})
		}
	}

	onPressEdit = (id, type) => {
		this.setState({ visibleModal: true, modalType: type, modalId: id })
	}

	findIndexOfId = (id, array) => {
		// Find index
		var index = -1;
		for (var i = 0; i < array.length; i++) {
	    // Check id
			if (array[i]['id'] == id) {
				index = i;
			}
		}
		return index
	}

	onPressDelete = (id) => {
		// make a separate copy of the array
		var array = [...this.state.steps];
		var newSelected = [...this.state.selected];
		// Find index
		var index = this.findIndexOfId(id, array);
	  if (index !== -1) {
	    array.splice(index, 1);
			newSelected.splice(index, 1);
			LayoutAnimation.configureNext(CustomLayoutSpring);
	    this.setState({
				steps: array,
				selected: newSelected,
			});
	  }
	}

	swapInArray = (array, idx1, idx2) => {
		temp = array[idx2];
		array[idx2] = array[idx1];
		array[idx1] = temp;
		return array;
	}

	onPressUp = (id) => {
		// make a separate copy of the array
		var array = [...this.state.steps];
		var newSelected = [...this.state.selected];
		// Find index
		var index = this.findIndexOfId(id, array);
		if (index !== -1) {
			array = this.swapInArray(array, index - 1, index);
			newSelected = this.swapInArray(newSelected, index - 1, index);
			LayoutAnimation.configureNext(CustomLayoutSpring);
	    this.setState({
				steps: array,
				selected: newSelected,
			});
	  }
	}

	onPressDown = (id) => {
		// make a separate copy of the array
		var array = [...this.state.steps];
		var newSelected = [...this.state.selected];
		// Find index
		var index = this.findIndexOfId(id, array);
		if (index !== -1) {
			array = this.swapInArray(array, index, index + 1);
			newSelected = this.swapInArray(newSelected, index, index + 1);
			LayoutAnimation.configureNext(CustomLayoutSpring);
			this.setState({
				steps: array,
				selected: newSelected,
			});
		}
	}

	onChangeText = (text) => {
		this.setState({
			modalText: text
		})
	}

	onChangePicker = (val, idx) => {
		console.log(val);
		this.setState({ modalSelect: val })
	}

	onRecipeSave = () => {
		console.log('Save recipe');
		objToUse = this.state;
		// Need to add totalWater, totalCoffee, waterTemp, and grindSize
		for (i = 0; i < objToUse.steps.length; i++) {
			currentStep = objToUse.steps[i];
		}
		newRecipe = recipeModel.Recipe(this.state);
		this.props.saveRecipe(newRecipe);
	}

	render() {
		const { recipeName, brewingVessel, filterType, orientation, modalId, modalType,
			modalText, modalSelect, steps, vesselId, selected } = this.state;

		const baseButtonPath = "../../assets/buttons/";

		// Check if we should disable certain fields
		var filterDisabled = (brewingVessel == '-');
		var orientationDisabled = false;
		if (vesselId == '' || filterType == "-" || !(vesselId in constants.orientations)) {
			orientationDisabled = true
		}

		return (
			<ScrollView style={styles.container}>
        <Text style={styles.title}>Recipe Builder</Text>
				<Step
					disabled={false}
					title={recipeName}
					description={'Recipe Name'}
					onStepClick={() => this.onStepClick(constants.RECIPE_NAME_ELEM)}
					margin={[0, 15, 15, 15]}
				/>
				<View style={styles.rowSteps}>
					<View style={styles.vesselContainer}>
						<Vessel
							disabled={false}
							title={brewingVessel}
							description={'Brewing Vessel'}
							onStepClick={() => this.onStepClick(constants.VESSEL_ELEM)}
						/>
					</View>
					<View style={styles.columnSteps}>
						<Step
							disabled={filterDisabled}
							title={filterType}
							description={'Filter Type'}
							onStepClick={() => this.onStepClick(constants.FILTER_ELEM)}
							margin={[0, 15, 15, 15]}
						/>
						<Step
							disabled={orientationDisabled}
							title={orientation}
							description={'Orientation/Size'}
							onStepClick={() => this.onStepClick(constants.ORIENTATION_ELEM)}
							margin={[0, 15, 15, 15]}
						/>
					</View>
				</View>
				<View style={styles.line}/>
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
					/>
					<Button
						onButtonClick={this.onRecipeSave}
						type={1}
						title={'Save'}
						width={110}
						margin={[15, 0, 15, 0]}
					/>
				</View>
				<BuilderModal
					visibleModal={this.state.visibleModal}
					onSwipeComplete={this.onCloseClick}
					modalId={modalId}
					modalType={modalType}
					modalText={modalText}
					modalSelect={modalSelect}
					vessel={vesselId}
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
  title: {
		marginTop: 70,
    marginLeft: 15,
		marginBottom: 20,
    fontSize: 28,
		fontWeight: "600",
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
		flexDirection:'row'
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

const mapStateToProps = (state) => ({
	recipes: state.recipesReducer.recipes
});

const mapDispatchToProps = { saveRecipe: saveRecipe }

BuilderPage = connect(mapStateToProps,mapDispatchToProps)(BuilderPage)

export default BuilderPage;
