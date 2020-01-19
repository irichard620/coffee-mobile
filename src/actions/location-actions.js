import fetch from 'cross-fetch';
import * as constants from './constants';

const camelcaseKeys = require('camelcase-keys');

export const REQUEST_LOCATIONS = 'REQUEST_LOCATIONS';
function requestLocations(sponsorID) {
  return {
    type: REQUEST_LOCATIONS,
    sponsorID
  };
}

export const RECEIVE_LOCATIONS = 'RECEIVE_LOCATIONS';
function receiveLocations(sponsorID, json) {
  let jsonToUse = {};
  if (json) {
    jsonToUse = camelcaseKeys(json);
  }
  return {
    type: RECEIVE_LOCATIONS,
    sponsorID,
    locations: jsonToUse,
    receivedAt: Date.now()
  };
}

export const ERROR_LOCATIONS = 'ERROR_LOCATIONS';
function errorLocations(err) {
  return {
    type: ERROR_LOCATIONS,
    error: err,
    receivedAt: Date.now()
  };
}

export function fetchLocations(sponsorID) {
  return function (dispatch) {
    dispatch(requestLocations(sponsorID));
    const sponsorParam = sponsorID || '';
    return fetch(`${constants.API_URL}/locations/${sponsorParam}`)
      .then((response) => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(json => dispatch(receiveLocations(sponsorID, json)))
      .catch(error => dispatch(errorLocations(error)));
  };
}
