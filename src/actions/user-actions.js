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
        userDetails.premium = false; // Initialize premium to false - first time open
        AsyncStorage.setItem('user', JSON.stringify(userDetails));
        dispatch(savedUsername());
      });
  };
}

export const UPGRADING_IAP = 'UPGRADING_IAP';
function upgradingIAP() {
  return {
    type: UPGRADING_IAP,
  };
}

export const UPGRADED_IAP = 'UPGRADED_IAP';
function upgradedIAP(userDetails) {
  return {
    type: UPGRADED_IAP,
    user: userDetails,
    receivedAt: Date.now()
  };
}

export function upgradeIAP() {
  return function (dispatch) {
    dispatch(upgradingIAP());
    return AsyncStorage.getItem('user')
      .then((user) => {
        const userDetails = user ? JSON.parse(user) : {};
        userDetails.premium = true;
        AsyncStorage.setItem('user', JSON.stringify(userDetails));
        dispatch(upgradedIAP(userDetails));
      });
  };
}

export const RESTORING_IAP = 'RESTORING_IAP';
function restoringIAP() {
  return {
    type: RESTORING_IAP,
  };
}

export const RESTORED_IAP = 'RESTORED_IAP';
function restoredIAP(userDetails) {
  return {
    type: RESTORED_IAP,
    user: userDetails,
    receivedAt: Date.now()
  };
}

export const ERROR_RESTORE_IAP = 'ERROR_RESTORE_IAP';
function errorRestoreIAP(userDetails, err) {
  return {
    type: ERROR_RESTORE_IAP,
    user: userDetails,
    error: err,
    receivedAt: Date.now()
  };
}

export function restoreIAP() {
  return function (dispatch) {
    dispatch(restoringIAP());
    return AsyncStorage.getItem('user')
      .then((user) => {
        const userDetails = user ? JSON.parse(user) : {};
        RNIap.getAvailablePurchases(constants.itemSkus)
          .then((purchases) => {
            // Check if user has premium
            let isPremium = false;
            purchases.forEach((purchase) => {
              switch (purchase.productId) {
                case constants.DRIPPY_PRO_IOS:
                  isPremium = true;
                  break;
                default:
                  break;
              }
            });
            // Update user
            userDetails.premium = isPremium;
            AsyncStorage.setItem('user', JSON.stringify(userDetails));
            dispatch(restoredIAP(userDetails));
          })
          .catch((error) => {
            // Assume premium false in error
            userDetails.premium = false;
            AsyncStorage.setItem('user', JSON.stringify(userDetails));
            dispatch(errorRestoreIAP(userDetails, error));
          });
      });
  };
}
