import React, { PropTypes } from 'react';
import {} from './BannerBottom.scss';
import { Link } from 'elements';

const BannerBottom = (props) => {
  const { title, description } = props;

  return (
    <div className="banner-bottom">
      <div className="banner-bottom__container banner-bottom__container--bg" />
      <div className="banner-bottom__content container container--lg-width">
        <div className="banner-bottom__table">
          <div className="banner-bottom__content-wrapper">
            <div className="banner-bottom__content-container lazyload">
              <span className="banner-bottom__static-title lazyload">Looking for somewhere new to rent?</span>
              <h1 className="banner-bottom__title lazyload">{title}</h1>
              <p className="banner-bottom__description lazyload">{description}</p>
              <Link to="/apartments/{{location}}"
                className="form-button form-button--circle form-button--pink form-button--full-width form-button--view-places lazyload"
                onClick={e => props.handleLocation(e, '/apartments/')}
              >
                <span>
                  View Offered places
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
BannerBottom.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  handleLocation: PropTypes.func
};

export default BannerBottom;
