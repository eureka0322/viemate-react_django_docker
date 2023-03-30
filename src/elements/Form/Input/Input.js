import React, { Component, PropTypes } from 'react';
import { Form } from 'elements';
import {} from './Input.scss';

export default class Input extends Component {
  static propTypes = {
    autoFocus: PropTypes.bool,
    autoComplete: PropTypes.bool,
    className: PropTypes.string,
    classNameInput: PropTypes.string,
    classNameAddon: PropTypes.string,
    classNameAddonIcon: PropTypes.string,
    classNameAddonPosition: PropTypes.string,
    classNameLabel: PropTypes.string,
    field: PropTypes.object.isRequired,
    help: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string.isRequired,
    maxLength: PropTypes.number,
    customBlur: PropTypes.func,
  };

  static defaultProps = {
    autoFocus: false,
    autoComplete: false,
    className: '',
    type: 'text',
    customBlur: () => {},
  };

  customChange(e) { // eslint-disable-line
    const { field: { input: { onChange } }, maxLength } = this.props;
    if (typeof maxLength !== 'number') {return false;}  // eslint-disable-line
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value);
    }
  }

  render() {
    const { customBlur, autoComplete, autoFocus, maxLength, className, classNameLabel, classNameInput, classNameAddon, classNameAddonIcon, classNameAddonPosition, field, help, label, placeholder, type } = this.props;

    return (
      <Form.Group>
        <div className={className + (field.meta.error && field.meta.touched ? 'has-error ' : '')}>
          {label && <label className={classNameLabel || ''} htmlFor={'form-input-' + field.input.name}>{label}</label>}
          {(typeof maxLength === 'number') && <div className="input-length">{maxLength - field.input.value.length}</div>}
          {classNameAddon && classNameAddonPosition === 'left' ? <span className={classNameAddon}>{classNameAddonIcon && <i className={classNameAddonIcon} />}</span> : false}
          <input
            autoFocus={autoFocus}
            autoComplete={autoComplete ? 'on' : 'off'}
            className={'form-control ' + (classNameInput ? `${classNameInput} ` : '') + (field.meta.error && field.meta.touched ? 'is-error ' : '') + (field.input.value && field.input.value.length ? 'has-value ' : '')}
            type={type === 'date' ? 'text' : type}
            disabled={field.disabled}
            placeholder={placeholder}
            id={'form-input-' + field.input.name}
            {...field.input}
            readOnly={field.readOnly}
            onChange={typeof maxLength === 'number' ? ::this.customChange : field.input.onChange}
            onBlur={val => {
              customBlur(val);
              return field.input.onBlur(val);
            }}
          />
          {classNameAddon && classNameAddonPosition === 'right' ? <span className={classNameAddon}>{classNameAddonIcon && <i className={classNameAddonIcon} />}</span> : false}
          {field.meta.error && field.meta.touched && <Form.Error message={field.meta.error && field.meta.touched ? field.meta.error : ''} />}
          {help && <p className="help-block">{help}</p>}
        </div>
      </Form.Group>
    );
  }
}
