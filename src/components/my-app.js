/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit-element';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installOfflineWatcher } from 'pwa-helpers/network.js';
import { installRouter } from 'pwa-helpers/router.js';
import { updateMetadata } from 'pwa-helpers/metadata.js';

// This element is connected to the Redux store.
import { store } from '../store.js';

// These are the actions needed by this element.
import {
  navigate,
  updateOffline,
  updateDrawerState
} from '../actions/app.js';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import { menuIcon } from './my-icons.js';
import './snack-bar.js';

class MyApp extends connect(store)(LitElement) {
  static get properties() {
    return {
      appTitle: { type: String },
      _page: { type: String },
      _drawerOpened: { type: Boolean },
      _snackbarOpened: { type: Boolean },
      _offline: { type: Boolean }
    };
  }

  static get styles() {
    return [
      css `
        :host {
          display: block;
        }
        .app-wrap {
          height: 100vh;
          margin: 0 auto 0 auto;
          border-bottom-width: 70px;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -webkit-flex-direction: column;
              -ms-flex-direction: column;
                  flex-direction: column;
        }
        
        .app-wrap > * {
          -webkit-box-flex: 1;
          -webkit-flex: 1 1 auto;
              -ms-flex: 1 1 auto;
                  flex: 1 1 auto;
        }
        
        .content {
          background: white;
          box-shadow: 0 0 5px 0 rgba(0,0,0,0.1);
          line-height: 1.6;
          overflow-y: scroll;
          -webkit-overflow-scrolling:touch;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -webkit-flex-direction: column;
              -ms-flex-direction: column;
                  flex-direction: column;
          overflow-x: hidden;
        }
        
        .content > * {
          -webkit-box-flex: 1;
          -webkit-flex: 1 1;
              -ms-flex: 1 1;
                  flex: 1 1;
          max-width: 100%;
        }

        .page {
          display: none;
        }
        .page[active] {
          display: block;
        }
        
        
        .icon-bar a {
          -webkit-box-flex: 1;
          -webkit-flex: 1;
              -ms-flex: 1;
                  flex: 1;
          text-align: center;
          padding: 1.5rem;
          border-left: 1px solid rgba(0,0,0,0.1);
          background-color: #26272a;
          color: #fff;
          text-decoration: none;
        }

        .icon-bar a:hover, .icon-bar a.selected {
          background-color:#1e1f21;
          color: #47af7c;
        }
        
        
        .icon-bar a:first-child {
          border-left: 0;
        }
        
        .app-header {
          background-color: #26272a;
          color: #fff;
          max-height: 65px;
          box-sizing: border-box;
          padding: 1rem;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: justify;
          -webkit-justify-content: space-between;
              -ms-flex-pack: justify;
                  justify-content: space-between;
          -webkit-box-align: center;
          -webkit-align-items: center;
              -ms-flex-align: center;
                  align-items: center;
          text-align: center;
          z-index: 2;
        }
        
        .icon-bar {
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-flex-basis: 60px;
              -ms-flex-preferred-size: 60px;
                  flex-basis: 60px;
          box-sizing: border-box;
          max-height: 60px;
        }
      `
    ];
  }

  render() {
    // Anything that's related to rendering should be done in here.
    return html`
      <div class="app-wrap">
        <header class="app-header">
          <button class="menu-btn" title="Menu" @click="${this._menuButtonClicked}">${menuIcon}</button>

          <h1>${this.appTitle}</h1>

          <a href="#" class="button">
          Info
            <i class="fa fa-cog"></i>
          </a>
        </header>

        <main role="main" class="content">
          <my-view1 class="page" ?active="${this._page === 'view1'}"></my-view1>
          <my-view2 class="page" ?active="${this._page === 'view2'}"></my-view2>
          <my-view3 class="page" ?active="${this._page === 'view3'}"></my-view3>
          <my-view404 class="page" ?active="${this._page === 'view404'}"></my-view404>
        </main>

        <nav class="icon-bar">
        <a class="${this._page === 'view1' ? 'selected' : ''}" ?selected="${this._page === 'view1'}" href="/view1">Photos</a>
        <a class="${this._page === 'view2' ? 'selected' : ''}" ?selected="${this._page === 'view2'}" href="/view2">Music</a>
        <a class="${this._page === 'view3' ? 'selected' : ''}" ?selected="${this._page === 'view3'}" href="/view3">Messages</a>
        </nav>
      </div>
      <snack-bar ?active="${this._snackbarOpened}">
          You are now ${this._offline ? 'offline' : 'online'}.
      </snack-bar>
    `;
  }

  constructor() {
    super();
    // To force all event listeners for gestures to be passive.
    // See https://www.polymer-project.org/3.0/docs/devguide/settings#setting-passive-touch-gestures
    setPassiveTouchGestures(true);
  }

  firstUpdated() {
    installRouter((location) => store.dispatch(navigate(decodeURIComponent(location.pathname))));
    installOfflineWatcher((offline) => store.dispatch(updateOffline(offline)));
    installMediaQueryWatcher(`(min-width: 460px)`,
      () => store.dispatch(updateDrawerState(false)));
  }

  updated(changedProps) {
    if (changedProps.has('_page')) {
      const pageTitle = this.appTitle + ' - ' + this._page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _menuButtonClicked() {
    store.dispatch(updateDrawerState(true));
  }

  _drawerOpenedChanged(e) {
    store.dispatch(updateDrawerState(e.target.opened));
  }

  stateChanged(state) {
    this._page = state.app.page;
    this._offline = state.app.offline;
    this._snackbarOpened = state.app.snackbarOpened;
    this._drawerOpened = state.app.drawerOpened;
  }
}

window.customElements.define('my-app', MyApp);