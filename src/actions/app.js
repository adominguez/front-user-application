/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.
  const parts = path === '/' ? ['view1'] : path.slice(1).split('/');
  const routes = {
    id: parts[1],
    page: parts[ 0 ]
  }
  
  dispatch(loadPage( routes ));

  // Close the drawer - in case the *path* change came from a link in the drawer.
  //dispatch(updateDrawerState(false));
};

const loadPage = (routes) => (dispatch) => {
  let page = routes.page
  switch(page) {
    case 'view1':
      import('../components/my-view1.js').then((module) => {
        // Put code in here that you want to run every time when
        // navigating to view1 after my-view1.js is loaded.
      });
      break;
    case 'music':
      import('../components/music-view.js');
      break;
    case 'album':
      if(routes.id) {
        import('../components/album-view.js');
      } else {
        window.location.replace("./music");
      }
      break;
    case 'view3':
      import('../components/my-view3.js');
      break;
    default:
    routes.page = 'view404';
      import('../components/my-view404.js');
  }

  dispatch(updatePage(routes));
};

const updatePage = (routes) => {
  return {
    type: UPDATE_PAGE,
    routes
  };
};

let snackbarTimer;

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  window.clearTimeout(snackbarTimer);
  snackbarTimer = window.setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = (offline) => (dispatch, getState) => {
  // Show the snackbar only if offline status changes.
  if (offline !== getState().app.offline) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const updateDrawerState = (opened) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  };
};
