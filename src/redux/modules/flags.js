const SET = 'flags/SET';

const initialState = {
  hide_header: false,
  hide_footer: false,
  active_request: -1,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET:
      return { ...state, ...(action.result) };
    default:
      return state;
  }
}

export function setFlag(name, value) {
  return {
    types: ['', SET, ''],
    promise: () => Promise.resolve({[name]: value}),
  };
}

