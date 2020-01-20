import {
  SAVING_HISTORY,
  SAVED_HISTORY,
  REQUEST_HISTORY,
  RECEIVE_HISTORY,
} from '../actions/history-actions';

function histories(
  state = {
    historyIsSaving: false,
    history: {},
    historyIsFetching: false,
    histories: [],
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
    case REQUEST_HISTORY:
      return Object.assign({}, state, {
        historyIsFetching: true,
      });
    case RECEIVE_HISTORY:
      return Object.assign({}, state, {
        historyIsFetching: false,
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
      return Object.assign({}, state, {
        histories: histories(state.histories, action)
      });
    default:
      return state;
  }
}

export default historiesReducer;
