import AsyncStorage from '@react-native-community/async-storage';
import * as RNIap from 'react-native-iap';
import * as constants from './constants';

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

export const FETCHING_IAP = 'FETCHING_IAP';
function fetchingIAP() {
  return {
    type: FETCHING_IAP,
  };
}

export const FETCHED_IAP = 'FETCHED_IAP';
function fetchedIAP(purchases) {
  let isPremium = false;
  console.log(purchases);
  purchases.forEach((purchase) => {
    switch(purchase.productId) {
      case constants.DRIPPY_PRO_IOS:
          isPremium = true;
    }
  });
  return {
    type: FETCHED_IAP,
    premium: isPremium,
    receivedAt: Date.now()
  };
}

export const ERROR_IAP = 'ERROR_IAP';
function errorIAP(err) {
  return {
    type: ERROR_IAP,
    error: err,
    receivedAt: Date.now()
  };
}

export function fetchIAP() {
  return function (dispatch) {
    dispatch(fetchingIAP());
    return RNIap.getAvailablePurchases(constants.itemSkus)
      .then((purchases) => {
        // RNIap.requestPurchase(purchases[0].productId, false);
        dispatch(fetchedIAP(purchases));
      })
      .catch(error => dispatch(errorIAP(error)));
  };
}
