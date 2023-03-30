import React, { PropTypes, Component } from 'react';
import { executionEnvironment } from 'utils/helpers';
import config from '../../config';

export default class GoogleLogin extends Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    appId: PropTypes.string.isRequired,
    // buttonText: PropTypes.string,
    offline: PropTypes.bool,
    scope: PropTypes.string,
    className: PropTypes.string,
    redirectUri: PropTypes.string,
    cookiePolicy: PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    appId: config.googleClientId,
    buttonText: 'Google',
    scope: 'profile email',
    redirectUri: 'postmessage',
    cookiePolicy: 'single_host_origin'
  };

  constructor(props) {
    super(props);
    this.executionEnvironment = executionEnvironment();
    this.canUseDOM = this.executionEnvironment.canUseDOM;
    this.onClick = ::this.onClick;
  }

  componentDidMount() {
    if (this.canUseDOM) {
      const { appId, scope, cookiePolicy } = this.props;
      /* eslint-disable func-names */
      (function (d, s, id, cb) {
        if (!document.getElementById('google-login')) {
          const element = d.getElementsByTagName(s)[0];
          const fjs = element;
          let js = element;
          js = d.createElement(s);
          js.id = id;
          js.src = '//apis.google.com/js/platform.js';
          fjs.parentNode.insertBefore(js, fjs);
          js.onload = cb;
        }
      }(document, 'script', 'google-login', () => {
        const params = {
          client_id: appId,
          cookiepolicy: cookiePolicy,
          scope
        };
        window.gapi.load('auth2', () => {
          window.gapi.auth2.init(params);
        });
      }));
      /* eslint-enable func-names */
    }
  }

  onClick() {
    const auth2 = window.gapi.auth2.getAuthInstance();
    const { offline, redirectUri, callback } = this.props;
    if (offline) {
      const options = {
        redirect_uri: redirectUri
      };
      auth2.grantOfflineAccess(options)
        .then((data) => {
          callback(data);
        });
    } else {
      auth2.signIn()
        .then((response) => {
          callback(response);
        });
    }
  }

  render() {
    const { className, children } = this.props;
    return (
      <button
        className={'form-button ' + (className ? className : '')} //eslint-disable-line
        onClick={this.onClick}
      >
        {children}
      </button>
    );
  }
}
