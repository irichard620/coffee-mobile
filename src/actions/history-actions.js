import AsyncStorage from '@react-native-community/async-storage';

export const SAVING_HISTORY = 'SAVING_HISTORY';
function savingHistory() {
  return {
    type: SAVING_HISTORY
  };
}

export const SAVED_HISTORY = 'SAVED_HISTORY';
function savedHistory(history) {
  return {
    type: SAVED_HISTORY,
    history,
    receivedAt: Date.now()
  };
}

export function saveHistory(historyToSave) {
  return function (dispatch) {
    dispatch(savingHistory());
    return AsyncStorage.getItem('histories')
      .then((histories) => {
        const h = histories ? JSON.parse(histories) : [];
        h.push(historyToSave);
        AsyncStorage.setItem('histories', JSON.stringify(h));
        dispatch(savedHistory(historyToSave));
      });
  };
}

export const REQUEST_HISTORY = 'REQUEST_HISTORY';
function requestHistory() {
  return {
    type: REQUEST_HISTORY
  };
}

export const RECEIVE_HISTORY = 'RECEIVE_HISTORY';
function receiveHistory(h) {
  return {
    type: RECEIVE_HISTORY,
    histories: h,
    receivedAt: Date.now()
  };
}

export function fetchHistories(recipeId) {
  return function (dispatch) {
    dispatch(requestHistory());
    return AsyncStorage.getItem('histories')
      .then((histories) => {
        const h = histories ? JSON.parse(histories) : [];
        const historiesToReturn = [];
        for (let i = 0; i < h.length; i += 1) {
          if (recipeId) {
            if (recipeId === h[i].recipeId) {
              historiesToReturn.push(h[i]);
            }
          } else {
            historiesToReturn.push(h[i]);
          }
        }
        dispatch(receiveHistory(historiesToReturn));
      });
  };
}
