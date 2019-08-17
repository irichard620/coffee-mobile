
import React, { Component } from 'react';
import CustomModal from '../../components/modal';
import * as constants from '../../constants';

class BuilderModal extends Component {
  newStepOptions = (vessel) => {
    const arrToUse = [];
    constants.steps.forEach((step) => {
      if (step === constants.STEP_INSERT_PLUNGER) {
        if (vessel === constants.VESSEL_AEROPRESS) {
          arrToUse.push({ title: step });
        }
      } else if (step === constants.STEP_PUSH_PLUNGER) {
        if (vessel === constants.VESSEL_AEROPRESS) {
          arrToUse.push({ title: step });
        }
      } else if (step === constants.STEP_PUSH_FILTER) {
        if (vessel === constants.VESSEL_FRENCH_PRESS) {
          arrToUse.push({ title: step });
        }
      } else {
        arrToUse.push({ title: step });
      }
    });
    return arrToUse;
  }

  brewVesselOptions = () => {
    const arrToUse = [];
    constants.vessels.forEach((vessel) => {
      arrToUse.push({ title: vessel });
    });
    return arrToUse;
  }

  filterOptions = (vessel) => {
    const arrToUse = [];
    constants.filters[vessel].forEach((filter) => {
      arrToUse.push({ title: filter });
    });
    return arrToUse;
  }

  orientationOptions = (vessel) => {
    const arrToUse = [];
    constants.orientations[vessel].forEach((orientation) => {
      arrToUse.push({ title: orientation });
    });
    return arrToUse;
  }

  getTextPlaceholder = (modalType, useMetric) => {
    if (modalType === constants.STEP_HEAT_WATER) {
      if (useMetric) {
        return 'Degrees Celsius';
      }
      return 'Degrees Fahrenheit';
    } if (modalType === constants.STEP_GRIND_COFFEE) {
      return 'Grams of Coffee';
    } if (modalType === constants.STEP_BLOOM_GROUNDS) {
      return 'Grams of Water';
    } if (modalType === constants.STEP_POUR_WATER) {
      return 'Grams of Water';
    } if (modalType === constants.STEP_WAIT) {
      return 'Seconds to Wait';
    } if (modalType === constants.STEP_ADD_ICE) {
      return 'Grams of Ice';
    } if (modalType === constants.RECIPE_NAME_ELEM) {
      return 'Recipe Name';
    } if (modalType === constants.USER_NAME_ELEM) {
      return 'Name';
    }
    return '';
  }

  render() {
    const {
      visibleModal, modalType, modalText, modalSelect, onCloseClick, onPressItem,
      onChangeText, onModalSave, onChangePicker, vessel, useMetric
    } = this.props;

    // Get content
    let isListModal = false;
    let isSelectInput = false;
    let options = [];
    let titleToDisplay = '';
    let charLimit = 4;
    if (modalType === constants.NEW_STEP_ELEM) {
      isListModal = true;
      options = this.newStepOptions(vessel);
    } else if (modalType === constants.VESSEL_ELEM) {
      isListModal = true;
      options = this.brewVesselOptions();
    } else if (modalType === constants.FILTER_ELEM) {
      isListModal = true;
      options = this.filterOptions(vessel);
    } else if (modalType === constants.ORIENTATION_ELEM) {
      isListModal = true;
      options = this.orientationOptions(vessel);
    } else if (modalType === constants.STEP_GRIND_COFFEE) {
      isSelectInput = true;
    } else if (modalType === constants.RECIPE_NAME_ELEM) {
      titleToDisplay = 'Recipe Name';
      charLimit = 30;
    } else if (modalType === constants.USER_NAME_ELEM) {
      titleToDisplay = "What's your name?";
      charLimit = 20;
    } else {
      titleToDisplay = modalType;
    }

    return (
      <CustomModal
        visibleModal={visibleModal}
        onCloseClick={onCloseClick}
        modalText={modalText}
        textPlaceholder={this.getTextPlaceholder(modalType, useMetric)}
        modalSelect={modalSelect}
        isListModal={isListModal}
        isSelectInput={isSelectInput}
        options={options}
        title={titleToDisplay}
        charLimit={charLimit}
        pickerValues={constants.grindSizes}
        onPressItem={onPressItem}
        onChangeText={onChangeText}
        onModalSave={onModalSave}
        onChangePicker={onChangePicker}
      />
    );
  }
}

export default BuilderModal;
