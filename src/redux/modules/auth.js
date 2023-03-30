import cookie from 'react-cookie';
import config from 'config';
import { executionEnvironment } from 'utils/helpers';

const LOAD = 'auth/LOAD';
const LOAD_SUCCESS = 'auth/LOAD_SUCCESS';
const LOAD_FAIL = 'auth/LOAD_FAIL';

const LOGOUT = 'auth/LOGOUT';

const LOGIN = 'auth/LOGIN';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'auth/LOGIN_FAIL';

const REGISTER = 'auth/REGISTER';
const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
const REGISTER_FAIL = 'auth/REGISTER_FAIL';

const CONFIRM = 'auth/CONFIRM';
const CONFIRM_SUCCESS = 'auth/CONFIRM_SUCCESS';
const CONFIRM_FAIL = 'auth/CONFIRM_FAIL';

const SEND_PASS_RESTORE = 'auth/SEND_PASS_RESTORE';
const SEND_PASS_RESTORE_SUCCESS = 'auth/SEND_PASS_RESTORE_SUCCESS';
const SEND_PASS_RESTORE_FAIL = 'auth/SEND_PASS_RESTORE_FAIL';

const RESTORE_PASS = 'auth/RESTORE_PASS';
const RESTORE_PASS_SUCCESS = 'auth/RESTORE_PASS_SUCCESS';
const RESTORE_PASS_FAIL = 'auth/RESTORE_PASS_FAIL';

const SOCIAL_AUTH = 'auth/SOCIAL_AUTH';
const SOCIAL_AUTH_SUCCESS = 'auth/SOCIAL_AUTH_SUCCESS';
const SOCIAL_AUTH_FAIL = 'auth/SOCIAL_AUTH_FAIL';

const UPDATE_USER = 'profile/UPDATE_USER';
const UPDATE_USER_SUCCESS = 'profile/UPDATE_USER_SUCCESS';
const UPDATE_USER_FAIL = 'profile/UPDATE_USER_FAIL';

const UNREAD_LOAD_SUCCESS = 'profile/UNREAD_COUNT_SUCCESS';
const UNREAD_LOAD_FAIL = 'profile/UNREAD_COUNT_FAIL';

const UNREAD_NOTIF_SUCCESS = 'profile/NOTIF_COUNT_SUCCESS';
const UNREAD_NOTIF_FAIL = 'profile/NOTIF_COUNT_FAIL';

const VERIFY_CODE_SUCCESS = 'profile/VERIFY_CODE_SUCCESS';

const VERIFY_ID_SUCCESS = 'profile/VERIFY_ID_SUCCESS';

const initialState = {
  loading: false,
  loaded: false,
  loggingIn: false,
  loggingOut: false,
  user: null,
  unread_messages: 0,
};

const clearCookies = () => {
  cookie.remove('uid', {path: '/'});
  cookie.remove('client', {path: '/'});
  cookie.remove('access-token', {path: '/'});
  cookie.remove('expiry', {path: '/'});
  return true;
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return { ...state, loading: true };
    case LOAD_SUCCESS:
      return { ...state, loading: false, loaded: true, user: action.result.user, error: null };
    case LOAD_FAIL:
      clearCookies();
      return { ...state, loading: false, loaded: false, user: null, error: action.error };

    case UPDATE_USER:
      return { ...state, updating: true };
    case UPDATE_USER_SUCCESS:
      return { ...state, updating: false, updated: true, user: action.result.user, error: null };
    case UPDATE_USER_FAIL:
      return { ...state, updating: false, updated: false, error: action.error };

    case VERIFY_CODE_SUCCESS:
      return { ...state, user: {...state.user, profile: {...state.user.profile, phone_confirmed: true}} };

    case LOGIN:
      return { ...state, loggingIn: true, error: null };
    case SOCIAL_AUTH_SUCCESS:
    case LOGIN_SUCCESS:
      return { ...state, loggingIn: false, loaded: true, user: action.result.user, error: null };
    case LOGIN_FAIL:
      clearCookies();
      return { ...state, loggingIn: false, loaded: false, user: null, error: action.error };

    case REGISTER:
      return { ...state, loggingIn: true, error: null };
    case REGISTER_SUCCESS:
      return { ...state, loggingIn: false, loaded: true, user: action.result.user, error: null };
    case REGISTER_FAIL:
      return { ...state, loggingIn: false, loaded: false, error: action.error };

    case CONFIRM:
      return { ...state, confirm_status: 'progress', error: null };
    case CONFIRM_SUCCESS:
      return { ...state, confirm_status: 'success', loaded: true, user: action.result.user };
    case CONFIRM_FAIL:
      return { ...state, confirm_status: 'fail', error: action.error };

    case UNREAD_LOAD_SUCCESS:
      return { ...state, unread_messages: action.result.unread_count || 0 };
    case UNREAD_LOAD_FAIL:
      return { ...state, unread_messages: 0 };

    case UNREAD_NOTIF_SUCCESS:
      return { ...state, unread_count: action.result.unread_count || 0 };
    case UNREAD_NOTIF_FAIL:
      return { ...state, unread_count: 0 };

    case VERIFY_ID_SUCCESS:
      return { ...state, user: {...state.user, attachments: [...[action.result.attachment]]} };

    case LOGOUT:
      clearCookies();
      return { initialState };

    default:
      return state;
  }
}

