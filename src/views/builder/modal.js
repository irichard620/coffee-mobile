
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Picker } from 'react-native';
import Modal from "react-native-modal";
import List from '../../components/list';
import Close from '../../components/close';
import * as constants from './builder-constants';

class BuilderModal extends Component {
	constructor(props) {
    super(props);
  }

	onPressItem = (id) => {
		// Set
    console.log(id + ' selected');
  };

	onCloseClick = () => {
		this.setState({
			visibleModal: false,
			modalType: null,
		});
	}

	newStepOptions = () => {
		arrToUse = [];
		Object.keys(constants.stepLabels)
			.sort()
			.forEach(function(v, i) {
				arrToUse.push({ id: v, title: constants.stepLabels[v] })
			});
		return arrToUse;
	}

	brewVesselOptions = () => {
		arrToUse = [];
		Object.keys(constants.vesselLabels)
			.sort()
			.forEach(function(v, i) {
				arrToUse.push({ id: v, title: constants.vesselLabels[v] })
			});
		return arrToUse;
	}

	filterOptions = () => {
		arrToUse = [];
		constants.filters[this.props.vessel]
			.sort()
			.forEach(function(v, i) {
				arrToUse.push({ id: v, title: constants.filterLabels[v] })
			});
		return arrToUse;
	}

  orientationOptions = () => {
		arrToUse = [];
		constants.orientations[this.props.vessel]
			.sort()
			.forEach(function(v, i) {
				arrToUse.push({ id: v, title: constants.orientationLabels[v] })
			});
		return arrToUse;
	}

  getTextPlaceholder = (modalType) => {
    if (modalType == constants.STEP_HEAT_WATER) {
      return 'Water Temp';
    } else if (modalType == constants.STEP_GRIND_COFFEE) {
      return 'Grams of Coffee';
    } else if (modalType == constants.STEP_BLOOM_GROUNDS) {
      return 'Water Amount';
    } else if (modalType == constants.STEP_POUR_WATER) {
      return 'Water Amount';
    } else if (modalType == constants.STEP_WAIT ) {
      return 'Wait Time';
    }
    return '';
  }

	render() {
		const { visibleModal, modalType, modalText, modalSelect } = this.props;

    // Get list content
    isListModal = false
		options = [];
		if (modalType == constants.NEW_STEP_ELEM) {
			isListModal = true
			options = this.newStepOptions();
		} else if (modalType == constants.VESSEL_ELEM) {
			isListModal = true
			options = this.brewVesselOptions();
		} else if (modalType == constants.FILTER_ELEM) {
			isListModal = true
			options = this.filterOptions();
		} else if (modalType == constants.ORIENTATION_ELEM) {
			isListModal = true
			options = this.orientationOptions();
		}

    // Elems with atleast one text
    isTextInput = true
    isSelectInput = false
    if (modalType == constants.STEP_GRIND_COFFEE) {
      isSelectInput = true
    }

    // Text to display
    textToDisplay = modalText;
    if (modalText == '' || modalText == '-') {
      textToDisplay = this.getTextPlaceholder(modalType);
    }

		return (
      <Modal
        isVisible={visibleModal}
        onSwipeComplete={this.props.onSwipeComplete}
        swipeDirection={['up', 'left', 'right', 'down']}
        style={styles.bottomModal}
      >
        <View style={styles.content}>
          <Close
            onCloseClick={this.props.onCloseClick}
            style={styles.close}
          />
          {isTextInput && <TextInput
            onChangeText={(text) => this.props.onChangeText(text)}
            value={textToDisplay}
          />}
          {isSelectInput && <View style={styles.picker}>
            <Picker
              selectedValue={modalSelect}
              onValueChange={this.props.onChangePicker}
              itemStyle={styles.pickertitle}
            >
              <Picker.Item label="Fine" value="Fine" />
              <Picker.Item label="Medium-Coarse" value="Medium-Coarse" />
              <Picker.Item label="Coarse" value="Coarse" />
            </Picker>
          </View>}
          {isListModal && <List
    				options={options}
    				onPressItem={this.props.onPressItem}
    			/>}
        </View>
      </Modal>
		);
	}
}

const styles = StyleSheet.create({
	content: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
	close: {
		marginTop: 15,
		marginBottom: 15,
	},
  picker: {
  },
  pickertitle: {
    fontSize: 16,
    color: '#1D5E9E',
  },
});

export default BuilderModal;
