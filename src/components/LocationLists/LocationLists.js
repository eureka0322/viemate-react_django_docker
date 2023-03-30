import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import cookie from 'react-cookie';
import {} from './LocationLists.scss';
import { Form } from 'elements';
import { saveLocation, clearPrefix } from 'redux/modules/location';
import locations from 'utils/available_cities';

const saveCookie = (str) => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  cookie.save('chosen_location', str, { path: '/', expire: d });
};

const handleClick = (location, props) => {
  saveCookie(location);
  props.saveLocation(location);
  props.closeModal();

  if (props.prefix) {
    props.pushState(props.prefix + location);
    props.clearPrefix();
  }
};

const LocationLists = (props) => {
  return (
    <div className="location container container--base-width">
      <div className="location__title">Choose a city</div>
      <ul className="list-unstyled location__lists">
        {locations.map((c, i) =>
          <li className="location__item" key={i}>
            <Form.Button
              className="form-button--base-link form-button--location"
              type="button"
              onClick={() => handleClick(c.value, props)}
            >
              <span>
                {c.label}
              </span>
            </Form.Button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default connect(
  state => ({
    prefix: state.location.prefix
  }), {
    pushState: push,
    saveLocation,
    clearPrefix
  }
)(LocationLists);
