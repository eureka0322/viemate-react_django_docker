import React, { Component } from 'react';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import config from 'config';
import { FormWantedPostEdit as FormWantedPostEditComponent } from 'components';
import { load } from 'redux/modules/product';
import { setBodyClassname } from 'utils/helpers';

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState } }) => {
    const promises = [];
    const state = getState();
    if (!state.product.loaded) {
      promises.push(dispatch(load(params.id)));
    }
    return Promise.all(promises);
  }
}])
export default class EditWantedPost extends Component {
  componentDidMount() {
    setBodyClassname('body-settings');
  }

  render() {
    return (
      <div className="container--full-width container post-edit post-edit__container">
        <Helmet {...config.app.head} />
        <div className="post-edit__header">Edit your post</div>
        <div className="container container--xs-width">
          <FormWantedPostEditComponent {...this.props} />
        </div>
      </div>
    );
  }
}
