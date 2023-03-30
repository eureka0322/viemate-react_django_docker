import React, { Component } from 'react';
import { VerifyComponent } from 'components';
import { setBodyClassname } from 'utils/helpers';

export default class VerifyContainer extends Component {
  componentDidMount() {
    setBodyClassname('body-settings');
  }

  render() {
    return (
      <div>
        <VerifyComponent />
      </div>
    );
  }
}
