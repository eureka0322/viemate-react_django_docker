import React, { Component, PropTypes } from 'react';
import { Form } from 'elements';
import {} from './Radio.scss';

export default class Radio extends Component {
  static propTypes = {
    className: PropTypes.string,
    classNameIcon: PropTypes.string,
    classNameInput: PropTypes.string,
    classNameCaption: PropTypes.string,
    classNameLabel: PropTypes.string,
    field: PropTypes.object.isRequired,
    label: PropTypes.string,
    caption: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    classNameIcon: '',
    classNameCaption: '',
    classNameLabel: '',
  };

  render() {
    const { caption, className, classNameInput, classNameIcon, classNameLabel, classNameCaption, field, label } = this.props;
    return (
      <Form.Group>
        <div className={`form-radio ${className}` + (field.meta.error && field.meta.touched ? 'has-error ' : '')}>
          <label htmlFor={'form-radio-' + field.input.name + '-' + field.input.value}>
            <input
              className={' ' + (classNameInput ? `${classNameInput} ` : '') + (field.meta.error && field.meta.touched ? 'is-error ' : '')}
              type="radio"
              disabled={field.disabled}
              id={'form-radio-' + field.input.name + '-' + field.input.value}
              {...field.input}
            />
            <span className={classNameIcon} />
            <span className={classNameLabel}>{label}</span>
            {caption && <span className={classNameCaption}>{caption}</span>}
          </label>
          {field.meta.error && field.meta.touched && <Form.RadioError field={field.input.name} error={field.meta.error} />}
        </div>
      </Form.Group>
    );
  }
}
