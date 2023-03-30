import React, { Component, PropTypes } from 'react';
import {} from './MapForm.scss';
import { Form } from 'elements';
import { reduxForm, Field } from 'redux-form';

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

@reduxForm({
  form: 'form-map',
  // enableReinitialize: true
})
export default class MapForm extends Component {
  static propTypes = {
    travel_mode: PropTypes.string,
    travel_time: PropTypes.string,
    change: PropTypes.func,
    setParams: PropTypes.func,
    clearDirections: PropTypes.func,
    submitting: PropTypes.bool.isRequired,
    directions_loading: PropTypes.bool,
    pointB: PropTypes.object
  };

  render() {
    const { submitting, change, travel_mode, travel_time, setParams, directions_loading, clearDirections, pointB } = this.props;

    return (
      <form className="map-form" action="" method="post">
        <div className="map-form__item">
          <Field
            classNameInput="input input--map-location input--map-location-dark"
            disabled={submitting}
            name="cur_location"
            type="text"
            component={renderInput}
            placeholder="From the red circle"
            readOnly
          />
        </div>
        <div className="map-form__separator" />
        <div className="map-form__item map-form__item-icon">
          <Form.MapAutocomplete
            classNameInput="input input--map-location input--map-location-icon"
            name="next_location"
            type="text"
            placeholder="To where..?"
            coordinatesName="coordinates_pointB"
            changeForm={change}
            disableChangeCoordinates
            clearBtn
            clearBtnClassName="form-clear-autocomplete"
            clearDirections={clearDirections}
          />
        </div>
        {!!pointB &&
          <div className="map-form__nav">
            <Form.Button
              className={'form-button--clear form-button--directions-loader' + (travel_mode === 'DRIVING' ? ' is-active' : '') + (directions_loading ? ' form-button--directions-loading' : '')}
              type="button"
              onClick={() => setParams({travel_mode: 'DRIVING'})}
            >
              <span className="map-form__icon-wrap">
                <i className="icon icon--car" />
                <i className="icon icon--car-active icon-active" />
                {(travel_mode === 'DRIVING' && travel_time) ?
                  <span className="time">{travel_time}</span> : <span className="time">&mdash;</span>}
              </span>
            </Form.Button>
            <Form.Button
              className={'form-button--clear form-button--directions-loader' + (travel_mode === 'TRANSIT' ? ' is-active' : '') + (directions_loading ? ' form-button--directions-loading' : '')}
              type="button"
              onClick={() => setParams({travel_mode: 'TRANSIT'})}
            >
              <span className="map-form__icon-wrap">
                <i className="icon icon--bus" />
                <i className="icon icon--bus-active icon-active" />
                {(travel_mode === 'TRANSIT' && travel_time) ?
                  <span className="time">{travel_time}</span> : <span className="time">&mdash;</span>}
              </span>
            </Form.Button>
            <Form.Button
              className={'form-button--clear form-button--directions-loader' + (travel_mode === 'WALKING' ? ' is-active' : '') + (directions_loading ? ' form-button--directions-loading' : '')}
              type="button"
              onClick={() => setParams({travel_mode: 'WALKING'})}
            >
              <span className="map-form__icon-wrap">
                <i className="icon icon--man" />
                <i className="icon icon--man-active icon-active" />
                {(travel_mode === 'WALKING' && travel_time) ?
                  <span className="time">{travel_time}</span> : <span className="time">&mdash;</span>}
              </span>
            </Form.Button>
            <Form.Button
              className={'form-button--clear form-button--directions-loader' + (travel_mode === 'BICYCLING' ? ' is-active' : '') + (directions_loading ? ' form-button--directions-loading' : '')}
              type="button"
              onClick={() => setParams({travel_mode: 'BICYCLING'})}
            >
              <span className="map-form__icon-wrap">
                <i className="icon icon--bicycle" />
                <i className="icon icon--bicycle-active icon-active" />
                {(travel_mode === 'BICYCLING' && travel_time) ?
                  <span className="time">{travel_time}</span> : <span className="time">&mdash;</span>}
              </span>
            </Form.Button>
          </div>}
      </form>
    );
  }
}
