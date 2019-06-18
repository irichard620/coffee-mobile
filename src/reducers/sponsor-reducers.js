import { combineReducers } from 'redux'
import {
  REQUEST_SPONSORS,
  RECEIVE_SPONSORS,
  REQUEST_SPONSOR,
  RECEIVE_SPONSOR,
} from '../actions/sponsor-actions'

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
      })
    case RECEIVE_SPONSORS:
      return Object.assign({}, state, {
        sponsorsIsFetching: false,
        sponsors: action.sponsors,
        lastUpdated: action.receivedAt
      })
    case REQUEST_SPONSOR:
      return Object.assign({}, state, {
        sponsorId: action.sponsorId,
        sponsorIsFetching: true,
      })
    case RECEIVE_SPONSOR:
      return Object.assign({}, state, {
        sponsorIsFetching: false,
        sponsor: action.sponsor,
        sponsorId: action.sponsorId,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function sponsorsReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_SPONSORS:
    case REQUEST_SPONSORS:
    case RECEIVE_SPONSOR:
    case REQUEST_SPONSOR:
      return Object.assign({}, state, {
        ["sponsors"]: sponsors(state["sponsors"], action)
      })
    default:
      return state
  }
}

const rootReducer = combineReducers({
  sponsorsReducer
})

export default rootReducer
