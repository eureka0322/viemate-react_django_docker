import React, { Component, PropTypes } from 'react';
import ReactInputRange from 'react-input-range';
import { Form } from 'elements';
import { Field } from 'redux-form';

const renderInputHidden = field =>
  <Form.InputHidden
    field={field}
    {...field}
  />;

export default class InputRange extends Component {
  static propTypes = {
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    step: PropTypes.number,
    min_name: PropTypes.string,
    max_name: PropTypes.string,
    changeForm: PropTypes.func,
    values: PropTypes.object,
    min_max_any: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      values: props.values || {
        min: props.minValue,
        max: props.maxValue
      },
    };
    this.handleValuesChange = ::this.handleValuesChange;
  }

  componentDidMount() {
    this.props.changeForm(this.props.min_name || 'price_min', this.state.values.min);
    this.props.changeForm(this.props.max_name || 'price_max', this.state.values.max);
  }

  handleValuesChange(component, values) {
    this.setState({ values });
    this.props.changeForm(this.props.min_name || 'price_min', values.min);
    this.props.changeForm(this.props.max_name || 'price_max', values.max);
  }

  render() {
    const { values } = this.state;
    const { min_max_any, maxValue, minValue } = this.props;

    return (
      <div>
        <ReactInputRange
          maxValue={maxValue}
          minValue={minValue}
          value={this.state.values}
          onChange={this.handleValuesChange}
          step={this.props.step}
        />
        <Field
          name={this.props.min_name || 'price_min'}
          type="hidden"
          component={renderInputHidden}
        />
        <Field
          name={this.props.max_name || 'price_max'}
          type="hidden"
          component={renderInputHidden}
        />
        <div className="range-data">
          <span>{`from ${(min_max_any && (values.min <= minValue) ? 'any' : '$' + values.min)}`}</span>
        </div>
        <div className="range-data">
          <span>{`to ${(min_max_any && (values.max >= maxValue) ? 'any' : '$' + values.max)}`}</span>
        </div>
      </div>
    );
  }
}
