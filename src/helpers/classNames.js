import {executionEnvironment} from 'utils/helpers';

export const addBodyClass = (className) => {
  if (executionEnvironment().canUseDOM) {
    const currentClassNames = document.body.className.replace(/^\s+|\s+$/g, '');
    document.body.className = currentClassNames + ' ' + className;
  }
};

export const removeBodyClass = (className) => {
  if (executionEnvironment().canUseDOM) {
    document.body.className = document.body.className.replace(className, '');
    document.body.className = document.body.className.replace('  ', ' ');
  }
};

export const removeAllBodyClass = () => {
  if (executionEnvironment().canUseDOM) {
    document.body.className = '';
  }
};

export const addHtmlClass = (className) => {
  if (executionEnvironment().canUseDOM) {
    const currentClassNames = document.documentElement.className.replace(/^\s+|\s+$/g, '');
    document.documentElement.className = currentClassNames + ' ' + className;
  }
};

export const removeHtmlClass = (className) => {
  if (executionEnvironment().canUseDOM) {
    document.documentElement.className = document.documentElement.className.replace(className, '');
    document.documentElement.className = document.documentElement.className.replace('  ', ' ');
  }
};
