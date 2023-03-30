const SET = 'waypoints/ADD';

const initialState = {
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET:
      return { ...state, ...(action.result) };
    default:
      return state;
  }
}

export function setWaypoint(name, value = true) {
  return {
    types: ['', SET, ''],
    promise: () => Promise.resolve({[name]: !!value}),
  };
}

