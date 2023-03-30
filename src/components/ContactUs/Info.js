import React, {PropTypes} from 'react';
import {} from './Info.scss';

/*eslint-disable*/
const Info = ({user, showAuth}) => {
  return (
    <div>
      <div className="info-box info-box--hign-space">
        <i className="icon icon--twitter-gray info-box__icon" />
        <div className="info-box__content">
          For a quick response reach us through Twitter
          <a href="https://twitter.com/viemate" target="_blank" className="info-box__item-link info-box__item-link--default">
            <span> @viemate </span>
          </a>
        </div>
      </div>
      <div className="info-box info-box--mid-space">
        <i className="icon icon--email-gray info-box__icon"/>
        <div className="info-box__content info-box__content--go-right">
          <p className="info-box__text-box">Good old-fashioned emails and forms work too, but may take up to 24 hours for us to get back to you.</p>
          {user && <div className="info-box__title">Email us at:</div>}
          {user &&
            <a href="mailto:support@viemate.com" className="info-box__item-link info-box__item-link--black">
              support@viemate.com
            </a>
          }
        </div>
        {!user &&
          <div className="info-box__sign_in">
            <button
              className="form-button form-button--pink form-button--circle form-button--send-sm info-box__sign_in--btn"
              onClick={showAuth}
              type="button"
            >
              Sign in
            </button>
          </div>
        }

      </div>
    </div>
  );
};

Info.propTypes = {
  user: PropTypes.object,
  showAuth: PropTypes.func,
};

export default Info;
