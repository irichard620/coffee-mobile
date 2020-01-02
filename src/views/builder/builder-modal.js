
import React, { Component } from 'react';
import CustomModal from '../../components/modal';
import ModalContentBottom from '../../components/modal-content-bottom';
import * as constants from '../../constants';

class BuilderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModalItem: '',
    };
  }

  newStepOptions = (vessel) => {
    const arrToUse = [];
    constants.steps.forEach((step) => {
      if (step === constants.STEP_HEAT_WATER
        || step === constants.STEP_RINSE_FILTER
        || step === constants.STEP_STIR) {
        if (vessel !== constants.VESSEL_MIZUDASHI) {
          arrToUse.push({ title: step });
        }
      } else if (step === constants.STEP_INSERT_PLUNGER) {
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
      } else if (step === constants.STEP_CHILL_WATER
        || step === constants.STEP_INSERT_FILTER
        || step === constants.STEP_STEEP) {
        if (vessel === constants.VESSEL_MIZUDASHI) {
          arrToUse.push({ title: step });
        }
      } else {
        arrToUse.push({ title: step });
      }
    });
    return arrToUse;
  };

  brewVesselOptions = (existingVessel) => {
    const arrToUse = [];
    constants.vessels.forEach((vessel) => {
      arrToUse.push({ title: vessel, selected: (existingVessel === vessel) });
    });
    return arrToUse;
  };

  filterOptions = (vessel, existingFilter) => {
    const arrToUse = [];
    constants.filters[vessel].forEach((filter) => {
      arrToUse.push({ title: filter, selected: (existingFilter === filter) });
    });
    return arrToUse;
  };

  orientationOptions = (vessel, existingOrientation) => {
    const arrToUse = [];
    constants.orientations[vessel].forEach((orientation) => {
      arrToUse.push({ title: orientation, selected: (existingOrientation === orientation) });
    });
    return arrToUse;
  };

  getTextPlaceholder = (modalType, useMetric) => {
    if (modalType === constants.STEP_HEAT_WATER) {
      if (useMetric) {
        return 'Degrees Celsius';
      }
      return 'Degrees Fahrenheit';
    } if (modalType === constants.STEP_CHILL_WATER) {
      return 'Grams of Water';
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
    } if (modalType === constants.STEP_STEEP) {
      return 'Hours to Steep';
    } if (modalType === constants.RECIPE_DESCRIPTION_ELEM) {
      return 'Recipe Description';
    }
    return '';
  };

  onModalPressItem = (item) => {
    const { onPressItem } = this.props;
    if (constants.steps.includes(item)) {
      // If step - we immediately trigger new step
      onPressItem(item);
    } else {
      // Other presses require a save
      // Also update options for this one
      this.setState({
        selectedModalItem: item
      });
    }
  };

  onModalSavePressed = () => {
    const { onModalSave } = this.props;
    const { selectedModalItem } = this.state;
    onModalSave(selectedModalItem);
    this.setState({
      selectedModalItem: ''
    });
  };

  onModalCloseClick = () => {
    const { onCloseClick } = this.props;
    onCloseClick();
    this.setState({
      selectedModalItem: ''
    });
  };

  render() {
    const {
      visibleModal, modalType, modalText, modalSelect,
      onChangeText, onChangePicker, vessel, useMetric, filterType,
      orientation
    } = this.props;
    const { selectedModalItem } = this.state;

    // Get content
    let isListModal = false;
    let isSelectInput = false;
    let options = [];
    let titleToDisplay = '';
    let charLimit = 4;
    let hasSave = true;
    if (modalType === constants.NEW_STEP_ELEM) {
      titleToDisplay = 'Step Options';
      isListModal = true;
      options = this.newStepOptions(vessel);
      hasSave = false;
    } else if (modalType === constants.VESSEL_ELEM) {
      titleToDisplay = 'Vessel Options';
      isListModal = true;
      let existingItem = vessel;
      if (selectedModalItem !== '') {
        existingItem = selectedModalItem;
      }
      options = this.brewVesselOptions(existingItem);
    } else if (modalType === constants.FILTER_ELEM) {
      titleToDisplay = 'Filter Options';
      isListModal = true;
      let existingItem = filterType;
      if (selectedModalItem !== '') {
        existingItem = selectedModalItem;
      }
      options = this.filterOptions(vessel, existingItem);
    } else if (modalType === constants.ORIENTATION_ELEM) {
      titleToDisplay = 'Orientation Options';
      isListModal = true;
      let existingItem = orientation;
      if (selectedModalItem !== '') {
        existingItem = selectedModalItem;
      }
      options = this.orientationOptions(vessel, existingItem);
    } else if (modalType === constants.STEP_GRIND_COFFEE) {
      titleToDisplay = 'Grind Coffee Options';
      isSelectInput = true;
    } else if (modalType === constants.RECIPE_NAME_ELEM) {
      titleToDisplay = 'Recipe Name';
      charLimit = 30;
    } else if (modalType === constants.RECIPE_DESCRIPTION_ELEM) {
      titleToDisplay = 'Recipe Description';
      charLimit = 100;
    } else {
      titleToDisplay = modalType;
    }

    return (
      <CustomModal
        visibleModal={visibleModal}
        onCloseClick={this.onModalCloseClick}
        type={constants.MODAL_TYPE_BOTTOM}
      >
        <ModalContentBottom
          modalText={modalText}
          textPlaceholder={this.getTextPlaceholder(modalType, useMetric)}
          modalSelect={modalSelect}
          isListModal={isListModal}
          isSelectInput={isSelectInput}
          options={options}
          title={titleToDisplay}
          charLimit={charLimit}
          pickerValues={constants.grindSizes}
          onPressItem={this.onModalPressItem}
          onChangeText={onChangeText}
          onModalSave={this.onModalSavePressed}
          onChangePicker={onChangePicker}
          hasSave={hasSave}
        />
      </CustomModal>
    );
  }
}

export default BuilderModal;
