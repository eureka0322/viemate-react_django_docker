import config from 'config';
import bounds from 'utils/location_bounds';
import { clearObject, formatPrice, tagsToString, scrollToXY } from 'utils/helpers';

const CLEAR = 'products/CLEAR';
const CLEAR_OWN = 'products/CLEAR_OWN';

const SET_STATUS = 'products/SET_STATUS';

const UPDATE_PRODUCTS = 'products/UPDATE_PRODUCTS';

const LOAD = 'products/LOAD';
const LOAD_SUCCESS = 'products/LOAD_SUCCESS';
const LOAD_FAIL = 'products/LOAD_FAIL';

const SET_FILTERS = 'products/SET_FILTERS';

const LOAD_MANAGED = 'products/LOAD_MANAGED';
const LOAD_MANAGED_SUCCESS = 'products/LOAD_MANAGED_SUCCESS';
const LOAD_MANAGED_FAIL = 'products/LOAD_MANAGED_FAIL';

const LOAD_BEST = 'products/LOAD_BEST';
const LOAD_BEST_SUCCESS = 'products/LOAD_BEST_SUCCESS';
const LOAD_BEST_FAIL = 'products/LOAD_BEST_FAIL';

const GET_BOUND = 'maps/GET_BOUND';
const GET_BOUND_SUCCESS = 'maps/GET_BOUND_SUCCESS';
const GET_BOUND_FAIL = 'maps/GET_BOUND_FAIL';

const CHANGE_VIEW = 'products/CHANGE_VIEW';

const initialState = {
  loaded: false,
  managed_loaded: false,
  loading: false,
  products: [],
  managed_products: [],
  filters: {},
  allowed_filters: {},
  pagination: {},
  page: 1,
  query: {},
  map_view: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
    case LOAD_MANAGED:
      return {
        ...state,
        loading: true
      };
    case LOAD_BEST:
      return {
        ...state,
        loading_best: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        products: action.result.posts || [],
        allowed_filters: action.result.meta.filters || {},
        pagination: action.result.meta.pagination || {},
        page: action.page || 1
      };
    case LOAD_BEST_SUCCESS:
      return {
        loading_best: false,
        loaded_best: true,
        best_posts: action.result.posts || [],
        pagination_best: action.result.meta.pagination || {}
      };
    case CLEAR:
      return {
        ...state,
        loaded: false,
        products: []
      };
    case CLEAR_OWN:
      return {
        ...state,
        managed_loaded: false,
        managed_products: []
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOAD_BEST_FAIL:
      return {
        ...state,
        loading_best: false,
        loaded_best: false,
        error: action.error
      };
    case LOAD_MANAGED_FAIL:
      return {
        ...state,
        loading: false,
        managed_loaded: false,
        error: action.error
      };
    case LOAD_MANAGED_SUCCESS:
      return {
        ...state,
        loading: false,
        managed_loaded: true,
        managed_products: action.result.posts || []
      };
    case SET_FILTERS:
      return {
        ...state,
        filters: {...action.result},
        query: {...action.query}
      };
    case GET_BOUND_SUCCESS:
      return {
        ...state,
        center: action.result.center,
      };
    case SET_STATUS:
      return {
        ...state,
        managed_products: state.managed_products.map(c => c.id !== action.post.id ? c : { ...action.post })
      };
    case UPDATE_PRODUCTS:
      return {
        ...state,
        products: action.post.status === 'published'
          ? [{ ...action.post }, ...state.products]
          : state.products.filter(c => c.id !== action.post.id)
      };
    case CHANGE_VIEW:
      return {
        ...state,
        ...action.result,
      };
    default:
      return state;
  }
}

export function loadManaged() {
  return {
    types: [LOAD_MANAGED, LOAD_MANAGED_SUCCESS, LOAD_MANAGED_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/posts`)
  };
}

export function load(page) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    page,
    promise: (client) => client.get(`${config.apiPrefix}/posts/offered`, {params: {page, per_page: 18}})
  };
}

export function load_best(per_page = 14) {
  return {
    types: [LOAD_BEST, LOAD_BEST_SUCCESS, LOAD_BEST_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/posts/featured`, {params: {page: 1, per_page}})
  };
}

export function applyFilters(query, page = 1, getBackRequest = () => {}) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    page,
    promise: (client) => client.post(`${config.apiPrefix}/posts/search`, {data: query, params: {page, per_page: 18}, getBackRequest}).then(r => {
      scrollToXY();
      return r;
    })
  };
}

export function setFilters(data, page, getBackRequest = () => {}) {
  // if (!data.lease_type_temporary) {
  //   data.lease_type_temporary = false;
  // }
  // if (!data.lease_type_take_over) {
  //   data.lease_type_take_over = false;
  // }
  return (dispatch, getState) => {
    const state = getState();
    // if (JSON.stringify(data) === JSON.stringify(state.products.filters)) {
    //   return dispatch({
    //     types: ['', SET_FILTERS, ''],
    //     query: state.products.query,
    //     promise: () => Promise.resolve(data)
    //   });
    // }
    const obj = clearObject(formatPrice({...state.products.filters, ...data}));
    let query = clearObject(formatPrice({...state.products.query, ...data}));
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
      promise: () => dispatch(applyFilters(query, page, getBackRequest)).then(() => obj)
    });
  };
}

export function changeFilters(data) {
  return (dispatch) => {
    // if (JSON.stringify(data) === JSON.stringify(state.products.filters)) {
    //   return dispatch({
    //     types: ['', SET_FILTERS, ''],
    //     query: state.products.query,
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
  return (dispatch, getState) => {
    const state = getState();
    const query = {location: state.products.query.location};
    const obj = {location: state.products.filters.location};
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
    const obj = {...state.products.filters};
    if (obj[name]) {
      delete obj[name];
    }
    return dispatch(changeFilters(obj));
  };
}

export function getCityBounds(city) {
  return {
    types: [GET_BOUND, GET_BOUND_SUCCESS, GET_BOUND_FAIL],
    promise: () => new Promise((resolve, reject) => {
      if (bounds[city]) {
        return resolve(bounds[city]);
      }
      return reject();
    })
  };
}

export function clearProducts() {
  return {
    type: CLEAR
  };
}

export function clearManagedProducts() {
  return {
    type: CLEAR_OWN
  };
}

export function setStatus(post) {
  return {
    type: SET_STATUS,
    post
  };
}

export function updateProducts(post) {
  return {
    type: UPDATE_PRODUCTS,
    post
  };
}

export function changeView(map_view) {
  return {
    type: CHANGE_VIEW,
    result: {map_view}
  };
}
