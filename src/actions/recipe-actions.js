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
        // result = result.concat(defaultRecipes());
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

export function saveRecipe(recipeToSave) {
  return function(dispatch) {
    console.log("saving recipe")
    dispatch(savingRecipe())
    return AsyncStorage.getItem('recipes')
      .then((recipes) => {
        const r = recipes ? JSON.parse(recipes) : [];
        var found = false;
        for (i = 0; i < r.length; i++) {
          if (r[i].recipeId == recipeToSave.recipeId) {
            r[i] = recipeToSave;
            found = true;
          }
        }
        if (!found) {
          r.push(recipe);
        }
        AsyncStorage.setItem('recipes', JSON.stringify(r));
        dispatch(savedRecipe());
      });
  }
}

export const FAVORITING_RECIPE = 'FAVORITING_RECIPE'
function favoritingRecipe() {
  return {
    type: FAVORITING_RECIPE
  }
}

export const FAVORITED_RECIPE = 'FAVORITED_RECIPE'
function favoritedRecipe() {
  return {
    type: FAVORITED_RECIPE,
    receivedAt: Date.now()
  }
}

export function favoriteRecipe(id) {
  return function(dispatch) {
    console.log("favoriting recipe")
    dispatch(favoritingRecipe())
    return AsyncStorage.getItem('recipes')
      .then((recipes) => {
        const r = recipes ? JSON.parse(recipes) : [];
        for (recipe of r) {
          if (recipe.recipeId == id) {
            recipe.favorited = true;
          }
        }
        AsyncStorage.setItem('recipes', JSON.stringify(r));
        dispatch(favoritedRecipe());
      });
  }
}

export const UNFAVORITING_RECIPE = 'UNFAVORITING_RECIPE'
function unfavoritingRecipe() {
  return {
    type: UNFAVORITING_RECIPE
  }
}

export const UNFAVORITED_RECIPE = 'UNFAVORITED_RECIPE'
function unfavoritedRecipe() {
  return {
    type: UNFAVORITED_RECIPE,
    receivedAt: Date.now()
  }
}

export function unfavoriteRecipe(id) {
  return function(dispatch) {
    console.log("unfavoriting recipe")
    dispatch(unfavoritingRecipe())
    return AsyncStorage.getItem('recipes')
      .then((recipes) => {
        const r = recipes ? JSON.parse(recipes) : [];
        for (recipe of r) {
          if (recipe.recipeId == id) {
            recipe.favorited = false;
          }
        }
        AsyncStorage.setItem('recipes', JSON.stringify(r));
        dispatch(unfavoritedRecipe());
      });
  }
}

export const DELETING_RECIPE = 'DELETING_RECIPE'
function deletingRecipe() {
  return {
    type: DELETING_RECIPE
  }
}

export const DELETED_RECIPE = 'DELETED_RECIPE'
function deletedRecipe() {
  return {
    type: DELETED_RECIPE,
    receivedAt: Date.now()
  }
}

export function deleteRecipe(id) {
  return function(dispatch) {
    console.log("deleting recipe")
    dispatch(deletingRecipe())
    return AsyncStorage.getItem('recipes')
      .then((recipes) => {
        const r = recipes ? JSON.parse(recipes) : [];
        for (i = 0; i < r.length; i++) {
          recipe = r[i]
          if (recipe.recipeId == id) {
            r.splice(i, 1)
          }
        }
        AsyncStorage.setItem('recipes', JSON.stringify(r));
        dispatch(deletedRecipe());
      });
  }
}
