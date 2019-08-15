import {
  REQUEST_USER,
  RECEIVE_USER,
  ERROR_USER,
  SAVING_USERNAME,
  SAVED_USERNAME,
} from '../actions/user-actions';

function user(
  state = {
    userIsFetching: false,
    user: {},
    userIsSaving: false,
    error: '',
  },
  action
) {
  switch (action.type) {
    case REQUEST_USER:
      return Object.assign({}, state, {
        userIsFetching: true,
      });
    case RECEIVE_USER:
      return Object.assign({}, state, {
        userIsFetching: false,
        user: action.user,
        error: '',
        lastUpdated: action.receivedAt
      });
    case ERROR_USER:
      return Object.assign({}, state, {
        userIsFetching: false,
        error: action.error,
        lastUpdated: action.receivedAt
      });
    case SAVING_USERNAME:
      return Object.assign({}, state, {
        userIsSaving: true,
      });
    case SAVED_USERNAME:
      return Object.assign({}, state, {
        userIsSaving: false,
        error: '',
        user: action.user,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

function userReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_USER:
    case REQUEST_USER:
    case ERROR_USER:
    case SAVED_USERNAME:
    case SAVING_USERNAME:
      return Object.assign({}, state, {
        user: user(state.user, action)
      });
    default:
      return state;
  }
}

export default userReducer;
