import {
  REQUEST_VESSEL,
  RECEIVE_VESSEL,
  ERROR_VESSEL,
} from '../actions/vessel-actions';

function vessels(
  state = {
    vesselIsFetching: false,
    vessel: {},
    error: ''
  },
  action
) {
  switch (action.type) {
    case REQUEST_VESSEL:
      return Object.assign({}, state, {
        vesselIsFetching: true,
        vesselName: action.vesselName,
      });
    case RECEIVE_VESSEL:
      return Object.assign({}, state, {
        vesselIsFetching: false,
        vessel: action.vessel,
        vesselName: action.vesselName,
        error: '',
        lastUpdated: action.receivedAt
      });
    case ERROR_VESSEL:
      return Object.assign({}, state, {
        vesselIsFetching: false,
        error: action.error,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

function vesselsReducer(state = {}, action) {
  switch (action.type) {
    case REQUEST_VESSEL:
    case RECEIVE_VESSEL:
    case ERROR_VESSEL:
      return Object.assign({}, state, {
        vessels: vessels(state.vessels, action)
      });
    default:
      return state;
  }
}

export default vesselsReducer;
