import React, {Component, PropTypes } from 'react';
import {} from './CreditCard.scss';
import client from 'braintree-web/client';
import paypal from 'braintree-web/paypal';
import { Loader } from 'elements';

export default class Braintree extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    showNotification: PropTypes.func,
    changeComponent: PropTypes.func,
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
      tokenization: false,
    };
    this.createPaypal = ::this.createPaypal;
  }

  componentDidMount() {
    if (this._paypal) {
      const authorization = this.props.token;
      client.create({
        authorization
      }, (err, clientInstance) => {
        if (err) {
          this.props.onError(err.message);
          return;
        }
        this.createPaypal(clientInstance, this._paypal);
      });
    }
  }

  shouldComponentUpdate(nextProp, nextState) {
    if (this.state !== nextState) {
      return true;
    }
    return false;
  }

  createPaypal(clientInstance) {
    paypal.create({
      client: clientInstance,
    }, (err, paypalInstance) => {
      if (err) {
        this.props.onError(err.message);
        return;
      }

      const tokenize = (event) => {
        event.preventDefault();
        this.setState({tokenization: true});

        paypalInstance.tokenize({
          flow: 'vault'
        }, (tokenizeErr, payload) => {
          if (tokenizeErr) {
            // console.log(tokenizeErr);
            this.props.showNotification(tokenizeErr.message);
            this.setState({tokenization: false});
            return;
          }
          // teardown();
          // console.log(payload);
          this.props.onSuccess(payload.nonce);
          return;
        });
      };

      if (this._paypal) {
        this._paypal.addEventListener('click', tokenize, false);
        this.setState({ready: true});
      }
    });
  }

  render() {
    return (
      <div>
        <button
          disabled={this.state.tokenization}
          id="braintree-paypal-button"
          className="paypal form-button form-button--circle form-button--paypal"
          type="button"
          ref={n => this._paypal = n}
        >
          <span>PayPal with</span>
          <i className="icon icon--paypal-btn" />
        </button>

        <div className="credit-card__btn-groups">
          <button
            className="form-button form-button--card-action form-button--default-dark form-button--circle"
            type="button"
            onClick={() => this.props.changeComponent()}
            disabled={this.state.tokenization}
          >
            <span>Cancel</span>
          </button>
        </div>

        {!this.state.ready && <Loader />}
      </div>
    );
  }
}
