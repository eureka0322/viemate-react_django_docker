import React, { Component, PropTypes } from 'react';
import { Form } from 'elements';
import { Field } from 'redux-form';
import { SingleDatePicker } from 'react-dates';
import {} from 'react-dates/css/styles.scss';
import {} from './DateRangePicker.scss';
import moment from 'moment';

class SingleDatePickerWrapper extends Component {
  static propTypes = {
    // change: PropTypes.func,
    displayFormat: PropTypes.string,
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    className: PropTypes.string,
    dateLabel: PropTypes.string,
    input: PropTypes.object,
    meta: PropTypes.object,
    cbFunction: PropTypes.func
  };

  static defaultProps = {
    displayFormat: 'DD.MM.YYYY',
    className: '',
    cbFunction: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {focused: false};
    this.cachedElements = {};
    this.curFocus = null;
    this.prevInvocTime = 0;
    this.prevStartDate = null;
    this.onFocusChange = ::this.onFocusChange;
  }

  // componentDidMount() {
  //   const { input: { value } } = this.props;

  //   if (value && value.startDate && !this.prevStartDate) {
  //     this.prevStartDate = value.startDate._d;
  //   }
  // }


  onFocusChange({ focused }) {
    this.setState({ focused });
  }
  // onFocusChange(focusedInput, value) {
  //   const { moveToFocus } = this.props;
  //   // this.checkInvocationSpeed(200) && this.setState({ focusedInput });

  //   // if the start date has been selected/changed close datepicker
  //   if (value && value.startDate && value.startDate._d !== this.prevStartDate) {
  //     this.setState({focusedInput: null});
  //     this.prevStartDate = value.startDate._d;
  //   } else this.checkInvocationSpeed(250) && this.setState({ focusedInput });

  //   if (this.curFocus !== focusedInput && focusedInput && moveToFocus) {
  //     const elems = this.cachedElements;
  //     if (!elems.picker) this.cacheElements();

  //     if (focusedInput === 'startDate') {
  //       // elems.picker.style.left = this.getXPosition(elems.startInput, elems.inputWrapp);
  //       elems.picker.style.top = this.getYPosition(elems.startInput, elems.inputWrapp);
  //     }
  //     if (focusedInput === 'endDate') {
  //       // elems.picker.style.left = this.getXPosition(elems.endInput, elems.inputWrapp);
  //       elems.picker.style.top = this.getYPosition(elems.endInput, elems.inputWrapp);
  //     }
  //   }

  //   this.curFocus = focusedInput;
  // }

  // getXPosition(element, wrapper) {
  //   const xOffset = window.pageXOffset;
  //   const elementXPos = element.getBoundingClientRect().left + xOffset;
  //   const wrapperXPos = wrapper.getBoundingClientRect().left + xOffset;

  //   return Math.round(elementXPos - wrapperXPos) + 'px';
  // }

  // getYPosition(element, wrapper) {
  //   const yOffset = window.pageYOffset;
  //   const elementYPos = element.getBoundingClientRect().top + yOffset;
  //   const wrapperYPos = wrapper.getBoundingClientRect().top + yOffset;

  //   return Math.round((elementYPos - wrapperYPos) + element.offsetHeight) + 'px';
  // }

  // cacheElements() {
  //   const doc = document;
  //   const { startDateId, endDateId } = this.props;

  //   this.cachedElements.startInput = doc.getElementById(startDateId);
  //   this.cachedElements.endInput = doc.getElementById(endDateId);
  //   this.cachedElements.inputWrapp = doc.querySelector('.DateRangePickerInput');
  //   this.cachedElements.picker = doc.querySelector('.DateRangePicker__picker');
  // }

  // checkInvocationSpeed(time) {
  //   const timeNow = Date.now();
  //   let result = true;

  //   if ((timeNow - this.prevInvocTime) < time) result = false;
  //   this.prevInvocTime = timeNow;
  //   return result;
  // }

  render() {
    const { className, id, dateLabel, input: { onChange, value }, meta: { error, touched } } = this.props;

    if (value) {
      if (value.startDate && (typeof value.startDate !== 'object')) value.startDate = moment(value.startDate);
      if (value.endDate && (typeof value.endDate !== 'object')) value.endDate = moment(value.endDate);
    }

    return (
      <Form.Group>
        <div className={`date-range-picker ${className}` + (error && touched ? ' has-error ' : '')}>
          <div className="date-range-picker__labels">
            {dateLabel && <div className="date-range-picker__label-wrap date-range-picker__label-wrap--start">
              <label className="date-range-picker__label" htmlFor={id}>{dateLabel}</label>
            </div>}
          </div>
          <SingleDatePicker
            {...this.props}
            displayFormat={this.props.displayFormat}
            focused={this.state.focused}
            onFocusChange={this.onFocusChange}
            onDateChange={val => {
              this.props.cbFunction(val);
              return onChange(val);
            }}
            date={value || null}
          />
        </div>
        {/* required for scrollToFirstError func */}
        <input type="hidden" name={this.props.name} style={{ diplay: 'none' }} />
        {error && touched && <Form.Error message={error && touched ? error : ''} />}
      </Form.Group>
    );
  }
}

export default props => <Field {...props} component={SingleDatePickerWrapper} />;
