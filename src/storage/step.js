import uuidv4 from 'uuid/v4';
import * as constants from '../views/builder/builder-constants';

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
  step.description = stepObj['description'];
  step.properties = stepObj['properties'];

  // Functions
  step.getDescription = function() {
    description = '';
    if (this.type == constants.STEP_HEAT_WATER) {
      description += 'Heat your water to ' + this.properties.waterTemp + '\u2109.';
    } else if (this.type == constants.STEP_GRIND_COFFEE) {
      description += 'Grind ' + this.properties.gramsCoffee +
        ' grams of coffee to a ' + this.properties.grindSize + ' consistency.';
    } else if (this.type == constants.STEP_RINSE_FILTER) {
      description += 'Rinse the filter with some of your hot water, then discard the water. ' +
        'This washes the filter and remove any paper taste.';
    } else if (this.type == constants.STEP_ADD_GROUNDS) {
      description += 'Add the ground coffee to the vessel.';
    } else if (this.type == constants.STEP_BLOOM_GROUNDS) {
      description += 'Pour ' + this.properties.gramsWater + ' grams of water on to ' +
        'fully saturate your coffee grounds.';
    } else if (this.type == constants.STEP_POUR_WATER) {
      description += 'Add ' + this.properties.gramsWater + ' grams of water to the brew bed.';
    } else if (this.type == constants.STEP_WAIT) {
      description += 'Wait ' + this.properties.seconds + ' seconds';
    }

    return description
  }

  return step;
}
