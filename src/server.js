import Express from 'express';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';

import superagent from 'superagent';
import OAuth from 'oauth';
import cache from 'memory-cache';
// import cluster from 'cluster';
// import os from 'os';
// import fs from 'fs';

import { match } from 'react-router';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import {Provider} from 'react-redux';
import getRoutes from './routes';
import cookieServer from 'utils/cookie';
import { syncHistoryWithStore } from 'react-router-redux';

import bodyParser from 'body-parser';

import allowed_cities from 'utils/available_cities';

function loadBlogPost() {
  return new Promise((resolve, reject) => {
    const request = superagent.get('http://blog.viemate.com/ghost/api/v0.1/posts?client_id=ghost-frontend&client_secret=dc20fd91379c&limit=1');
    request.set('Content-Type', 'application/json;charset=UTF-8');
    request.end((err, res) => {
      if (res) {
        resolve(res.text);
      } else {
        reject(err);
      }
    });
  });
}

// function subscribe(data) {
//   // return data;
//   return new Promise((resolve, reject) => {
//     const request = superagent.post('https://us9.api.mailchimp.com/3.0/lists/b121fbcb90/members');
//     request.set('Content-Type', 'application/json;charset=UTF-8');
//     request.set('Authorization', 'apikey b99e33aa39eff956877adf2fe4315a2e-us9');
//     request.send(data);
//     request.end((err, res) => {
//       if (res) {
//         resolve(res.text);
//       } else {
//         reject(err);
//       }
//     });
//   });
// }

function twitterAuth() {
  return new Promise((resolve, reject) => {
    // const request = superagent.post('https://api.twitter.com/oauth2/token');
    // request.set('Authorization', `Basic ${token}`);
    // request.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    // request.send('grant_type=client_credentials');
    // request.end((err, res) => {
    //   if (res) {
    //     resolve(res);
    //   } else {
    //     reject(err);
    //   }
    // });
    const oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      'MF3uy8VHkS4vlqAJ70INvy1NL',
      'ClNqEM2GfFtHKJ6xuisj9CrvwdyhIAmXOVJiwZ55UugtdGvwRc',
      '1.0A',
      null,
      'HMAC-SHA1'
    );
    oauth.get(
      'https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=viemate&count=1&include_rts=false&exclude_replies=true',
      '2389584780-YTqaPLZGDNahio4pQBKfArOgh28w0dygtQcfr1O', //test user token
      'r2dO7ALunbB8A3qOIS4RsF144h1yAPQQr8NKS4LMs18Ne', //test user secret
      function (err, data) {
        if (err) {
          return reject(err);
        }
        return resolve(data);
    });
  });
}

function loadTumblr() {
  return new Promise((resolve, reject) => {
    superagent
      .get(`https://api.tumblr.com/v2/blog/viemate.tumblr.com/posts/photo?api_key=${config.tumblrKey}&limit=4`)
      .set('Content-Type', 'application/json; charset=utf-8')
      .end((err, res) => {
        if (res) {
          resolve(res.text);
        } else {
          reject(err);
        }
      });
  });
}

let targetUrl = '';

const protocol = config.secure ? 'https' : 'http';

if (config.apiPort && config.apiPort !== 'disabled') {
  targetUrl = protocol + '://' + config.apiHost + ':' + config.apiPort;
} else {
  targetUrl = protocol + '://' + config.apiHost;
}

// const restartWorkers = () => {
//   const workerIds = Object.keys(cluster.workers) || [];
//   workerIds.forEach(function(wid) {
//     cluster.workers[wid].send({
//       text: 'shutdown',
//       from: 'master'
//     });

//     setTimeout(function() {
//       if(cluster.workers[wid]) {
//         cluster.workers[wid].kill('SIGKILL');
//       }
//     }, 5000);
//   });
// };

// if (cluster.isMaster) {
//   const numWorkers = os.cpus().length;
//   console.log('Master cluster setting up ' + numWorkers + ' workers...');

//   for(let i = 0; i < numWorkers; i++) {
//       cluster.fork();
//   }

//   cluster.on('online', function(worker) {
//       console.log('Worker ' + worker.process.pid + ' is online');
//   });

//   fs.readdir('.', function(err, files) {
//     files.forEach(function(file) {
//       fs.watch(file, function() {
//         restartWorkers();
//       });
//     });
//   });

//   cluster.on('exit', function(worker, code, signal) {
//       console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
//       console.log('Starting a new worker');
//       cluster.fork();
//   });
// } else {

//   process.on('message', function(message) {
//     if(message.type === 'shutdown') {
//       process.exit(0);
//     }
//   });

const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);
const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  ws: false,
  changeOrigin: true
});

const mailchimp_proxy = httpProxy.createProxyServer({
  target: 'https://us9.api.mailchimp.com/3.0/lists/b121fbcb90/members',
  ws: false,
  changeOrigin: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Authorization': 'apikey b99e33aa39eff956877adf2fe4315a2e-us9',
  }
});

app.disable('etag');
app.disable('x-powered-by');
app.use(compression());
// app.use(bodyParser.json());

