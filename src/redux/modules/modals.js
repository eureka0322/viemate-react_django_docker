const TOGGLE_MODAL = 'modals/TOGGLE_MODAL';
const SHOW_AUTH = 'modals/SHOW_AUTH';
const HIDE_AUTH = 'modals/HIDE_AUTH';

const SHOW_EMAIL = 'modals/SHOW_EMAIL';
const HIDE_EMAIL = 'modals/HIDE_EMAIL';

const initialState = {
  auth_opened: false,
  email_opened: false,
  hidden_email: false,
  location_opened: false,
  confirmation_opened: false,
  authCallback: () => {},
  emailCallback: () => {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case TOGGLE_MODAL:
      return { ...state, [action.result]: !state[action.result] };
    case SHOW_AUTH:
      return { ...state, auth_opened: true, authCallback: action.callback, hidden_email: action.hidden_email };
    case HIDE_AUTH:
      return { ...state, auth_opened: false, authCallback: () => {}, hidden_email: false };
    case SHOW_EMAIL:
      return { ...state, email_opened: true, emailCallback: action.callback };
    case HIDE_EMAIL:
      return { ...state, email_opened: false, emailCallback: () => {} };
    default:
      return state;
  }
}

export function toggleModal(modal) {
  return { type: TOGGLE_MODAL, result: modal };
}

export function showAuth(callback = () => {}, hidden_email = false) {
  return {
    type: SHOW_AUTH,
    callback,
    hidden_email
  };
}

export function hideAuth() {
  return {
    type: HIDE_AUTH,
  };
}

export function showEmail(callback = () => {}) {
  return {
    type: SHOW_EMAIL,
    callback,
  };
}

export function hideEmail() {
  return {
    type: HIDE_EMAIL,
  };
}
