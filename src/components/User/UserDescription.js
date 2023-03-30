import React, { Component, PropTypes } from 'react';
import {} from './UserDescription.scss';

export default class UserDescription extends Component {
  static propTypes = {
    descriptionUser: PropTypes.string
  };

  render() {
    const { descriptionUser } = this.props;
    return (
      <p className="user-description">
        {descriptionUser}
      </p>
    );
  }
}
