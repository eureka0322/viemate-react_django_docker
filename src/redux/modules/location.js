import cookie from 'react-cookie';
import cookieServer from 'utils/cookie';
import cities from 'utils/available_cities';

const SAVE_LOCATION = 'location/SAVE_LOCATION';

const SAVE_PREFIX = 'modals/SAVE_PREFIX';
const CLEAR_PREFIX = 'modals/CLEAR_PREFIX';

const initialState = {
  prefix: null,
  location: ''
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SAVE_LOCATION:
      return { ...state, location: action.result };
    case SAVE_PREFIX:
      return { ...state, prefix: action.result };
    case CLEAR_PREFIX:
      return { ...state, prefix: null };
    default:
      return state;
  }
}

export function saveLocation(location) {
  if (!cities.find(c => c.value === location)) {
    return { type: SAVE_LOCATION, result: '' };
  }
  cookie.save('chosen_location', location, {expires: new Date(3e3, 0), path: '/'});
  return { type: SAVE_LOCATION, result: location };
}

export function savePrefix(prefix) {
  return { type: SAVE_PREFIX, result: prefix };
}

export function clearPrefix() {
  return { type: CLEAR_PREFIX };
}

export function initializeLocation(req) {
  const server_cookie = !!req && req.get('cookie');
  const cookie_location = !!server_cookie && cookieServer.getServer(server_cookie, 'chosen_location');
  const location = req ? cookie_location : (cookie.load('chosen_location'));
  return (dispatch) => {
    return dispatch(saveLocation(location));
  };
}
