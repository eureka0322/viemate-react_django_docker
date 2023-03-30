import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import config from 'config';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object,
    is_home_page: PropTypes.bool,
    chosen_location: PropTypes.string,
  };

  render() {
    const {assets, component, store, is_home_page, chosen_location} = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();
    const ie = '<!--[if lte IE 9]><div class="browsehappy"><div class="browsehappy__inner"><div class="browsehappy__message">You are using an <strong>outdated</strong> browser.Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</div></div></div><![endif]-->';
    return (
      <html lang="en-us">
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          <link rel="shortcut icon" href="/favicons/favicon.ico" />
          <link rel="apple-touch-icon" sizes="57x57" href="/favicon/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/favicon/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/favicon/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/favicon/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/favicon/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/favicon/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/favicon/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/favicon/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192"  href="/favicon/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/favicon/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />

          <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' name='viewport' />
          {/*<meta content='width=device-width, initial-scale=1.0' name='viewport' />*/}

          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).map((style, key) =>
            <link href={assets.styles[style]} key={key} rel="stylesheet" type="text/css" charSet="UTF-8"/>
          )}

          {/* (will be present only in development mode) */}
          {/* outputs a <style/> tag with all bootstrap styles + App.scss + it could be CurrentPage.scss. */}
          {/* can smoothen the initial style flash (flicker) on page load in development mode. */}
          {/* ideally one could also include here the style for the current page (Home.scss, About.scss, etc) */}
          {/* Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{__html: require('../containers/App/App.scss')._style}}/> : null */}
          <script async src='//www.google-analytics.com/analytics.js' />
        </head>
        <body className={is_home_page ? 'header-transparent' : ''}>
          <div dangerouslySetInnerHTML={{__html: ie}} />
          <div id="content" dangerouslySetInnerHTML={{__html: content}}/>
          <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())};`}} charSet="UTF-8"/>
          <script dangerouslySetInnerHTML={{__html: `window.__chosen_location="${chosen_location}";`}} charSet="UTF-8"/>
          <script dangerouslySetInnerHTML={{
            __html: `
            window.fbAsyncInit = function() {
              FB.init({
                appId: ${config.facebookAppId},
                xfbml: true,
                cookie: true,
                version: 'v2.8'
              });
            };

            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = "//connect.facebook.net/en_US/sdk.js";
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));`
          }} charSet="UTF-8"/>
          {<script dangerouslySetInnerHTML={{
            __html: 'window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;'
          }} charSet="UTF-8"/>}
          {/*<script dangerouslySetInnerHTML={{
            __html: `
            window.twttr = (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
              if (d.getElementById(id)) return t;
              js = d.createElement(s);
              js.id = id;
              js.src = "https://platform.twitter.com/widgets.js";
              fjs.parentNode.insertBefore(js, fjs);

              t._e = [];
              t.ready = function(f) {
                t._e.push(f);
              };

              return t;
            }(document, "script", "twitter-wjs"));`
          }} charSet="UTF-8"/>*/}
          <script src={`https://maps.googleapis.com/maps/api/js?key=${config.googleMapsKey || 'AIzaSyDtFdacW0IvkfFkQNAzTRYyN2jpVqpzaDQ'}&libraries=places&language=en&region=US`} />
          <script src="/jquery.min.js" />
          <script src="https://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" />
          <script type="text/javascript" src="https://netverify.com/widget/jumio-verify/2.0/iframe-script.js" />
          <script src={assets.javascript.main} />
        </body>
      </html>
    );
  }
}
