import {
  SAVING_HISTORY,
  SAVED_HISTORY,
  REQUEST_HISTORY,
  RECEIVE_HISTORY,
  DELETING_HISTORY,
  DELETED_HISTORY,
} from '../actions/history-actions';

function histories(
  state = {
    historyIsSaving: false,
    history: {},
    historyIsFetching: false,
    histories: [],
    historyIsDeleting: false,
    error: '',
    recipeId: '',
  },
  action
) {
  switch (action.type) {
    case SAVING_HISTORY:
      return Object.assign({}, state, {
        historyIsSaving: true,
      });
    case SAVED_HISTORY:
      return Object.assign({}, state, {
        historyIsSaving: false,
        history: action.history,
        histories: action.histories,
        error: '',
        lastUpdated: action.receivedAt
      });
    case REQUEST_HISTORY:
      return Object.assign({}, state, {
        historyIsFetching: true,
      });
    case RECEIVE_HISTORY:
      return Object.assign({}, state, {
        historyIsFetching: false,
        histories: action.histories,
        recipeId: action.recipeId,
        error: '',
        lastUpdated: action.receivedAt
      });
    case DELETING_HISTORY:
      return Object.assign({}, state, {
        historyIsDeleting: true,
      });
    case DELETED_HISTORY:
      return Object.assign({}, state, {
        historyIsDeleting: false,
        historyId: action.historyId,
        histories: action.histories,
        error: '',
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

function historiesReducer(state = {}, action) {
  switch (action.type) {
    case SAVING_HISTORY:
    case SAVED_HISTORY:
    case RECEIVE_HISTORY:
    case REQUEST_HISTORY:
    case DELETING_HISTORY:
    case DELETED_HISTORY:
      return Object.assign({}, state, {
        histories: histories(state.histories, action)
      });
    default:
      return state;
  }
}

export default historiesReducer;
