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
import { selectArtist, getArtistById } from '../actions/music.js';

// We are lazy loading its reducer.
import music from '../reducers/music.js';
store.addReducers({
  music
});

// These are the elements needed by this element.
import './result-item-card.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class AlbumView extends connect(store)(PageViewElement) {

  static get properties() {
    return {
      /**
       * this object has a selected artist and it´s must be filled when an artist card is selected
       */
      _artistSelected: {type: Array},
      albumId: {type: String},
      _artistInfo: {type: Object}
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
        :host {
          background-color: #47af7c;
        }
      </style>
      ${this._artistSelected ? html`
      ${this._artistInfo && html`<result-item-card  closeLink="./music" heading="${this._artistInfo.name}" subheading="${this._artistInfo.genres ? this._artistInfo.genres.join(", ") : ''}" image="${this.getImage(this._artistInfo.images) ? this.getImage(this._artistInfo.images).url : ''}"></result-item-card>`}
      <ul>${this._artistSelected.tracks ? this._artistSelected.tracks.map(track => html`
        <li>
          ${track.name} - ${track.id}
        </li>
      </ul>`) : 'La lista está vacía o ha podido haber algún error, Prueba a realizar otra búsqueda o vuelve a intentarlo más tarde'}` : `Loading...`}
      
    `;
  } 

  firstUpdated() {
    this._selectArtist();
  }

  _selectArtist() {
    store.dispatch(getArtistById(this.albumId))
    store.dispatch(selectArtist(this.albumId))
  }

  getImage(images) {
    return images && images.find(image => image.width === 64 || image.width === 160 || image.width === 320)
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._artistSelected = state.music.artistSelected;
    this._artistInfo = state.music.artist;
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
