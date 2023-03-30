import config from 'config';

const LOAD_TOKEN = 'braintree/LOAD_TOKEN';
const LOAD_TOKEN_SUCCESS = 'braintree/LOAD_TOKEN_SUCCESS';
const LOAD_TOKEN_FAIL = 'braintree/LOAD_TOKEN_FAIL';

const LOAD_TRANSACTIONS = 'braintree/LOAD_TRANSACTIONS';
const LOAD_TRANSACTIONS_SUCCESS = 'braintree/LOAD_TRANSACTIONS_SUCCESS';
const LOAD_TRANSACTIONS_FAIL = 'braintree/LOAD_TRANSACTIONS_FAIL';

const LOAD_PAYMENTS = 'payments/LOAD_PAYMENTS';
const LOAD_PAYMENTS_SUCCESS = 'payments/LOAD_PAYMENTS_SUCCESS';
const LOAD_PAYMENTS_FAIL = 'payments/LOAD_PAYMENTS_FAIL';

const CREATE_PAYMENT = 'braintree/CREATE_PAYMENT';
const CREATE_PAYMENT_SUCCESS = 'braintree/CREATE_PAYMENT_SUCCESS';
const CREATE_PAYMENT_FAIL = 'braintree/CREATE_PAYMENT_FAIL';

const SELECT_DEFAULT = 'braintree/SELECT_DEFAULT';
const SELECT_DEFAULT_SUCCESS = 'braintree/SELECT_DEFAULT_SUCCESS';
const SELECT_DEFAULT_FAIL = 'braintree/SELECT_DEFAULT_FAIL';

const REMOVE_BRAINTREE_METHOD = 'braintree/REMOVE_BRAINTREE_METHOD';
const REMOVE_BRAINTREE_METHOD_SUCCESS = 'braintree/REMOVE_BRAINTREE_METHOD_SUCCESS';
const REMOVE_BRAINTREE_METHOD_FAIL = 'braintree/REMOVE_BRAINTREE_METHOD_FAIL';

const SAVE_ADDRESS = 'braintree/SAVE_ADDRESS';
const CLEAR_ADDRESS = 'braintree/CLEAR_ADDRESS';

const CREATE_PAYOUT = 'payments/CREATE_PAYOUT';
const CREATE_PAYOUT_SUCCESS = 'payments/CREATE_PAYOUT_SUCCESS';
const CREATE_PAYOUT_FAIL = 'payments/CREATE_PAYOUT_FAIL';

const LOAD_PAYOUT = 'payments/LOAD_PAYOUT';
const LOAD_PAYOUT_SUCCESS = 'payments/LOAD_PAYOUT_SUCCESS';
const LOAD_PAYOUT_FAIL = 'payments/LOAD_PAYOUT_FAIL';

const DEFAULT_PAYOUT = 'payments/DEFAULT_PAYOUT';
const DEFAULT_PAYOUT_SUCCESS = 'payments/DEFAULT_PAYOUT_SUCCESS';
const DEFAULT_PAYOUT_FAIL = 'payments/DEFAULT_PAYOUT_FAIL';

const REMOVE_PAYOUT = 'payments/REMOVE_PAYOUT';
const REMOVE_PAYOUT_SUCCESS = 'payments/REMOVE_PAYOUT_SUCCESS';
const REMOVE_PAYOUT_FAIL = 'payments/REMOVE_PAYOUT_FAIL';

const initialState = {
  braintree_loading: false,
  braintree_token: null,
  payments_loading: false,
  payments_loaded: false,
  payment_creating: false,
  payout_creating: false,
  payment_methods: [],
  payout_methods: [],
};

function makeDefaultMethod(array, token, name = 'token') {
  let index = -1;
  const new_array = array.map((c, i) => {
    if (c[name] === token) {
      index = i;
      return {...c, default: true};
    }
    return {...c, default: false};
  });
  return index > -1 ? [...new_array] : [...array];
}

