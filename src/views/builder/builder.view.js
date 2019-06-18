
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

class BuilderPage extends Component {
	constructor(props) {
    super(props);
		this.state = {
			visibleModal: false,
			modalType: null,
			modalText: "",
			modalSelect: "Fine",
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
			this.setState({ brewingVessel: constants.vesselLabels[id], vesselId: id, visibleModal: false, modalType: null, });
		} else if (id.includes(constants.FILTER_ELEM)) {
			// Update vessel
			this.setState({ filterType: constants.filterLabels[id], visibleModal: false, modalType: null, });
		} else if (id.includes(constants.ORIENTATION_ELEM)) {
			// Update vessel
			this.setState({ orientation: constants.orientationLabels[id], visibleModal: false, modalType: null, });
		} else {
			// Add new step
			newStep = {
				id: uuidv4(),
				type: id,
				title: constants.stepLabels[id],
				description: ''
			}
			this.setState({
				visibleModal: false,
				modalType: null,
				steps: [
					...this.state.steps,
					newStep
				]
			})
		}
  };

	onCloseClick = () => {
		// If id empty - add new step to end

		// If id there, find element and update it
		this.setState({
			visibleModal: false,
			modalType: null,
		});
	}

	onStepClick = (id) => {
		// Pull up modify menu
		this.setState({ visibleModal: true, modalType: id })
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

	render() {
		const { recipeName, brewingVessel, filterType, orientation, modalType,
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
						/>
						<Step
							disabled={orientationDisabled}
							title={orientation}
							description={'Orientation/Size'}
							onStepClick={() => this.onStepClick(constants.ORIENTATION_ELEM)}
						/>
					</View>
				</View>
				<View style={styles.line}/>
				<SwipeList
					data={steps}
				/>
				<View style={styles.addandsave}>
					<Add
						onAddClick={this.onAddClick}
						backgroundColor={'#1D5E9E'}
						textColor={'#FFFFFF'}
					/>
				</View>
				<BuilderModal
					visibleModal={this.state.visibleModal}
					onSwipeComplete={() => this.setState({ visibleModal: false })}
					modalType={modalType}
					modalText={modalText}
					modalSelect={modalSelect}
					vessel={vesselId}
					onCloseClick={this.onCloseClick}
					onPressItem={this.onPressItem}
					onChangeText={this.onChangeText}
					onChangePicker={this.onChangePicker}
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
		alignSelf: 'center'
	}
});

export default BuilderPage;
