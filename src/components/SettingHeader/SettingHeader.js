import React, { Component, PropTypes } from 'react';
import {} from './SettingHeader.scss';

export default class SettingHeader extends Component {
  static propTypes = {
    title: PropTypes.any,
    subtitle: PropTypes.string,
    className: PropTypes.string
  };

  render() {
    const { title, subtitle, className } = this.props;
    return (
      <div className={'setting-header' + (className ? ` ${className}` : '')}>
        <h1 className="setting-header__title">{title}</h1>
        <h2 className="setting-header__subtitle">{subtitle}</h2>
      </div>
    );
  }
}
