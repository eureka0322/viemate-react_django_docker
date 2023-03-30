import React, { Component, PropTypes } from 'react';
import {} from './MessageListTitle.scss';
import { Form } from 'elements';
import { Link } from 'react-router';

export default class MessageListTitle extends Component {
  static propTypes = {
    titleList: PropTypes.string,
    conv_id: PropTypes.number,
    onDelete: PropTypes.func,
    isMobile: PropTypes.bool,
  };

  render() {
    const { titleList, conv_id, onDelete, isMobile } = this.props;
    return (
      <div className="message-header">
        {isMobile ?
          <Link className="message-title__item message-title__item--back" to="/messages">
            <i className="icon icon--arrow-back" />
            <span>Back to Listing</span>
          </Link>
          :
          <div className="message-header__title text-cutting">
            { titleList }
          </div>
        }
        <div className="message-header__btn-delete">
          <Form.Button
            onClick={conv_id ? () => onDelete(conv_id) : () => {}}
            className="form-button--clear"
            disabled={false}
            type="button"
          >
            <span><i className="icon icon--delete" /></span>
          </Form.Button>
        </div>
      </div>
    );
  }
}
