import React, { PropTypes } from 'react';
import {} from './ProductOptions.scss';

const ProductOptions = props => {
  const { dateRentFrom, dateRentTo, furniture, leaseTypes, location, roomType, gender } = props;

  return (
    <ul className="list-unstyled product-options">
      <li className="product-options__item">
        <span className="product-options__title">From</span>
        <span className="product-options__option">
          <span className="product-options__date-from"><span className="product-options__date-from--bold">From</span> {dateRentFrom}</span>
          <span className="product-options__date-to"><span className="product-options__date-to--bold">To</span> {dateRentTo}</span>
        </span>
      </li>
      <li className="product-options__item">
        <span className="product-options__title">Property type</span>
        <span className="product-options__option">{roomType}</span>
      </li>
      <li className="product-options__item">
        <span className="product-options__title">Heighborhood</span>
        <span className="product-options__option">{location}</span>
      </li>
      <li className="product-options__item">
        <span className="product-options__title">Lease type</span>
        {leaseTypes.map((c, i) => <span key={i} className="product-options__option">{c}</span>)}
      </li>
      <li className="product-options__item">
        <span className="product-options__title">Furniture</span>
        <span className="product-options__option">{furniture}</span>
      </li>
      <li className="product-options__item">
        <span className="product-options__title">Gender</span>
        <span className="product-options__option">
          {gender}
        </span>
      </li>
      <li className="product-options__separator" />
    </ul>
  );
};
ProductOptions.propTypes = {
  dateRentFrom: PropTypes.string,
  dateRentTo: PropTypes.string,
  // gender: PropTypes.string,
  furniture: PropTypes.string,
  location: PropTypes.string,
  roomType: PropTypes.string,
  leaseTypes: PropTypes.array,
  gender: PropTypes.any
};

export default ProductOptions;
