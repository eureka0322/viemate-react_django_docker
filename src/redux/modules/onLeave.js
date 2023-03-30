const SET_CONFIRM = 'form/SET_CONFIRM';

const initialState = {
  confirmation: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CONFIRM:
      return { ...state, ...(action.result) };
    default:
      return state;
  }
}

export function confirmNeeded() {
  return {
    types: ['', SET_CONFIRM, ''],
    promise: () => Promise.resolve({confirmation: true}),
  };
}

export function confirmLeave() {
  return {
    types: ['', SET_CONFIRM, ''],
    promise: () => Promise.resolve({confirmation: false}),
  };
}
