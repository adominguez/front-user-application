export const SEARCH_BY_ARTIST = 'SEARCH_BY_ARTIST';
export const SEARCH_BY_TRACK = 'SEARCH_BY_TRACK';
export const GET_TOKEN = 'GET_TOKEN';

import {API_URL, SPOTIFY_API_URL} from '../const.js'

export const getToken = () => (dispatch) => {
  const authOptions = {
    method: 'GET',
    cache: 'default',
    json: true
  };
  const url = `${API_URL}/get-spotify-token`;
  const myRequest = new Request(url, authOptions);

  fetch(myRequest)
    .then(function (response) {
      return response.json();
    }).then(function (token) {
      dispatch({
        type: GET_TOKEN,
        token
      });
    });
}

export const searchByArtist = (search, token) => (dispatch) => {
  const url = `${SPOTIFY_API_URL}/search?q=${search}&type=artist&limit=15`;
  debugger;
  const headers = new Headers({
    'Authorization': 'Bearer ' + token
  });

  const options = {
    method: 'GET',
    headers: headers,
    cache: 'default',
    json: true
  };

  const myRequest = new Request(url, options);

  fetch(myRequest)
    .then(function (response) {
      return response.json();
    }).then(function (results) {
      dispatch({
        type: SEARCH_BY_ARTIST,
        results
      });
    });
};

export const searchBytrack = (search, token) => (dispatch) => {
  const url = `${SPOTIFY_API_URL}/search?q=${search}&type=track&market=ES&limit=15`;
  const headers = new Headers({
    'Authorization': 'Bearer ' + token
  });

  const options = {
    method: 'GET',
    headers: headers,
    cache: 'default',
    json: true
  };

  const myRequest = new Request(url, options);

  fetch(myRequest)
    .then(function (response) {
      return response.json();
    }).then(function (results) {
      dispatch({
        type: SEARCH_BY_TRACK,
        results
      });
    });
};