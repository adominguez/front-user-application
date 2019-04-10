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
import { searchByArtist, searchBytrack } from '../actions/search-results.js';

// We are lazy loading its reducer.
import counter from '../reducers/counter.js';
store.addReducers({
  counter
});

// These are the elements needed by this element.
import './counter-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class MyView2 extends connect(store)(PageViewElement) {
  static get properties() {
    return {
      /**
       * Value of search input
       */
      _inputValue: {type: String},
      /**
       * method of search in input, by default is track his values are track | artist
       */
      _methodOfSearch: {type: String},
      minCharacterForSearch: {type: Number},
      _loading: {type: Boolean}
    };
  }

  constructor() {
    super();
    this._methodOfSearch = 'track';
    this._inputValue = null;
    this.minCharacterForSearch = 3;
    this._loading = false
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
        <button ?disabled="${this._inputValue && this._inputValue.length >= this.minCharacterForSearch ? false : true}">Buscar</button>
        <div class="search-results">
          <div class="loading" ?hidden="${!this._loading}">
            loading...
          </div>
        </div>
      </div>
    `;
  }

  _selectMethod(e) {
      this._methodOfSearch = e.currentTarget.id
  }

  _valueChange(value) {
    this._inputValue = value.currentTarget.value;
    if(value.currentTarget.value.length >= this.minCharacterForSearch) {
      this._loading = true;
      store.dispatch(this._methodOfSearch === 'artist' ? searchByArtist() : searchBytrack());
    }

  }

  /*_counterIncremented() {
    store.dispatch(increment());
  }

  _counterDecremented() {
    store.dispatch(decrement());
  }*/

  // This is called every time something is updated in the store.
  stateChanged(state) {
    this._clicks = state.counter.clicks;
    this._value = state.counter.value;
  }
}

window.customElements.define('my-view2', MyView2);
