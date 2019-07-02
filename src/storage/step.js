import uuidv4 from 'uuid/v4';
import * as constants from '../constants';

export function Step(stepObj) {
  step = {}
  // Get ID
  if (!('id' in stepObj) || stepObj['id'] == '') {
    step.id = uuidv4();
  } else {
    step.id = stepObj['id'];
  }

  // Assign other values
  step.type = stepObj['type'];
  step.title = stepObj['title'];
  step.properties = stepObj['properties'];

  return step;
}

export function getStepShortDescription(step) {
  description = '';
  if (step.type == constants.STEP_HEAT_WATER) {
    description += 'Heat water to ' + step.properties.waterTemp + '\u2109.';
  } else if (step.type == constants.STEP_GRIND_COFFEE) {
    description += step.properties.gramsCoffee + ' grams of coffee ground  ' + step.properties.grindSize;
  } else if (step.type == constants.STEP_RINSE_FILTER) {
    description += 'Rinse filter with water. Discard water.';
  } else if (step.type == constants.STEP_ADD_GROUNDS) {
    description += 'Add grounds to the brewing vessel.';
  } else if (step.type == constants.STEP_BLOOM_GROUNDS) {
    description += 'Bloom grounds with ' + step.properties.gramsWater + ' grams of water';
  } else if (step.type == constants.STEP_POUR_WATER) {
    description += 'Pour in ' + step.properties.gramsWater + ' grams of water';
  } else if (step.type == constants.STEP_WAIT) {
    description += 'Wait ' + step.properties.seconds + ' seconds';
  }

  return description
}

export function getStepDescription(step) {
  description = '';
  if (step.type == constants.STEP_HEAT_WATER) {
    description += 'Heat your water to ' + step.properties.waterTemp + '\u2109.';
  } else if (step.type == constants.STEP_GRIND_COFFEE) {
    description += 'Grind ' + step.properties.gramsCoffee +
      ' grams of coffee to a ' + step.properties.grindSize + ' consistency.';
  } else if (step.type == constants.STEP_RINSE_FILTER) {
    description += 'Rinse the filter with some of your hot water, then discard the water. ' +
      'This washes the filter and remove any paper taste.';
  } else if (step.type == constants.STEP_ADD_GROUNDS) {
    description += 'Add the ground coffee to the vessel.';
  } else if (step.type == constants.STEP_BLOOM_GROUNDS) {
    description += 'Pour ' + step.properties.gramsWater + ' grams of water on to ' +
      'fully saturate your coffee grounds.';
  } else if (step.type == constants.STEP_POUR_WATER) {
    description += 'Add ' + step.properties.gramsWater + ' grams of water to the brew bed.';
  } else if (step.type == constants.STEP_WAIT) {
    description += 'Wait ' + step.properties.seconds + ' seconds';
  }

  return description
}

export function getStepProperties(modalType, modalText, modalSelect) {
  // Get description
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
  } else {
    return {};
  }
}
