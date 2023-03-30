import React, { PropTypes } from 'react';
import { executionEnvironment } from 'utils/helpers';
import config from '../../config';

export default class FacebookLogin extends React.Component {
  static propTypes = {
    callback: PropTypes.func.isRequired,
    // appId: PropTypes.string.isRequired,
    // xfbml: PropTypes.bool,
    // cookie: PropTypes.bool,
    scope: PropTypes.string,
    // textButton: PropTypes.string,
    // autoLoad: PropTypes.bool,
    fields: PropTypes.string,
    className: PropTypes.string,
    // version: PropTypes.string,
    // language: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    appId: config.facebookAppId,
    // textButton: 'Facebook',
    scope: 'public_profile, email',
    // xfbml: true,
    // cookie: true,
    // fields: 'name',
    // version: '2.5',
    // language: 'en_US'
  };

  constructor(props) {
    super(props);
    this.executionEnvironment = executionEnvironment();
    // this.canUseDOM = this.executionEnvironment.canUseDOM;
  }

  // componentDidMount() {
  //   if (this.canUseDOM) {
  //     const fbRoot = document.createElement('div');
  //     fbRoot.id = 'fb-root';
  //     window.fbAsyncInit = () => {
  //       window.FB.init({
  //         appId: this.props.appId,
  //         xfbml: this.props.xfbml,
  //         cookie: this.props.cookie,
  //         version: 'v' + this.props.version
  //       });
  //       if (this.props.autoLoad) {
  //         window.FB.getLoginStatus(this.checkLoginState);
  //       }
  //     };
  //     /* eslint-disable func-names */
  //     (function(d, s, id, props) {
  //       if (!document.getElementById('facebook-jssdk')) {
  //         const element = d.getElementsByTagName(s)[0];
  //         const fjs = element;
  //         let js = element;
  //         if (d.getElementById(id)) {
  //           return;
  //         }
  //         js = d.createElement(s);
  //         js.id = id;
  //         js.src = '//connect.facebook.net/' + props.language + '/sdk.js';
  //         fjs.parentNode.insertBefore(js, fjs);
  //       }
  //     }(document, 'script', 'facebook-jssdk', this.props));
  //     /* eslint-enable func-names */
  //   }
  // }

  onClick = () => {
    if (window.FB && window.FB.login) {
      window.FB.login(this.checkLoginState, { scope: this.props.scope });
    }
  };

  checkLoginState = (response) => {
    if (response.authResponse) {
      this.responseApi(response.authResponse);
    }
  };

  responseApi = (authResponse) => {
    window.FB.api('/me', { fields: this.props.fields }, (me) => {
      console.log(me);
      me.accessToken = authResponse.accessToken;
      this.props.callback(me);
    });
  };

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
