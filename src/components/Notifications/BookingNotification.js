import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { Avatar } from 'elements';
import { truncateUserName } from 'utils/helpers';

const renderText = (type, sender, booking) => {
  switch (type) {
    case 'pended':
      return <span>{`${truncateUserName(sender.full_name, true)} applied to your place`}</span>;
    case 'approved':
      return <span>{`${truncateUserName(sender.full_name, true)} approved your application`}</span>;
    case 'declined':
      return <span>{`${truncateUserName(sender.full_name, true)} declined your application`}</span>;
    case 'canceled':
      return <span>{`${truncateUserName(sender.full_name, true)} cancelled renting your place`}</span>;
    case 'expired':
      return <span>{`Application No ${booking.bid} is expired `}</span>;
    case 'paid':
      return <span>{`${truncateUserName(sender.full_name, true)} paid the rent`}</span>;
    default:
      return <span />;
  }
};

/*eslint-disable*/
const BookingNotification = ({item, user}) => {
  return (
    <li
      className={
        classNames('notification__item', {'is-active': !item.read})
      }
    >
      <Link to="/profile/payments/requests">
        <span className="avatar-wrapper avatar-wrapper--extra-xs"><Avatar img={item.sender.avatar} /></span>
        <p className="notification__user-activity">
          {renderText(item.booking_status, item.sender, item.booking, user)}
        </p>
      </Link>
    </li>
  );
};

BookingNotification.propTypes = {
  item: PropTypes.object,
  user: PropTypes.object,
};

export default BookingNotification;
