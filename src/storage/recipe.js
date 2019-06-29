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
    steps: [],
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
