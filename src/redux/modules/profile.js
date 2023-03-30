import config from 'config';
import {unreadNotifications} from './auth';

const UPDATE_PASSWORD = 'profile/UPDATE_PASSWORD';
const UPDATE_PASSWORD_SUCCESS = 'profile/UPDATE_PASSWORD_SUCCESS';
const UPDATE_PASSWORD_FAIL = 'profile/UPDATE_PASSWORD_FAIL';

const VERIFY_PHONE = 'profile/VERIFY_PHONE';
const VERIFY_PHONE_SUCCESS = 'profile/VERIFY_PHONE_SUCCESS';
const VERIFY_CODE_SUCCESS = 'profile/VERIFY_CODE_SUCCESS';
const VERIFY_PHONE_FAIL = 'profile/VERIFY_PHONE_FAIL';

const CANCEL_CODE = 'profile/CANCEL_CODE';

const VERIFY_ID = 'profile/VERIFY_ID';
const VERIFY_ID_SUCCESS = 'profile/VERIFY_ID_SUCCESS';
const VERIFY_ID_FAIL = 'profile/VERIFY_ID_FAIL';

const UPDATE_USER = 'profile/UPDATE_USER';
const UPDATE_USER_SUCCESS = 'profile/UPDATE_USER_SUCCESS';
const UPDATE_USER_FAIL = 'profile/UPDATE_USER_FAIL';

const LOAD_NOTIF = 'user/LOAD_NOTIF';
const LOAD_NOTIF_SUCCESS = 'user/LOAD_NOTIF_SUCCESS';
const LOAD_NOTIF_FAIL = 'user/LOAD_NOTIF_FAIL';

const CLEAR_NOTIF = 'user/CLEAR_NOTIF';

const LOAD = 'profile/LOAD';
const LOAD_SUCCESS = 'profile/LOAD_SUCCESS';
const LOAD_FAIL = 'profile/LOAD_FAIL';

const LOAD_POSTS = 'profile/LOAD_POSTS';
const LOAD_POSTS_SUCCESS = 'profile/LOAD_POSTS_SUCCESS';
const LOAD_POSTS_FAIL = 'profile/LOAD_POSTS_FAIL';

const INIT_JUMIO = 'jumio/INIT_JUMIO';
const INIT_JUMIO_SUCCESS = 'jumio/INIT_JUMIO_SUCCESS';
const INIT_JUMIO_FAIL = 'jumio/INIT_JUMIO_FAIL';

const CLEAR = 'profile/CLEAR';

const initialProfileState = {
  loaded: false,
  loading: false,
  profile: {},
  loading_posts: false,
  loaded_posts: false,
  posts: []
};

const initialState = {
  updating: false,
  updated: false,
  phone_verified: false,
  id_loading: false,
  code_sended: false,
  notifications_loading: false,
  notifications: [],
  ...initialProfileState
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_PASSWORD:
      return { ...state, updating: true, updated: false };
    case UPDATE_PASSWORD_SUCCESS:
      return { ...state, updating: false, updated: true };
    case UPDATE_PASSWORD_FAIL:
      return { ...state, updating: false, updated: false };
    case VERIFY_PHONE:
      return { ...state, verifying: true };
    case VERIFY_PHONE_SUCCESS:
      return { ...state, verifying: false, code_sended: true, phone: action.phone };
    case VERIFY_CODE_SUCCESS:
      return { ...state, verifying: false, phone_verified: true };
    case VERIFY_PHONE_FAIL:
      return { ...state, verifying: false, error: action.error };
    case CANCEL_CODE:
      return { ...state, verifying: false, code_sended: false };
    case VERIFY_ID:
      return { ...state, id_loading: true };
    case VERIFY_ID_SUCCESS:
      return { ...state, id_loading: false };
    case VERIFY_ID_FAIL:
      return { ...state, id_loading: false, error: action.error };
    case INIT_JUMIO:
      return { ...state, jumio_initializing: true };
    case INIT_JUMIO_SUCCESS:
      return { ...state, jumio_initializing: false, jumio_token: action.result.authorizationToken };
    case INIT_JUMIO_FAIL:
      return { ...state, jumio_initializing: false, error: action.error };
    case LOAD_NOTIF:
      return { ...state, notifications_loading: true };
    case LOAD_NOTIF_SUCCESS:
      return { ...state, notifications_loading: false, notifications: [...state.notifications, ...action.result.notifications], notifications_meta: action.result.meta };
    case LOAD_NOTIF_FAIL:
      return { ...state, notifications_loading: false, notifications: [...state.notifications], error: action.error };
    case CLEAR_NOTIF:
      return { ...state, notifications_loading: false, notifications: []};
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        profile: action.result.user || {}
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case CLEAR:
      return {
        ...state,
        ...initialProfileState
      };
    case LOAD_POSTS:
      return {
        ...state,
        loading_posts: true
      };
    case LOAD_POSTS_SUCCESS:
      return {
        ...state,
        loading_posts: false,
        loaded_posts: true,
        posts: action.result.posts || []
      };
    case LOAD_POSTS_FAIL:
      return {
        ...state,
        loading_posts: false,
        loaded_posts: false,
        error: action.error
      };
    default:
      return state;
  }
}

