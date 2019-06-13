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
    sponsors: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}

export function fetchSponsors() {
  return function(dispatch) {
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
