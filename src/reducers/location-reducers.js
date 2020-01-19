import {
  REQUEST_LOCATIONS,
  RECEIVE_LOCATIONS,
  ERROR_LOCATIONS,
} from '../actions/location-actions';

function locations(
  state = {
    locationsIsFetching: false,
    locations: [],
    error: ''
  },
  action
) {
  switch (action.type) {
    case REQUEST_LOCATIONS:
      return Object.assign({}, state, {
        locationsIsFetching: true,
      });
    case RECEIVE_LOCATIONS:
      return Object.assign({}, state, {
        locationsIsFetching: false,
        locations: action.locations,
        error: '',
        lastUpdated: action.receivedAt
      });
    case ERROR_LOCATIONS:
      return Object.assign({}, state, {
        locationsIsFetching: false,
        error: action.error,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

function locationsReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_LOCATIONS:
    case REQUEST_LOCATIONS:
    case ERROR_LOCATIONS:
      return Object.assign({}, state, {
        locations: locations(state.locations, action)
      });
    default:
      return state;
  }
}

export default locationsReducer;
