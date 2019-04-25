import { LitElement, html, css } from 'lit-element';

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class AppLoading extends LitElement {
  static get properties() {
    return {
    }
  }

  static get styles() {
    return [
      css`
        :host{
            color:#F97DC4;
            font-family: 'Dancing Script', cursive;
            text-align: center;
        }
        svg path.linear-1 { // stroke works fine, filter doesn't work
            stroke: white;
            filter: url(#blur-filter);
        }
        .loading {
            width: 100%;
            max-width: 300px;
            margin: 0 auto;
            padding: 0;
            position: relative;
        }
        
        .loading svg {
            height: 100%;
        }
        
        .loading .linear-1{
            stroke-dasharray:281;
            -webkit-animation: dash 6s infinite linear forwards;
        }
        .loading .linear-2{
            stroke-dasharray:300;
            -webkit-animation: dash 5s infinite linear forwards;
        }
        .loading .linear-3{
            stroke-dasharray:340;
            -webkit-animation: dash 4s infinite linear forwards;
        }
        .loading .linear-4{
            stroke-dasharray:400;
            -webkit-animation: dash 3s infinite linear forwards;
        }
        
        /*Animation*/
        @-webkit-keyframes dash{ from{stroke-dashoffset:814;} to {stroke-dashoffset:-814;}}
        
        h1 {
            text-shadow: 2px 2px 5px #E21393;
        }
        h3 {
            color: #fff;
        }
        :host[hidden], [hidden] {
            display: none;
        }
      `
    ];
  }

  render() {
    return html`
        <div class="loading">
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                width="300" height="200" viewBox="0 0 334 120" enable-background="new 0 0 334 120" xml:space="preserve">
                <filter id="blur-filter" x="-1" y="0" width="200" height="200">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                </filter>
            <path class="linear-1" fill="none" stroke="#E21393" stroke-miterlimit="10" d="M31.333,90c0,0,38-29.333,69.333-15.333S167.333,97.333,184,85.333
                s31.638-47.49,14-69c-8.615-10.506-19.829-1.669-26,7.667c-3.619,5.474-4.667,12.667-4.667,12.667S151.637,12.315,141,29.333
                c-5,8-5.667,45.333,19.333,57C204.574,106.979,286.928,102.42,310,88"/>
            <path class="linear-1" fill="none" stroke="#F97DC4" stroke-miterlimit="10" d="M32.333,90c0,0,38-29.333,69.333-15.333S168.333,97.333,185,85.333
                s31.638-47.49,14-69c-8.615-10.506-19.829-1.669-26,7.667c-3.619,5.474-4.667,12.667-4.667,12.667S152.637,12.315,142,29.333
                c-5,8-5.667,45.333,19.333,57C205.574,106.979,287.928,102.42,311,88"/>
            <path class="linear-3" fill="none" stroke="#E21367" stroke-miterlimit="10" d="M36.333,90c0,0,38-29.333,69.333-15.333S172.333,97.333,189,85.333
                s31.638-47.49,14-69c-8.615-10.506-19.829-1.669-26,7.667c-3.619,5.474-4.667,12.667-4.667,12.667S156.637,12.315,146,29.333
                c-5,8-5.667,45.333,19.333,57C209.574,106.979,291.928,102.42,315,88"/>
            <path class="linear-4" fill="none" stroke="#F97DC4" stroke-miterlimit="10" d="M40.333,90c0,0,38-29.333,69.333-15.333S176.333,97.333,193,85.333
                s31.638-47.49,14-69c-8.615-10.506-19.829-1.669-26,7.667c-3.619,5.474-4.667,12.667-4.667,12.667S160.637,12.315,150,29.333
                c-5,8-5.667,45.333,19.333,57C213.574,106.979,295.928,102.42,319,88"/>
            </svg>
            <h1>Ana & Domin</h1>
            <h3>With love</h3>
        </div>
    `;
  }
}

window.customElements.define('app-loading', AppLoading);