export function unreadMessages() {
  return {
    types: ['', UNREAD_LOAD_SUCCESS, UNREAD_LOAD_FAIL],
    promise: client => client.get(`${config.apiPrefix}/users/unread_messages`)
  };
}

export function unreadNotifications() {
  return {
    types: ['', UNREAD_NOTIF_SUCCESS, UNREAD_NOTIF_FAIL],
    promise: client => client.get(`${config.apiPrefix}/notifications/unread_count`)
  };
}

export function logIn({ email, password }) {
  return (dispatch) => {
    return dispatch({
      types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
      promise: client => client.post(`${config.apiPrefix}/auth/sign_in`, { data: { email, password } }).then(r => new Promise((resolve) => {
        return Promise.all([dispatch(unreadMessages()), dispatch(unreadNotifications())]).then(() => resolve(r), () => resolve(r));
      }))
    });
  };
}

export function register({ email, password, first_name = 'Name', last_name = 'LastName' }) {
  return {
    types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAIL],
    promise: client => client.post(`${config.apiPrefix}/auth`, { data: { email, password, first_name, last_name, password_confirmation: password } })
  };
}

export function load() {
  return (dispatch) => {
    return dispatch({
      types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
      promise: client => client.get(`${config.apiPrefix}/auth/validate_token`).then(r => new Promise((resolve) => {
        return Promise.all([dispatch(unreadMessages()), dispatch(unreadNotifications())]).then(() => resolve(r), () => resolve(r));
      }))
    });
  };
}

export function logOut() {
  return {
    types: ['', LOGOUT, LOGOUT],
    promise: client => client.del(`${config.apiPrefix}/auth/sign_out`)
  };
}

export function changePass(data) {
  return {
    types: ['', '', ''],
    promise: client => client.put(`${config.apiPrefix}/auth/password`, {data})
  };
}

export function resetPass(data) {
  return {
    types: ['', '', ''],
    promise: client => client.post(`${config.apiPrefix}/auth/password`, {data: {...data, redirect_url: `${config.domain}/reset_password`}})
  };
}

export function facebook_auth(data) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: client => client.post(`${config.apiPrefix}/social/facebook`, {params: {user_id: data.id, access_token: data.accessToken}})
  };
}

export function google_auth(data) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: client => client.post(`${config.apiPrefix}/social/google`, {data})
  };
}

// old functions
const saveTokens = (data) => {
  if (executionEnvironment().canUseDOM) {
    cookie.save('tokens', { access: data.data.accessToken, refresh: data.data.refreshToken }, { path: '/' });
  }
  return data;
};

export function isLoaded(store) {
  return (!!store.auth && !!store.auth.user) || !!store.auth.error;
}

export function confirm(confirm_code) {
  return {
    types: [CONFIRM, CONFIRM_SUCCESS, CONFIRM_FAIL],
    promise: client => client.get('/confirm', { params: { confirm_code } }).then(saveTokens)
  };
}

export function sendPasswordRestore({ login }) {
  return {
    types: [SEND_PASS_RESTORE, SEND_PASS_RESTORE_SUCCESS, SEND_PASS_RESTORE_FAIL],
    promise: client => client.get('/send-restore', { params: { login } })
  };
}

export function restorePassword({ restore_code, password }) {
  return {
    types: [RESTORE_PASS, RESTORE_PASS_SUCCESS, RESTORE_PASS_FAIL],
    promise: client => client.get('/restore', { params: { restore_code, password } })
  };
}

export function socialAuth(token) {
  return {
    types: [SOCIAL_AUTH, SOCIAL_AUTH_SUCCESS, SOCIAL_AUTH_FAIL],
    promise: client => client.get('/facebook-login', { params: { token } }).then(saveTokens)
  };
}

