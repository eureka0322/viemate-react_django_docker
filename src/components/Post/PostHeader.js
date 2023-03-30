import React, { Component, PropTypes } from 'react';
import {} from './PostHeader.scss';

export default class PostHeader extends Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  render() {
    const { className, title, subtitle } = this.props;
    return (
      <div className="post-header">
        <div className="post-header__icon hidden">
          <i className={`icon ${className}`} />
        </div>
        <div className="post-header__title">{title}</div>
        <div className="post-header__subtitle">{subtitle}</div>
      </div>
    );
  }
}
