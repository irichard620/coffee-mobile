
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import uuidv4 from 'uuid/v4';
import Modal from "react-native-modal";
import Add from '../../components/add';
import List from '../../components/list';
import Close from '../../components/close';
import Step from './step';
import Vessel from './vessel';
import * as constants from './builder-constants';
import BuilderModal from './modal';
import SwipeList from './swipe-list';
import update from 'immutability-helper';
import Button from '../../components/button';

class BuilderPage extends Component {
	constructor(props) {
    super(props);
		this.state = {
			visibleModal: false,
			modalId: "",
			modalType: "",
			modalText: "",
			modalSelect: "Medium",
			recipeName: "New Recipe",
			vesselId: "",
			brewingVessel: "-",
			filterType: "-",
			orientation: "-",
			totalWater: 0,
			totalCoffee: 0,
			steps: [],
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
			newStep = {
				id: uuidv4(),
				type: id,
				title: constants.stepLabels[id],
				description: this.getDescription(id, "", ""),
			}
			this.setState({
				visibleModal: false,
				modalType: "",
				steps: [
					...this.state.steps,
					newStep
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
			// Get title label
			titleLabel = '';
			if (modalType.includes(constants.NEW_STEP_ELEM)) {
				titleLabel = constants.stepLabels[modalType];
			} else if (modalType.includes(constants.RECIPE_NAME_ELEM)) {
				titleLabel = 'Recipe Name';
			}

			// Get description
			description = this.getDescription(modalType, modalText, modalSelect)

			// Add new step and update state
			newStep = {
				id: uuidv4(),
				type: modalType,
				title: titleLabel,
				description: description,
				properties: this.getProperties(modalType, modalText, modalSelect)
			}
			this.setState({
				visibleModal: false,
				modalType: "",
				modalText: "",
				steps: [
					...steps,
					newStep
				]
			})
		} else if (id != '') {
			// Get description
			description = this.getDescription(modalType, modalText, modalSelect)

			// Find index
			var index = -1;
			for (var i = 0; i < steps.length; i++) {
		    // Check id
				if (steps[i]['id'] == id) {
					index = i;
				}
			}

			if (index !== -1) {
				this.setState({
					visibleModal: false,
					modalType: "",
					modalText: "",
					modalId: "",
					steps: update(steps, {[index]: {
						description: {$set: description},
						properties: {$set: this.getProperties(modalType, modalText, modalSelect)},
					}}),
				})
		  }
		}
	}

	onStepClick = (id) => {
		// Pull up modify menu
		this.setState({ visibleModal: true, modalType: id })
	}

	onPressEdit = (id, type) => {
		this.setState({ visibleModal: true, modalType: type, modalId: id })
	}

	onPressDelete = (id) => {
		// make a separate copy of the array
		var array = [...this.state.steps];
		// Find index
		var index = -1;
		for (var i = 0; i < array.length; i++) {
	    // Check id
			if (array[i]['id'] == id) {
				index = i;
			}
		}
	  if (index !== -1) {
	    array.splice(index, 1);
	    this.setState({ steps: array });
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
		const { recipeName, brewingVessel, filterType, orientation, totalWater, totalCoffee,
			steps } = this.state;


	}

	getDescription(modalType, modalText, modalSelect) {
		// Get description
		description = '';
		if (modalType == constants.STEP_HEAT_WATER) {
			return 'Heat water to ' + modalText + 'F';
		} else if (modalType == constants.STEP_GRIND_COFFEE) {
			return modalText + ' grams of coffee ground ' + modalSelect;
		} else if (modalType == constants.STEP_BLOOM_GROUNDS) {
			return 'Bloom grounds with ' + modalText + ' of water';
		} else if (modalType == constants.STEP_POUR_WATER) {
			return 'Pour in ' + modalText + ' of water';
		} else if (modalType == constants.STEP_WAIT ) {
			return 'Wait ' + modalText + ' seconds';
		} else if (modalType == constants.STEP_RINSE_FILTER) {
			return 'Rinse paper filter with water. Discard water.';
		} else if (modalType == constants.STEP_ADD_GROUNDS) {
			return 'Add grounds to the brewing vessel.';
		} else if (modalType == constants.STEP_SERVE ) {
			return 'Pour and enjoy!';
		}
	}

	getProperties(modalType, modalText, modalSelect) {
		// Get description
		description = '';
		if (modalType == constants.STEP_HEAT_WATER) {
			return { waterTemp: modalText };
		} else if (modalType == constants.STEP_GRIND_COFFEE) {
			return { gramsCoffee: modalText, grindSize: modalSelect };
		} else if (modalType == constants.STEP_BLOOM_GROUNDS) {
			return { gramsWater: modalText };
		} else if (modalType == constants.STEP_POUR_WATER) {
			return { gramsWater: modalText };
		} else if (modalType == constants.STEP_WAIT ) {
			return { seconds: modalText };
		} else if (modalType == constants.STEP_RINSE_FILTER) {
			return {};
		} else if (modalType == constants.STEP_ADD_GROUNDS) {
			return {};
		} else if (modalType == constants.STEP_SERVE ) {
			return {};
		}
	}

	render() {
		const { recipeName, brewingVessel, filterType, orientation, modalId, modalType,
			modalText, modalSelect, steps, vesselId } = this.state;

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
				<SwipeList
					onPressEdit={this.onPressEdit}
					onPressDelete={this.onPressDelete}
					data={steps}
				/>
				<View style={styles.addandsave}>
					<Add
						onAddClick={this.onAddClick}
						backgroundColor={'#1D5E9E'}
						textColor={'#FFFFFF'}
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
	}
});

export default BuilderPage;
