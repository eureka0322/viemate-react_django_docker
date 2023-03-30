const SET_TYPE = 'screen/SET_TYPE';
const SET_RESOLUTION = 'screen/SET_RESOLUTION';

const initialState = {
  screen_type: 'desktop',
  screen_resolution: 1920,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_TYPE:
      return {...state, screen_type: action.result};
    case SET_RESOLUTION:
      return {...state, screen_resolution: action.result};
    default:
      return {...state};
  }
}

export function setScreenType(screen_resolution) {
  const detectType = () => {
    switch (true) {
      case screen_resolution <= 767:
        return 'mobile';
      case screen_resolution > 767 && screen_resolution <= 991:
        return 'tablet';
      default:
        return 'desktop';
    }
  };
  return {
    type: SET_TYPE,
    result: detectType(),
  };
}

export function setScreenResolution(screen_resolution) {
  return {
    type: SET_RESOLUTION,
    result: Math.floor(parseFloat(screen_resolution)),
  };
}
