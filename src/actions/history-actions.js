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
        AsyncStorage.setItem('recipes', JSON.stringify(h));
        dispatch(savedHistory(historyToSave));
      });
  };
}
