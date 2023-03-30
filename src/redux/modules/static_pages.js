import config from 'config';

const LOAD = 'static_pages/LOAD';
const LOAD_SUCCESS = 'static_pages/LOAD_SUCCESS';
const LOAD_FAIL = 'static_pages/LOAD_FAIL';

const LOAD_LIST = 'static_pages/LOAD_LIST';
const LOAD_LIST_SUCCESS = 'static_pages/LOAD_LIST_SUCCESS';
const LOAD_LIST_FAIL = 'static_pages/LOAD_LIST_FAIL';

const initialState = {
  list: [],
  list_loaded: false,
  loading: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return { ...state, loading: true };
    case LOAD_SUCCESS:
      return { ...state, loading: false, [`${action.name}_loaded`]: true, [`${action.name}_page`]: action.result.static_page };
    case LOAD_FAIL:
      return { ...state, loading: false, [`${action.name}_loaded`]: false, [`${action.name}_page`]: null, [`${action.name}_error`]: action.error };
    case LOAD_LIST:
      return { ...state };
    case LOAD_LIST_SUCCESS:
      return { ...state, list_loaded: true, list: action.result.static_pages || [] };
    case LOAD_LIST_FAIL:
      return { ...state, list_loaded: false, list: [] };
    default:
      return state;
  }
}

export function loadPage(id) {
  return {
    name: id,
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/static_pages/${id}`),
  };
}

export function loadList() {
  return {
    types: [LOAD_LIST, LOAD_LIST_SUCCESS, LOAD_LIST_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/static_pages`),
  };
}

