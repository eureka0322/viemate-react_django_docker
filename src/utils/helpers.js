import jump from 'jump.js';
import cookie from 'react-cookie';

export function selectLocation(location) {
  if (cookie) {
    const chosen_location = cookie.load('chosen_location');
    if (!chosen_location || chosen_location !== location) {
      cookie.save('chosen_location', location, {path: '/'});
    }
  }
}

export function truncateMiddleString(str, length, separator) {
  if (str.length <= length) return str;

  separator = separator || '...';

  const sepLen = separator.length;
  const charsToShow = length - sepLen;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return str.substr(0, frontChars) + separator + str.substr(str.length - backChars);
}

export function truncString(str, length, separator) {
  separator = separator || '...';
  return (typeof str === 'string' && str.length > length ? str.substring(0, length) + separator : str);
}

export function fireEvent(node, eventName) {
  let doc = {};
  if (node.ownerDocument) {
    doc = node.ownerDocument;
  } else if (node.nodeType === 9) {
    doc = node;
  }
  if (node.dispatchEvent) {
    let eventClass = '';
    switch (eventName) {
      case 'click':
      case 'mousedown':
      case 'mouseup':
        eventClass = 'MouseEvents';
        break;
      case 'focus':
      case 'change':
      case 'blur':
      case 'select':
        eventClass = 'HTMLEvents';
        break;
      default:
        break;
    }
    const event = doc.createEvent(eventClass);
    event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

    event.synthetic = true; // allow detection of synthetic events
    // The second parameter says go ahead with the default action
    node.dispatchEvent(event, true);
  } else if (node.fireEvent) {
    // IE-old school style
    const event = doc.createEventObject();
    event.synthetic = true; // allow detection of synthetic events
    node.fireEvent('on' + eventName, event);
  }
}

export function executionEnvironment() {
  const canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

  return {
    canUseDOM,
    canUseWorkers: typeof Worker !== 'undefined',
    canUseEventListeners: canUseDOM && !!(window.addEventListener || window.attachEvent),
    canUseViewport: canUseDOM && !!window.screen
  };
}

export function setBodyClassname(className) {
  if (!executionEnvironment().canUseDOM && !className) {
    return 0;
  }
  const d = document;
  const g = d.getElementsByTagName('body')[0];
  g.className = className;
  return 1;
}

export function getWindowHeight() {
  if (!executionEnvironment().canUseDOM) {
    return 0;
  }
  const w = window;
  const d = document;
  const e = d.documentElement;
  const g = d.getElementsByTagName('body')[0];
  return w.innerHeight || e.clientHeight || g.clientHeight;
}

export function getWindowWidth() {
  if (!executionEnvironment().canUseDOM) {
    return 0;
  }
  const w = window;
  const d = document;
  const e = d.documentElement;
  const g = d.getElementsByTagName('body')[0];
  return w.innerWidth || e.clientWidth || g.clientWidth;
}

export function getDeviceType() {
  if (!executionEnvironment().canUseDOM) {
    return 'desktop';
  }
  const w = window || null;
  const d = document;
  const e = d.documentElement;
  const g = d.getElementsByTagName('body')[0];
  const witdh = w.innerWidth || e.clientWidth || g.clientWidth;
  if (witdh <= 767) {
    return 'mobile';
  }
  if (witdh > 767 && witdh <= 991) {
    return 'tablet';
  }
  return 'desktop';
}

export function getScrollTop() {
  return window.pageYOffset || document.documentElement.scrollTop;
}

export function scrollToXY(x = 0, y = 0) {
  if (executionEnvironment().canUseDOM) {
    window.scrollTo(x, y);
  }
  return true;
}

export function getScreenHeight() {
  return Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
}

export function wrappWithObj(name, value) {
  if (!name) {
    return {};
  }
  const res = {};
  res[name] = value;
  return res;
}

/*eslint-disable */
export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};


export function nFormatter(num = 0, digits) {
  var si = [
    { value: 1E18, symbol: "E" },
    { value: 1E15, symbol: "P" },
    { value: 1E12, symbol: "T" },
    { value: 1E9,  symbol: "G" },
    { value: 1E6,  symbol: "M" },
    { value: 1E3,  symbol: "k" }
  ], i;
  for (i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[i].symbol;
    }
  }
  return num.toString();
}
/*eslint-enable */

export function detectOpenInNewTab(e) {
  if (
      e.nativeEvent.ctrlKey ||
      e.nativeEvent.shiftKey ||
      e.nativeEvent.metaKey || // apple
      (e.nativeEvent.button && e.nativeEvent.button === 1) // middle click, >IE9 + everyone else
  ) {
    return true;
  }
  return false;
}