function removeDefaultPayment(array, token, name = 'token') {
  const new_array = array.filter(c => c[name] !== token) || [];
  if (new_array.length > 0 && !new_array.find(c => c.default)) {
    new_array[0].default = true;
  }
  return [...new_array];
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_TOKEN:
      return { ...state, braintree_loading: true, braintree_error: null };
    case LOAD_TOKEN_SUCCESS:
      return { ...state, braintree_loading: false, braintree_token: action.result.token};
    case LOAD_TOKEN_FAIL:
      return { ...state, braintree_loading: false, braintree_error: action.error };
    case LOAD_PAYMENTS:
      return { ...state, payments_loading: true, payment_loading_error: null };
    case LOAD_PAYMENTS_SUCCESS:
      return { ...state, payments_loading: false, payments_loaded: true, payment_methods: action.result.payment_methods};
    case LOAD_PAYMENTS_FAIL:
      return { ...state, payments_loading: false, payments_loaded: false, payment_loading_error: action.error };
    case LOAD_TRANSACTIONS:
      return { ...state, transactions_loading: true, transactions_loading_error: null };
    case LOAD_TRANSACTIONS_SUCCESS:
      return { ...state, transactions_loading: false, transactions: action.result.transactions};
    case LOAD_TRANSACTIONS_FAIL:
      return { ...state, transactions_loading: false, transactions_loading_error: action.error };
    case SELECT_DEFAULT:
    case CREATE_PAYMENT:
    case REMOVE_BRAINTREE_METHOD:
      return { ...state, payment_creating: true, payment_creating_error: null };
    case CREATE_PAYMENT_SUCCESS:
      return { ...state, payment_creating: false};
    case SELECT_DEFAULT_SUCCESS:
      return { ...state, payment_creating: false, payment_methods: makeDefaultMethod(state.payment_methods, action.token) };
    case REMOVE_BRAINTREE_METHOD_SUCCESS:
      return { ...state, payment_creating: false, payment_methods: removeDefaultPayment(state.payment_methods, action.token) };
    case SELECT_DEFAULT_FAIL:
    case CREATE_PAYMENT_FAIL:
    case REMOVE_BRAINTREE_METHOD_FAIL:
      return { ...state, payment_creating: false, payment_creating_error: action.error };
    case LOAD_PAYOUT:
      return { ...state, payout_loaded: false, payout_loading: true };
    case LOAD_PAYOUT_SUCCESS:
      return { ...state, payout_loaded: true, payout_loading: false, payout_methods: action.result.payouts };
    case LOAD_PAYOUT_FAIL:
      return { ...state, payout_loaded: false, payout_loading: false };
    case DEFAULT_PAYOUT:
    case REMOVE_PAYOUT:
      return { ...state, payout_loaded: false, payout_loading: true };
    case DEFAULT_PAYOUT_SUCCESS:
      return { ...state, payout_loaded: true, payout_loading: false, payout_methods: makeDefaultMethod(state.payout_methods, action.id, 'id') };
    case DEFAULT_PAYOUT_FAIL:
    case REMOVE_PAYOUT_FAIL:
      return { ...state, payout_loaded: false, payout_loading: false };
    case REMOVE_PAYOUT_SUCCESS:
      return { ...state, payout_loaded: true, payout_loading: false, payout_methods: removeDefaultPayment(state.payout_methods, action.id, 'id') };
    case CREATE_PAYOUT:
      return { ...state, payout_creating: true };
    case CREATE_PAYOUT_SUCCESS: {
      const payouts = [...state.payout_methods];
      payouts.push(action.result.payout);
      return { ...state, payout_creating: false, payout_methods: payouts };
    }
    case CREATE_PAYOUT_FAIL:
      return { ...state, payout_creating: false };
    case SAVE_ADDRESS:
      return { ...state, address: action.result };
    case CLEAR_ADDRESS:
      return { ...state, address: null };
    default:
      return state;
  }
}

export function loadBraintreeToken() {
  return {
    types: [LOAD_TOKEN, LOAD_TOKEN_SUCCESS, LOAD_TOKEN_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/payments/braintree/generate_token`)
  };
}

export function loadPayments() {
  return {
    types: [LOAD_PAYMENTS, LOAD_PAYMENTS_SUCCESS, LOAD_PAYMENTS_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/users/payment_methods`).then(r => {return r;})
  };
}

