import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import config from 'config';
import { AuthModal } from 'components';
// import {} from './SignUp.scss';

export default class SignUp extends Component {
  static propTypes = {
    location: PropTypes.object,
  };

  render() {
    const {location} = this.props;
    return (
      <div>
        <Helmet {...config.app.head}
          title="Viemate SignIn / SignUp"
        />
        <div className="container sign-up__container">
          <AuthModal not_modal callbackUrl={(!!location && !!location.query && location.query.callbackUrl) || '/'} />
        </div>
      </div>
    );
  }
}
