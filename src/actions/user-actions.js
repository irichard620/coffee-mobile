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
        // Add metric variable if needed
        if (('name' in userDetails) && !('useMetric' in userDetails)) {
          userDetails.useMetric = false;
          AsyncStorage.setItem('user', JSON.stringify(userDetails));
        }
        dispatch(receiveUser(userDetails));
      })
      .catch(error => dispatch(errorUser(error)));
  };
}

export const SAVING_USER = 'SAVING_USER';
function savingUser() {
  return {
    type: SAVING_USER,
  };
}

export const SAVED_USER = 'SAVED_USER';
function savedUser(userDetails) {
  return {
    type: SAVED_USER,
    user: userDetails,
    receivedAt: Date.now()
  };
}

export function saveUsername(username, firstTime) {
  return function (dispatch) {
    dispatch(savingUser());
    return AsyncStorage.getItem('user')
      .then((user) => {
        const userDetails = user ? JSON.parse(user) : {};
        userDetails.name = username;
        if (firstTime) {
          userDetails.useMetric = false;
        }
        AsyncStorage.setItem('user', JSON.stringify(userDetails));
        dispatch(savedUser(userDetails));
      });
  };
}

export function updateTemperatureUnits(useMetric) {
  return function (dispatch) {
    dispatch(savingUser());
    return AsyncStorage.getItem('user')
      .then((user) => {
        const userDetails = user ? JSON.parse(user) : {};
        userDetails.useMetric = useMetric;
        AsyncStorage.setItem('user', JSON.stringify(userDetails));
        dispatch(savedUser(userDetails));
      });
  };
}