export function historyState(id, stateKey, link) {
  const history = window.history;
  if (id && !history.state[stateKey]) {
    history.pushState({ [stateKey]: true }, '', link);
  } else if (history.state[stateKey]) {
    history.back();
    history.state[stateKey] = false;
  }
}

export function scrollToFirstError(obj = {}, extraHeight = 0) {
  // const w = window;
  const d = document;
  const errors = Object.keys(obj);
  const errorsLength = errors.length;

  let i = 0;
  let elementError;

  while (i <= errorsLength) {
    elementError = d.getElementsByName(errors[i])[0];
    if (elementError) break;
    i++; // eslint-disable-line
  }
  if (elementError) {
    // const elementVerticalPosition = (elementError.parentElement.getBoundingClientRect().top + w.pageYOffset) - extraHeight;
    // elementError.focus();
    // w.scrollTo(0, elementVerticalPosition);
    jump(elementError.parentElement, {
      offset: extraHeight * -1
    });
  }
}

export function parseAddressComponents(arr) {
  /* eslint-disable */
  let street_number = '',
      route = '',
      address = {};

  arr.forEach(c => {
    switch(c.types[0]) {
      case 'street_number':
        street_number = c.short_name;
        break;
      case 'route':
        route = c.short_name;
        break;
      case 'postal_code':
        address.postalCode = c.short_name;
        break;
      case 'neighborhood':
      case 'sublocality_level_1':
        address.neighborhood = !address.neighborhood ? c.short_name : address.neighborhood;
        break;
      case 'locality':
        address.neighborhood = !address.neighborhood ? c.short_name : address.neighborhood;
        address.city = !address.city ? c.long_name : address.city;
        break;
      case 'administrative_area_level_1':
        address.state = c.short_name;
        address.city = !address.city ? c.long_name : address.city;
        break;
      case 'country':
        address.country = c.long_name;
        break;
    }
  });
  address.street = (street_number && route)
    ? `${street_number} ${route}`
    : arr[0].short_name;

  // console.log('PARSE_ADDRESS', address);
  return address;
  /* eslint-enable */
}

export function capitalizeFirst(str) {
  return str && str[0].toUpperCase() + str.slice(1);
}

export function truncateUserName(name, only_first = false) {
  if (name) {
    const name_array = name.split(' ');
    if (name_array.length > 1) {
      if (only_first) {
        return name_array[0];
      }
      const last_n = name_array[name_array.length - 1];
      name_array[name_array.length - 1] = `${last_n.slice(0, 1)}.`;
      return name_array.join(' ');
    }
    return name;
  }
  return '';
}

export function formatPrice(f_obj) {
  if (f_obj.price) {
    if (f_obj.price.from <= 0 && f_obj.price.to >= 10000) {
      delete f_obj.price;
    } else if (f_obj.price.to >= 10000) {
      f_obj.price.to = 10000000;
    }
  }
  return {...f_obj};
}

export function clearObject(obj) {
  if (typeof obj === 'object') {
    const temp_obj = {};
    Object.keys(obj).forEach(c => {
      if (obj[c]) {
        temp_obj[c] = obj[c];
      }
    });
    return {...temp_obj};
  }
  return {...obj};
}

export function tagsToString(input_obj, exc_regex = false) {
  if (typeof input_obj === 'object' && Object.keys(input_obj).length > 0) {
    const obj = {...input_obj};
    if (obj.tag_list) delete obj.tag_list;
    const temp_tags = [];
    Object.keys(obj).forEach(c => {
      if (typeof obj[c] === 'boolean' && (!exc_regex || !exc_regex.test(c)) && obj[c]) {
        temp_tags.push(c);
        delete obj[c];
      }
    });
    if (temp_tags.length > 0) {
      obj.tag_list = temp_tags.join(',');
    }
    return {...obj};
  }
  return input_obj;
}

export function stripTags(text) {
  return text.replace(/(<([^>]+)>)/ig, '');
}

export function clearSpaces(text) {
  if (!text && typeof text !== 'string') {
    return text;
  }
  return text.replace(/^ +| $| (?= )/g, '');
}

export function handlePageReload(e) {
  const { pristine } = this.props;
  if (pristine) return false;

  const confirmationMessage = 'Changes you made may not be saved'; // won't work in chrome. this is default chrome message

  e.returnValue = confirmationMessage; // Gecko, Trident, Chrome 34+
  return confirmationMessage; // Gecko, WebKit, Chrome < 34
}
