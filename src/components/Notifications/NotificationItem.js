import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { Avatar } from 'elements';
import { truncateUserName } from 'utils/helpers';

/*eslint-disable*/
const NotificationItem = ({item}) => {
  switch (item.post_type) {
    case 'offered':
      return (
        <li
          className={
            classNames('notification__item', {'is-active': !item.read})
          }
        >
          <span className="avatar-wrapper avatar-wrapper--extra-xs"><Avatar img={item.sender.avatar} /></span>
          <p className="notification__user-activity">
            <span>{`${truncateUserName(item.sender.full_name, true)} is offering `}</span>
            <Link to={`/apartments/${item.post.address}/${item.post.id}`}>a place</Link>
            <span>{` for you`}</span>
            <span className="notification__date">01 Oct 2016</span>
          </p>
        </li>
      );
    default:
      return (
        <li
          className={
            classNames('notification__item', {'is-active': !item.read})
          }
        >
          <span className="avatar-wrapper avatar-wrapper--extra-xs"><Avatar img={item.sender.avatar} /></span>
          <p className="notification__user-activity">
            <span>{`${truncateUserName(item.sender.full_name, true)} is `}</span>
            <Link to={`/wanted-apartments/${item.post.address}/${item.post.id}`}>looking for</Link>
            <span> a place like yours</span>
            <span className="notification__date">01 Oct 2016</span>
          </p>
        </li>
      );
  }
};

NotificationItem.propTypes = {
  item: PropTypes.object,
};

export default NotificationItem;
