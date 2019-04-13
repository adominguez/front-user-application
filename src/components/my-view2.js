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
import { searchByArtist, searchBytrack, getToken, emptyResults } from '../actions/music.js';

// We are lazy loading its reducer.
import music from '../reducers/music.js';
store.addReducers({
  music
});

// These are the elements needed by this element.
import './counter-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

var globalTimeout = null; 

class MyView2 extends connect(store)(PageViewElement) {

  static get properties() {
    return {
      /**
       * Value of delay for use in search in ms
       */
      delaySearch:{type: Number},
      /**
       * Value of search input
       */
      _inputValue: {type: String},
      /**
       * this property shows or hide the loading spinner
       */
      _loading: {type: Boolean},
      /**
       * method of search in input, by default is track his values are track | artist
       */
      _methodOfSearch: {type: String},
      /**
       * Min character to write in input search
       */
      _minCharacterForSearch: {type: Number},
      /**
       * List of results with information about artists or tracks
       */
      _results: {type: Array},
    };
  }

  constructor() {
    super();
    this._methodOfSearch = 'track';
    this._inputValue = null;
    this._minCharacterForSearch = 3;
    this._loading = false
    this._results = null
    this.delaySearch = 500
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
          height: 100%;
        }
        h2 {
          color: #359788!important;
          letter-spacing: 1px;
          line-height: 1.2;
        }
        h3 {
          text-align: center;
          color: white;
        }
        .content {
          padding: 2em 2em 2em;
          margin: 0em auto;
          min-height: calc(100vh-104px);
          -webkit-box-shadow: -2px 7px 37px 8px rgba(0,0,0,0.52);
          -moz-box-shadow: -2px 7px 37px 8px rgba(0,0,0,0.52);
          box-shadow: -2px 7px 37px 8px rgba(0,0,0,0.52);
          background: rgba(0, 0, 0, 0.69)!important;
        }
        :host([hidden]) { display: none; }
      </style>

      <div class="content">
        <h2>Envía la canción que quieras</h2>
        <h3>Selecciona como quieres buscar tu canción</h3>
        <button id="track" @click="${this._selectMethod}">Buscar por canción</button>
        <button id="artist" @click="${this._selectMethod}">Buscar por artista</button>
        <input type="text" @keyup="${this._valueChange}" .value="${this._inputValue}" placeholder="Buscar por ${this._methodOfSearch === 'track' ? 'canción' : 'artista'}"/>
        <button ?disabled="${this._inputValue && this._inputValue.length >= this._minCharacterForSearch ? false : true}">Buscar</button>
        <div class="search-results">
          <div class="loading" ?hidden="${!this._loading}">
            loading...
          </div>
          <ul ?hidden="${this._loading}">
            ${this._results && this._results[this._methodOfSearch === 'track' ? 'tracks' : 'artists'].items.map(i => html`
              <li>
              ${i.album ?
                html`
                <div class="image">
                  <img src="${this.getImage(i.album.images) ? this.getImage(i.album.images).url : this.getPreviewImage()}" />
                </div>
                <div class="name">${i.name}</div>`:
                html`
                <div class="image">
                  <img src="${this.getImage(i.images) ? this.getImage(i.images).url : this.getPreviewImage()}" />
                </div>
                <div class="name">${i.name}</div>`}
              </li>
            `)}
          </ul>
        </div>
      </div>
    `;
  }

  /**
   * This method is dispatched when artist or track button is selected
   */
  _selectMethod(e) {
      this._methodOfSearch = e.currentTarget.id
      this._inputValue = '';
      store.dispatch(emptyResults());
  }

  /**
   * This method is dispatched when input value is changed
   */
  _valueChange(value) {
    if(this._inputValue !== value.currentTarget.value) {
      this._inputValue = value.currentTarget.value;
  
      if(value.currentTarget.value.length >= this._minCharacterForSearch ) {
        this._loading = true;
  
        if (globalTimeout != null) {
          clearTimeout(globalTimeout);
        }
        globalTimeout = setTimeout((() => {
          globalTimeout = null;
          store.dispatch(this._methodOfSearch === 'artist' ? searchByArtist(this._inputValue) : searchBytrack(this._inputValue))
        }).bind(this), this.delaySearch);  
      } else if(value.currentTarget.value.length === 0) {
        store.dispatch(emptyResults());
      }
    }
  }

  /**
   * This method dispatch getToken for refresh the Token
   */
  _getToken() {
    store.dispatch(getToken());
  }

  getImage(images) {
    return images.find(image => image.width === 64 || image.width === 160 || image.width === 320)
  }

  getPreviewImage() {
    return `http://icons.veryicon.com/64/Avatar/Free%20Male%20Avatars/Male%20Avatar%20Goatee%20Beard.png`;
  }

  firstUpdated(changedProperties) {
    this._getToken();
  }

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._results = state.music.results;
    this._loading = state.music.loading
  }
}

window.customElements.define('my-view2', MyView2);
