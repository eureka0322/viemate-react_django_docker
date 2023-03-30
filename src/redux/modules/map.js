const SET_PARAMS = 'map/SET_PARAMS';

const CLEAR_DIRECTIONS = 'map/CLEAR_DIRECTIONS';

const ADD_VIEWED = 'map/ADD_VIEWED';

const initialDirections = {
  directions_loading: false,
  directions: null,
  directions_markers: [],
  hide_init_markers: false,
  travel_mode: 'DRIVING',
  travel_time: null,
};

const initialState = {
  ...initialDirections,
  viewed_posts: [],
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PARAMS:
      return {
        ...state,
        ...action.result
      };
    case CLEAR_DIRECTIONS:
      return {
        // ...initialState
        ...state,
        ...initialDirections
      };
    case ADD_VIEWED: {
      const markers = [...state.viewed_posts];
      if (!markers.find(c => c === action.result)) {
        markers.push(action.result);
      }
      return {
        ...state,
        viewed_posts: [...markers],
      };
    }
    default:
      return state;
  }
}

export function setParams(params = {}) {
  return {
    type: SET_PARAMS,
    result: params
  };
}

export function clearDirections() {
  return {type: CLEAR_DIRECTIONS};
}

export function addViewedPost(id) {
  return {
    type: ADD_VIEWED,
    result: id,
  };
}
