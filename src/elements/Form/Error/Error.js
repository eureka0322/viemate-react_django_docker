import React, { Component, PropTypes } from 'react';
import {} from './Error.scss';

export default class Error extends Component {
  static propTypes = {
    className: PropTypes.string,
    message: PropTypes.string.isRequired
  };

  static defaultProps = {
    className: ''
  }

  render() {
    const { className, message } = this.props;
    return (
      <div>
        {message !== '' &&
          <div className={'form-error help-block' + className}>
            {message}
          </div>}
      </div>
    );
  }
}
