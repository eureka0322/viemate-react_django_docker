import React, {PropTypes} from 'react';
import {} from './AboutUs.scss';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { loadPage } from 'redux/modules/static_pages';

let AboutUs = ({page_content}) => {
  return (
    <div>
      <div className="static-banner">
        <div className="static-banner__wrapper">
          <div className="main-title main-title--capitalize">About us</div>
        </div>
      </div>
      <div className="about-content container container--md-extra-width" dangerouslySetInnerHTML={{__html: page_content.body}} />
    </div>
  );
};

AboutUs.propTypes = {
  page_content: PropTypes.object,
};

AboutUs = asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const state = getState();
    const promises = [];
    if (!state.static_pages.about_loaded) {
      promises.push(dispatch(loadPage('about')));
    }
    return Promise.all(promises);
  }
}])(AboutUs);

export default connect((st) => ({
  page_content: st.static_pages.about_page,
  page_error: st.static_pages.about_error,
}))(AboutUs);
