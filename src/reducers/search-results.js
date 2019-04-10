import { SEARCH_BY_ARTIST, SEARCH_BY_TRACK } from '../actions/search-results.js';

const INITIAL_STATE = {
  tracks: null,
  artists: null
};

const search = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_BY_ARTIST:
      return {
        clicks: state.clicks + 1,
        value: state.value + 1
      };
    case SEARCH_BY_TRACK:
      return {
        clicks: state.clicks + 1,
        value: state.value - 1
      };
    default:
      return state;
  }
};

export default counter;
