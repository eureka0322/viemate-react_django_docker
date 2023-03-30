import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import {} from './Loader.scss';

export default class Loader extends Component {
  static propTypes = {
    absolute: PropTypes.bool,
    bgWhite: PropTypes.bool,
    className: PropTypes.string,
  };

  render() {
    return (
      <div
        className={
          classNames('loader', {'loader--absolute': this.props.absolute}, {'loader--bg-white': this.props.bgWhite}, {[this.props.className]: !!this.props.className})
        }
      >
        <div className="loader__list">
          <div className="loader__dot-item" />
          <div className="loader__dot-item" />
          <div className="loader__dot-item" />
        </div>
      </div>
    );
  }
}
