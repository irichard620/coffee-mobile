import uuidv4 from 'uuid/v4';

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
  recipe.vesselId = recipeObj.vesselId;
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
  recipe.steps = recipeObj.steps;
  if (!('favorited' in recipeObj)) {
    recipe.favorited = false;
  } else {
    recipe.favorited = recipeObj.favorited;
  }

  return recipe;
}

export function getRecipeDescription(recipe) {
  // Line 1
  let description = '';
  if (recipe.orientation !== '') {
    description += `${recipe.orientation} `;
  }
  description += recipe.brewingVessel;
  description += ` with a ${recipe.filterType} filter`;
  description += '\n';

  // Line 2
  description += `${recipe.totalCoffee}g coffee, ${recipe.grindSize} grind\n`;

  // Line 3
  description += `${recipe.totalWater}g of water, ${recipe.waterTemp}\u2109`;

  return description;
}
