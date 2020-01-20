import uuidv4 from 'uuid/v4';

export default function History(historyObj) {
  const history = {};
  // Get ID
  if (!('historyId' in historyObj) || historyObj.historyId === '') {
    history.historyId = uuidv4();
  } else {
    history.historyId = historyObj.historyId;
  }

  // Link to recipe
  history.recipeId = historyObj.recipeId;

  // Recipe name for display
  history.recipeName = historyObj.recipeName;

  // Num stars
  history.stars = historyObj.numStars || 0;

  // Beans
  history.beans = historyObj.beans || '';

  // Notes
  history.notes = historyObj.notes || '';

  // Timestamp
  history.timestamp = new Date().getTime();

  return history;
}
