import config from 'config';
import {showAuth, showEmail} from 'redux/modules/modals';

const LOAD_SUCCESS = 'auth/LOAD_SUCCESS';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const REGISTER_SUCCESS = 'auth/REGISTER_SUCCESS';
const LOGOUT = 'auth/LOGOUT';

const ADD_FAVORITE = 'favorites/ADD_FAVORITE';
const ADD_FAVORITE_SUCCESS = 'favorites/ADD_FAVORITE_SUCCESS';
const ADD_FAVORITE_FAIL = 'favorites/ADD_FAVORITE_FAIL';

const LOAD_OFFERED = 'favorites/LOAD_OFFERED';
const LOAD_OFFERED_SUCCESS = 'favorites/LOAD_OFFERED_SUCCESS';
const LOAD_OFFERED_FAIL = 'favorites/LOAD_OFFERED_FAIL';

const LOAD_WANTED = 'favorites/LOAD_WANTED';
const LOAD_WANTED_SUCCESS = 'favorites/LOAD_WANTED_SUCCESS';
const LOAD_WANTED_FAIL = 'favorites/LOAD_WANTED_FAIL';

const REMOVE_FAVORITE = 'favorites/REMOVE_FAVORITE';
const REMOVE_FAVORITE_SUCCESS = 'favorites/REMOVE_FAVORITE_SUCCESS';
const REMOVE_FAVORITE_FAIL = 'favorites/REMOVE_FAVORITE_FAIL';

const initialState = {
  offered: [],
  wanted: [],
  offered_posts: [],
  posts_loading: false,
  wanted_posts: [],
  adding: false,
};

function splitFavorites(state, action) {
  if (!!action.result && !!action.result.user && action.result.user.favorites) {
    return {...state, offered: action.result.user.favorites.offered || [], wanted: action.result.user.favorites.wanted || [] };
  }
  return {...state};
}

function addFavoritesType(offered, wanted, id, post_type) {
  switch (post_type) {
    case 'offered': {
      if (offered.find(c => id === c)) {
        return {offered, wanted};
      }
      return {offered: [...offered, id], wanted};
    }
    case 'wanted': {
      if (wanted.find(c => id === c)) {
        return {offered, wanted};
      }
      return {wanted: [...wanted, id], offered};
    }
    default:
      return {offered, wanted};
  }
}

function rmFavoritesType(offered, wanted, id, post_type, wanted_posts, offered_posts) {
  switch (post_type) {
    case 'offered':
      return {offered: offered.filter(c => c !== id), wanted, offered_posts: offered_posts.filter(c => c.id !== id), wanted_posts};
    case 'wanted':
      return {wanted: wanted.filter(c => c !== id), offered, wanted_posts: wanted_posts.filter(c => c.id !== id), offered_posts};
    default:
      return {offered, wanted};
  }
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case LOAD_SUCCESS:
    case REGISTER_SUCCESS:
      return splitFavorites(state, action);
    case ADD_FAVORITE:
    case REMOVE_FAVORITE:
      return {...state, adding: true};
    case ADD_FAVORITE_SUCCESS:
      return {...state, adding: false, ...addFavoritesType([...state.offered], [...state.wanted], action.id, action.post_type, [...state.wanted_posts], [...state.offered_posts])};
    case REMOVE_FAVORITE_SUCCESS:
      return {...state, adding: false, ...rmFavoritesType([...state.offered], [...state.wanted], action.id, action.post_type, [...state.wanted_posts], [...state.offered_posts])};
    case ADD_FAVORITE_FAIL:
    case REMOVE_FAVORITE_FAIL:
      return {...state, adding: false};
    case LOAD_WANTED:
    case LOAD_OFFERED:
      return {...state, posts_loading: true};
    case LOAD_WANTED_SUCCESS:
      return {...state, wanted_posts: action.result.posts || [], posts_loading: false};
    case LOAD_OFFERED_SUCCESS:
      return {...state, offered_posts: action.result.posts || [], posts_loading: false};
    case LOAD_WANTED_FAIL:
    case LOAD_OFFERED_FAIL:
      return {...state, posts_loading: false};
    case LOGOUT:
      return {...initialState};
    default:
      return {...state};
  }
}

function addItem(id, type) {
  return {
    types: [ADD_FAVORITE, ADD_FAVORITE_SUCCESS, ADD_FAVORITE_FAIL],
    post_type: type,
    id,
    promise: (client) => client.post(`${config.apiPrefix}/favorites`, {data: {id}})
  };
}

export function addToFavorite(id, type) {
  return (dispatch, getState) => {
    const st = getState();
    if (!st.auth.user) {
      return dispatch(showAuth(() => dispatch(addItem(id, type))));
    }
    if (st.auth.user && !st.auth.user.email_present) return dispatch(showEmail(() => dispatch(addItem(id, type))));

    return dispatch(addItem(id, type));
  };
}

export function removeFavorite(id, type) {
  return {
    types: [REMOVE_FAVORITE, REMOVE_FAVORITE_SUCCESS, REMOVE_FAVORITE_FAIL],
    post_type: type,
    id,
    promise: (client) => client.del(`${config.apiPrefix}/favorites/${id}`)
  };
}

export function loadFavWanted() {
  return {
    types: [LOAD_WANTED, LOAD_WANTED_SUCCESS, LOAD_WANTED_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/favorites`, {params: {post_type: 'wanted'}})
  };
}

export function loadFavOffered() {
  return {
    types: [LOAD_OFFERED, LOAD_OFFERED_SUCCESS, LOAD_OFFERED_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/favorites`, {params: {post_type: 'offered'}})
  };
}
