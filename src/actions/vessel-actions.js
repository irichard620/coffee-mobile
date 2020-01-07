import fetch from 'cross-fetch';
import * as constants from './constants';
import * as vesselConstants from '../constants';

const camelcaseKeys = require('camelcase-keys');

export const REQUEST_VESSEL = 'REQUEST_VESSEL';
function requestVessel(vesselName) {
  return {
    type: REQUEST_VESSEL,
    vesselName
  };
}

export const RECEIVE_VESSEL = 'RECEIVE_VESSEL';
function receiveVessel(vesselName, json) {
  let jsonToUse = {};
  if (json) {
    jsonToUse = camelcaseKeys(json);
  }
  return {
    type: RECEIVE_VESSEL,
    vesselName,
    vessel: jsonToUse,
    receivedAt: Date.now()
  };
}

export const ERROR_VESSEL = 'ERROR_VESSEL';
function errorVessel(err) {
  return {
    type: ERROR_VESSEL,
    error: err,
    receivedAt: Date.now()
  };
}

export function fetchVessel(vesselName) {
  return function (dispatch) {
    dispatch(requestVessel(vesselName));
    const vesselApiName = vesselConstants.vesselApiNames[vesselName];
    return fetch(`${constants.API_URL}/vessels/${vesselApiName}`)
      .then((response) => {
        if (!response.ok) throw response;
        return response.json();
      })
      .then(json => dispatch(receiveVessel(vesselName, json)))
      .catch(error => dispatch(errorVessel(error)));
  };
}
