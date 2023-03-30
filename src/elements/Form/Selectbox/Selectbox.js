import React, { Component, PropTypes } from 'react';
import { Form } from 'elements';
import SimpleSelect from 'react-select';
import classNames from 'classnames';
import {} from 'react-select/scss/default.scss';

export default class Selectbox extends Component {
  static propTypes = {
    className: PropTypes.string,
    placeholder: PropTypes.string,
    field: PropTypes.object.isRequired,
    help: PropTypes.string,
    multiple: PropTypes.bool,
    searchable: PropTypes.bool,
    clearable: PropTypes.bool,
    cbFunction: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    multiple: false,
    searchable: false,
    clearable: false,
    cbFunction: () => {},
  };

  render() {
    const { className, field, help, multiple, searchable, placeholder, cbFunction, clearable } = this.props;
    return (
      <Form.Group>
        <div
          className={
            classNames({
              [className]: !!className,
              'has-error': !!(field.meta.error && field.meta.touched),
            })
          }
        >
          <SimpleSelect
            multi={multiple}
            options={field.list}
            disabled={field.disabled}
            value={field.input.value}
            onChange={(val) => {
              cbFunction(val && val.value);
              return val && field.input.onChange(val && val.value);
            }}
            clearable={clearable}
            searchable={searchable}
            placeholder={placeholder}
          />
          {help && <p className="help-block">{help}</p>}
          <Form.Error message={field.meta.error && field.meta.touched ? field.meta.error : ''} />
        </div>
      </Form.Group>
    );
  }
}
