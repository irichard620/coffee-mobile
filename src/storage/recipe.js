import uuidv4 from 'uuid/v4';
import AsyncStorage from '@react-native-community/async-storage';
import * as constants from '../views/builder/builder-constants';

export function Recipe(recipeObj) {
  recipe = {}
  // Get ID
  if (!('id' in recipeObj)) {
    recipe.id = uuidv4();
  } else {
    recipe.id = recipeObj['id'];
  }

  // Assign other values
  recipe.recipeName = recipeObj['recipeName'];
  recipe.vesselId = recipeObj['vesselId'];
  recipe.brewingVessel = recipeObj['brewingVessel'];
  recipe.filterType = recipeObj['filterType'];
  recipe.orientation = recipeObj['orientation'];
  recipe.totalWater = recipeObj['totalWater'];
  recipe.totalCoffee = recipeObj['totalCoffee'];
  recipe.waterTemp = recipeObj['waterTemp'];
  recipe.grindSize = recipeObj['grindSize'];
  recipe.steps = recipeObj['steps'];
  recipe.favorited = recipeObj['favorited'];

  // Functions
  recipe.getDescription = function() {
    // Line 1
    description = '';
    if (this.orientation != '') {
      description += this.orientation + " ";
    }
    description += this.brewingVessel;
    description += ' with a ' + this.filterType + ' filter';
    description += '\n';

    // Line 2
    description += this.totalCoffee + 'g coffee, ' + this.grindSize + " grind\n";

    // Line 3
    description += this.totalWater + 'g of water, ' + this.waterTemp + '\u2109';

    return description
  }

  return recipe;
}

export function defaultRecipes() {
  defaultRecipes = [];

  // Intro to aeropress
  defaultRecipes.push(Recipe({
    id: "a201b075-7b19-49f7-ba67-1a4a96acd5f4",
    recipeName: "Intro to the AeroPress",
    vesselId: constants.VESSEL_AEROPRESS,
    brewingVessel: constants.vesselLabels[constants.VESSEL_AEROPRESS],
    filterType: constants.filterLabels[constants.FILTER_PAPER],
    orientation: constants.orientationLabels[constants.ORIENTATION_INVERTED],
    totalWater: 230,
    totalCoffee: 17,
    waterTemp: 205,
    grindSize: "Medium",
    steps: [
      Step({
        id: "0c47ceea-9aae-11e9-a2a3-2a2ae2dbcce4",
        type: constants.STEP_HEAT_WATER,
        title: constants.stepLabels[constants.STEP_HEAT_WATER],
        description: '',
        properties: {
          waterTemp: 205
        }
      })
    ],
    favorited: true,
  }));

  defaultRecipes.push(Recipe({
    id: "aa5f349c-99be-11e9-a2a3-2a2ae2dbcce4",
    recipeName: "Intro to the Chemex",
    vesselId: constants.VESSEL_CHEMEX,
    brewingVessel: constants.vesselLabels[constants.VESSEL_CHEMEX],
    filterType: constants.filterLabels[constants.FILTER_PAPER],
    orientation: "",
    totalWater: 600,
    totalCoffee: 36,
    waterTemp: 205,
    grindSize: "Medium-Coarse",
    steps: [],
    favorited: true,
  }));

  return defaultRecipes;
}

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
