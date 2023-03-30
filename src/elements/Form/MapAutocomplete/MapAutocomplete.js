import React, { Component, PropTypes } from 'react';
import { Form } from 'elements';
import { Field } from 'redux-form';
import { parseAddressComponents } from 'utils/helpers';
// import bounds from 'utils/location_bounds';

const renderMapAutocomplete = (field) => {
  const { className, classNameLabel, classNameInput, label, placeholder, disabled, input: { name }, meta: { error, touched }, handleClearField, clearBtn, clearBtnClassName, onClearBtnLoad } = field;
  // console.log('INPUT', field.input);

  return (
    <Form.Group>
      <div className={className + (error && touched ? ' has-error ' : '')}>
        {label && <label className={classNameLabel || ''} htmlFor={'form-input-' + name}>{label}</label>}
        <input
          {...field.input}
          autoComplete="off"
          className={'form-control ' + (classNameInput ? `${classNameInput} ` : '') + (error && touched ? 'is-error ' : '')}
          type="text"
          disabled={disabled}
          placeholder={placeholder}
          id={'form-input-' + name}
        />
        {clearBtn &&
          <button ref={onClearBtnLoad} className={'hidden ' + (clearBtnClassName || '')} type="button" onClick={handleClearField}>X</button>}
        {error && touched &&
          <Form.Error message={error && touched ? error : ''} />}
      </div>
    </Form.Group>
  );
};

const renderHidden = (field) => {
  const { input, meta: { error, touched }, autocompleteParent } = field;
  // console.log('HIDDEN', field.input);

  return (
    <div>
      <input
        {...input}
        type="hidden"
        id={input.name}
      />
      {error && touched && <Form.Error message={error || ''} />}
      {autocompleteParent && (error && touched ? autocompleteParent.classList.add('has-error') : autocompleteParent.classList.remove('has-error'))}
    </div>
  );
};

export default class MapAutocomplete extends Component {
  static propTypes = {
    changeForm: PropTypes.func.isRequired,
    clearDirections: PropTypes.func,
    name: PropTypes.string.isRequired,
    coordinatesName: PropTypes.string.isRequired,
    neighborhoodName: PropTypes.string,
    postalCodeName: PropTypes.string,
    stateName: PropTypes.string,
    fillAs: PropTypes.string,
    hideCoordinates: PropTypes.bool,
    addressData: PropTypes.bool
  };

  static defaultProps = {
    className: ''
  };

  constructor() {
    super();
    this._input = null;
    this._searchBox = null;
    // this._prevCoordinates = null;

    this.handleChange = ::this.handleChange;
    this.handleChangeCoordinates = ::this.handleChangeCoordinates;
    this.handleClearField = ::this.handleClearField;
    this.handleClearBtnLoad = ::this.handleClearBtnLoad;
    this.preventSubmit = ::this.preventSubmit;
    this.handleKeyUp = ::this.handleKeyUp;
    // this.removeFocus = ::this.removeFocus;
  }

  componentDidMount() {
    /* eslint-disable */
    if (google) {
      this._input = document.getElementById(`form-input-${this.props.name}`);
      this._searchBox = new google.maps.places.SearchBox(this._input, {
        bounds: new google.maps.LatLngBounds({lat: 18.7763, lng: 170.5957}, {lat: 71.5388001, lng: -66.885417})
      });
      this._geocoder = new google.maps.Geocoder;

      this._searchBox.addListener('places_changed', this.handleChange);
      this._input.addEventListener('keydown', this.preventSubmit);

      if (this.props.addErrorToWrap) this._autocompleteParent = this._input.parentElement.parentElement;
      if (!this.props.disableChangeCoordinates) this._input.addEventListener('change', this.handleChangeCoordinates);
      if (this.props.clearBtn) {
        this._input.addEventListener('keyup', this.handleKeyUp);
        this.handleKeyUp();
      }
      // bug with touch devices: https://trello.com/c/6ssgJ8X9/665-cannot-create-offered-on-mobile-because-i-cannot-select-the-address
      // document.addEventListener('ontouchend' in window ? 'touchend' : 'click', this.removeFocus);
    }
    /* eslint-enable */
  }