export function loadTransactions() {
  return {
    types: [LOAD_TRANSACTIONS, LOAD_TRANSACTIONS_SUCCESS, LOAD_TRANSACTIONS_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/payments/braintree/transactions`).then(r => {return r;})
  };
}

export function createBraintreePayment(data) {
  return (dispatch, getState) => {
    const st = getState();
    data = {...data, billing_address: (st.payments.address || {})};
    return dispatch({
      types: [CREATE_PAYMENT, CREATE_PAYMENT_SUCCESS, CREATE_PAYMENT_FAIL],
      promise: (client) => client.post(`${config.apiPrefix}/payments/braintree/create_payment_method`, {data}).then(r => {
        dispatch(loadPayments());
        return Promise.resolve(r);
      })
    });
  };
}

export function createStripePayment(data) {
  return (dispatch, getState) => {
    const st = getState();
    data = {...data, billing_address: (st.payments.address || {})};
    return dispatch({
      types: [CREATE_PAYMENT, CREATE_PAYMENT_SUCCESS, CREATE_PAYMENT_FAIL],
      promise: (client) => client.post(`${config.apiPrefix}/payments/stripe`, {data}).then(r => {
        dispatch(loadPayments());
        return Promise.resolve(r);
      })
    });
  };
}

export function createPayout(data, type) {
  return (dispatch, getState) => {
    const st = getState();
    data = {...data, ...(st.payments.address || {}), method_type: type};
    return dispatch({
      types: [CREATE_PAYOUT, CREATE_PAYOUT_SUCCESS, CREATE_PAYOUT_FAIL],
      promise: (client) => client.post(`${config.apiPrefix}/payments/payouts`, {data}).then(r => {
        return Promise.resolve(r);
      })
    });
  };
}

export function loadPayout() {
  return (dispatch) => {
    return dispatch({
      types: [LOAD_PAYOUT, LOAD_PAYOUT_SUCCESS, LOAD_PAYOUT_FAIL],
      promise: (client) => client.get(`${config.apiPrefix}/payments/payouts`).then(r => {
        return Promise.resolve(r);
      })
    });
  };
}

export function selectDefaultPayment(data) {
  return (dispatch) => {
    return dispatch({
      token: data.token,
      types: [SELECT_DEFAULT, SELECT_DEFAULT_SUCCESS, SELECT_DEFAULT_FAIL],
      promise: (client) => client.put(`${config.apiPrefix}/payments/braintree/make_default`, {data}).then(r => {
        // dispatch(loadPayments());
        return Promise.resolve(r);
      })
    });
  };
}

export function selectDefaultPayout(id) {
  return (dispatch) => {
    return dispatch({
      id,
      types: [DEFAULT_PAYOUT, DEFAULT_PAYOUT_SUCCESS, DEFAULT_PAYOUT_FAIL],
      promise: (client) => client.put(`${config.apiPrefix}/payments/payouts/${id}/make_default`).then(r => {
        // dispatch(loadPayments());
        return Promise.resolve(r);
      })
    });
  };
}

export function removePayout(id) {
  return (dispatch) => {
    return dispatch({
      id,
      types: [REMOVE_PAYOUT, REMOVE_PAYOUT_SUCCESS, REMOVE_PAYOUT_FAIL],
      promise: (client) => client.del(`${config.apiPrefix}/payments/payouts/${id}`).then(r => {
        // dispatch(loadPayments());
        return Promise.resolve(r);
      })
    });
  };
}

export function removePayment(data) {
  return (dispatch) => {
    return dispatch({
      token: data.token,
      types: [REMOVE_BRAINTREE_METHOD, REMOVE_BRAINTREE_METHOD_SUCCESS, REMOVE_BRAINTREE_METHOD_FAIL],
      promise: (client) => client.del(`${config.apiPrefix}/payments/braintree/remove_payment_method`, {data}).then(r => {
        // dispatch(loadPayments());
        return Promise.resolve(r);
      })
    });
  };
}

export function saveAddress(data) {
  return {
    types: ['', SAVE_ADDRESS, ''],
    promise: () => Promise.resolve(data),
  };
}

export function clearAddress() {
  return {
    types: ['', CLEAR_ADDRESS, ''],
    promise: () => Promise.resolve(''),
  };
}
