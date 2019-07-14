import {
  REQUEST_SPONSORS,
  RECEIVE_SPONSORS,
  ERROR_SPONSORS,
  REQUEST_SPONSOR,
  RECEIVE_SPONSOR,
  ERROR_SPONSOR,
} from '../actions/sponsor-actions';

function sponsors(
  state = {
    sponsorsIsFetching: false,
    sponsors: [],
    sponsorIsFetching: false,
    sponsor: {}
  },
  action
) {
  switch (action.type) {
    case REQUEST_SPONSORS:
      return Object.assign({}, state, {
        sponsorsIsFetching: true,
      });
    case RECEIVE_SPONSORS:
      return Object.assign({}, state, {
        sponsorsIsFetching: false,
        sponsors: action.sponsors,
        error: '',
        lastUpdated: action.receivedAt
      });
    case ERROR_SPONSORS:
      return Object.assign({}, state, {
        sponsorsIsFetching: false,
        error: action.error,
        lastUpdated: action.receivedAt
      });
    case REQUEST_SPONSOR:
      return Object.assign({}, state, {
        sponsorId: action.sponsorId,
        sponsorIsFetching: true,
      });
    case RECEIVE_SPONSOR:
      return Object.assign({}, state, {
        sponsorIsFetching: false,
        sponsor: action.sponsor,
        sponsorId: action.sponsorId,
        error: '',
        lastUpdated: action.receivedAt
      });
    case ERROR_SPONSOR:
      return Object.assign({}, state, {
        sponsorIsFetching: false,
        sponsorId: action.sponsorId,
        error: action.error,
        lastUpdated: action.receivedAt
      });
    default:
      return state;
  }
}

function sponsorsReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_SPONSORS:
    case REQUEST_SPONSORS:
    case RECEIVE_SPONSOR:
    case REQUEST_SPONSOR:
      return Object.assign({}, state, {
        sponsors: sponsors(state.sponsors, action)
      });
    default:
      return state;
  }
}

export default sponsorsReducer;
