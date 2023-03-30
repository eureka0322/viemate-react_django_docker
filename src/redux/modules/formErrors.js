const SET_ERROR = 'form/SET_ERROR';

const initialState = {
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_ERROR:
      return { ...state, ...(action.result) };
    default:
      return state;
  }
}

export function setError(name, value) {
  const result = {};
  result[name] = value;
  return { type: SET_ERROR, result };
}

export function clearError(name) {
  const result = {};
  result[name] = null;
  return { type: SET_ERROR, result };
}
