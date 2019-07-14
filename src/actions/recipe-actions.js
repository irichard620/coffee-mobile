import AsyncStorage from '@react-native-community/async-storage';
import fetch from 'cross-fetch';
import Config from 'react-native-config';

import { Recipe } from '../storage/recipe';

const camelcaseKeys = require('camelcase-keys');

export const REQUEST_DEFAULT_RECIPES = 'REQUEST_DEFAULT_RECIPES';
function requestDefaultRecipes() {
  return {
    type: REQUEST_DEFAULT_RECIPES
  };
}

export const RECEIVE_DEFAULT_RECIPES = 'RECEIVE_DEFAULT_RECIPES';
function receiveDefaultRecipes() {
  return {
    type: RECEIVE_DEFAULT_RECIPES,
    receivedAt: Date.now()
  };
}

export function fetchDefaultRecipes() {
  return function (dispatch) {
    dispatch(requestDefaultRecipes())
    return fetch(`${Config.API_URL}/recipes`)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then((json) => {
        AsyncStorage.getItem('recipes')
          .then((recipes) => {
            const r = recipes ? JSON.parse(recipes) : [];
            for (var i = 0; i < json.length; i += 1) {
              defaultRecipe = camelcaseKeys(json[i])
              var found = false;
              for (var j = 0; j < r.length; j += 1 ) {
                if (r[j].recipeId == defaultRecipe.recipeId) {
                  found = true;
                  break;
                }
              }
              if (!found) {
                r.push(defaultRecipe);
              }
            }
            AsyncStorage.setItem('recipes', JSON.stringify(r));
            dispatch(receiveDefaultRecipes());
          });
      })
  }
}

export const REQUEST_RECIPES = 'REQUEST_RECIPES';
function requestRecipes() {
  return {
    type: REQUEST_RECIPES
  };
}

export const RECEIVE_RECIPES = 'RECEIVE_RECIPES';
function receiveRecipes(json) {
  return {
    type: RECEIVE_RECIPES,
    recipes: json,
    receivedAt: Date.now()
  };
}

export function fetchRecipes() {
  return function(dispatch) {
    dispatch(requestRecipes())
    return AsyncStorage.getItem('recipes')
      .then((recipes) => {
        var result = [];
        const r = recipes ? JSON.parse(recipes) : [];
        for (recipe of r) {
          // Create objects and add to result
          result.push(Recipe(recipe));
        }
        dispatch(receiveRecipes(result));
      });
  }
}

export const SAVING_RECIPE = 'SAVING_RECIPE';
function savingRecipe() {
  return {
    type: SAVING_RECIPE
  };
}

export const SAVED_RECIPE = 'SAVED_RECIPE';
function savedRecipe(recipe) {
  return {
    type: SAVED_RECIPE,
    recipe: recipe,
    receivedAt: Date.now()
  };
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
            break
          }
        }
        if (!found) {
          r.push(recipeToSave);
        }
        AsyncStorage.setItem('recipes', JSON.stringify(r));
        dispatch(savedRecipe(recipeToSave));
      });
  }
}

export function favoriteRecipe(id) {
  return function(dispatch) {
    console.log("favoriting recipe")
    dispatch(savingRecipe())
    return AsyncStorage.getItem('recipes')
      .then((recipes) => {
        const r = recipes ? JSON.parse(recipes) : [];
        for (recipe of r) {
          if (recipe.recipeId == id) {
            recipe.favorited = true;
            break
          }
        }
        AsyncStorage.setItem('recipes', JSON.stringify(r));
        dispatch(savedRecipe(recipe));
      });
  }
}

export function unfavoriteRecipe(id) {
  return function(dispatch) {
    console.log("unfavoriting recipe")
    dispatch(savingRecipe())
    return AsyncStorage.getItem('recipes')
      .then((recipes) => {
        const r = recipes ? JSON.parse(recipes) : [];
        for (recipe of r) {
          if (recipe.recipeId == id) {
            recipe.favorited = false;
            break
          }
        }
        AsyncStorage.setItem('recipes', JSON.stringify(r));
        dispatch(savedRecipe(recipe));
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
function deletedRecipe(id) {
  return {
    type: DELETED_RECIPE,
    recipeId: id,
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
            break
          }
        }
        AsyncStorage.setItem('recipes', JSON.stringify(r));
        dispatch(deletedRecipe(id));
      });
  }
}
