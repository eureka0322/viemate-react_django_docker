import React, { Component, PropTypes } from 'react';
import {} from './MessageItem.scss';
import { reduxForm, Field } from 'redux-form';
import { Form } from 'elements';
import validate from './validate';

const NewMessageTextarea = field =>
  <Form.TextareaAutosize
    field={field}
    {...field}
  />;

@reduxForm({
  form: 'form-subscribe',
  touchOnBlur: false,
  validate,
})

export default class MessageItemForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    send: PropTypes.func,
    reset: PropTypes.func,
    sending: PropTypes.bool,
    pristine: PropTypes.bool,
    conv_id: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
  }

  handleSubmit(data) {
    this.props.send(this.props.conv_id, {message: {body: data.message}}).then((r) => {
      this.props.reset();
      return r;
    });
  }

  render() {
    const {handleSubmit, sending, pristine} = this.props;
    return (
      <div className="message-item__form">
        <form action="javascript:void(0)" onSubmit={handleSubmit(this.handleSubmit)} className="message-form">
          <div className="message-form__textarea">
            <Field
              name="message"
              component={NewMessageTextarea}
              placeholder="Reply to..."
              formSumbit={handleSubmit(this.handleSubmit)}
              row={1}
            />
          </div>
          <div className="message-form__nav">
            <Form.Button
              type="submit"
              disabled={sending || pristine}
              className="form-button form-button--circle form-button--pink form-button--sent"
            >
              <span>{sending ? 'Sending...' : 'Send'}</span>
            </Form.Button>
          </div>
        </form>
      </div>
    );
  }
}
