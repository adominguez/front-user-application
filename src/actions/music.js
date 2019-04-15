export const SEARCH_BY_ARTIST = 'SEARCH_BY_ARTIST';
export const SEARCH_BY_TRACK = 'SEARCH_BY_TRACK';
export const GET_TOKEN = 'GET_TOKEN';
export const EMPTY_RESULTS = 'EMPTY_RESULTS';
export const SELECT_ARTIST = 'SELECT_ARTIST';

import {API_URL} from '../const.js'

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

export const emptyResults = () => (dispatch) => {
  dispatch({
    type: EMPTY_RESULTS,
  });
}

export const searchByArtist = (search, token) => (dispatch) => {
  const url = `${API_URL}/artists/${search}`;

  const options = {
    method: 'GET',
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
  const url = `${API_URL}/tracks/${search}`;

  const options = {
    method: 'GET',
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

export const selectArtist = () => (dispatch) => {
  const id = event.detail.id;

  const url = `${API_URL}/artists/${id}/top-track`;

  const options = {
    method: 'GET',
    cache: 'default',
    json: true
  };

  const myRequest = new Request(url, options);

  fetch(myRequest)
    .then(function (response) {
      return response.json();
    }).then(function (tracks) {
      dispatch({
        type: SELECT_ARTIST,
        artistSelected: {
          id,
          ...tracks
        },
      });
    });
}