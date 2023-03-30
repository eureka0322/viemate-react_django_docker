import React, { Component, PropTypes } from 'react';
const logo = require('./logo.svg');
const logoMobile = require('./logo-mobile.svg');
import {} from './Logo.scss';

export default class Logo extends Component {
  static propTypes = {
    className: PropTypes.string
  }

  render() {
    return (
      <span className="logo">
        <img src={logo} width="90" height="18" alt="Viemate" className="hidden-xs" />
        <img src={logoMobile} width="96" height="27" alt="Viemate" className="visible-xs" />
      </span>
    );
  }
}
