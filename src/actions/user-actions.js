import AsyncStorage from '@react-native-community/async-storage';

export const REQUEST_USER = 'REQUEST_USER'
function requestUser() {
  return {
    type: REQUEST_USER
  }
}

export const RECEIVE_USER = 'RECEIVE_USER'
function receiveUser(user) {
  return {
    type: RECEIVE_USER,
    user: user,
    receivedAt: Date.now()
  }
}

export function fetchUser() {
  return function(dispatch) {
    console.log("fetching user")
    dispatch(requestUser())
    return AsyncStorage.getItem('user')
      .then((user) => {
        const userDetails = user ? JSON.parse(user) : {};
        dispatch(receiveUser(userDetails))
      });
  }
}

export const SAVING_USERNAME = 'SAVING_USERNAME'
function savingUsername() {
  return {
    type: SAVING_USERNAME,
  }
}

export const SAVED_USERNAME = 'SAVED_USERNAME'
function savedUsername() {
  return {
    type: SAVED_USERNAME,
    receivedAt: Date.now()
  }
}

export function saveUsername(username) {
  return function(dispatch) {
    console.log("saving user with username " + username)
    dispatch(savingUsername())
    return AsyncStorage.getItem('user')
      .then((user) => {
        const userDetails = user ? JSON.parse(user) : {};
        userDetails.name = username
        AsyncStorage.setItem('user', JSON.stringify(userDetails));
        dispatch(savedUsername());
      });
  }
}