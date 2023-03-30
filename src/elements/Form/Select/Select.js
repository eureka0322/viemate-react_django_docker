import React, { Component, PropTypes } from 'react';
import { Form } from 'elements';
import {} from './Select.scss';

export default class Select extends Component {
  static propTypes = {
    className: PropTypes.string,
    classNameInput: PropTypes.string,
    field: PropTypes.object.isRequired,
    help: PropTypes.string,
    label: PropTypes.string,
    multiple: PropTypes.bool,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    className: '',
    multiple: false
  }

  render() {
    const { className, classNameInput, field, help, label, multiple, placeholder } = this.props;
    return (
      <Form.Group>
        <div className={`${className} ` + (field.meta.error && field.meta.touched ? 'has-error ' : '')}>
          <label htmlFor={'form-select-' + field.input.name}>{label}</label>
          {field.list && field.list.length > 0 &&
            <select
              className={'form-control ' + classNameInput + (field.meta.error && field.meta.touched ? ' is-error ' : '')}
              disabled={field.disabled}
              id={'form-select-' + field.input.name}
              multiple={multiple}
              placeholder={placeholder}
              {...field.input}
            >
              {field.list.map((item, i) => {
                if (item.active) {
                  return (
                    <option key={i} value={item.value}>{item.label}</option>
                  );
                }
                return (
                  <option key={i} value={item.value} disabled>{item.label}</option>
                );
              })}
            </select>}
          {help && <p className="help-block">{help}</p>}
          <Form.Error message={field.meta.error && field.meta.touched ? field.meta.error : ''} />
        </div>
      </Form.Group>
    );
  }
}
