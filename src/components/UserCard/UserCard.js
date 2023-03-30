import React, { PropTypes } from 'react';
import {} from './UserCard.scss';
import { Link } from 'react-router';
import { Form } from 'elements';
import { detectOpenInNewTab, truncString, getDeviceType, truncateUserName } from 'utils/helpers';
import moment from 'moment';
import classNames from 'classnames';

function selectType(type) {
  switch (type) {
    case 'entire_apt':
      return 'Entire apartment';
    case 'private_room':
      return 'Private room';
    case 'shared_room':
      return 'Shared room';
    default:
      return '';
  }
}

function selectRentalType(type) {
  switch (type) {
    case 'entire_apt':
      return 'rental apartment';
    case 'private_room':
    case 'shared_room':
      return 'roommate';
    default:
      return '';
  }
}

function handleUserClick(e, onClick, id, address) {
  const newTab = getDeviceType() === 'mobile' ? true : detectOpenInNewTab(e);

  if (onClick && !newTab) {
    onClick(id, address);
    e.preventDefault();
  }
}

function UserCard(props) {
  const { onClick, id, owner, price, place_type, description, start_date, sendMessage, address, is_favorite, toggleFavorite, neighbourhood } = props;
  const splittedFullName = truncateUserName(owner.full_name, true);
  // const splittedFullName = owner.full_name.split(' ');

  return (
    <div className="user-card">
      <div className="user-card__panel-img">
        <div className="user-card__panel-links panel-links panel-links--top">
          <Form.Button
            className={classNames('form-button', 'form-button--clear', 'panel-links__like', {'is-active': is_favorite})}
            type="button"
            onClick={toggleFavorite}
          >
            <span>
              <i className="icon icon--like" />
              <i className="icon icon--like-full" />
            </span>
          </Form.Button>
        </div>
        <div className="user-card__panel-links panel-links panel-links--bottom">
          <div className="panel-links__btn">
            <button
              className="form-button form-button--circle form-button--message-w"
              onClick={sendMessage}
              disabled={false}
              type="button"
            >
            Message
            </button>
          </div>
        </div>
        <Link
          to={`/wanted-apartments/${address}/${id}`}
          className="user-card__media-cover"
          onClick={e => handleUserClick(e, onClick, id, address)}
        >
          {owner.avatar &&
            <img
              src={owner.avatar || ''}
              alt={`Tenant${owner.id} looking for ${selectRentalType(place_type)}${neighbourhood ? ` in ${neighbourhood}` : ''}`}
              title={`Tenant is looking for ${selectRentalType(place_type)}${neighbourhood ? ` in ${neighbourhood}` : ''}`}
            />
          }
        </Link>
      </div>
      <div className="user-card__caption">
        <span className="user-card__name">{splittedFullName + (owner.age ? `, ${owner.age}` : '')}</span>
        <ul className="list-unstyled user-details">
          <li className="user-details__item">
            <i className="icon icon--business" />
            <span className="user-details__item--text">{price}</span>
          </li>
          <li className="user-details__item">
            <i className="icon icon--calendar" />
            <span className="user-details__item--text"><span className="user-details--bold">from</span> {moment(start_date, 'YYYY-MM-DD').format('DD MMMM, YYYY')}</span>
          </li>
          <li className="user-details__item">
            <i className="icon icon--home" />
            <span className="user-details__item--text">{selectType(place_type)}</span>
          </li>
        </ul>
        <p className="user-card__description">{truncString(description, 100)}</p>
        {description && description.length > 100 && <Link to={`/wanted-apartments/${address}/${id}`} className="user-card__trigger-more">Read more</Link>}
      </div>
    </div>
  );
}
UserCard.propTypes = {
  onClick: PropTypes.func,
  sendMessage: PropTypes.func,
  owner: PropTypes.object,
  price: PropTypes.string,
  place_type: PropTypes.string,
  description: PropTypes.string,
  start_date: PropTypes.string,
  address: PropTypes.string,
  neighbourhood: PropTypes.string,
  id: PropTypes.number,
  toggleFavorite: PropTypes.func,
  is_favorite: PropTypes.bool,
};
UserCard.defaultProps = {
  owner: {}
};

export default UserCard;
