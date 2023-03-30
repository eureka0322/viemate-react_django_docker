import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { initializeJumio } from 'redux/modules/profile';
import { Loader } from 'elements';

@connect(state => ({
  user: state.auth.user,
  jumio_initializing: state.profile.jumio_initializing,
  jumio_token: state.profile.jumio_token,
}), {
  initializeJumio
})
export default class VerifyComponent extends Component {
  static propTypes = {
    user: PropTypes.object,
    // jumio_initializing: PropTypes.bool,
    // jumio_token: PropTypes.string,
    initializeJumio: PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      loading: true
    };
    this.initializeJumio = ::this.initializeJumio;
  }

  componentDidMount() {
    if (window.JumioClient) {
      this.initializeJumio();
    }
  }

  componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  initializeJumio() {
    this.props.initializeJumio(this.props.user.id).then(r => {
      window.JumioClient.setVars({ authorizationToken: r.authorizationToken, responsiveLayout: true }).initVerify('verify_container');
      this._timeout = setTimeout(() => this.setState({loading: false}), 2100);
    });
  }

  render() {
    return (
      <div className="container container--medium-width container--verify">
        <div className="setting-header setting-header--extra-space">
          <h1 className="setting-header__title setting-header__title--jumio-grey ">Verify your ID</h1>
        </div>
        <div id="verify_container" className="settings__document">
          {this.state.loading && <Loader bgWhite absolute className="settings__jumio-loader" />}
        </div>
      </div>
    );
  }
}
