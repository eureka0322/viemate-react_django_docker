import React, { PropTypes } from 'react';
import {} from './ProductCard.scss';
import { Avatar, Form, Link } from 'elements';
import { detectOpenInNewTab, getDeviceType, truncateUserName } from 'utils/helpers';
import moment from 'moment';
import classNames from 'classnames';

let marker;
let markerParent;

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

function selectLeaseTypes(product) {
  const arr = [];
  const lTypes = {
    lease_type_temporary: 'Temporary sublet',
    lease_type_take_over: 'Lease takeover'
  };

  Object.keys(lTypes).forEach(c => product[c] ? arr.push(lTypes[c]) : c);
  return arr;
}

function handleProductClick(e, onClick, id, highlightMarkers, addViewedPost, status, type, address) {
  const newTab = getDeviceType() === 'mobile' ? true : detectOpenInNewTab(e);

  if (onClick && !newTab) {
    // if (highlightMarkers) {
    //   // marker = document.querySelector(`.map-marker-${id}`);
    //   // if (marker) marker.classList.add('map-marker--viewed');
    //   addViewedPost(id);
    // }

    onClick(id, address, status, type);
    e.preventDefault();
  }
}

function handleUserClick(e, toggleUserModal, owner) {
  const newTab = getDeviceType() === 'mobile' ? true : detectOpenInNewTab(e);

  if (toggleUserModal && !newTab) {
    toggleUserModal((!!owner && owner.id) || 0);
    e.preventDefault();
  }
}

function handleMouseEnter(id) {
  marker = document.querySelector(`.map-marker-${id}`);
  if (marker) {
    markerParent = marker.parentElement.parentElement;
    marker.classList.add('map-marker--hovered');
    if (markerParent) markerParent.style.zIndex = 1;
  }
}

function handleMouseLeave() {
  if (marker) {
    marker.classList.remove('map-marker--hovered');
    if (markerParent) markerParent.style.zIndex = '';
  }
}

const ProductCard = props => {
  const { info, onClick, toggleUserModal, highlightMarkers, activate, setStatus, activation_loading, user, is_favorite, toggleFavorite, addViewedPost, hiddenAvatarLink, toggleFeedbackModal } = props;
  const { id, attachments, place_type, price, start_date, owner, status, post_type, address, neighbourhood } = info;
  const ownerOrAdmin = user && owner && (user.id === owner.id || user.admin);
  const lease_types = selectLeaseTypes(info);

  return (
    <div
      className="product-card"
      {...(highlightMarkers ? {onMouseEnter: () => handleMouseEnter(id)} : {})}
      {...(highlightMarkers ? {onMouseLeave: handleMouseLeave} : {})}
    >
      {ownerOrAdmin &&
        <div className="product-card__btn-groups">
          {(status === 'inactivated' || status === 'initialization') &&
            <Form.Button
              className={'form-button form-button--user-action form-button--circle form-button--pink form-button--loader' + (activation_loading ? ' form-button--loading' : '')}
              type="button"
              disabled={activation_loading}
              onClick={() => {
                activate(id, post_type)
                  .then((r) => setStatus(r.post, 'published'))
                  .catch(err => console.log(err));
              }}
            >
              <span>Activate</span>
            </Form.Button>}
          {status === 'published' &&
            <Form.Button
              className={'form-button form-button--user-action form-button--circle form-button--extra-grey form-button--loader' + (activation_loading ? ' form-button--loading' : '')}
              type="button"
              disabled={activation_loading}
              onClick={() => {
                // deactivate(id)
                //   .then((r) => setStatus(r.post, 'inactivated'))
                //   .catch(err => console.log(err));
                toggleFeedbackModal(id);
              }}
            >
              <span>Deactivate</span>
          </Form.Button>}
          <Link
            className="form-button form-button--user-action form-button--default-dark form-button--circle"
            to={post_type === 'wanted' ? `/wanted-post/${id}` : `/offered-post/${id}`}
          >
            <span>Edit</span>
          </Link>
        </div>}
      <div className="product-card__panel-img">
        <Link
          to={post_type === 'wanted' ? `/wanted-apartments/{{location}}/${id}` : `/apartments/{{location}}/${id}`}
          className="product-card__media-cover"
          onClick={e => handleProductClick(e, onClick, id, highlightMarkers, addViewedPost, status, post_type, address)}
        >
          {!!attachments && !!attachments.length && post_type !== 'wanted' &&
            <img
              src={attachments[0].urls.small}
              srcSet={`${attachments[0].urls.small} 1x, ${attachments[0].urls.medium} 2x`}
              title={`${lease_types[0] || ''} for ${selectType(place_type)} in ${neighbourhood}`}
              alt={`${selectType(place_type)} for rent in ${neighbourhood}`}
              className={+attachments[0].image_height > +attachments[0].image_width ? 'img-vertical' : ''}
            />}
          {!!owner && post_type === 'wanted' &&
            <img src={owner.avatar}
              alt={truncateUserName(owner.full_name, true)}
            />}
        </Link>
      </div>
      <div className="product-card__properties">
        <div className="product-card__details">
          <span className="type-room">
            <span>{selectType(place_type)}</span>
            <span className="product-card__separator" />
            <span>{`${moment(start_date, 'YYYY-MM-DD').format('DD MMMM')}`}</span>
          </span>
          <span className="price">{`$${price}`}</span>
        </div>
        <div className="product-card__avatar">
          {!hiddenAvatarLink ?
            <Link
              to={`/profile/${(!!owner && owner.id) || 0}`}
              onClick={e => handleUserClick(e, toggleUserModal, owner)}
              className="avatar-wrapper avatar-wrapper--sm"
            >
              <Avatar img={!!owner && owner.avatar} />
            </Link> :
            <span className="avatar-wrapper avatar-wrapper--sm">
              <Avatar img={!!owner && owner.avatar} />
            </span>}
        </div>
      </div>
      <div className="panel-links panel-links--top">
        <Form.Button
          className={classNames('form-button', 'form-button--clear', 'panel-links__like', {'is-active': is_favorite})}
          onClick={toggleFavorite}
          type="button"
        >
          <i className="icon icon--like" />
          <i className="icon icon--like-full" />
        </Form.Button>
      </div>
    </div>
  );
};
ProductCard.propTypes = {
  onClick: PropTypes.func,
  toggleUserModal: PropTypes.func,
  activate: PropTypes.func,
  // deactivate: PropTypes.func,
  setStatus: PropTypes.func,
  toggleFavorite: PropTypes.func,
  addViewedPost: PropTypes.func,
  toggleFeedbackModal: PropTypes.func,
  info: PropTypes.object,
  user: PropTypes.object,
  highlightMarkers: PropTypes.bool,
  activation_loading: PropTypes.bool,
  is_favorite: PropTypes.bool,
  hiddenAvatarLink: PropTypes.bool
};
ProductCard.defaultProps = {
  image: '',
  addViewedPost: () => {},
};

export default ProductCard;
