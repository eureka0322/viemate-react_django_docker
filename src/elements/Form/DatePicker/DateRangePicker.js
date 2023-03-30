import React, { Component, PropTypes } from 'react';
import { Form } from 'elements';
import { Field } from 'redux-form';
import { DateRangePicker } from 'react-dates';
import {} from 'react-dates/css/styles.scss';
import {} from './DateRangePicker.scss';
import moment from 'moment';

class DateRangePickerWrapper extends Component {
  static propTypes = {
    // change: PropTypes.func,
    displayFormat: PropTypes.string,
    startDateId: PropTypes.string.isRequired,
    endDateId: PropTypes.string.isRequired,
    name: PropTypes.string,
    className: PropTypes.string,
    startDateLabel: PropTypes.string,
    endDateLabel: PropTypes.string,
    input: PropTypes.object,
    meta: PropTypes.object,
    moveToFocus: PropTypes.bool, // eslint-disable-line
    minimumNights: PropTypes.number,
    cbFunction: PropTypes.func
  };

  static defaultProps = {
    displayFormat: 'DD.MM.YYYY',
    className: '',
    cbFunction: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      focusedInput: null,
      // initial_month: moment(),
    };
    this.cachedElements = {};
    // this.curFocus = null;
    // this.prevInvocTime = 0;
    // this.prevStartDate = null;
    this._startEl = null;
    this._endEl = null;

