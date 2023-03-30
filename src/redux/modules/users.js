import config from 'config';
import { clearObject, formatPrice, tagsToString, scrollToXY } from 'utils/helpers';

const CLEAR = 'users/CLEAR';

const LOAD = 'users/LOAD';
const LOAD_SUCCESS = 'users/LOAD_SUCCESS';
const LOAD_FAIL = 'users/LOAD_FAIL';

const SET_FILTERS = 'users/SET_FILTERS';

const UPDATE_USERS = 'users/UPDATE_USERS';

const initialState = {
  loaded: false,
  loading: false,
  users: [],
  filters: {},
  allowed_filters: {},
  pagination: {},
  page: 1,
  query: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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
        users: action.result.posts || [],
        pagination: action.result.meta.pagination || {},
        page: action.page || 1
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
        loaded: false,
        users: []
      };
    case SET_FILTERS:
      return {
        ...state,
        filters: {...action.result},
        query: {...action.query}
      };
    case UPDATE_USERS:
      return {
        ...state,
        users: action.post.status === 'published'
          ? [{ ...action.post }, ...state.users]
          : state.users.filter(c => c.id !== action.post.id)
      };
    default:
      return state;
  }
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/posts/wanted`)
  };
}

export function clear() {
  return {
    type: CLEAR
  };
}

export function applyFilters(query, page = 1) {
  return (dispatch, getState) => {
    const state = getState();
    const location = state.location.location;
    return dispatch({
      types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
      page,
      promise: (client) => client.post(`${config.apiPrefix}/posts/search`, {data: {...query, address: location, post_type: 'wanted'}, params: {page, per_page: 24}}).then(r => {
        scrollToXY();
        return r;
      })
    });
  };
}

export function setFilters(data, page) {
  // if (!data.lease_type_temporary) {
  //   data.lease_type_temporary = false;
  // }
  // if (!data.lease_type_take_over) {
  //   data.lease_type_take_over = false;
  // }
  return (dispatch, getState) => {
    const state = getState();
    // if (JSON.stringify(data) === JSON.stringify(state.users.filters)) {
    //   return dispatch({
    //     types: ['', SET_FILTERS, ''],
    //     query: state.users.query,
    //     promise: () => Promise.resolve(data)
    //   });
    // }
    const obj = clearObject(formatPrice({...state.users.filters, ...data}));
    let query = clearObject(formatPrice({...state.users.query, ...data}));
    // Object.keys(obj).forEach(c => {
    //   query = {...query, ...(typeof obj[c] === 'string' ? {[c]: obj[c]} : obj[c])};
    // });
    if (query.dates) {
      query = {
        ...query,
        date: {
          from: query.dates.start_date,
          to: query.dates.end_date,
        }
      };
      delete query.dates;
    }
    query = tagsToString(query, /lease_type_/);
    return dispatch({
      types: ['', SET_FILTERS, ''],
      query,
      promise: () => dispatch(applyFilters(query, page)).then(() => obj)
    });
  };
}

export function changeFilters(data) {
  return (dispatch) => {
    // if (JSON.stringify(data) === JSON.stringify(state.users.filters)) {
    //   return dispatch({
    //     types: ['', SET_FILTERS, ''],
    //     query: state.users.query,
    //     promise: () => Promise.resolve(data)
    //   });
    // }
    const obj = clearObject({...data});
    let query = clearObject({...data});
    // Object.keys(obj).forEach(c => {
    //   query = {...query, ...(typeof obj[c] === 'string' ? {[c]: obj[c]} : obj[c])};
    // });
    if (query.dates) {
      query = {
        ...query,
        date: {
          from: query.dates.start_date,
          to: query.dates.end_date,
        }
      };
      delete query.dates;
    }
    query = tagsToString(query, /lease_type_/);
    return dispatch({
      types: ['', SET_FILTERS, ''],
      query,
      promise: () => dispatch(applyFilters(query)).then(() => obj)
    });
  };
}

export function clearAllFilters() {
  return (dispatch) => {
    const query = {};
    const obj = {};
    return dispatch({
      types: ['', SET_FILTERS, ''],
      query,
      promise: () => dispatch(applyFilters(query)).then(() => obj)
    });
  };
}

export function clearFilter(name) {
  return (dispatch, getState) => {
    const state = getState();
    const obj = {...state.users.filters};
    if (obj[name]) {
      delete obj[name];
    }
    return dispatch(changeFilters(obj));
  };
}

export function updateUsers(post) {
  return {
    type: UPDATE_USERS,
    post
  };
}
