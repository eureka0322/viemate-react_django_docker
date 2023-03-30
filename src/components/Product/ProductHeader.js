import React, { PropTypes } from 'react';
import {} from './ProductHeader.scss';
import { Form } from 'elements';
import classNames from 'classnames';

const ProductHeader = props => {
  const { header, price, rentalPeriod, typeBill, is_favorite, toggleFavorite } = props;

  return (
    <div className="product-header">
      <div className="product-header__preview">Preview</div>
      <div className="product-header__wrapper">
        <div className="product-header--left">
          <h1 className="product-header__location">
            {header}
          </h1>
          <h2 className="product-header__price-details">
            <span className="type-bill">{typeBill}</span>
            <span>{price}</span>
            <span className="rental-period"> {rentalPeriod}</span>
          </h2>
        </div>
        <Form.Button
          className={classNames('form-button', 'form-button--clear', 'product-header__icon-like', {'is-active': is_favorite})}
          type="button"
          onClick={toggleFavorite}
        >
          <span>
            <i className="icon icon--like-grey" />
            <i className="icon icon--like-full-1" />
          </span>
        </Form.Button>
      </div>
    </div>
  );
};
ProductHeader.propTypes = {
  header: PropTypes.string,
  price: PropTypes.string,
  rentalPeriod: PropTypes.string,
  typeBill: PropTypes.string,
  is_favorite: PropTypes.bool,
  toggleFavorite: PropTypes.func,
};

export default ProductHeader;
