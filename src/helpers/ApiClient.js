import superagent from 'superagent';
import config from 'config';
import cookie from 'react-cookie';
import cookieServer from 'utils/cookie';

const methods = ['get', 'post', 'put', 'patch', 'del'];
function formatUrl(path, direct_url = false) {
  if (direct_url) return path;
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  const apiPort = config.apiPort !== 'disabled' ? ':' + config.apiPort : '';
  const protocol = config.secure ? 'https' : 'http';
  if (__SERVER__ || config.proxy_off) {
    // Prepend host and port of the API server to the path.
    return protocol + '://' + config.apiHost + apiPort + adjustedPath;
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return '/api_proxy' + adjustedPath;
}

/*
 * This silly underscore is here to avoid a mysterious "ReferenceError: ApiClient is not defined" error.
 * See Issue #14. https://github.com/erikras/react-redux-universal-hot-example/issues/14
 *
 * Remove it at your own risk.
 */
class _ApiClient {
  constructor(req) {
    methods.forEach((method) => {
      this[method] = (path, { params, data, headers, attachments, direct_url, handleProgress, getBackRequest } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path, direct_url));
        if (params) {
          request.query(params);
        }

        if (__SERVER__ && !direct_url) {
          const server_cookies = req.get('cookie');
          if (server_cookies) {
            const uid = cookieServer.getServer(server_cookies, 'uid');
            const client = cookieServer.getServer(server_cookies, 'client');
            const token = cookieServer.getServer(server_cookies, 'access-token');

            if (uid && client && token) {
              request.set('uid', uid);
              request.set('client', client);
              request.set('access-token', token);
              request.set('token-type', 'Bearer');
            }
          }
        } else if (__CLIENT__ && !direct_url) {
          const uid = cookie.load('uid');
          const client = cookie.load('client');
          const token = cookie.load('access-token');

          if (uid && client && token) {
            request.set('uid', uid);
            request.set('client', client);
            request.set('access-token', token);
            request.set('token-type', 'Bearer');
          }
        }

        if (!attachments) {
          request.set('Content-Type', 'application/json');
        }

        if (headers) {
          for (const header in headers) { // eslint-disable-line
            if (headers.hasOwnProperty(header)) { // eslint-disable-line
              request.set(header, headers[header]);
            }
          }
        }

        if (attachments) {
          Object.keys(attachments).forEach(c => {
            if (typeof attachments[c] === 'string') {
              request.field(c, attachments[c]);
            } else if (/create_batch/.test(request.url)) {
              attachments[c].forEach((file, i) => {
                request.attach(`attachment[${c}_${i}]`, file);
              });
            } else {
              request.attach('attachment[attachment]', attachments[c][0]);
            }
          });
        }

        if (data && !attachments) {
          request.send(data);
        }

        if (handleProgress) {
          request.on('progress', handleProgress);
        }

        if (getBackRequest) {
          getBackRequest(request);
        }

        request.end((err, res = {}) => {
          if (res) {
            const { header } = res;
            if (!!header && header.uid && header.client && header.expiry && header['access-token']) {
              const now = header.expiry ? new Date(header.expiry * 1000) : 'session';
              cookie.save('uid', header.uid, { path: '/', expires: now });
              cookie.save('client', header.client, { path: '/', expires: now });
              cookie.save('access-token', header['access-token'], { path: '/', expires: now });
            }
          }
          // return err ? reject(err, res.body, request.xhr) : resolve(res.body, request.xhr);
          if (err) {
            return reject({body: res.body, status: res.status}, err, request.xhr);
          }
          return resolve(res.body, request.xhr);
        });
      });
    });
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
