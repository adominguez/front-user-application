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
import './app-loading.js';

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
    this._methodOfSearch = null;
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
        .content-view {
          width: 100%;
          display: flex;
          height: 100%;
          transition: width 0.2s ease, transform 0.2s ease;
          transition-delay: 0.3s;
          background-color: #000;
        }
        .content-view.artist {
          transform: translateX(-50%);
          width: 200%;
        }
        .content-view.track {
          transform: translateX(0%);
          width: 200%;
        }
        .side {
          flex: 1;
          color: white;
          opacity: 0.7;
          transition: opacity 0.5s ease;
          transition-delay: 0.6s;
          position: relative;
        }
        .content-view.track .track, .content-view.artist .artist {
          opacity: 1;
        }
        .track {
          background-color: #424141;
        }
        .artist {
          background-color: #47af7c;
        }
        .option-button {
          background-color: transparent;
          background-size: cover;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          border: 10px solid #1e1e1e;
          color: #fff;
          position: absolute;
          margin: 0 auto;
          left: 50%;
          top: 50%;
          outline: 0;
          transform: translate(-50%, -50%);
          padding: 0;
          transition: transform 0.2s ease, 
                      width 0.2s ease,
                      height 0.2s ease,
                      left 0.2s ease,
                      top 0.2s ease,
                      border 0.2s ease;
          transition-delay: 0.3s;
        }
        .side.track .option-button {
          background-image: url('../../images/assets/track.svg');
        }
        .side.artist .option-button {
          background-image: url('../../images/assets/artist.svg');
        }
        .content-view.artist .artist .option-button, .content-view.track .track .option-button {
          transform: translate(0, 0);
          left: 1em;
          top: 1em;
          width: 80px;
          height: 80px;
          border: 5px solid #1e1e1e;
        }
        .view-title {
          position: absolute;
          color: #fff;
          background-color: #26272a;
          width: 100%;
          text-align: center;
          z-index: 1;
          -webkit-box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.75);
          -moz-box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.75);
          box-shadow: 0px 5px 5px 0px rgba(0,0,0,0.75);
          transition: transform 0.2s ease;
          transition-delay: 0.6s;
        }
        .content-view.artist .view-title, .content-view.track .view-title {
          transform: translateY(-106px);
          transition-delay: 0s;
        }
        
        .search-input {
          font-family: 'Raleway', sans-serif;
          color: #fff;
          font-size: 30px;
          border: 0;
          background: transparent;
          -webkit-appearance: none;
          box-sizing: border-box;
          outline: 0;
          font-weight: 200;
          margin-top: 100px;
          padding: 0.2em;
          width: 100%;
          opacity: 0;
          transition-delay: 0.6s;
          transition: opacity 0.2s ease;
        }
        .search-input.input-track, .search-input.input-artist {
          opacity: 1;
        }
        .close-button {
          font-weight: 700;
          font-family: 'Raleway', sans-serif;
          font-size: 30px;
          position: absolute;
          right: 0.5em;
          top: 0.5em;
          opacity: 0;
          transition-delay: 0.6s;
          transition: opacity 0.2s ease;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.2);
          border: 0;
          border-radius: 50%;
          width:40px;
          height: 40px;
        }
        .close-button.button-artist, .close-button.button-track {
          opacity: 1;
        }
      </style>

      <div class="content-view ${this._methodOfSearch}">
        <div class="view-title">
          <h2>¿Qué música quieres escuchar?</h2>
          <h3>Selecciona como quieres buscar...</h3>
        </div>
        <div class="side track">
          <button id="track" class="option-button" @click="${this._selectMethod}"></button>
          ${this._methodOfSearch === 'track' ? html`
            <button id="button-track" class="close-button" @click="${this._selectMethod}">X</button>
            <input id="input-track" class="search-input" type="text" @keyup="${this._valueChange}" .value="${this._inputValue}" placeholder="Buscar por canción"/>
            <div class="search-results">
              <app-loading ?hidden="${!this._loading}"></app-loading>
              <ul ?hidden="${this._loading}">
                ${this._results && this._results['tracks'].items.map(i => html`
                  <li>
                    <div class="image">
                      <img src="${this.getImage(i.album.images) ? this.getImage(i.album.images).url : this.getPreviewImage()}" />
                    </div>
                    <div class="name">${i.name}</div>
                  </li>
                `)}
              </ul>
            </div>`
          : ``}
        </div>
        <div class="side artist">
          <button id="artist" class="option-button" @click="${this._selectMethod}"></button>
          ${this._methodOfSearch === 'artist' ? html`
            <button id="button-artist" class="close-button" @click="${this._selectMethod}">X</button>
            <input id="input-artist" class="search-input" type="text" @keyup="${this._valueChange}" .value="${this._inputValue}" placeholder="Buscar por artista"/>
            <div class="search-results">
              <app-loading ?hidden="${!this._loading}"></app-loading>
              <ul ?hidden="${this._loading}">
                ${this._results && this._results['artists'].items.map(i => html`
                  <li>
                    <div class="image">
                      <img src="${this.getImage(i.images) ? this.getImage(i.images).url : this.getPreviewImage()}" />
                    </div>
                    <div class="name">${i.name}</div>
                  </li>
                `)}
              </ul>
            </div>`
          : ``}
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
      setTimeout((()=> {
        this.shadowRoot.getElementById(`input-${this._methodOfSearch}`).focus();
        this.shadowRoot.getElementById(`input-${this._methodOfSearch}`).classList.add(`input-${this._methodOfSearch}`);
        this.shadowRoot.getElementById(`button-${this._methodOfSearch}`).classList.add(`button-${this._methodOfSearch}`);
      }).bind(this), 500)
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