    this.handleDatesChange = ::this.handleDatesChange;
    this.handleFocusChange = ::this.handleFocusChange;
    this.handleStartClick = ::this.handleStartClick;
    this.handleEndClick = ::this.handleEndClick;
    this.handleKeyClose = ::this.handleKeyClose;
  }

  componentDidMount() {
    // const { input: { value } } = this.props;

    // if (value && value.startDate && !this.prevStartDate) {
    //   this.prevStartDate = value.startDate._d;
    // }
    this.cacheElements();

    this._startEl.addEventListener('click', this.handleStartClick);
    this._endEl.addEventListener('click', this.handleEndClick);
    this.cachedElements.startInput.addEventListener('focus', this.handleStartClick);
    this.cachedElements.endInput.addEventListener('focus', this.handleEndClick);
    window.addEventListener('keydown', this.handleKeyClose);
  }

  componentWillUnmount() {
    this._startEl.removeEventListener('click', this.handleStartClick);
    this._endEl.removeEventListener('click', this.handleEndClick);
    this.cachedElements.startInput.removeEventListener('focus', this.handleStartClick);
    this.cachedElements.endInput.removeEventListener('focus', this.handleEndClick);
    window.removeEventListener('keydown', this.handleKeyClose);
  }

  getYPosition(element, wrapper) {
    const yOffset = window.pageYOffset;
    const elementYPos = element.getBoundingClientRect().top + yOffset;
    const wrapperYPos = wrapper.getBoundingClientRect().top + yOffset;

    return Math.round((elementYPos - wrapperYPos) + element.offsetHeight) + 'px';
  }

  handleDatesChange(val, onChange) {
    const { minimumNights } = this.props;

    if (minimumNights) {
      const minNightsMs = minimumNights * 24 * 3600 * 1000;

      if (val.endDate && val.startDate && (val.endDate - val.startDate < minNightsMs)) {
        val.endDate = moment(val.startDate._d.getTime() + minNightsMs);
      }
      if (val.startDate && !val.endDate) {
        val.endDate = moment(val.startDate._d.getTime() + minNightsMs);
      }
    }
    // if datepicker is open close it
    if (this.state.focusedInput) this.setState({focusedInput: null});

    this.props.cbFunction(val);
    return onChange(val);
  }

  handleFocusChange(focusedInput) {
    const { moveToFocus } = this.props;

    if (!focusedInput) this.setState({ focusedInput });

    // if (this.curFocus !== focusedInput && focusedInput && moveToFocus) {
    if (focusedInput && moveToFocus) {
      const elems = this.cachedElements;
      // if (!elems.picker) this.cacheElements();

      if (focusedInput === 'startDate') {
        // elems.picker.style.left = this.getXPosition(elems.startInput, elems.inputWrapp);
        // if (value.startDate) {
        //   this.setState({initial_month: value.startDate});
        // }
        elems.picker.style.top = this.getYPosition(elems.startInput, elems.inputWrapp);
      }
      if (focusedInput === 'endDate') {
        // elems.picker.style.left = this.getXPosition(elems.endInput, elems.inputWrapp);
        // if (value.endDate) {
        //   this.setState({initial_month: value.endDate});
        // }
        elems.picker.style.top = this.getYPosition(elems.endInput, elems.inputWrapp);
      }
    }

    // this.curFocus = focusedInput;
  }

  // getXPosition(element, wrapper) {
  //   const xOffset = window.pageXOffset;
  //   const elementXPos = element.getBoundingClientRect().left + xOffset;
  //   const wrapperXPos = wrapper.getBoundingClientRect().left + xOffset;

  //   return Math.round(elementXPos - wrapperXPos) + 'px';
  // }

  handleStartClick() {
    this.setState({focusedInput: 'startDate'});
  }

  handleEndClick() {
    this.setState({focusedInput: 'endDate'});
  }

  handleKeyClose(e) {
    if (this.state.focusedInput && e.keyCode === 27) {
      this.setState({focusedInput: null});
    }
  }

  cacheElements() {
    const doc = document;
    const { startDateId, endDateId } = this.props;
    const className = this.props.className || 'date-range-picker';

    const inputWrapp = doc.querySelector(`.${className} .DateRangePickerInput`);

    this._startEl = inputWrapp.querySelector(`#${startDateId} + .DateInput__display-text`);
    this._endEl = inputWrapp.querySelector(`#${endDateId} + .DateInput__display-text`);
    this.cachedElements.inputWrapp = inputWrapp;
    this.cachedElements.startInput = inputWrapp.querySelector(`#${startDateId}`);
    this.cachedElements.endInput = inputWrapp.querySelector(`#${endDateId}`);

    this.cachedElements.picker = doc.querySelector(`.${className} .DateRangePicker__picker`);
  }

  // checkInvocationSpeed(time) {
  //   const timeNow = Date.now();
  //   let result = true;

  //   if ((timeNow - this.prevInvocTime) < time) result = false;
  //   this.prevInvocTime = timeNow;
  //   return result;
  // }

  render() {
    const { focusedInput } = this.state;
    const { className, startDateId, startDateLabel, endDateLabel, endDateId, minimumNights, input: { onChange, value }, meta: { error, touched } } = this.props;

    if (value) {
      if (value.startDate && (typeof value.startDate !== 'object')) value.startDate = moment(value.startDate);
      if (value.endDate && (typeof value.endDate !== 'object')) value.endDate = moment(value.endDate);
    }

    return (
      <Form.Group>
        <div className={`date-range-picker ${className}` + (error && touched ? ' has-error ' : '')}>
          <div className="date-range-picker__labels">
            {startDateLabel && <div className="date-range-picker__label-wrap date-range-picker__label-wrap--start">
              <label className="date-range-picker__label" htmlFor={startDateId}>{startDateLabel}</label>
            </div>}
            {endDateLabel && <div className="date-range-picker__label-wrap date-range-picker__label-wrap--end">
              <label className="date-range-picker__label" htmlFor={endDateId}>{endDateLabel}</label>
            </div>}
          </div>
          <DateRangePicker
            {...this.props}
            displayFormat={this.props.displayFormat}
            onDatesChange={val => this.handleDatesChange(val, onChange)}
            onFocusChange={input => this.handleFocusChange(input, value)}
            focusedInput={focusedInput}
            startDate={(value && value.startDate) || null}
            endDate={(value && value.endDate) || null}
            startDateId={startDateId}
            endDateId={endDateId}
            minimumNights={minimumNights}
          />
        </div>
        {/* required for scrollToFirstError func */}
        <input type="hidden" name={this.props.name} style={{ diplay: 'none' }} />
        {error && touched && <Form.Error message={error && touched ? error : ''} />}
      </Form.Group>
    );
  }
}

export default props => <Field {...props} component={DateRangePickerWrapper} />;
