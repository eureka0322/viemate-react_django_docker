import React, { PropTypes } from 'react';
import {} from './ProductTags.scss';

const ProductTags = props => {
  const { titleTag, tags } = props;

  return (
    <div className="product-tags">
      <h4 className="product-tags__title">{titleTag}</h4>
      <ul className="list-unstyled product-tags__list">
        {tags.map((c, i) =>
          <li key={i}>
            <span className="item-tag">{c}</span>
          </li>
        )}
      </ul>
    </div>
  );
};
ProductTags.propTypes = {
  titleTag: PropTypes.string,
  tags: PropTypes.array,
};

export default ProductTags;
