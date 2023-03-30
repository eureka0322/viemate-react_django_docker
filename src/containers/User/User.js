import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-connect';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import config from 'config';
import {} from './User.scss';
import { User as UserComponent, ErrorPage } from 'components';
import { DisableComponent } from 'elements';
import { setBodyClassname } from 'utils/helpers';
import { load } from 'redux/modules/product';
import { saveLocation } from 'redux/modules/location';
import { replace } from 'react-router-redux';
import { showDefault } from 'redux/modules/notifications';

@asyncConnect([{
  promise: ({ params, store: { dispatch, getState }}) => {
    const promises = [];
    const state = getState();
    if (!state.product.loaded || params.id !== state.product.product.id) {
      promises.push(dispatch(load(params.id)));
    }
    return Promise.all(promises);
  }
}])
@connect((st) => ({
  error: st.product.error,
  chosen_location: st.location.location,
  product: st.product.product,
}), {
  replace,
  saveLocation,
  showDefault,
})
export default class User extends Component {
  static propTypes = {
    product: PropTypes.object,
    error: PropTypes.object,
    params: PropTypes.object,
    replace: PropTypes.func,
    saveLocation: PropTypes.func,
    chosen_location: PropTypes.string,
    // showDefault: PropTypes.func,
  }

  componentWillMount() {
    this.changeLocation(this.props);
    if (this.props.error || (!this.props.product || !this.props.product.id)) {
      const geo_location = this.props.chosen_location || `${this.props.params.city}--${this.props.params.state}--${this.props.params.country}`;
      this.props.replace(`/apartments/${geo_location}?post_sold=true`);
    }
  }

  componentDidMount() {
    setBodyClassname('body-user');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params !== nextProps.params) {
      this.changeLocation(nextProps);
    }
  }

  changeLocation(props) {
    const {params: {city, country, state}/*, error, chosen_location*/} = props;
    if (city && state && country) {
      this.props.saveLocation(`${city}--${state}--${country}`);
    }
    // if (error) {
    //   let location = 'Boston--MA--United-States';
    //   if (city && state && country) {
    //     location = `${city}--${state}--${country}`;
    //   } else if (chosen_location) {
    //     location = chosen_location;
    //   }
    //   this.props.showDefault('post_sold');
    //   this.props.replace(`/wanted-apartments/${location}`);
    // }
  }

  render() {
    const {product} = this.props;
    if ((product && product.post_type === 'offered')) {
      return (
        <div>
          <ErrorPage />
        </div>
      );
    }
    return (
      <div>
        <Helmet {...config.app.head} />
        <div className="container--default-width container user">
          {(!this.props.product || !this.props.product.id) && <DisableComponent.Footer />}
          {!!this.props.product && !!this.props.product.id && <UserComponent />}
        </div>
      </div>
    );
  }
}
