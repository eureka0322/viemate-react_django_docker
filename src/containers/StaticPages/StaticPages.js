import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import config from 'config';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import { Error404 } from 'containers';
import { loadPage } from 'redux/modules/static_pages';
import {} from './StaticPages.scss';
import { setBodyClassname } from 'utils/helpers';

@asyncConnect([{
  promise: ({ params, store: {dispatch, getState}}) => {
    const state = getState();
    const promises = [];
    if (!state.static_pages[`${params.page_name}_loaded`]) {
      promises.push(dispatch(loadPage(params.page_name)));
    }
    return Promise.all(promises);
  }
}])
@connect((st, props) => ({
  page_content: st.static_pages[`${props.params.page_name}_page`],
  page_error: st.static_pages[`${props.params.page_name}_error`],
}))
export default class StaticPage extends Component {
  static propTypes = {
    page_content: PropTypes.object,
    page_error: PropTypes.any,
  };

  componentDidMount() {
    setBodyClassname('');
  }

  render() {
    const {page_content, page_error} = this.props;
    if (page_error || !page_content) {
      return <Error404 />;
    }
    return (
      <div>
        <Helmet {...config.app.head}
          title="Viemate"
          meta={[
            {...page_content.description ? {name: 'description', content: page_content.description} : {}},
            {...page_content.keywords ? {name: 'keywords', content: page_content.keywords} : {}}
          ]}
        />
        <div className="static-banner">
          <div className="static-banner__wrapper">
            <div className="main-title main-title--capitalize">{page_content.title}</div>
          </div>
        </div>
        <div className="container container--md-extra-width container__static-page" dangerouslySetInnerHTML={{__html: page_content.body}} />
      </div>
    );
  }
}
