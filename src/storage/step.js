import uuidv4 from 'uuid/v4';
import * as constants from '../constants';

export function Step(stepObj) {
  const step = {};
  // Get ID
  if (!('stepId' in stepObj) || stepObj.stepId === '') {
    step.stepId = uuidv4();
  } else {
    step.stepId = stepObj.stepId;
  }

  // Assign other values
  step.type = stepObj.type;
  step.title = stepObj.title;
  step.properties = stepObj.properties;

  return step;
}

export function getStepShortDescription(step) {
  if (step.type === constants.STEP_HEAT_WATER) {
    return `Heat water to ${step.properties.waterTemp}\u2109.`;
  } if (step.type === constants.STEP_GRIND_COFFEE) {
    return `${step.properties.gramsCoffee} grams of coffee ground  ${step.properties.grindSize}`;
  } if (step.type === constants.STEP_RINSE_FILTER) {
    return 'Rinse filter with water. Discard water.';
  } if (step.type === constants.STEP_ADD_GROUNDS) {
    return 'Add grounds to the brewing vessel.';
  } if (step.type === constants.STEP_BLOOM_GROUNDS) {
    return `Bloom grounds with ${step.properties.gramsWater} grams of water`;
  } if (step.type === constants.STEP_POUR_WATER) {
    return `Pour in ${step.properties.gramsWater} grams of water`;
  } if (step.type === constants.STEP_WAIT) {
    return `Wait ${step.properties.seconds} seconds`;
  } if (step.type === constants.STEP_ADD_ICE) {
    return `Add ${step.properties.gramsIce} grams of ice`;
  } if (step.type === constants.STEP_STIR) {
    return 'Gently stir the brew bed';
  } if (step.type === constants.STEP_INSERT_PLUNGER) {
    return 'Insert the plunger';
  } if (step.type === constants.STEP_PUSH_PLUNGER) {
    return 'Push down the plunger';
  } if (step.type === constants.STEP_PUSH_FILTER) {
    return 'Push down the filter';
  }

  return '';
}

export function getStepDescription(step) {
  if (step.type === constants.STEP_HEAT_WATER) {
    return `Heat your water to ${step.properties.waterTemp}\u2109.`;
  } if (step.type === constants.STEP_GRIND_COFFEE) {
    return `Grind ${step.properties.gramsCoffee
    } grams of coffee to a ${step.properties.grindSize} consistency.`;
  } if (step.type === constants.STEP_RINSE_FILTER) {
    return 'Rinse the filter with some of your hot water, then discard the water. '
      + 'This washes the filter and remove any paper taste.';
  } if (step.type === constants.STEP_ADD_GROUNDS) {
    return 'Add the ground coffee to the vessel.';
  } if (step.type === constants.STEP_BLOOM_GROUNDS) {
    return `Pour ${step.properties.gramsWater} grams of water on to `
      + 'fully saturate your coffee grounds.';
  } if (step.type === constants.STEP_POUR_WATER) {
    return `Add ${step.properties.gramsWater} grams of water to the brew bed.`;
  } if (step.type === constants.STEP_WAIT) {
    return `Wait ${step.properties.seconds} seconds`;
  } if (step.type === constants.STEP_ADD_ICE) {
    return `Add ${step.properties.gramsIce} grams of ice to the bottom of your vessel.`;
  } if (step.type === constants.STEP_STIR) {
    return 'Gently stir the brew bed to make sure all the coffee grounds are saturated.';
  } if (step.type === constants.STEP_INSERT_PLUNGER) {
    return 'Insert the plunger into your Aeropress';
  } if (step.type === constants.STEP_PUSH_PLUNGER) {
    return 'With your Aeropress on your mug, push the plunger down slowly until all the coffee is pushed out.';
  } if (step.type === constants.STEP_PUSH_FILTER) {
    return 'Push down the filter on your French Press until all the grounds are pushed to the bottom.';
  }

  return '';
}

export function getStepProperties(modalType, modalText, modalSelect) {
  // Get description
  if (modalType === constants.STEP_HEAT_WATER) {
    return { waterTemp: modalText };
  } if (modalType === constants.STEP_GRIND_COFFEE) {
    return { gramsCoffee: modalText, grindSize: modalSelect };
  } if (modalType === constants.STEP_BLOOM_GROUNDS) {
    return { gramsWater: modalText };
  } if (modalType === constants.STEP_POUR_WATER) {
    return { gramsWater: modalText };
  } if (modalType === constants.STEP_WAIT) {
    return { seconds: modalText };
  } if (modalType === constants.STEP_ADD_ICE) {
    return { gramsIce: modalText };
  }
  return {};
}
