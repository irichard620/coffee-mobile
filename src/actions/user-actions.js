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
        // Add metric variable if needed
        if (('name' in userDetails)) {
          if (!('useMetric' in userDetails)) {
            userDetails.useMetric = false;
          }
          if (!('premium' in userDetails)) {
            userDetails.premium = false;
          }
          if (!('lastAdShown' in userDetails)) {
            userDetails.lastAdShown = null;
          }
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
          userDetails.premium = false; // Initialize premium to false - first time open
          userDetails.lastAdShown = null;
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

export function updateLastAdShown(updatedDate) {
  return function (dispatch) {
    dispatch(savingUser());
    return AsyncStorage.getItem('user')
      .then((user) => {
        const userDetails = user ? JSON.parse(user) : {};
        userDetails.lastAdShown = updatedDate;
        AsyncStorage.setItem('user', JSON.stringify(userDetails));
        dispatch(savedUser(userDetails));
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
function upgradedIAP(userDetails, purchasePassed) {
  return {
    type: UPGRADED_IAP,
    user: userDetails,
    purchase: purchasePassed,
    receivedAt: Date.now()
  };
}

export function upgradeIAP(purchase) {
  return function (dispatch) {
    dispatch(upgradingIAP());
    return AsyncStorage.getItem('user')
      .then((user) => {
        const userDetails = user ? JSON.parse(user) : {};
        userDetails.premium = true;
        AsyncStorage.setItem('user', JSON.stringify(userDetails));
        dispatch(upgradedIAP(userDetails, purchase));
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

export const PURCHASING_IAP = 'PURCHASING_IAP';
function purchasingIAP() {
  return {
    type: PURCHASING_IAP,
  };
}

export const PURCHASED_IAP = 'PURCHASED_IAP';
function purchasedIAP() {
  return {
    type: PURCHASED_IAP,
    receivedAt: Date.now()
  };
}

export const ERROR_PURCHASING_IAP = 'ERROR_PURCHASING_IAP';
function errorPurchasingIAP(err) {
  return {
    type: ERROR_PURCHASING_IAP,
    error: err,
    receivedAt: Date.now()
  };
}

export function requestPurchaseIAP() {
  return function (dispatch) {
    dispatch(purchasingIAP());
    return RNIap.getProducts(constants.itemSkus)
      .then(() => {
        RNIap.requestPurchase(constants.DRIPPY_PRO_IOS, false)
          .then(() => {
            dispatch(purchasedIAP());
          })
          .catch((error) => {
            dispatch(errorPurchasingIAP(error));
          });
      })
      .catch((error) => {
        dispatch(errorPurchasingIAP(error));
      });
  };
}
