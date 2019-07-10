import { combineReducers } from 'redux'
import {
  REQUEST_DEFAULT_RECIPES,
  RECEIVE_DEFAULT_RECIPES,
  REQUEST_RECIPES,
  RECEIVE_RECIPES,
  SAVING_RECIPE,
  SAVED_RECIPE,
  FAVORITING_RECIPE,
  FAVORITED_RECIPE,
  UNFAVORITING_RECIPE,
  UNFAVORITED_RECIPE,
  DELETING_RECIPE,
  DELETED_RECIPE,
} from '../actions/recipe-actions'

function recipes(
  state = {
    recipesIsFetching: false,
    recipes: [],
    recipeIsSaving: false,
    defaultRecipes: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_DEFAULT_RECIPES:
      return Object.assign({}, state, {
        recipesIsFetching: true,
      })
    case RECEIVE_DEFAULT_RECIPES:
      return Object.assign({}, state, {
        recipesIsFetching: false,
        defaultRecipes: action.defaultRecipes,
        lastUpdated: action.receivedAt
      })
    case REQUEST_RECIPES:
      return Object.assign({}, state, {
        recipesIsFetching: true,
      })
    case RECEIVE_RECIPES:
      return Object.assign({}, state, {
        recipesIsFetching: false,
        recipes: action.recipes,
        lastUpdated: action.receivedAt
      })
    case SAVING_RECIPE:
      return Object.assign({}, state, {
        recipeIsSaving: true,
      })
    case SAVED_RECIPE:
      // In case of saved recipe, edit recipes array
      var found = false;
      for (i = 0; i < state.recipes.length; i++) {
        if (state.recipes[i].recipeId == action.recipe.recipeId) {
          state.recipes[i] = action.recipe;
          found = true;
          break
        }
      }
      if (!found) {
        state.recipes.push(action.recipe);
      }
      return Object.assign({}, state, {
        recipeIsSaving: false,
        recipes: state.recipes,
        lastUpdated: action.receivedAt
      })
    case DELETING_RECIPE:
      return Object.assign({}, state, {
        recipeIsDeleting: true,
      })
    case DELETED_RECIPE:
      // In case of deleted recipe, edit recipes array
      for (i = 0; i < state.recipes.length; i++) {
        if (state.recipes[i].recipeId == action.recipeId) {
          state.recipes.splice(i, 1)
          break
        }
      }
      return Object.assign({}, state, {
        recipeIsDeleting: false,
        recipes: state.recipes,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function recipesReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_DEFAULT_RECIPES:
    case REQUEST_DEFAULT_RECIPES:
    case RECEIVE_RECIPES:
    case REQUEST_RECIPES:
    case SAVED_RECIPE:
    case SAVING_RECIPE:
    case DELETING_RECIPE:
    case DELETED_RECIPE:
      return Object.assign({}, state, {
        ["recipes"]: recipes(state["recipes"], action)
      })
    default:
      return state
  }
}

export default recipesReducer
