import { combineReducers } from 'redux'
import {
  REQUEST_SPONSORS,
  RECEIVE_SPONSORS,
} from '../actions/sponsor-actions'

function sponsors(
  state = {
    isFetching: false,
    items: []
  },
  action
) {
  switch (action.type) {
    case REQUEST_SPONSORS:
      return Object.assign({}, state, {
        isFetching: true,
      })
    case RECEIVE_SPONSORS:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.sponsors,
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
