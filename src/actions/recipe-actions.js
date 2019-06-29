import AsyncStorage from '@react-native-community/async-storage';
import { Recipe, defaultRecipes } from '../storage/recipe';

export const REQUEST_RECIPES = 'REQUEST_RECIPES'
function requestRecipes() {
  return {
    type: REQUEST_RECIPES
  }
}

export const RECEIVE_RECIPES = 'RECEIVE_RECIPES'
function receiveRecipes(json) {
  return {
    type: RECEIVE_RECIPES,
    recipes: json,
    receivedAt: Date.now()
  }
}

export function fetchRecipes() {
  return function(dispatch) {
    console.log("fetching recipes")
    dispatch(requestRecipes())
    return AsyncStorage.getItem('recipes')
      .then((recipes) => {
        var result = []
        const r = recipes ? JSON.parse(recipes) : [];
        for (recipe of r) {
          // Create objects and add to result
          result.push(Recipe(recipe));
        }
        result = result.concat(defaultRecipes());
        dispatch(receiveRecipes(result))
      });
  }
}

export const SAVING_RECIPE = 'SAVING_RECIPE'
function savingRecipe() {
  return {
    type: SAVING_RECIPE
  }
}

export const SAVED_RECIPE = 'SAVED_RECIPE'
function savedRecipe() {
  return {
    type: SAVED_RECIPE,
    receivedAt: Date.now()
  }
}

export function saveRecipe(recipe) {
  return function(dispatch) {
    console.log("saving recipe")
    dispatch(savingRecipe())
    return AsyncStorage.getItem('recipes')
      .then((recipes) => {
        const r = recipes ? JSON.parse(recipes) : [];
        r.push(recipe.recipe);
        AsyncStorage.setItem('recipes', JSON.stringify(r));
        dispatch(savedRecipe());
      });
  }
}
