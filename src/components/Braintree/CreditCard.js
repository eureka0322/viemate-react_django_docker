import React, {Component, PropTypes } from 'react';
import {} from './CreditCard.scss';
import client from 'braintree-web/client';
import hostedFields from 'braintree-web/hosted-fields';
import { Loader, Form } from 'elements';
import { reduxForm, Field } from 'redux-form';
import validate from './ccValidate';

const renderInput = field =>
  <Form.Input
    field={field}
    {...field}
  />;

@reduxForm({
  form: 'form-credit-card',
  validate,
})
export default class Braintree extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    showNotification: PropTypes.func,
    changeComponent: PropTypes.func,
    handleSubmit: PropTypes.func,
  };

  static defaultProps = {
    onSuccess: () => {},
    onError: () => {},
    showNotification: () => {},
  };

  constructor() {
    super();
    this.state = {
      ready: false,
      submitting: false,
    };
    this._clientInstance = null;

    this.createHostedFields = ::this.createHostedFields;
    this.tokenize = ::this.tokenize;
    this.handleSubmit = ::this.handleSubmit;
    this.teardown = ::this.teardown;
  }

  componentDidMount() {
    if (this._payment) {
      const authorization = this.props.token;
      client.create({
        authorization
      }, (err, clientInstance) => {
        if (err) {
          this.props.onError(err.message);
          return;
        }
        this.createHostedFields(clientInstance, this._payment);
      });
    }
  }

  shouldComponentUpdate(nextProp, nextState) {
    if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  createHostedFields(clientInstance) {
    this._clientInstance = clientInstance;

    hostedFields.create({
      client: clientInstance,
      styles: {
        input: {
          color: '#000',
          'font-size': '15px',
          // 'font-family': 'MaisonNeueMedium, helvetica, arial',
          'font-family': 'helvetica, arial'
        },
        'input::-webkit-input-placeholder': {
          color: '#bfbfbf'
        },
        'input:-moz-placeholder': {
          color: '#bfbfbf'
        },
        'input::-moz-placeholder': {
          color: '#bfbfbf'
        },
        'input:-ms-input-placeholder': {
          color: '#bfbfbf'
        },
        'input::placeholder': {
          color: '#bfbfbf'
        },
        select: {
          color: '#bfbfbf',
          'font-size': '15px',
          // 'font-family': 'MaisonNeueMedium, helvetica, arial'
          'font-family': 'helvetica, arial'
        },
        // ':focus': {
        //   color: 'black'
        // },
        '.valid': {
          // color: '#8bdda8'
          color: '#000'
        },
        '.invalid': {
          color: '#ff3366'
        }
      },
      fields: {
        number: {
          selector: '#card-number',
          placeholder: '4111 1111 1111 1111'
        },
        cvv: {
          selector: '#cvv',
          placeholder: '123'
        },
        expirationMonth: {
          selector: '#expiration-month',
          // select: true,
          placeholder: 'MM'
        },
        expirationYear: {
          selector: '#expiration-year',
          // select: true,
          placeholder: 'YYYY'
        }
      }
    }, (err, hostedFieldsInstance) => {
      this._hostedFieldsInstance = hostedFieldsInstance;

      if (this._payment) {
        // this._payment.addEventListener('submit', tokenize, false);
        this.setState({ready: true});
      }
    });
  }

  handleSubmit(data) {
    this.setState({submitting: true});
    this.tokenize({...data}).catch(() => {
      // console.log('test');
      this.setState({submitting: false});
      this.teardown();
      // return Promise.reject(err);
    });
  }

  teardown() {
    // this._payment.removeEventListener('submit', tokenize, false); //eslint-disable-line
    this._hostedFieldsInstance.teardown(() => {
      this.createHostedFields(this._clientInstance);
    });
  }

  tokenize(data) {
    // event.preventDefault();

    // if (this._hostedFieldsInstance) {
    return new Promise((resolve, reject) => {
      this._hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
        // this.teardown();
        if (tokenizeErr) {
          // console.log(tokenizeErr);
          this.props.showNotification(tokenizeErr.message);
          reject({error: tokenizeErr});
        } else {
          this.props.onSuccess(payload.nonce, data);
          resolve(payload.nonce);
        }
      });
    });
    // }
    // return Promise.reject({error: 'error'});
  }

  render() {
    const { submitting } = this.state;
    // console.log('submitting: ', submitting);
    return (
      <form ref={n => this._payment = n} onSubmit={this.props.handleSubmit(this.handleSubmit)} id="checkout-form" method="post" className="credit-card credit-card__form">
        <h2 className="credit-card__title">Add new payment method</h2>
        <div id="error-message" />
        <ul className="payments__method-lists credit-card__card-lists">
          <li>
            <i className="icon icon--visa" />
          </li>
           <li>
            <i className="icon icon--discover" />
          </li>
          <li>
            <i className="icon icon--american-express" />
          </li>
          <li>
            <i className="icon icon--master-card" />
          </li>
        </ul>
        <div className="credit-card__form-section">
          <span className="credit-card__text">Card Number</span>
          <div className="credit-card__items-wrap">
            <div className="credit-card__item credit-card__item--lg credit-card__item--padding-sm">
              <div
                className="form-control input input--base input--card-details hosted-field"
                id="card-number"
              />
            </div>
          </div>
        </div>
        <div className="credit-card__form-section credit-card__form-section--margin">
          <div className="credit-card__items-wrap">
            <div className="credit-card__item credit-card__item--sm">
              <span className="credit-card__text">Expires on</span>
              <div
                className="form-control input input--base input--card-details input--card-detail-month hosted-field"
                id="expiration-month"
              />
            </div>
            <div className="credit-card__item credit-card__item--sm credit-card__item--no-label">
              <div
                className="form-control input input--base input--card-details input--card-detail-year hosted-field"
                id="expiration-year"
              />
            </div>
            <div className="credit-card__item credit-card__item--sm">
              <span className="credit-card__text">Security Code</span>
              <div
                className="form-control input input--base input--card-details input--card-detail-code hosted-field"
                id="cvv"
              />
            </div>
          </div>
        </div>
        <div className="credit-card__form-section">
          <span className="credit-card__text">Name as it appears on Card</span>
          <div className="credit-card__items-wrap">
            <div className="credit-card__item credit-card__item--md">
              <div className="credit-card__input-wrap">
                <Field
                  name="first_name"
                  type="text"
                  component={renderInput}
                  placeholder="First name"
                />
              </div>
            </div>
            <div className="credit-card__item credit-card__item--md">
              <div className="credit-card__input-wrap">
                <Field
                  name="last_name"
                  type="text"
                  component={renderInput}
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="credit-card__btn-groups">
          <Form.Button
            className="form-button form-button--card-action form-button--default-dark form-button--circle"
            type="button"
            onClick={() => this.props.changeComponent()}
            disabled={submitting}
          >
            <span>Cancel</span>
          </Form.Button>

          <Form.Button
            className={'form-button form-button--capitalize form-button--card-action form-button--circle form-button--pink form-button--loader' + (submitting ? ' form-button--loading' : '')}
            type="submit"
            disabled={submitting}
          >
            <span>Add card</span>
          </Form.Button>
        </div>

        {/*<label htmlFor="cvv">CVV</label>
        <div className="hosted-field" id="cvv" />*/}

        {/*<label htmlFor="expiration-date">Expiration Date</label>
        <div className="hosted-field" id="expiration-date" />*/}


        {!this.state.ready && <Loader />}
      </form>
    );
  }
}
