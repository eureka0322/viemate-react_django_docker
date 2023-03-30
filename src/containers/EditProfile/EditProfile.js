import React, { Component } from 'react';
import Helmet from 'react-helmet';
import config from 'config';
import { FormEditProfile as FormEditProfileComponent } from 'components';

export default class EditProfile extends Component {

  render() {
    return (
      <div>
        <Helmet {...config.app.head} />
        <FormEditProfileComponent {...this.props} />
      </div>
    );
  }
}
