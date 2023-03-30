import React, { Component, PropTypes } from 'react';
import {} from './ProductDescription.scss';

export default class Description extends Component {
  static propTypes = {
    descriptionProduct: PropTypes.string
  };

  render() {
    const { descriptionProduct } = this.props;
    return (
      <div className="product-description">
        {descriptionProduct}
      </div>
    );
  }
}
