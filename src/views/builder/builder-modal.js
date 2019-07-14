
import React, { Component } from 'react';
import CustomModal from '../../components/modal';
import * as constants from '../../constants';

class BuilderModal extends Component {
  newStepOptions = () => {
    const arrToUse = [];
    Object.keys(constants.stepLabels)
      .sort()
      .forEach((v) => {
        arrToUse.push({ id: v, title: constants.stepLabels[v] });
      });
    return arrToUse;
  }

  brewVesselOptions = () => {
    const arrToUse = [];
    Object.keys(constants.vesselLabels)
      .sort()
      .forEach((v) => {
        arrToUse.push({ id: v, title: constants.vesselLabels[v] });
      });
    return arrToUse;
  }

  filterOptions = () => {
    const { vessel } = this.props;
    const arrToUse = [];
    constants.filters[vessel]
      .sort()
      .forEach((v) => {
        arrToUse.push({ id: v, title: constants.filterLabels[v] });
      });
    return arrToUse;
  }

  orientationOptions = () => {
    const { vessel } = this.props;
    const arrToUse = [];
    constants.orientations[vessel]
      .sort()
      .forEach((v) => {
        arrToUse.push({ id: v, title: constants.orientationLabels[v] });
      });
    return arrToUse;
  }

  getTextPlaceholder = (modalType) => {
    if (modalType === constants.STEP_HEAT_WATER) {
      return 'Water Temp';
    } if (modalType === constants.STEP_GRIND_COFFEE) {
      return 'Grams of Coffee';
    } if (modalType === constants.STEP_BLOOM_GROUNDS) {
      return 'Water Amount';
    } if (modalType === constants.STEP_POUR_WATER) {
      return 'Water Amount';
    } if (modalType === constants.STEP_WAIT) {
      return 'Wait Time';
    } if (modalType === constants.RECIPE_NAME_ELEM) {
      return 'Recipe Name';
    }
    return '';
  }

  render() {
    const {
      visibleModal, modalId, modalType, modalText, modalSelect, onCloseClick, onPressItem,
      onChangeText, onModalSave, onChangePicker
    } = this.props;

    // Get list content
    let isListModal = false;
    let options = [];
    if (modalType === constants.NEW_STEP_ELEM) {
      isListModal = true;
      options = this.newStepOptions();
    } else if (modalType === constants.VESSEL_ELEM) {
      isListModal = true;
      options = this.brewVesselOptions();
    } else if (modalType === constants.FILTER_ELEM) {
      isListModal = true;
      options = this.filterOptions();
    } else if (modalType === constants.ORIENTATION_ELEM) {
      isListModal = true;
      options = this.orientationOptions();
    }

    // Elems with atleast one text
    let isSelectInput = false;
    if (modalType === constants.STEP_GRIND_COFFEE) {
      isSelectInput = true;
    }

    // Title
    let titleToDisplay = '';
    if (modalType.includes(constants.NEW_STEP_ELEM)) {
      titleToDisplay = constants.stepLabels[modalType];
    } else if (modalType.includes(constants.RECIPE_NAME_ELEM)) {
      titleToDisplay = 'Recipe Name';
    }

    return (
      <CustomModal
        visibleModal={visibleModal}
        onCloseClick={onCloseClick}
        modalId={modalId}
        modalText={modalText}
        textPlaceholder={this.getTextPlaceholder(modalType)}
        modalSelect={modalSelect}
        isListModal={isListModal}
        isSelectInput={isSelectInput}
        options={options}
        title={titleToDisplay}
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