  componentWillUnmount() {
    /* eslint-disable */
    if (google) {
      google.maps.event.clearListeners(this._searchBox, 'place_changed');
      this._input.removeEventListener('keydown', this.preventSubmit);

      if (!this.props.disableChangeCoordinates) this._input.removeEventListener('change', this.handleChangeCoordinates);
      if (this.props.clearBtn) this._input.removeEventListener('keyup', this.handleKeyUp);
      if (this.props.clearDirections) this.props.clearDirections();

      // document.removeEventListener('ontouchend' in window ? 'touchend' : 'click', this.removeFocus);
    }
    /* eslint-enable */
  }

  getComponents(coordinates) {
    /* eslint-disable */
    return new Promise((resolve, reject) => {
      this._geocoder.geocode({'location': coordinates}, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            // console.log('GET_RESULTS', results);
            resolve(results[0].address_components);
          }
        } else {
          reject('No results found');
        }
      });
    });
    /* eslint-enable */
  }

  handleChange() {
    // const { initialCoordinates } = this.props;
    const place = this._searchBox.getPlaces()[0];
    // console.log('PLACE', place);
    if (!place) {
      this._input.blur();
      this._input.focus();
      return;
    }
    const coordinates = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    if (place.address_components) {
      const address = parseAddressComponents(place.address_components);
      // fix for chrome 56
      setTimeout(() => this.fillForm(address, coordinates), 4);
      this._input.blur();
    }
    if (!place.address_components) {
      this.getComponents(coordinates)
        .then(result => {
          const address = parseAddressComponents(result);
          setTimeout(() => this.fillForm(address, coordinates), 4);
          this._input.blur();
        })
        .catch(error => console.log(error));
    }
  }

  handleChangeCoordinates() {
    this.props.changeForm(this.props.coordinatesName, null);
  }

  handleClearField() {
    const { name, coordinatesName, changeForm, clearDirections } = this.props;

    if (clearDirections) clearDirections();
    changeForm(name, null);
    changeForm(coordinatesName, null);
    this.hideClearBtn();
  }

  handleClearBtnLoad(btn) {
    this._clearBtn = btn;
  }

  handleKeyUp() {
    if (!this._clearBtn) return;
    if (this._input.value) this._clearBtn.classList.remove('hidden');
      else this.hideClearBtn(); // eslint-disable-line
  }

  hideClearBtn() {
    this._clearBtn.classList.add('hidden');
  }

  fillForm(address, coordinates) {
    const { changeForm, name, coordinatesName, neighborhoodName, postalCodeName, stateName, fillAs, addressData } = this.props;

    changeForm(name, '');
    !fillAs ? changeForm(name, address.street) : changeForm(name, address[fillAs] || address.street);
    changeForm(coordinatesName, coordinates);
    !!postalCodeName && changeForm(postalCodeName, address.postalCode || '');
    !!neighborhoodName && changeForm(neighborhoodName, address.neighborhood || '');
    !!stateName && changeForm(stateName, address.state || '');
    !!addressData && changeForm('address_data', address);
  }

  preventSubmit(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  }

  // removeFocus(e) {
  //   if (this._input && !this._input_parent.contains(e.target)) {
  //     this._input.blur();
  //   }
  // }

  render() {
    const { name, coordinatesName, hideCoordinates, addressData } = this.props;
    hideCoordinates && this._autocompleteParent && this._autocompleteParent.classList.remove('has-error');

    return (
      <div>
        <Field {...this.props} name={name} component={renderMapAutocomplete} handleClearField={this.handleClearField} onClearBtnLoad={this.handleClearBtnLoad} />
        {!hideCoordinates && <Field {...this.props} name={coordinatesName} component={renderHidden} autocompleteParent={this._autocompleteParent} />}
        {addressData && <Field {...this.props} name={'address_data'} component={renderHidden} />}
      </div>
    );
  }
}
