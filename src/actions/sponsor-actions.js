import fetch from 'cross-fetch';
import * as constants from './constants';

const camelcaseKeys = require('camelcase-keys');

export const REQUEST_SPONSORS = 'REQUEST_SPONSORS';
function requestSponsors() {
  return {
    type: REQUEST_SPONSORS
  };
}

export const RECEIVE_SPONSORS = 'RECEIVE_SPONSORS';
function receiveSponsors(json) {
  let jsonToUse = [];
  if (json) {
    jsonToUse = camelcaseKeys(json);
  }
  return {
    type: RECEIVE_SPONSORS,
    sponsors: jsonToUse,
    receivedAt: Date.now()
  };
}

export const ERROR_SPONSORS = 'ERROR_SPONSORS';
function errorSponsors(err) {
  return {
    type: ERROR_SPONSORS,
    error: err,
    receivedAt: Date.now()
  };
}

export function fetchSponsors() {
  return function (dispatch) {
    dispatch(requestSponsors());
    return fetch(`${constants.API_URL}/sponsors`)
      .then(
        response => response.json(),
        error => dispatch(errorSponsors(error))
      )
      .then(json => dispatch(receiveSponsors(json)));
  };
}

export const REQUEST_SPONSOR = 'REQUEST_SPONSOR';
function requestSponsor(sponsorId) {
  return {
    type: REQUEST_SPONSOR,
    sponsorId
  };
}

export const RECEIVE_SPONSOR = 'RECEIVE_SPONSOR';
function receiveSponsor(sponsorId, json) {
  let jsonToUse = {};
  if (json) {
    jsonToUse = camelcaseKeys(json);
  }
  return {
    type: RECEIVE_SPONSOR,
    sponsorId,
    sponsor: jsonToUse,
    receivedAt: Date.now()
  };
}

export const ERROR_SPONSOR = 'ERROR_SPONSOR';
function errorSponsor(err) {
  return {
    type: ERROR_SPONSOR,
    error: err,
    receivedAt: Date.now()
  };
}

export function fetchSponsor(sponsorId) {
  return function (dispatch) {
    dispatch(requestSponsor(sponsorId));
    return fetch(`${constants.API_URL}/sponsors/${sponsorId}`)
      .then(
        response => response.json(),
        error => dispatch(errorSponsor(error))
      )
      .then(json => dispatch(receiveSponsor(sponsorId, json)));
  };
}
