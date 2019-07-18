import AsyncStorage from '@react-native-community/async-storage';

export const REQUEST_USER = 'REQUEST_USER';
function requestUser() {
  return {
    type: REQUEST_USER
  };
}

export const RECEIVE_USER = 'RECEIVE_USER';
function receiveUser(userDetails) {
  return {
    type: RECEIVE_USER,
    user: userDetails,
    receivedAt: Date.now()
  };
}

export const ERROR_USER = 'ERROR_USER';
function errorUser(err) {
  return {
    type: ERROR_USER,
    error: err,
    receivedAt: Date.now()
  };
}

export function fetchUser() {
  return function (dispatch) {
    dispatch(requestUser());
    return AsyncStorage.getItem('user')
      .then((user) => {
        const userDetails = user ? JSON.parse(user) : {};
        dispatch(receiveUser(userDetails));
      })
      .catch(error => dispatch(errorUser(error)));
  };
}

export const SAVING_USERNAME = 'SAVING_USERNAME';
function savingUsername() {
  return {
    type: SAVING_USERNAME,
  };
}

export const SAVED_USERNAME = 'SAVED_USERNAME';
function savedUsername() {
  return {
    type: SAVED_USERNAME,
    receivedAt: Date.now()
  };
}

export function saveUsername(username) {
  return function (dispatch) {
    dispatch(savingUsername());
    return AsyncStorage.getItem('user')
      .then((user) => {
        const userDetails = user ? JSON.parse(user) : {};
        userDetails.name = username;
        AsyncStorage.setItem('user', JSON.stringify(userDetails));
        dispatch(savedUsername());
      });
  };
}
