import React, { Component, PropTypes } from 'react';
import { reduxForm, getFormValues, Field } from 'redux-form';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { Link } from 'react-router';
import { Form } from 'elements';
import { ErrorPage } from 'components';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { load, edit } from 'redux/modules/product';
import { showNotification } from 'redux/modules/notifications';
import validate from './validate';
import markerIcon from '../../../icons/svg/icon-marker.svg';
import mapStyles from 'components/Map/mapStyles.json';
import {} from './IncompletePost.scss';
import available_cities from 'utils/available_cities';

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

const renderSelectbox = field =>
  <Form.Selectbox
    field={field}
    {...field}
  />;

const RenderMap = withGoogleMap(props => (
  <GoogleMap
    defaultZoom={12}
    defaultCenter={props.defaultCenter}
    onClick={props.handleClick}
    options={{
      styles: mapStyles,
      clickableIcons: false,
      scrollwheel: false
    }}
  >
    {props.marker &&
      <Marker
        position={{ lat: props.marker.lat, lng: props.marker.lng }}
        draggable
        options={{
          icon: markerIcon,
          size: new google.maps.Size(26, 34), // eslint-disable-line
          zIndex: 1000
        }}
        onDragEnd={e => props.handleClick(e)}
      />
    }
  </GoogleMap>)
);
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
@connect(st => ({
  form_values: getFormValues('incomplete-post')(st) || {},
  product: st.product.product,
}), {
  edit,
  showNotification,
})
@reduxForm({
  form: 'incomplete-post',
  validate
})
export default class IncompletePost extends Component {
  static propTypes = {
    showNotification: PropTypes.func,
    edit: PropTypes.func,
    change: PropTypes.func,
    initialize: PropTypes.func,
    handleSubmit: PropTypes.func,
    form_values: PropTypes.object,
    product: PropTypes.object,
  };

  constructor() {
    super();
    this.onMapClick = ::this.onMapClick;
    this.handleSubmit = ::this.handleSubmit;
  }

  componentDidMount() {
    const {product} = this.props;
    if (product) {
      this.props.initialize({lat: product.latitude, lng: product.longitude, address: product.address});
    }
  }

  onMapClick(e) {
    this.props.change('lat', e.latLng.lat());
    this.props.change('lng', e.latLng.lng());
  }

  handleSubmit(data) {
    // console.log(data);
    this.props.edit({address: data.address, latitude: data.lat, longitude: data.lng, id: this.props.product.id}).then((r) => {
      this.props.showNotification('updated_post', {text: 'Updated', type: 'success'});
      return Promise.resolve(r);
    });
  }

  render() {
    const {form_values, handleSubmit, product} = this.props;
    if (!product || Object.keys(product).length === 0) {
      return (
        <div>
          <ErrorPage />
        </div>
      );
    }
    return (
      <div className="incomplete-post">
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <div>
            <ul className="list-unstyled incomplete-post__list">
              <li className="incomplete-post__list-item">
                <span className="incomplete-post__key">zipcode</span>
                <span className="incomplete-post__data">{product.zip_code}</span>
              </li>
              <li className="incomplete-post__list-item">
                <span className="incomplete-post__key">state</span>
                <span className="incomplete-post__data">{product.state}</span>
              </li>
              <li className="incomplete-post__list-item">
                <span className="incomplete-post__key">neighborhood</span>
                <span className="incomplete-post__data">{product.neighborhood}</span>
              </li>
              <li className="incomplete-post__list-item">
                <span className="incomplete-post__key">street name</span>
                <span className="incomplete-post__data">{product.street_name}</span>
              </li>
              <li className="incomplete-post__list-item">
                <span className="incomplete-post__key">unit num</span>
                <span className="incomplete-post__data">{product.street_unit}</span>
              </li>
            </ul>
            <div className="incomplete-post__full">{`${product.zip_code}, ${product.state}, ${product.neighbourhood}, ${product.street_name}, ${product.street_unit}, `}</div>
          </div>
          <div className="incomplete-post__fields">
            <div className="incomplete-post__field-item">
              <Field
                classNameInput="form-control input input--base"
                name="lat"
                type="text"
                component={renderInput}
                placeholder="Lat"
                label="Latitude"
              />
            </div>
            <div className="incomplete-post__field-item">
              <Field
                classNameInput="form-control input input--base"
                name="lng"
                type="text"
                component={renderInput}
                placeholder="Lng"
                label="Longitute"
              />
            </div>
            <div className="incomplete-post__field-item">
              <label htmlFor="form-input-address">Address</label>
              <Field
                name="address"
                list={available_cities}
                type="checkbox"
                placeholder="Address"
                component={renderSelectbox}
              />
            </div>
          </div>
          <div className="incomplete-post__map-wrap">
            <RenderMap
              containerElement={
                <div style={{ height: '500px' }} />
              }
              mapElement={
                <div className="map__inner" style={{ height: '500px' }} />
              }
              defaultCenter={{lat: 42.3600825, lng: -71.0588801}}
              handleClick={this.onMapClick}
              marker={{lat: parseFloat(form_values.lat), lng: parseFloat(form_values.lng)}}
            />
          </div>
          <div className="incomplete-post__btns">
            <Link className="form-button form-button form-button--card-action form-button--default-dark form-button--circle" to="/">Cancel</Link>
            <button className="form-button form-button form-button--capitalize form-button--card-action form-button--circle form-button--pink" type="submit">Save</button>
          </div>
        </form>
      </div>
    );
  }
}
