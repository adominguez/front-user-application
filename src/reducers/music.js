import { SEARCH_BY_ARTIST, SEARCH_BY_TRACK, GET_TOKEN, EMPTY_RESULTS, SELECT_ARTIST } from '../actions/music.js';

const INITIAL_STATE = {
    results: null,
    token: null,
    loading: false,
    artistSelected: null
};

const music = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case EMPTY_RESULTS:
      return {
        ...state,
        results: null,
      };
    case SEARCH_BY_ARTIST:
      return {
        ...state,
        results: action.results,
        loading: false,
      };
    case SEARCH_BY_TRACK:
      return {
        ...state,
        results: action.results,
        loading: false,
      };
      case SELECT_ARTIST:
      return {
        ...state,
        artistSelected: action.artistSelected,
      };
    default:
      return state;
  }
};

export default music;
