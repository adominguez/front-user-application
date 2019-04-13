import { SEARCH_BY_ARTIST, SEARCH_BY_TRACK, GET_TOKEN, EMPTY_RESULTS } from '../actions/music.js';

const INITIAL_STATE = {
    results: null,
    token: null,
    loading: false
};

const music = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TOKEN:
      return {
        token: action.token,
      };
    case EMPTY_RESULTS:
      return {
        results: null,
      };
    case SEARCH_BY_ARTIST:
      return {
        results: action.results,
        loading: false
      };
      case SEARCH_BY_TRACK:
      return {
        results: action.results,
        loading: false
      };
    default:
      return state;
  }
};

export default music;
