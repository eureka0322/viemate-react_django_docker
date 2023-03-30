import config from 'config';

const SEND = 'contact_us/SEND';
const SEND_SUCCESS = 'contact_us/SEND_SUCCESS';
const SEND_FAIL = 'contact_us/SEND_FAIL';

const initialState = {
  sending: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SEND:
      return { ...state, sending: true };
    case SEND_SUCCESS:
      return { ...state, sending: false };
    case SEND_FAIL:
      return { ...state, sending: false };
    default:
      return state;
  }
}

export function sendMessage(data) {
  return {
    types: [SEND, SEND_SUCCESS, SEND_FAIL],
    promise: (client) => client.post(`${config.apiPrefix}/support`, {data}),
  };
}

