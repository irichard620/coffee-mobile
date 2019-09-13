import {
  REQUEST_USER,
  RECEIVE_USER,
  ERROR_USER,
  RESTORING_IAP,
  RESTORED_IAP,
  ERROR_RESTORE_IAP,
  UPGRADING_IAP,
  UPGRADED_IAP,
  PURCHASING_IAP,
  PURCHASED_IAP,
  ERROR_PURCHASING_IAP,
  SAVING_USER,
  SAVED_USER,
} from '../actions/user-actions';

function user(
  state = {
    userIsFetching: false,
    user: {},
    userIsSaving: false,
    error: '',
    iapIsRestoring: false,
    iapIsUpgrading: false,
    iapIsPurchasing: false,
    purchase: {}
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
    case SAVING_USER:
      return Object.assign({}, state, {
        userIsSaving: true,
      });
    case SAVED_USER:
      return Object.assign({}, state, {
        userIsSaving: false,
        error: '',
        user: action.user,
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
        purchase: action.purchase,
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
    case PURCHASING_IAP:
      return Object.assign({}, state, {
        iapIsPurchasing: true,
      });
    case PURCHASED_IAP:
      return Object.assign({}, state, {
        iapIsPurchasing: false,
        error: '',
        lastUpdated: action.receivedAt
      });
    case ERROR_PURCHASING_IAP:
      return Object.assign({}, state, {
        iapIsPurchasing: false,
        error: action.error,
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
    case RESTORED_IAP:
    case RESTORING_IAP:
    case ERROR_RESTORE_IAP:
    case UPGRADED_IAP:
    case UPGRADING_IAP:
    case PURCHASED_IAP:
    case PURCHASING_IAP:
    case ERROR_PURCHASING_IAP:
    case SAVING_USER:
    case SAVED_USER:
      return Object.assign({}, state, {
        user: user(state.user, action)
      });
    default:
      return state;
  }
}

export default userReducer;
