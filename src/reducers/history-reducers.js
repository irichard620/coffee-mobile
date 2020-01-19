import {
  SAVING_HISTORY,
  SAVED_HISTORY,
} from '../actions/history-actions';

function histories(
  state = {
    historyIsSaving: false,
    history: {},
    error: ''
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
      return Object.assign({}, state, {
        histories: histories(state.histories, action)
      });
    default:
      return state;
  }
}

export default historiesReducer;
