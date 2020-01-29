import AsyncStorage from '@react-native-community/async-storage';

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

export function saveHistory(historyToSave) {
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
        if (!found) {
          h.unshift(historyToSave);
        }
        AsyncStorage.setItem('histories', JSON.stringify(h));
        dispatch(savedHistory(historyToSave, h));
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

export function deleteHistory(id) {
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
        dispatch(deletedHistory(id, h));
      });
  };
}
