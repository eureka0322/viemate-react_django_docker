import React, { Component, PropTypes } from 'react';
import {} from './MessageTitle.scss';

export default class MessageTitle extends Component {
  static propTypes = {
    countMessage: PropTypes.number
  };

  render() {
    const { countMessage } = this.props;
    return (
      <div className="message-title table">
        <div className="table__cell">
          <div className="message-title__item message-title__item--inbox">
            <span>Inbox</span>
            <span className="message-title--separator">|</span>
            <span>{countMessage}</span>
          </div>
        </div>
        <div className="table__cell" />
      </div>
    );
  }
}
