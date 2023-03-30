import React, { Component, PropTypes } from 'react';
import {} from './UserHeader.scss';
import { Form } from 'elements';
import classNames from 'classnames';

export default class UserHeader extends Component {
  static propTypes = {
    header: PropTypes.string,
    price: PropTypes.string,
    rentalPeriod: PropTypes.string,
    typeBill: PropTypes.string,
    is_favorite: PropTypes.bool,
    toggleFavorite: PropTypes.func,
  };

  render() {
    const { header, price, rentalPeriod, typeBill, toggleFavorite, is_favorite } = this.props;
    return (
      <div className="user-header">
        <div className="user-header--left">
          <h2 className="user-header__location">
            {header}
          </h2>
          <h3 className="user-header__price-details">
            <span className="type-bill">{typeBill}</span>
            <span>{price} </span>
            <span className="rental-period">Per {rentalPeriod}</span>
          </h3>
        </div>
        <Form.Button
          className={classNames('form-button', 'form-button--clear', 'user-header__icon-like', {'is-active': is_favorite})}
          type="button"
          onClick={toggleFavorite}
        >
          <span>
            <i className="icon icon--like-grey" />
            <i className="icon icon--like-full-1" />
          </span>
        </Form.Button>
      </div>
    );
  }
}
