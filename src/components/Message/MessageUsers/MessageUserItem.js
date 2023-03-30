import React, { Component, PropTypes } from 'react';
import { Avatar, Form } from 'elements';
import { Link } from 'react-router';
import { truncateUserName } from 'utils/helpers';

export default class MessageUserItem extends Component {
  static propTypes = {
    className: PropTypes.string,
    timePost: PropTypes.string,
    changeActive: PropTypes.func,
    onDelete: PropTypes.func,
    userName: PropTypes.string,
    img: PropTypes.string,
    u_id: PropTypes.number,
  };

  static defaultProps = {
    className: ''
  };

  render() {
    const { className, timePost, userName, changeActive, onDelete, img, u_id } = this.props;
    return (
      <li className={`message-user__item ${className}`}>
        <div className="message-user__btn-delete">
          <Form.Button
            className="form-button--clear form-button--message-user"
            onClick={onDelete}
            disabled={false}
            type="button"
          >
            <span>
              <i className="icon icon--delete" />
              <i className="icon icon--delete-white" />
            </span>
          </Form.Button>
        </div>
        <div className="message-user__content" onClick={(e) => {e.preventDefault(); changeActive();}}>
          <div className="clearfix">
            <Link to={`/profile/${u_id}`} className="message-user__avatar">
              <span className="avatar-wrapper avatar-wrapper--xs"><Avatar img={img} /></span>
            </Link>
            <div className="message-user__details">
              <div className="message-user__post text-cutting">
                {truncateUserName(userName, true)}
              </div>
              <div className="message-user__user-data">
                <span>{timePost}</span>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}
