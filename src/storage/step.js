import * as constants from '../constants';
import { getTempUnit, translateTempToCelsius, translateTempToFahrenheit } from './helper';

export function Step(stepObj) {
  const step = {};

  // Assign other values
  step.title = stepObj.title;
  if (!('notes' in stepObj)) {
    step.notes = '';
  } else {
    step.notes = stepObj.notes;
  }
  step.properties = stepObj.properties;

  return step;
}

export function getStepShortDescription(step, useMetric) {
  if (step.title === constants.STEP_HEAT_WATER) {
    const tempUnit = getTempUnit(useMetric);
    const tempToUse = useMetric
      ? translateTempToCelsius(step.properties.waterTemp) : step.properties.waterTemp;
    return `Heat water to ${tempToUse}${tempUnit}`;
  } if (step.title === constants.STEP_GRIND_COFFEE) {
    return `${step.properties.gramsCoffee} grams of coffee ground ${step.properties.grindSize}`;
  } if (step.title === constants.STEP_RINSE_FILTER) {
    return 'Rinse filter with water. Discard water.';
  } if (step.title === constants.STEP_ADD_GROUNDS) {
    return 'Add grounds to the brewing vessel.';
  } if (step.title === constants.STEP_BLOOM_GROUNDS) {
    return `Bloom grounds with ${step.properties.gramsWater} grams of water`;
  } if (step.title === constants.STEP_POUR_WATER) {
    return `Pour in ${step.properties.gramsWater} grams of water`;
  } if (step.title === constants.STEP_WAIT) {
    return `Wait ${step.properties.seconds} seconds`;
  } if (step.title === constants.STEP_ADD_ICE) {
    return `Add ${step.properties.gramsIce} grams of ice`;
  } if (step.title === constants.STEP_STIR) {
    return 'Gently stir the brew bed';
  } if (step.title === constants.STEP_INSERT_PLUNGER) {
    return 'Insert the plunger';
  } if (step.title === constants.STEP_PUSH_PLUNGER) {
    return 'Push down the plunger';
  } if (step.title === constants.STEP_PUSH_FILTER) {
    return 'Push down the filter';
  }

  return '';
}

export function getStepDescription(step, useMetric) {
  if (step.title === constants.STEP_HEAT_WATER) {
    const tempUnit = getTempUnit(useMetric);
    const tempToUse = useMetric
      ? translateTempToCelsius(step.properties.waterTemp) : step.properties.waterTemp;
    return `Heat your water to ${tempToUse}${tempUnit}.`;
  } if (step.title === constants.STEP_GRIND_COFFEE) {
    return `Grind ${step.properties.gramsCoffee
    } grams of coffee to a ${step.properties.grindSize} consistency.`;
  } if (step.title === constants.STEP_RINSE_FILTER) {
    return 'Rinse your filter with hot water, then discard. '
      + 'This prevents any paper taste from getting into your coffee.';
  } if (step.title === constants.STEP_ADD_GROUNDS) {
    return 'Add the ground coffee to the vessel.';
  } if (step.title === constants.STEP_BLOOM_GROUNDS) {
    return `Pour ${step.properties.gramsWater} grams of water slowly and `
      + 'evenly around your brew bed to saturate all the coffee grounds.';
  } if (step.title === constants.STEP_POUR_WATER) {
    return `Pour ${step.properties.gramsWater} grams of water onto the brew bed `
      + 'in an even circular motion.';
  } if (step.title === constants.STEP_WAIT) {
    return `Wait ${step.properties.seconds} seconds`;
  } if (step.title === constants.STEP_ADD_ICE) {
    return `Add ${step.properties.gramsIce} grams of ice to the bottom of your vessel.`;
  } if (step.title === constants.STEP_STIR) {
    return 'Gently stir the brew bed to make sure all the coffee grounds are saturated.';
  } if (step.title === constants.STEP_INSERT_PLUNGER) {
    return 'Insert the plunger into your Aeropress';
  } if (step.title === constants.STEP_PUSH_PLUNGER) {
    return 'With your Aeropress on your mug, push the plunger down slowly until all the coffee is pushed out.';
  } if (step.title === constants.STEP_PUSH_FILTER) {
    return 'Push down the filter on your French Press until all the grounds are pushed to the bottom.';
  }

  return '';
}

export function getStepProperties(modalType, modalText, modalSelect, useMetric) {
  // Get description
  if (modalType === constants.STEP_HEAT_WATER) {
    const tempToUse = useMetric
      ? translateTempToFahrenheit(modalText) : modalText;
    return { waterTemp: tempToUse };
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

export function getModalTextProperty(step, useMetric) {
  const { title, properties } = step;
  if (title === constants.STEP_HEAT_WATER) {
    const tempToUse = useMetric
      ? translateTempToCelsius(properties.waterTemp) : properties.waterTemp;
    return tempToUse;
  } if (title === constants.STEP_GRIND_COFFEE) {
    return properties.gramsCoffee;
  } if (title === constants.STEP_BLOOM_GROUNDS) {
    return properties.gramsWater;
  } if (title === constants.STEP_POUR_WATER) {
    return properties.gramsWater;
  } if (title === constants.STEP_WAIT) {
    return properties.seconds;
  } if (title === constants.STEP_ADD_ICE) {
    return properties.gramsIce;
  }
  return '';
}

export function getModalSelectProperty(step) {
  const { title, properties } = step;
  if (title === constants.STEP_GRIND_COFFEE) {
    return properties.grindSize;
  }
  return '';
}

export function validateStep(modalType, modalText, useMetric) {
  // First, check it's a number
  const modalNumber = Number(modalText);
  if (modalText === ''
  || Number.isNaN(modalNumber)
  || Number.parseFloat(modalNumber) !== modalNumber) {
    return 'You must enter a number for this field.';
  }
  const x = Number.parseFloat(modalNumber);

  // Check wait time
  if (modalType === constants.STEP_WAIT && (x < 1 || x > 3600)) {
    return 'Wait time must be between 1 second and 60 minutes.';
  }

  // Check temp
  if (modalType === constants.STEP_HEAT_WATER) {
    if (useMetric && (x < 0 || x > 100)) {
      return 'Water temperature must not be above boiling or below 0 degrees.';
    } if (!useMetric && (x < 0 || x > 212)) {
      return 'Water temperature must not be above boiling or below 0 degrees.';
    }
  }

  return '';
}
