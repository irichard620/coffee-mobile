import {
  REQUEST_USER,
  RECEIVE_USER,
  SAVING_USERNAME,
  SAVED_USERNAME,
} from '../actions/user-actions'

function user(
  state = {
    userIsFetching: false,
    user: {},
    userIsSaving: false,
  },
  action
) {
  switch (action.type) {
    case REQUEST_USER:
      return Object.assign({}, state, {
        userIsFetching: true,
      })
    case RECEIVE_USER:
      return Object.assign({}, state, {
        userIsFetching: false,
        user: action.user,
        lastUpdated: action.receivedAt
      })
    case SAVING_USERNAME:
      return Object.assign({}, state, {
        userIsSaving: true,
      })
    case SAVED_USERNAME:
      return Object.assign({}, state, {
        userIsSaving: false,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function userReducer(state = {}, action) {
  switch (action.type) {
    case RECEIVE_USER:
    case REQUEST_USER:
    case SAVED_USERNAME:
    case SAVING_USERNAME:
      return Object.assign({}, state, {
        ["user"]: user(state["user"], action)
      })
    default:
      return state
  }
}

export default userReducer
