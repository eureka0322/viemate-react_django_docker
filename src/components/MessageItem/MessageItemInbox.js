import React, { Component, PropTypes } from 'react';
import {} from './MessageItem.scss';
import { Avatar } from 'elements';
import { Link } from 'react-router';

export default class MessageItemInbox extends Component {
  static propTypes = {
    author: PropTypes.object,
    className: PropTypes.string,
    content: PropTypes.string,
    timeMessage: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  render() {
    const { className, content, timeMessage, author } = this.props;
    return (
      <li className="message-item message-item--inbox">
        <Link className="message-item__avatar message-item__avatar--inbox" to={`/profile/${author.id}`}>
          <span className="avatar-wrapper avatar-wrapper--md"><Avatar img={author.avatar} /></span>
        </Link>
        <div className={`message-item__content message-item__content--inbox ${className}`}>
          <p className="text-content">{ content }</p>
          <span className="time-message">{timeMessage}</span>
        </div>
      </li>
    );
  }
}
