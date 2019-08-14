import {
  REQUEST_USER,
  RECEIVE_USER,
  ERROR_USER,
  SAVING_USERNAME,
  SAVED_USERNAME,
  RESTORING_IAP,
  RESTORED_IAP,
  ERROR_RESTORE_IAP,
  UPGRADING_IAP,
  UPGRADED_IAP
} from '../actions/user-actions';

function user(
  state = {
    userIsFetching: false,
    user: {},
    userIsSaving: false,
    error: '',
    iapIsRestoring: false,
    iapIsUpgrading: false
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
        lastUpdated: action.receivedAt
      });
    case UPGRADING_IAP:
      return Object.assign({}, state, {
        iapIsUpgrading: true,
      });
    case UPGRADED_IAP:
      return Object.assign({}, state, {
        iapIsUpgrading: false,
        error: '',
        user: action.user,
        lastUpdated: action.receivedAt
      });
    case RESTORING_IAP:
      return Object.assign({}, state, {
        iapIsRestoring: true,
      });
    case RESTORED_IAP:
      return Object.assign({}, state, {
        iapIsRestoring: false,
        error: '',
        user: action.user,
        lastUpdated: action.receivedAt
      });
    case ERROR_RESTORE_IAP:
      return Object.assign({}, state, {
        iapIsRestoring: false,
        error: action.error,
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
    case RESTORED_IAP:
    case RESTORING_IAP:
    case ERROR_RESTORE_IAP:
    case UPGRADED_IAP:
    case UPGRADING_IAP:
      return Object.assign({}, state, {
        user: user(state.user, action)
      });
    default:
      return state;
  }
}

export default userReducer;
