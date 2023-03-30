import React, { Component, PropTypes } from 'react';
import { Avatar } from 'elements';
import { Link } from 'react-router';

export default class MessageListItem extends Component {
  static propTypes = {
    className: PropTypes.string,
    content: PropTypes.string,
    timeMessage: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  render() {
    const { className, content, timeMessage } = this.props;
    return (
      <li className="message-list__item">
        <Link className="message-list__avatar" to="/user">
          <span className="avatar-wrapper avatar-wrapper--md"><Avatar /></span>
        </Link>
        <div className={`message-list__content ${className}`}>
          <p className="">{ content }</p>
          <span className="time-message">{timeMessage}</span>
        </div>
      </li>
    );
  }
}
