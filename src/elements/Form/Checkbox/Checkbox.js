import React, { Component, PropTypes } from 'react';
import { Form } from 'elements';
import {} from './Checkbox.scss';

export default class Checkbox extends Component {
  static propTypes = {
    className: PropTypes.string,
    classNameIcon: PropTypes.string,
    classNameInput: PropTypes.string,
    classNameCaption: PropTypes.string,
    classNameLabel: PropTypes.string,
    label: PropTypes.string,
    caption: PropTypes.string,
    multipleValidationName: PropTypes.string,
    field: PropTypes.object.isRequired,
    use_num: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    classNameIcon: '',
    classNameCaption: '',
    classNameLabel: '',
    use_num: false,
  };

  render() {
    const { caption, className, classNameInput, classNameIcon, classNameLabel, classNameCaption, field, label, multipleValidationName, use_num } = this.props;
    return (
      <Form.Group>
        <div className={`form-checkbox ${className}` + (field.meta.error && field.meta.touched ? 'has-error ' : '')}>
          <label htmlFor={'form-checkbox-' + field.input.name}>
            <input
              className={' ' + (classNameInput ? `${classNameInput} ` : '') + (field.meta.error && field.meta.touched ? 'is-error ' : '')}
              type="checkbox"
              disabled={field.disabled}
              id={'form-checkbox-' + field.input.name}
              {...field.input}
              {...(use_num ? {onChange: () => field.input.onChange(field.input.checked ? 0 : 1)} : {})}
            />
            {classNameIcon && <span className={classNameIcon} />}
            <span className={classNameLabel}>{label}</span>
            {caption && <span className={classNameCaption}>{caption}</span>}
          </label>
          {!multipleValidationName && <Form.Error message={field.meta.error && field.meta.touched ? field.meta.error : ''} />}
          {multipleValidationName && field.meta.error && field.meta.touched && <Form.RadioError field={multipleValidationName} error={field.meta.error} />}
        </div>
      </Form.Group>
    );
  }
}
