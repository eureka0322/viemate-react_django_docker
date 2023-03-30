/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import { Provider } from 'react-redux';
import { Router, browserHistory, hashHistory, applyRouterMiddleware } from 'react-router';
import { ReduxAsyncConnect } from 'redux-connect';
// import useScroll from 'scroll-behavior/lib/useStandardScroll';
import useScroll from 'react-router-scroll';
import getRoutes from './routes';
import { supportsHistory } from 'history/lib/DOMUtils';
import { syncHistoryWithStore } from 'react-router-redux';
import cookie from 'react-cookie';

const historyStrategy = supportsHistory() ? browserHistory : hashHistory;

const startRender = () => {
  const client = new ApiClient();
  // const scroll_history = useScroll(() => historyStrategy)();
  const dest = document.getElementById('content');
  const store = createStore(historyStrategy, client, window.__data);
  const history = syncHistoryWithStore(historyStrategy, store);

  const component = (
    <Router
      render={(props) => {
        return (
          <ReduxAsyncConnect {...props} helpers={{client}} filter={item => !item.deferred}
            render={applyRouterMiddleware(useScroll((prevProps, { location, routes }) => {
              if (routes.some(route => route.ignoreScrollBehavior)) {
                return false;
              }
              if (prevProps && `${location.pathname}${location.search}` !== `${prevProps.location.pathname}${prevProps.location.search}`) {
                return [0, 0];
              }
              return true;
            }))}
          />
        );
      }}
      history={history}
    >
      {getRoutes(store)}
    </Router>
  );

  ReactDOM.render(
    <Provider store={store} key="provider">
      {component}
    </Provider>,
    dest
  );

  if (process.env.NODE_ENV !== 'production') {
    window.React = React; // enable debugger

    if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
      console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
    }
  }
  if (__DEVTOOLS__ && !window.devToolsExtension) {
    const DevTools = require('./containers/DevTools/DevTools');
    ReactDOM.render(
      <Provider store={store} key="provider">
        <div>
          {component}
          <DevTools />
        </div>
      </Provider>,
      dest
    );
  }
};

const prepareRender = (chosen_location) => {
  if (chosen_location) {
    const old_id = cookie.load('chosen_location');
    if (old_id !== chosen_location) {
      cookie.save('chosen_location', chosen_location, {expires: new Date(3e3, 0), path: '/'});
    }
  }
  startRender();
};

prepareRender(window.__chosen_location);
