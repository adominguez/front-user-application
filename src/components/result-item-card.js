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

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class ResultItemCard extends LitElement {
  static get properties() {
    return {
      /* Item heading */
      heading: { type: String },
      /* Item subheading */
      subheading: { type: String },
      /* Item image */
      image: { type: String },
      /* Empty image */
      emptyImage: { type: String },
      /* selected card */
      selected: { type: Boolean },
      /* id card */
      id: {type: String}
    }
  }

  static get styles() {
    return [
      css`
        .material-card {
          position: relative;
          font-family: 'Raleway', sans-serif;
          display: block;
          width: 100%;
          border: 0;
          background-color: transparent;
          padding: 0;
        }
        .material-card-header {
          padding: 1em;
          background-color: rgba(30,30,30,0.7);
          color: #fff;
          display: flex;
          line-height: 1;
        }
        .material-card-header-image {
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          background-size: cover;
          border-radius: 50%;
          background-repeat: no-repeat;
          margin-right: 0.5em;
        }
        .material-card-header-heading h2 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 100;
        }
        .material-card-header-heading h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 400;
        }
      `
    ];
  }

  render() {
    return html`
      <article @click="${this.selectCard}" class="material-card">
        <div class="material-card-header">
          <div class="material-card-header-image" style="background-image: url('${this.image || this.emptyImage}')">
          </div>
          <div class="material-card-header-heading">
            <h2>${this.heading}</h2>
            <h3>
              <i class="fa fa-fw fa-star"></i>
              ${this.subheading}
            </h3>
          </div>
        </div>
      </article>
    `;
  }

  constructor() {
    super();
    this.heading = '';
    this.subheading = '';
    this.id= ''
    this.image = null;
    this.emptyImage = '../../images/assets/empty-image.svg';
    this.selected = false;
  }

  selectCard() {
    /*this.selected = !this.selected;*/
    let selectCard = new CustomEvent('select-artist', { 
      detail: { id: this.id, selected: this.selected },
      bubbles: true,
      composed: true });
    this.dispatchEvent(selectCard);
  }
}

window.customElements.define('result-item-card', ResultItemCard);
