import React, { Component, PropTypes } from 'react';
import {} from './LoaderImage.scss';

export default class LoaderImage extends Component {
  static propTypes = {
    progress: PropTypes.number
  };

  static defaultProps = {
    progress: 100
  };

  render() {
    return (
      <div className="loader-img">
        <div className="loader-img__container">
          <div className="loader-img__container-wrap">
            <div className="loader-img__wrapper">
              <div className="loader-img__title">Uploading your photo</div>
              <div className="progress progress--md">
                <div className="progress-bar progress-bar--pink" style={{width: `${this.props.progress}%`}} />
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

