import React, { Component, PropTypes } from 'react';
import {} from './Avatar.scss';

export default class Avatar extends Component {

  static propTypes = {
    className: PropTypes.string,
    img: PropTypes.any,
    overlay: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    img: '',
    overlay: false,
  };
  /* eslint-disable */
  render() {
    const { className, img, overlay, ...rest } = this.props;
    return (
      <div {...rest} className={`avatar ${className} ` + (!img ? 'avatar--empty ' : '')} style={ img ? { backgroundImage: `url(${img})` } : { } }>
        {overlay &&
          <div className="avatar__overlay">
            <i className="icon icon--plus-circle" />
          </div>
        }
      </div>
    );
  }
}
