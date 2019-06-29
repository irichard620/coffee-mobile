import { combineReducers } from 'redux'
import {
  REQUEST_RECIPES,
  RECEIVE_RECIPES,
  SAVING_RECIPE,
  SAVED_RECIPE,
} from '../actions/recipe-actions'

function recipes(
  state = {
    recipesIsFetching: false,
    recipes: [],
    recipeIsSaving: false,
  },
  action
) {
  switch (action.type) {
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
      return Object.assign({}, state, {
        recipeIsSaving: false,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function recipesReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_RECIPES:
    case REQUEST_RECIPES:
    case SAVED_RECIPE:
    case SAVING_RECIPE:
      return Object.assign({}, state, {
        ["recipes"]: recipes(state["recipes"], action)
      })
    default:
      return state
  }
}

export default recipesReducer
