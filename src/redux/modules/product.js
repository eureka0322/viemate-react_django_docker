import config from 'config';
import { showNotification, showDefault } from './notifications';
import { load as loadAuth } from './auth';

const LOAD = 'product/LOAD';
const LOAD_SUCCESS = 'product/LOAD_SUCCESS';
const LOAD_FAIL = 'product/LOAD_FAIL';

const ACTIVATION = 'product/ACTIVATION';
const ACTIVATION_SUCCESS = 'product/ACTIVATION_SUCCESS';
const ACTIVATION_FAIL = 'product/ACTIVATION_FAIL';

const ADD_NEW = 'product/ADD_NEW';
const ADD_NEW_SUCCESS = 'product/ADD_NEW_SUCCESS';
const ADD_NEW_FAIL = 'product/ADD_NEW_FAIL';

const EDIT = 'product/EDIT';
const EDIT_SUCCESS = 'product/EDIT_SUCCESS';
const EDIT_FAIL = 'product/EDIT_FAIL';

const ADD_ATTACH = 'product/ADD_ATTACH';
const ADD_ATTACH_SUCCESS = 'product/ADD_ATTACH_SUCCESS';
const ADD_ATTACH_FAIL = 'product/ADD_ATTACH_FAIL';

const DEL_ATTACH = 'product/DEL_ATTACH';
const DEL_ATTACH_SUCCESS = 'product/DEL_ATTACH_SUCCESS';
const DEL_ATTACH_FAIL = 'product/DEL_ATTACH_FAIL';

const CLEAR = 'product/CLEAR';

const UPDATE = 'product/UPDATE';

const initialState = {
  loaded: false,
  loading: false,
  activation_loading: false,
  product: {},
  attachments: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
    case ADD_NEW:
    case EDIT:
    case ADD_ATTACH:
    case DEL_ATTACH:
      return {
        ...state,
        loading: true,
        error: null
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        activation_loading: false,
        loaded: true,
        product: action.result.post || {}
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        activation_loading: false,
        loaded: false,
        error: action.error,
        product: {}
      };
    case ADD_NEW_FAIL:
    case ADD_ATTACH_FAIL:
    case EDIT_FAIL:
    case DEL_ATTACH_FAIL:
      return {
        ...state,
        loading: false,
        activation_loading: false,
        loaded: false,
        error: action.error
      };
    case ADD_NEW_SUCCESS:
    case EDIT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        product: action.result.post || {}
      };
    case ADD_ATTACH_SUCCESS:
      return {
        ...state,
        loaded: true,
        loading: false,
        product: { ...state.product, attachments: [...action.result.attachments] }
      };
    case DEL_ATTACH_SUCCESS:
      return {
        ...state,
        loading: false
      };
    case ACTIVATION:
      return {
        ...state,
        activation_loading: true
      };
    case ACTIVATION_SUCCESS:
      return {
        ...state,
        activation_loading: false
      };
    case ACTIVATION_FAIL:
      return {
        ...state,
        activation_loading: false,
        error: action.error
      };
    case UPDATE:
      return {
        ...state,
        product: { ...action.post }
      };
    case CLEAR:
      return { ...initialState };
    default:
      return state;
  }
}

export function load(id) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: client => client.get(`${config.apiPrefix}/posts/${id}`)
  };
}

export function sendToApprove(id) {
  return {
    types: [ACTIVATION, ACTIVATION_SUCCESS, ACTIVATION_FAIL],
    promise: client => client.put(`${config.apiPrefix}/posts/${id}/send_to_approve`)
  };
}

export function activate(id, post_type) {
  return (dispatch, getState) => {
    const st = getState();
    const user = st.auth.user;

    if (!user.admin && ((post_type === 'offered' && user.has_published_offered) || (post_type === 'wanted' && user.has_published_wanted))) {
      dispatch(showDefault('has_published_post', 0));
      return Promise.reject('Oops! Looks like you have an active post');
    }
    return dispatch({
      types: [ACTIVATION, ACTIVATION_SUCCESS, ACTIVATION_FAIL],
      promise: client => client.put(`${config.apiPrefix}/posts/${id}/activate`)
      .then(r => dispatch(loadAuth()).then(() => Promise.resolve(r)))
      .catch(err => {
        let error = null;
        if (err.body) {
          if (typeof err.body.error === 'string') {
            error = err.body.error;
          } else if (err.body.errors && Array.isArray(err.body.errors)) {
            error = err.body.errors[0];
          }
        }
        if (error) dispatch(showNotification('activation_error', {text: error, type: 'error'}));
        return Promise.reject(err);
      })
    });
  };
}

export function deactivate(id, feedback) {
  return (dispatch) => {
    return dispatch({
      types: [ACTIVATION, ACTIVATION_SUCCESS, ACTIVATION_FAIL],
      promise: client => client.put(`${config.apiPrefix}/posts/${id}/deactivate`, {
        data: {
          feedback
        }
      })
      .then(r => dispatch(loadAuth()).then(() => Promise.resolve(r)))
    });
  };
}

export function clear() {
  return {
    type: LOAD_SUCCESS,
    result: { post: {} }
  };
}

export function clearData() {
  return {
    type: CLEAR,
  };
}

export function addNew(product, postType, uncompleted = false) {
  return {
    types: [ADD_NEW, ADD_NEW_SUCCESS, ADD_NEW_FAIL],
    promise: client => client.post(`${config.apiPrefix}/posts`, {
      data: {
        post: { ...product, post_type: postType, uncompleted }
      }
    })
  };
}

export function addAttach(id, data, handleProgress = () => {}) {
  return {
    types: [ADD_ATTACH, ADD_ATTACH_SUCCESS, ADD_ATTACH_FAIL],
    promise: client => client.post(`${config.apiPrefix}/posts/${id}/attachments/create_batch`, {
      attachments: data,
      handleProgress
    })
  };
}

export function delAttach(id, attachId) {
  return {
    types: [DEL_ATTACH, DEL_ATTACH_SUCCESS, DEL_ATTACH_FAIL],
    promise: client => client.del(`${config.apiPrefix}/posts/${id}/attachments/${attachId}`)
  };
}

export function edit(product) {
  return {
    types: [EDIT, EDIT_SUCCESS, EDIT_FAIL],
    promise: client => client.put(`${config.apiPrefix}/posts/${product.id}`, {
      data: {
        post: { ...product }
      }
    })
  };
}

export function setCover(id, attachId) {
  return {
    types: [DEL_ATTACH, DEL_ATTACH_SUCCESS, DEL_ATTACH_FAIL],
    promise: client => client.post(`${config.apiPrefix}/posts/${id}/attachments/${attachId}/set_main`)
  };
}

export function update(post) {
  return {
    type: UPDATE,
    post
  };
}