app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));

app.use(Express.static(path.join(__dirname, '..', 'static'), {etag: false}));

// // Proxy to API server
app.use('/api_proxy', (req, res) => {
  if (config.proxy_off) {
    res.status(400).json({errors: {full_messages: ['Proxy disabled']}});
  }
  proxy.web(req, res, {target: targetUrl});
});

app.use('/email_subscribe', (req, res, next) => {
  if (req.method === 'POST') {
    mailchimp_proxy.web(req, res);
  } else {
    next();
  }
  // subscribe(req.body).then((r) => {
  //   res.send(r);
  // }, ({err, status}) => {
  //   res.status(status || 400).send(err);
  // });
});

app.get('/blog_post', (req, res) => {
  // const access_token = '91KNiTGxBe8c4Ncp4ZcF2Omou';
  // const token_secret = 'vsmRHwF5nTYYitT2Dwy5WbHi1Jo8CKjwRezWK2h85HUI1SnPVq';
  const latest_blog_post = cache.get('latest_blog_post');
  if (latest_blog_post) {
    res.status(200).json(JSON.parse(latest_blog_post));
  } else {
    loadBlogPost().then((r) => {
      cache.put('latest_blog_post', r, (1000 * 60 * 60 * 3));
      res.status(200).json(JSON.parse(r));
    }, (err) => {
      res.status(400).send(err);
    });
  }
});

app.get('/twitter_post', (req, res) => {
  // const access_token = '91KNiTGxBe8c4Ncp4ZcF2Omou';
  // const token_secret = 'vsmRHwF5nTYYitT2Dwy5WbHi1Jo8CKjwRezWK2h85HUI1SnPVq';
  const latest_tweet = cache.get('latest_tweet');
  if (latest_tweet) {
    res.status(200).json(JSON.parse(latest_tweet));
  } else {
    twitterAuth().then((r) => {
      cache.put('latest_tweet', r, (1000 * 60 * 15));
      res.status(200).json(JSON.parse(r));
    }, (err) => {
      res.status(400).send(err);
    });
  }
});

app.get('/tumblr_post', (req, res) => {
  // const access_token = '91KNiTGxBe8c4Ncp4ZcF2Omou';
  // const token_secret = 'vsmRHwF5nTYYitT2Dwy5WbHi1Jo8CKjwRezWK2h85HUI1SnPVq';
  const latest_tumblr = cache.get('latest_tumblr');
  if (latest_tumblr) {
    res.status(200).json(JSON.parse(latest_tumblr));
  } else {
    loadTumblr().then((r) => {
      cache.put('latest_tumblr', r, (1000 * 60 * 30));
      res.status(200).json(JSON.parse(r));
    }, (err) => {
      res.status(400).send(err);
    });
  }
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
mailchimp_proxy.on('error', (error, req, res) => {
  let json;
  if (error.code !== 'ECONNRESET') {
    console.error('proxy error', error);
  }
  if (!res.headersSent) {
    res.writeHead(500, {'content-type': 'application/json'});
  }

  json = {error: 'proxy_error', reason: error.message};
  res.end(JSON.stringify(json));
});

app.use('/sublets/boston/:id?', (req, res) => {
  if (req.params.id) {
    res.redirect(`/apartments/Boston--MA--United-States/${req.params.id}`);
  } else {
    res.redirect('/apartments/Boston--MA--United-States');
  }
});

app.use('/roommates/boston/:id?', (req, res) => {
  if (req.params.id) {
    res.redirect(`/wanted-apartments/Boston--MA--United-States/${req.params.id}`);
  } else {
    res.redirect('/wanted-apartments/Boston--MA--United-States');
  }
});

app.use('/users/sign_up', (req, res) => {
  res.redirect('/users/sign_in');
});

app.use('/mailbox/inbox', (req, res) => {
  res.redirect('/messages');
});

app.use((req, res) => {

  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const client = new ApiClient(req);
  const browser_history = createHistory(req.originalUrl);

  const store = createStore(browser_history, client);

  const history = syncHistoryWithStore(browser_history, store);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  function serverRedirect(url_to) {
    res.redirect(url_to);
    return;
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {

      const router_params = renderProps.params;
      let chosen_location = '';
      global.navigator = {userAgent: req.headers['user-agent']};
      if (req && req.get('cookie')) {
        chosen_location = cookieServer.getServer(req.get('cookie'), 'chosen_location');
        if (!chosen_location && router_params && router_params.city && router_params.country && router_params.state) {
          chosen_location = `${router_params.city}--${router_params.state}--${router_params.country}`;
        }
      }

      if (chosen_location && !allowed_cities.find(c => c.value === chosen_location)) {
        chosen_location = '';
      }

      loadOnServer({...renderProps, store, helpers: {client, req, res, serverRedirect}}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );

        res.status(200);

        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} is_home_page={req.url === '/'} component={component} store={store} chosen_location={chosen_location}/>));
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});

if (config.port) {
  server.listen(process.env.PORT || config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
// }
