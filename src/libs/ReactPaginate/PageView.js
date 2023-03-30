'use strict';

import React from 'react';
import { Link } from 'react-router';

export default class PageView extends React.Component {
  render() {
    const {pageLinkClassName, pageClassName, page, ...rest} = this.props;
    let linkClassName = pageLinkClassName;
    let cssClassName = pageClassName;

    if (this.props.selected) {
      if (typeof(cssClassName) !== 'undefined') {
        cssClassName = cssClassName + ' ' + this.props.activeClassName;
      } else {
        cssClassName = this.props.activeClassName;
      }
    }

    return (
        <li className={cssClassName}>
            <Link {...rest} className={linkClassName}>
              {page}
            </Link>
        </li>
    );
  }
};
