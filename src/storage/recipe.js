import uuidv4 from 'uuid/v4';
import { getTempUnit, translateTempToCelsius } from './helper';
import { VESSEL_MIZUDASHI } from '../constants';

const camelcaseKeys = require('camelcase-keys');

export function Recipe(recipeObj) {
  const recipe = {};
  // Get ID
  if (!('recipeId' in recipeObj) || recipeObj.recipeId === '') {
    recipe.recipeId = uuidv4();
  } else {
    recipe.recipeId = recipeObj.recipeId;
  }

  // Assign other values
  recipe.recipeName = recipeObj.recipeName;
  recipe.recipeDescription = recipeObj.recipeDescription;
  recipe.brewingVessel = recipeObj.brewingVessel;
  recipe.filterType = recipeObj.filterType;
  recipe.orientation = recipeObj.orientation;
  if (recipe.orientation === '-') {
    recipe.orientation = '';
  }
  recipe.totalWater = recipeObj.totalWater;
  recipe.totalCoffee = recipeObj.totalCoffee;
  recipe.waterTemp = recipeObj.waterTemp;
  recipe.grindSize = recipeObj.grindSize;
  recipe.steps = camelcaseKeys(recipeObj.steps);
  if (!('sponsorId' in recipeObj)) {
    recipe.sponsorId = '';
  } else {
    recipe.sponsorId = recipeObj.sponsorId;
  }
  if (!('favorited' in recipeObj)) {
    recipe.favorited = false;
  } else {
    recipe.favorited = recipeObj.favorited;
  }
  if (!('default' in recipeObj)) {
    recipe.default = false;
  } else {
    recipe.default = recipeObj.default;
  }
  if (!('status' in recipeObj)) {
    recipe.status = 'ACTIVE';
  } else {
    recipe.status = recipeObj.status;
  }

  return recipe;
}

export function getRecipeDescription(recipe, useMetric) {
  // Line 1
  let description = '';
  if (recipe.orientation !== '') {
    description += `${recipe.orientation}`;
    description += ` with a ${recipe.filterType} filter`;
  } else {
    description += `${recipe.filterType} filter`;
  }
  description += '\n';

  // Line 2
  description += `${recipe.totalCoffee}g coffee, ${recipe.grindSize} grind\n`;

  // Line 3 - different if cold brew
  if (recipe.brewingVessel === VESSEL_MIZUDASHI) {
    description += `${recipe.totalWater}g of cold water`;
  } else {
    const tempUnit = getTempUnit(useMetric);
    const tempToUse = useMetric ? translateTempToCelsius(recipe.waterTemp) : recipe.waterTemp;
    description += `${recipe.totalWater}g of water, ${tempToUse}${tempUnit}`;
  }

  return description;
}

export function validateRecipe(recipe) {
  let error = '';

  // Recipe name
  if (recipe.recipeName === '-' || recipe.recipeName === '') {
    error = 'Recipe name must not be blank.';
  } else if (recipe.brewingVessel === '-' || recipe.brewingVessel === '') {
    error = 'Recipe must contain valid brewing vessel.';
  } else if (recipe.filterType === '-' || recipe.filterType === '') {
    error = 'Recipe must contain a filter type for selected vessel.';
  }

  return error;
}
