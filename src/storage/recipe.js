import uuidv4 from 'uuid/v4';
import AsyncStorage from '@react-native-community/async-storage';

export function Recipe(recipeObj) {
  recipe = {}
  // Get ID
  if ('id' not in recipeObj) {
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
  this.recipe = recipe;

  // Functions
  this.getDescription = function() {
    // Line 1
    description = '';
    if (this.recipe.orientation != '') {
      description += this.recipe.orientation;
    }
    description += this.recipe.brewingVessel;
    description += 'with a ' + this.recipe.filterType + ' filter';
    description += '\n';

    // Line 2
    description += this.recipe.totalCoffee + ' grams coffee,' + this.recipe.grindSize;

    // Line 3
    description += this.recipe.totalWater + ' grams of water at ' this.recipe.waterTemp + '\u2109';

    return description
  }
}
