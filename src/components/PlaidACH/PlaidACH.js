import { Component, PropTypes } from 'react';

export default class PlaidACH extends Component {
  static propTypes = {
    onSuccess: PropTypes.func,
    // onError: PropTypes.func,
    showNotification: PropTypes.func,
    changeComponent: PropTypes.func,
    address: PropTypes.object,
  };

  static defaultProps = {
    onSuccess: () => {},
    // onError: () => {},
    // showNotification: () => {},
  };

  constructor() {
    super();
    this.state = {
      ready: false,
    };
    this.plaid_public = 'b0cb7a0bf216ef9b7a82d6c17f83bd';
    this.startAuth = ::this.startAuth;
  }

  componentDidMount() {
    if (this.props.address) {
      this._btnHandler = window.Plaid.create({ //eslint-disable-line
        selectAccount: true,
        env: 'production',
        clientName: 'Viemate',
        key: this.plaid_public,
        product: 'auth',
        onLoad: () => {
          // The Link module finished loading.
          this.startAuth();
        },
        onSuccess: (public_token, metadata) => {
          // The onSuccess function is called when the user has successfully
          // authenticated and selected an account to use.
          //
          // When called, you will send the public_token and the selected
          // account ID, metadata.account_id, to your backend app server.
          //
          // sendDataToBackendServer({
          //   public_token: public_token,
          //   account_id: metadata.account_id
          // });
          this.props.onSuccess({
            public_token,
            account_id: metadata.account_id
          });
        },
        onExit: (err) => {
          // The user exited the Link flow.
          if (err != null) {
            // The user encountered a Plaid API error prior to exiting.
            //
            this.props.showNotification(err.message);
          }
          this.props.changeComponent(null);
          // metadata contains information about the institution
          // that the user selected and the most recent API request IDs.
          // Storing this information can be helpful for support.
        },
      });
    }
  }

  startAuth() {
    this._btnHandler.open();
  }

  // shouldComponentUpdate(nextProp, nextState) {
  //   if (this.state !== nextState) {
  //     return true;
  //   }
  //   return false;
  // }

  // teardown() {
  //   // this._payment.removeEventListener('submit', tokenize, false); //eslint-disable-line
  //   this._hostedFieldsInstance.teardown(() => {
  //     this.createHostedFields(clientInstance);
  //   });
  // };

  render() {
    // const { submitting } = this.state;
    // console.log('submitting: ', submitting);
    return null;
  }
}
