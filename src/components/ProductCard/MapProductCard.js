import React, { Component, PropTypes } from 'react';
import { ProductCard } from 'components';

export default class MapProductCard extends Component {
  static propTypes = {
    handleBoxClose: PropTypes.func,
  };

  constructor() {
    super();
    this.closeBox = ::this.closeBox;
    this.moveBox = ::this.moveBox;
  }

  componentDidMount() {
    document.addEventListener('ontouchend' in window ? 'touchend' : 'click', this.closeBox);
    // document.addEventListener('touchmove', this.moveBox);
  }

  componentWillUnmount() {
    document.removeEventListener('ontouchend' in window ? 'touchend' : 'click', this.closeBox);
    // document.removeEventListener('touchmove', this.moveBox);
  }

  moveBox(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  closeBox(e) {
    if (!this._infobox.contains(e.target)) {
      this.props.handleBoxClose();
    }
  }

  render() {
    return (
      <div className="map-infobox" id="map-infobox" ref={n => this._infobox = n}>
        <ProductCard {...this.props} />
      </div>
    );
  }
}
