import uuidv4 from 'uuid/v4';
import AsyncStorage from '@react-native-community/async-storage';
import * as constants from '../views/builder/builder-constants';
import * as stepModel from './step';

export function Recipe(recipeObj) {
  recipe = {}
  // Get ID
  if (!('id' in recipeObj) || recipeObj['id'] == '') {
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
  if (recipe.orientation == '-') {
    recipe.orientation = ''
  }
  recipe.totalWater = recipeObj['totalWater'];
  recipe.totalCoffee = recipeObj['totalCoffee'];
  recipe.waterTemp = recipeObj['waterTemp'];
  recipe.grindSize = recipeObj['grindSize'];
  recipe.steps = recipeObj['steps'];
  if (!('favorited' in recipeObj)) {
    recipe.favorited = false
  } else {
    recipe.favorited = recipeObj['favorited'];
  }

  return recipe;
}

export function getRecipeDescription(recipe) {
  // Line 1
  description = '';
  if (recipe.orientation != '') {
    description += recipe.orientation + " ";
  }
  description += recipe.brewingVessel;
  description += ' with a ' + recipe.filterType + ' filter';
  description += '\n';

  // Line 2
  description += recipe.totalCoffee + 'g coffee, ' + recipe.grindSize + " grind\n";

  // Line 3
  description += recipe.totalWater + 'g of water, ' + recipe.waterTemp + '\u2109';

  return description
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
      stepModel.Step({
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
