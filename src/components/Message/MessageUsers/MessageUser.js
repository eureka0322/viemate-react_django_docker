import React, { PropTypes } from 'react';
import {} from './MessageUser.scss';
import MessageUserItem from './MessageUserItem';
import classNames from 'classnames';
import moment from 'moment';

const MessageUser = ({list, active = 0, changeActive, onDelete, own_id, loading}) => {
  return (
    <div className="message-user">
      <ul className="message-user__lists list-unstyled">
        {list.map((c) => {
          const messages_class = classNames({
            'message-user__item--default': c.id !== active,
            'message-user__item--unread': c.id === active,
            'message-user__item--new': c.unread_messages > 0,
          });
          const users = c.users.users || c.users;
          const profile = users.find(user => user.id !== own_id) || {};
          return (
            <MessageUserItem
              key={c.id}
              className={messages_class}
              changeActive={(loading || c.id === active) ? () => {} : () => changeActive(c.id)}
              onDelete={loading ? () => {} : () => onDelete(c.id)}
              post={c.name}
              img={profile.avatar}
              u_id={profile.id}
              userName={profile.full_name}
              timePost={moment(c.created_at).format('DD MMM YYYY')}
            />);
        })}

      </ul>
    </div>
  );
};

MessageUser.propTypes = {
  list: PropTypes.array,
  active: PropTypes.number,
  own_id: PropTypes.number,
  changeActive: PropTypes.func,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
};

export default MessageUser;
