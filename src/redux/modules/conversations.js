import config from 'config';
import { unreadMessages } from './auth';
import {reverse} from 'lodash';

const LOAD_ALL = 'conversations/LOAD_ALL';
const LOAD_ALL_SUCCESS = 'conversations/LOAD_ALL_SUCCESS';
const LOAD_ALL_FAIL = 'conversations/LOAD_ALL_FAIL';

const LOAD = 'conversations/LOAD';
const LOAD_SUCCESS = 'conversations/LOAD_SUCCESS';
const LOAD_FAIL = 'conversations/LOAD_FAIL';

const UPDATE = 'conversations/UPDATE';

const CREATE = 'conversations/CREATE';
const CREATE_SUCCESS = 'conversations/CREATE_SUCCESS';
const CREATE_FAIL = 'conversations/CREATE_FAIL';

const DELETE = 'conversations/DELETE';
const DELETE_SUCCESS = 'conversations/DELETE_SUCCESS';
const DELETE_FAIL = 'conversations/DELETE_FAIL';

// const LOAD_MESSAGES = 'conversations/LOAD_MESSAGES';
// const LOAD_MESSAGES_SUCCESS = 'conversations/LOAD_MESSAGES_SUCCESS';
// const LOAD_MESSAGES_FAIL = 'conversations/LOAD_MESSAGES_FAIL';

const CREATE_MESSAGE = 'conversations/CREATE_MESSAGE';
const CREATE_MESSAGE_SUCCESS = 'conversations/CREATE_MESSAGE_SUCCESS';
const CREATE_MESSAGE_FAIL = 'conversations/CREATE_MESSAGE_FAIL';

const DELETE_MESSAGE = 'conversations/DELETE_MESSAGE';
const DELETE_MESSAGE_SUCCESS = 'conversations/DELETE_MESSAGE_SUCCESS';
const DELETE_MESSAGE_FAIL = 'conversations/DELETE_MESSAGE_FAIL';

const CLEAR_CONV = 'conversations/CLEAR_CONV';

const initialState = {
  loaded: false,
  loading: false,
  conv_loaded: false,
  conv_loading: false,
  conv_deleting: false,
  loading_message: false,
  conversation: [],
  original_conversation: [],
  conversations: [],
  conversation_meta: {},
};

function updateConversationReducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE: {
      const conversations = [...state.conversations];
      let i_id = -1;
      conversations.find((c, i) => {
        if (c.id === action.id) {
          i_id = i;
        }
        return c.id === action.id;
      });
      if (i_id > -1) {
        conversations[i_id] = {...conversations[i_id], unread_messages: 0};
      }
      return {...state, conversations};
    }
    default:
      return {...state};
  }
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
    case CREATE:
      return {...state, conv_loading: true };
    case LOAD_SUCCESS:
    case CREATE_SUCCESS:
      return {...state, conv_loading: false, conv_loaded: true, original_conversation: [...state.original_conversation, ...((action.result && action.result.messages) || [])], conversation: reverse([...state.original_conversation, ...((action.result && action.result.messages) || [])]), conversation_meta: (action.result && action.result.meta) || {} };
    case LOAD_FAIL:
    case CREATE_FAIL:
      return {...state, conv_loading: false, conv_loaded: false };
    case LOAD_ALL:
      return {...state, loading: true };
    case LOAD_ALL_SUCCESS:
      return {...state, loading: false, loaded: true, conversation: [], original_conversation: [], conversations: (action.result && action.result.conversations) || [], inbox_count: (action.result && action.result.meta && action.result.meta.pagination.total_objects) || 0 };
    case LOAD_ALL_FAIL:
      return {...state, loading: false, loaded: false };
    case CREATE_MESSAGE:
      return {...state, loading_message: true };
    case CREATE_MESSAGE_SUCCESS:
      return {...state, loading_message: false, conversation: [...state.conversation, action.result.message] };
    case CREATE_MESSAGE_FAIL:
      return {...state, loading_message: false };
    case DELETE:
      return {...state, conv_deleting: true };
    case DELETE_SUCCESS:
      return {...state, conv_deleting: false, conversation: [], original_conversation: [], conversations: [...(state.conversations.filter((c) => c.id !== action.id) || [])], inbox_count: state.inbox_count - 1 };
    case DELETE_FAIL:
      return {...state, conv_deleting: false };
    case DELETE_MESSAGE:
      return {...state, loading_message: true };
    case DELETE_MESSAGE_SUCCESS:
      return {...state, loading_message: false };
    case DELETE_MESSAGE_FAIL:
      return {...state, loading_message: false };
    case CLEAR_CONV: {
      return {...initialState};
    }
    case UPDATE: {
      return {...updateConversationReducer(state, action)};
    }
    default:
      return {...state};
  }
}

export function updateConversation(id) {
  return {
    type: UPDATE,
    id
  };
}

export function loadConversation(id, page = 1) {
  return (dispatch) => {
    return dispatch({
      types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
      promise: (client) => client.get(`${config.apiPrefix}/conversations/${id}/messages`, {params: {page}}).then((r) => {
        dispatch(updateConversation(id));
        dispatch(unreadMessages());
        return r;
      })
    });
  };
}

export function createConversation(data) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.post(`${config.apiPrefix}/conversations`, {data})
  };
}

export function deleteConversation(id) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    id,
    promise: (client) => client.del(`${config.apiPrefix}/conversations/${id}`)
  };
}

export function createMessage(id, data) {
  return {
    types: [CREATE_MESSAGE, CREATE_MESSAGE_SUCCESS, CREATE_MESSAGE_FAIL],
    promise: (client) => client.post(`${config.apiPrefix}/conversations/${id}/messages`, {data})
  };
}

export function loadConversations() {
  return {
    types: [LOAD_ALL, LOAD_ALL_SUCCESS, LOAD_ALL_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/conversations`)
  };
}

export function clearConverstions() {
  return {
    type: CLEAR_CONV
  };
}
