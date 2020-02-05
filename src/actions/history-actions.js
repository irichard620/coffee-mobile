import AsyncStorage from '@react-native-community/async-storage';

function getHistories(histories, recipeId) {
  const historiesToReturn = [];
  for (let i = 0; i < histories.length; i += 1) {
    if (recipeId && recipeId === histories[i].recipeId) {
      historiesToReturn.push(histories[i]);
    } else if (!recipeId || recipeId === '') {
      historiesToReturn.push(histories[i]);
    }
  }
  return historiesToReturn;
}

export const SAVING_HISTORY = 'SAVING_HISTORY';
function savingHistory() {
  return {
    type: SAVING_HISTORY
  };
}

export const SAVED_HISTORY = 'SAVED_HISTORY';
function savedHistory(history, histories) {
  return {
    type: SAVED_HISTORY,
    history,
    histories,
    receivedAt: Date.now()
  };
}

export const ERROR_SAVING_HISTORY = 'ERROR_SAVING_HISTORY';
function errorSavingHistory(err) {
  return {
    type: ERROR_SAVING_HISTORY,
    error: err,
    receivedAt: Date.now()
  };
}

export function saveHistory(historyToSave, recipeId = '', premium = false, reset = false) {
  return function (dispatch) {
    dispatch(savingHistory());
    return AsyncStorage.getItem('histories')
      .then((histories) => {
        const h = histories ? JSON.parse(histories) : [];
        let found = false;
        for (let i = 0; i < h.length; i += 1) {
          if (h[i].historyId === historyToSave.historyId) {
            h[i] = historyToSave;
            found = true;
            break;
          }
        }
        let shouldSave = true;
        if (!found) {
          if (!premium && h.length >= 5) {
            shouldSave = false;
            dispatch(
              errorSavingHistory(
                'Unlimited Brew Journal entry is a Drippy Pro feature. Upgrade to Drippy Pro from the Settings menu.'
              )
            );
          } else {
            h.unshift(historyToSave);
          }
        }
        if (shouldSave) {
          AsyncStorage.setItem('histories', JSON.stringify(h));
          let historiesToReturn = [];
          if (!reset) {
            historiesToReturn = getHistories(h, recipeId);
          }
          dispatch(savedHistory(historyToSave, historiesToReturn));
        }
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
function receiveHistory(h, recipeId) {
  return {
    type: RECEIVE_HISTORY,
    histories: h,
    recipeId,
    receivedAt: Date.now()
  };
}

export function fetchHistories(recipeId) {
  return function (dispatch) {
    dispatch(requestHistory());
    return AsyncStorage.getItem('histories')
      .then((histories) => {
        const h = histories ? JSON.parse(histories) : [];
        const historiesToReturn = getHistories(h, recipeId);
        dispatch(receiveHistory(historiesToReturn, recipeId));
      });
  };
}

export const DELETING_HISTORY = 'DELETING_HISTORY';
function deletingHistory() {
  return {
    type: DELETING_HISTORY
  };
}

export const DELETED_HISTORY = 'DELETED_HISTORY';
function deletedHistory(id, histories) {
  return {
    type: DELETED_HISTORY,
    historyId: id,
    histories,
    receivedAt: Date.now()
  };
}

export function deleteHistory(id, recipeId) {
  return function (dispatch) {
    dispatch(deletingHistory());
    return AsyncStorage.getItem('histories')
      .then((histories) => {
        const h = histories ? JSON.parse(histories) : [];
        for (let i = 0; i < h.length; i += 1) {
          const history = h[i];
          if (history.historyId === id) {
            h.splice(i, 1);
            break;
          }
        }
        AsyncStorage.setItem('histories', JSON.stringify(h));
        const historiesToReturn = getHistories(h, recipeId);
        dispatch(deletedHistory(id, historiesToReturn));
      });
  };
}
