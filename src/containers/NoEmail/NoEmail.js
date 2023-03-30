import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import config from 'config';
import { EmailModal } from 'components';
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
          title="Viemate Require Email"
        />
        <div className="container sign-up__container">
          <EmailModal not_modal callbackUrl={(!!location && !!location.query && location.query.callbackUrl) || '/'} />
        </div>
      </div>
    );
  }
}
