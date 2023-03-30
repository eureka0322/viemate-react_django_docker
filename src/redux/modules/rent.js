import config from 'config';
import { showNotification } from './notifications';

const APPLY_RENT = 'rent/APPLY_RENT';
const APPLY_RENT_SUCCESS = 'rent/APPLY_RENT_SUCCESS';
const APPLY_RENT_FAIL = 'rent/APPLY_RENT_FAIL';

const LOAD_REQUESTS = 'rent/LOAD_REQUESTS';
const LOAD_REQUESTS_SUCCESS = 'rent/LOAD_REQUESTS_SUCCESS';
const LOAD_REQUESTS_FAIL = 'rent/LOAD_REQUESTS_FAIL';

const UPDATE_REQUESTS = 'rent/UPDATE_REQUESTS';
const UPDATE_REQUESTS_SUCCESS = 'rent/UPDATE_REQUESTS_SUCCESS';
const UPDATE_REQUESTS_FAIL = 'rent/UPDATE_REQUESTS_FAIL';

const CANCELING_REQUEST = 'rent/CANCELING_REQUEST';
const CANCELING_REQUEST_SUCCESS = 'rent/CANCELING_REQUEST_SUCCESS';
const CANCELING_REQUEST_FAIL = 'rent/CANCELING_REQUEST_FAIL';

const initialState = {
  renting: false,
  req_loading: false,
  req_updating: false,
  req_canceling: false,
  transactions: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case APPLY_RENT:
      return { ...state, renting: true, renting_error: null };
    case APPLY_RENT_SUCCESS:
      return { ...state, renting: false, rent_result: action.result};
    case APPLY_RENT_FAIL:
      return { ...state, renting: false, renting_error: action.error };
    case LOAD_REQUESTS:
      return { ...state, req_loading: true, req_loading_error: null };
    case LOAD_REQUESTS_SUCCESS:
      return { ...state, req_loading: false, requests: action.result, transactions: (action.result && action.result.bookings) ? action.result.bookings.filter(c => c.status === 'paid') : []};
    case LOAD_REQUESTS_FAIL:
      return { ...state, req_loading: false, req_loading_error: action.error };
    case UPDATE_REQUESTS:
      return { ...state, req_updating: true, req_updating_error: null };
    case CANCELING_REQUEST:
      return { ...state, req_canceling: true, req_updating_error: null };
    case CANCELING_REQUEST_SUCCESS:
    case UPDATE_REQUESTS_SUCCESS: {
      let index = -1;
      const requests = [...state.requests.bookings];
      requests.forEach((c, i) => {
        if (c.id === action.result.booking.id) {
          index = i;
        }
        return c;
      });
      if (index >= 0) {
        requests[index] = action.result.booking;
      }
      return { ...state, req_updating: false, req_canceling: false, requests: {...state.requests, bookings: requests}};
    }
    case CANCELING_REQUEST_FAIL:
    case UPDATE_REQUESTS_FAIL:
      return { ...state, req_updating: false, req_canceling: false, req_updating_error: action.error };
    default:
      return state;
  }
}

export function applyForRent(data, id) {
  return {
    types: [APPLY_RENT, APPLY_RENT_SUCCESS, APPLY_RENT_FAIL],
    promise: (client) => client.post(`${config.apiPrefix}/posts/${id}/bookings`, {data})
  };
}

export function approveRent(post_id, book_id) {
  return {
    types: [UPDATE_REQUESTS, UPDATE_REQUESTS_SUCCESS, UPDATE_REQUESTS_FAIL],
    object_type: 'seller',
    promise: (client) => client.put(`${config.apiPrefix}/posts/${post_id}/bookings/${book_id}/approve`)
  };
}

export function declineRent(post_id, book_id) {
  return {
    types: [CANCELING_REQUEST, CANCELING_REQUEST_SUCCESS, CANCELING_REQUEST_FAIL],
    object_type: 'seller',
    promise: (client) => client.put(`${config.apiPrefix}/posts/${post_id}/bookings/${book_id}/decline`)
  };
}

export function cancelRent(post_id, book_id) {
  return {
    types: [CANCELING_REQUEST, CANCELING_REQUEST_SUCCESS, CANCELING_REQUEST_FAIL],
    object_type: 'buyer',
    promise: (client) => client.put(`${config.apiPrefix}/posts/${post_id}/bookings/${book_id}/cancel`)
  };
}

export function payRent(post_id, book_id) {
  return (dispatch) => {
    return dispatch({
      types: [UPDATE_REQUESTS, UPDATE_REQUESTS_SUCCESS, UPDATE_REQUESTS_FAIL],
      object_type: 'buyer',
      promise: (client) => client.put(`${config.apiPrefix}/posts/${post_id}/bookings/${book_id}/pay`).then(r => {
        dispatch(showNotification('pay_ok', {text: 'Payment completed successfully. Payment will be released after you check in.', type: 'success'}));
        return Promise.resolve(r);
      })
      .catch(err => {
        dispatch(showNotification('pay_error', {text: 'Your payment was not successful. Please try again or select a different payment method.', type: 'error'}));
        return Promise.reject(err);
      })
    });
  };
}

export function loadRequests() {
  return {
    types: [LOAD_REQUESTS, LOAD_REQUESTS_SUCCESS, LOAD_REQUESTS_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/users/bookings`)
  };
}
