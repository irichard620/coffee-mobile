import fetch from 'cross-fetch'
import Config from 'react-native-config'

export const REQUEST_SPONSORS = 'REQUEST_SPONSORS'
function requestSponsors() {
  return {
    type: REQUEST_SPONSORS
  }
}

export const RECEIVE_SPONSORS = 'RECEIVE_SPONSORS'
function receiveSponsors(json) {
  return {
    type: RECEIVE_SPONSORS,
    sponsors: json,
    receivedAt: Date.now()
  }
}

export function fetchSponsors() {
  return function(dispatch) {
    console.log("fetching sponsors")
    dispatch(requestSponsors())
    return fetch(`${Config.API_URL}/sponsors`)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(json =>
        dispatch(receiveSponsors(json))
      )
  }
}

export const REQUEST_SPONSOR = 'REQUEST_SPONSOR'
function requestSponsor(sponsorId) {
  return {
    type: REQUEST_SPONSOR,
    sponsorId: sponsorId
  }
}

export const RECEIVE_SPONSOR = 'RECEIVE_SPONSOR'
function receiveSponsor(sponsorId, json) {
  return {
    type: RECEIVE_SPONSOR,
    sponsorId: sponsorId,
    sponsor: json,
    receivedAt: Date.now()
  }
}

export function fetchSponsor(sponsorId) {
  return function(dispatch) {
    console.log("fetching sponsor with ID " + sponsorId)
    dispatch(requestSponsor(sponsorId))
    return fetch(`${Config.API_URL}/sponsors/${sponsorId}`)
      .then(
        response => response.json(),
        error => console.log('An error occurred.', error)
      )
      .then(json =>
        dispatch(receiveSponsor(sponsorId, json))
      )
  }
}
