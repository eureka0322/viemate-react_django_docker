import React, { Component, PropTypes } from 'react';
import {} from './SendEmail.scss';
import { ProductCard } from 'components';
import { Form } from 'elements';
import { reduxForm, Field } from 'redux-form';
import validate from './validate';

const SendEmailInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

const SendEmailTextarea = field =>
  <Form.Textarea
    field={field}
    {...field}
  />;

@reduxForm({
  form: 'form-send-email',
  validate
})


export default class SendEmail extends Component {
  static propTypes = {
    // register: PropTypes.func,
    closeModal: PropTypes.func,
    // redux-form
    // active: PropTypes.string,
    // dirty: PropTypes.bool.isRequired,
    // errors: PropTypes.object,
    // initializeForm: PropTypes.func,
    // invalid: PropTypes.bool.isRequired,
    // pristine: PropTypes.bool.isRequired,
    // submitting: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    // error: PropTypes.string
    // valid: PropTypes.bool.isRequired

    info: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = ::this.handleSubmit;
  }

  handleSubmit(data) {
    if (window) {
      const url = window.location.href;
      const message = encodeURI(`${data.message}\n\n${url}`);
      window.location = `mailto:${data.email}?body=${message}`;
    }
    this.props.closeModal();
  }

  render() {
    return (
      <div className="send-email container container--extra-md-width">
        <div className="send-email__product-card">
          <ProductCard
            info={this.props.info}
            onClick={() => {}}
            toggleUserModal={() => {}}
            highlightMarkers={false}
          />
        </div>
        <form className="send-email__form" onSubmit={this.props.handleSubmit(this.handleSubmit)}>
          <div className="table">
            <div className="send-email__form-label">Send email to:</div>
            <div className="send-email__form-item">
              <Field
                classNameInput="form-control input input--base"
                name="email"
                type="email"
                component={SendEmailInput}
                placeholder="Enter email address"
              />
            </div>
            <div className="send-email__form-item">
              <Field
                name="message"
                component={SendEmailTextarea}
                row={5}
                placeholder="Hey! I found this amazing place on Viemate, Check it out!"
              />
            </div>
            <div className="send-email__separator" />
            <div className="send-email__nav">
              <button className="form-button form-button--pink form-button--circle form-button--full-width form-button--user-action" type="submit">
                <span>Send</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

}
