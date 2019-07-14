import {
  REQUEST_DEFAULT_RECIPES,
  RECEIVE_DEFAULT_RECIPES,
  ERROR_DEFAULT_RECIPES,
  REQUEST_RECIPES,
  RECEIVE_RECIPES,
  SAVING_RECIPE,
  SAVED_RECIPE,
  DELETING_RECIPE,
  DELETED_RECIPE,
} from '../actions/recipe-actions';

function recipes(
  state = {
    recipesIsFetching: false,
    recipes: [],
    recipeIsSaving: false,
    defaultRecipes: [],
    error: ''
  },
  action
) {
  switch (action.type) {
    case REQUEST_DEFAULT_RECIPES:
      return Object.assign({}, state, {
        recipesIsFetching: true,
      });
    case RECEIVE_DEFAULT_RECIPES:
      return Object.assign({}, state, {
        recipesIsFetching: false,
        defaultRecipes: action.defaultRecipes,
        error: '',
        lastUpdated: action.receivedAt
      });
    case ERROR_DEFAULT_RECIPES:
      return Object.assign({}, state, {
        recipesIsFetching: false,
        error: action.error,
        lastUpdated: action.receivedAt
      });
    case REQUEST_RECIPES:
      return Object.assign({}, state, {
        recipesIsFetching: true,
      });
    case RECEIVE_RECIPES:
      return Object.assign({}, state, {
        recipesIsFetching: false,
        recipes: action.recipes,
        error: '',
        lastUpdated: action.receivedAt
      });
    case SAVING_RECIPE:
      return Object.assign({}, state, {
        recipeIsSaving: true,
      });
    case SAVED_RECIPE: {
      // In case of saved recipe, edit recipes array
      const recipesCopy = [...state.recipes];
      let found = false;
      for (let i = 0; i < recipesCopy.length; i += 1) {
        if (recipesCopy[i].recipeId === action.recipe.recipeId) {
          recipesCopy[i] = action.recipe;
          found = true;
          break;
        }
      }
      if (!found) {
        recipesCopy.push(action.recipe);
      }
      return Object.assign({}, state, {
        recipeIsSaving: false,
        recipes: recipesCopy,
        error: '',
        lastUpdated: action.receivedAt
      });
    }
    case DELETING_RECIPE:
      return Object.assign({}, state, {
        recipeIsDeleting: true,
      });
    case DELETED_RECIPE:
      // In case of deleted recipe, edit recipes array
      for (let i = 0; i < state.recipes.length; i += 1) {
        if (state.recipes[i].recipeId === action.recipeId) {
          state.recipes.splice(i, 1);
          break;
        }
      }
      return Object.assign({}, state, {
        recipeIsDeleting: false,
        recipes: state.recipes,
        error: '',
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

function recipesReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_DEFAULT_RECIPES:
    case REQUEST_DEFAULT_RECIPES:
    case ERROR_DEFAULT_RECIPES:
    case RECEIVE_RECIPES:
    case REQUEST_RECIPES:
    case SAVED_RECIPE:
    case SAVING_RECIPE:
    case DELETING_RECIPE:
    case DELETED_RECIPE:
      return Object.assign({}, state, {
        recipes: recipes(state.recipes, action)
      });
    default:
      return state;
  }
}

export default recipesReducer;
