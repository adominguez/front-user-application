import { SEARCH_BY_ARTIST, SEARCH_BY_TRACK, GET_TOKEN } from '../actions/music.js';

const INITIAL_STATE = {
    results: null,
    token: null
};

const music = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TOKEN:
      return {
        token: action.token,
      };
    case SEARCH_BY_ARTIST:
      return {
        results: action.results,
      };
    case SEARCH_BY_TRACK:
      return {
        results: action.results
      };
    default:
      return state;
  }
};

export default music;
