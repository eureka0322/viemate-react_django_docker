import React, { Component, PropTypes } from 'react';
import { Form } from 'elements';
import {} from './Textarea.scss';

export default class Textarea extends Component {
  static propTypes = {
    autoComplete: PropTypes.string,
    className: PropTypes.string,
    classNameLabel: PropTypes.string,
    field: PropTypes.object.isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    maxLength: PropTypes.number,
    row: PropTypes.number,
    formSumbit: PropTypes.func,
  }

  static defaultProps = {
    className: '',
    formSumbit: () => {},
  }

  constructor() {
    super();
    this.handleSubmit = ::this.handleSubmit;
  }

  componentDidMount() {
    this._textarea.addEventListener('keyup', this.handleSubmit);
  }

  componentWillUnmount() {
    this._textarea.removeEventListener('keyup', this.handleSubmit);
  }

  customChange(e) { // eslint-disable-line
    const { field: { input: { onChange } }, maxLength } = this.props;
    if (typeof maxLength !== 'number') {return false;} // eslint-disable-line
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value);
    }
  }

  handleSubmit(e) {
    if (e.keyCode === 13 && e.ctrlKey) {
      this.props.formSumbit();
    }
  }

  render() {
    const { autoComplete, className, classNameLabel, field, label, placeholder, maxLength, row } = this.props;
    return (
      <Form.Group>
        <div className="form-textarea-autosize">
          <div className={className + (field.meta.error && field.meta.touched ? 'has-error ' : '')}>
            <label className={classNameLabel || ''} htmlFor={'form-input-' + field.input.name}>{label}</label>
            {(typeof maxLength === 'number') && <div className="textarea-count">{maxLength - field.input.value.length}</div>}
            <textarea
              ref={n => {this._textarea = n;}}
              className={'form-control form-textarea' + (field.input.value && field.input.value.length ? ' has-value' : '')}
              autoComplete={autoComplete}
              disabled={field.disabled}
              name={field.input.name}
              rows={row || 1}
              maxLength={maxLength}
              placeholder={placeholder}
              {...field.input}
              onChange={typeof maxLength === 'number' ? ::this.customChange : field.input.onChange}
            />
            <Form.Error message={field.meta.error && field.meta.touched ? field.meta.error : ''} />
          </div>
        </div>
      </Form.Group>
    );
  }
}
