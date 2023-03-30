import React, { Component, PropTypes } from 'react';
import { Form } from 'elements';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { subscribeEmail } from 'redux/modules/initialAppState';
import { showDefault } from 'redux/modules/notifications';
import validate from './validate';

const renderInput = (field) =>
  <Form.Input
    {...field}
    field={field}
  />;


@connect(() => ({}), {
  subscribeEmail,
  showDefault
})
@reduxForm({
  form: 'subscribe-form',
  touchOnBlur: false,
  validate
})
export default class FormSubscribe extends Component {
  static propTypes = {
    reset: PropTypes.func,
    handleSubmit: PropTypes.func,
    submitting: PropTypes.bool,
    // pristine: PropTypes.bool,
    subscribeEmail: PropTypes.func,
    showDefault: PropTypes.func,
  };

  constructor() {
    super();
    this.handleSubmit = ::this.handleSubmit;
  }

  handleSubmit(data) {
    return this.props.subscribeEmail(data).then(() => {
      this.props.showDefault('subscribe_ok');
      this.props.reset();
    }, (err) => {
      if (err.body && err.body.title) {
        throw new SubmissionError({email_address: err.body.title});
      }
    });
  }

  render() {
    const {handleSubmit, submitting} = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleSubmit)} className="footer__item-form lazyload">
        <Field
          classNameInput={'input--default input'}
          name="email_address"
          type="email"
          placeholder="Email"
          component={renderInput}
        />
        <Form.Button
          type="submit"
          disabled={submitting}
          className="form-button form-button--white form-button--subscribe"
        >
          <span>Subscribe</span>
        </Form.Button>
      </form>
    );
  }
}