export function getCode(phone_number) {
  return {
    types: [VERIFY_PHONE, VERIFY_PHONE_SUCCESS, VERIFY_PHONE_FAIL],
    phone: phone_number,
    promise: (client) => client.post(`${config.apiPrefix}/users/phone_confirm_request`, { data: {phone_number} }),
  };
}

export function verifyCode(phone_confirm_code) {
  return {
    types: [VERIFY_PHONE, VERIFY_CODE_SUCCESS, VERIFY_PHONE_FAIL],
    promise: (client) => client.post(`${config.apiPrefix}/users/phone_auth`, { data: {phone_confirm_code} }),
  };
}

export function cancelCode() {
  return {
    types: ['', CANCEL_CODE, ''],
    promise: () => Promise.resolve(''),
  };
}

export function verifyId() {
  return {
    types: ['', '', ''],
    promise: () => Promise.resolve(),
  };
}

export function uploadId(id, data, cb = () => {}) {
  // console.log(data);
  return {
    types: [VERIFY_ID, VERIFY_ID_SUCCESS, VERIFY_ID_FAIL],
    promise: (client) => client.post(`${config.apiPrefix}/users/${id}/attachments`, { attachments: data, handleProgress: cb }),
  };
}

export function updateProfile(data, id) {
  return {
    types: [UPDATE_USER, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL],
    promise: (client) => client.put(`${config.apiPrefix}/users/${id}`, { data }),
  };
}

export function loadNotifications(page = 1, getResp = () => {}, per_page = 10) {
  return (dispatch) => {
    return dispatch({
      types: [LOAD_NOTIF, LOAD_NOTIF_SUCCESS, LOAD_NOTIF_FAIL],
      promise: (client) => client.get(`${config.apiPrefix}/notifications`, {params: {per_page, page}, getBackRequest: getResp}).then(r => {
        dispatch(unreadNotifications());
        return r;
      }),
    });
  };
}

export function clearNotifications() {
  return {
    types: ['', CLEAR_NOTIF, ''],
    promise: () => Promise.resolve('')
  };
}

export function load(id) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: client => client.get(`${config.apiPrefix}/users/${id}`)
  };
}

export function clear() {
  return {
    type: CLEAR
  };
}

export function loadPosts(id) {
  return {
    types: [LOAD_POSTS, LOAD_POSTS_SUCCESS, LOAD_POSTS_FAIL],
    promise: client => client.get(`${config.apiPrefix}/users/${id}/posts`)
  };
}

export function initializeJumio() {
  return {
    types: [INIT_JUMIO, INIT_JUMIO_SUCCESS, INIT_JUMIO_FAIL],
    promise: client => client.get(`${config.apiPrefix}/jumio_init`)
  };
}

export function resultJumio(data) {
  return {
    types: [INIT_JUMIO, INIT_JUMIO_SUCCESS, INIT_JUMIO_FAIL],
    promise: client => client.post(`${config.apiPrefix}/jumio_result`, {data})
  };
}
