/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from 'lit-element';
import { PageViewElement } from './page-view-element.js';
import { connect } from 'pwa-helpers/connect-mixin.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import { selectArtist } from '../actions/music.js';

// We are lazy loading its reducer.
import music from '../reducers/music.js';
store.addReducers({
  music
});

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class AlbumView extends connect(store)(PageViewElement) {

  static get properties() {
    return {
      /**
       * this object has a selected artist and it´s must be filled when an artist card is selected
       */
      _artistSelected: {type: Array},
      albumId: {type: String}
    };
  }

  constructor() {
    super();
    this._artistSelected = null;
  }

  static get styles() {
    return [
      SharedStyles
    ];
  }

  render() {
    return html`
      <style>
      </style>


      <ul>
        ${this._artistSelected ? html`${this._artistSelected.tracks ? this._artistSelected.tracks.map(track => html`
          <li>
            ${track.name}
          </li>
        `) : 'La lista está vacía Prueba a realizar otra búsqueda'}` : `Loading...`}
      </ul>
    `;
  }

  firstUpdated() {
    this._selectArtist();
  }

  _selectArtist() {
    store.dispatch(selectArtist(this.albumId))
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._artistSelected = state.music.artistSelected
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if(propName === 'albumId' && oldValue !== this.albumId) {
        this._selectArtist()
      }
    });
  }
  
}

window.customElements.define('album-view', AlbumView);
