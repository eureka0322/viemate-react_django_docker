import React, { Component, PropTypes } from 'react';
import { Form } from 'elements';
import {} from 'elements/Form/Textarea/Textarea.scss';
import autosize from 'libs/autosize/autosize';

const UPDATE = 'autosize:update';
// const DESTROY = 'autosize:destroy';

export default class TextareaAutosize extends Component {
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
  };

  static defaultProps = {
    className: '',
    row: 1,
    formSumbit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      rows: props.row || 1
    };
    this.customChange = ::this.customChange;
    this.resizeOnChange = ::this.resizeOnChange;
    this.handleSubmit = ::this.handleSubmit;
  }

  componentDidMount() {
    this._textarea.addEventListener('keyup', this.handleSubmit);
    setTimeout(() => {
      const area = this._textarea;  // eslint-disable-line
      if (area) {
        autosize(area);
      }
    }, 0);
  }

  componentWillReceiveProps(nextProps) { // nextProps
    if (this.props.field.value !== nextProps.field.value) {
      this.dispatchEvent(UPDATE, true);
    }
  }

  componentWillUnmount() {
    this._textarea.removeEventListener('keyup', this.handleSubmit);
  }

  // componentWillUnmount() {
  //   this.dispatchEvent(DESTROY);
  // }

  // getValue(props) { // eslint-disable-line
  //   if (props) {
  //     return props.valueLink ? props.valueLink.value : props.value;
  //   }
  // }

  handleSubmit(e) {
    if (e.keyCode === 13 && e.ctrlKey) {
      this.props.formSumbit();
    }
  }

  dispatchEvent(EVENT_TYPE, defer) {
    const event = document.createEvent('Event');
    event.initEvent(EVENT_TYPE, true, false);
    const dispatch = () => this.textarea.dispatchEvent(event);  // eslint-disable-line
    if (defer) {
      setTimeout(dispatch);
    } else {
      dispatch();
    }
  }

  customChange(e) { // eslint-disable-line
    const { field: { input: { onChange } }, maxLength } = this.props;
    if (typeof maxLength !== 'number') {return false;} // eslint-disable-line
    if (e.target.value.length <= maxLength) {
      onChange(e.target.value);
    }
  }

  resizeOnChange(callback, e, val) {
    // console.log(e, val);
    callback(e, val);
  }

  render() {
    const { autoComplete, className, classNameLabel, field, label, placeholder, maxLength } = this.props;
    return (
      <Form.Group>
        <div className="form-textarea-autosize">
          <div className={className + (field.meta.error && field.meta.touched ? 'has-error ' : '')}>
            <label className={classNameLabel || ''} htmlFor={'form-input-' + field.input.name}>{label}</label>
            {(typeof maxLength === 'number') && <div className="textarea-count">{maxLength - field.input.value.length}</div>}
            <textarea
              ref={n => this._textarea = n}
              className="form-control form-textarea"
              autoComplete={autoComplete}
              disabled={field.disabled}
              name={field.input.name}
              rows={this.state.rows}
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
