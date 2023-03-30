import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import { reducer as form } from 'redux-form';

import auth from './auth';
import products from './products';
import product from './product';
import profile from './profile';
import users from './users';
import formErrors from './formErrors';
import location from './location';
import modals from './modals';
import onLeave from './onLeave';
import notification_messages from './notifications';
import initialAppState from './initialAppState';
import conversations from './conversations';
import map from './map';
import screen_type from './screen';
import favorites from './favorites';
import payments from './payments';
import spamReport from './spamReport';
import rent from './rent';
import flags from './flags';
import contactUs from './contactUs';
import static_pages from './static_pages';
import waypoints from './waypoints';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  form,
  auth,
  products,
  product,
  profile,
  users,
  formErrors,
  location,
  modals,
  onLeave,
  notification_messages,
  initialAppState,
  conversations,
  map,
  screen_type,
  favorites,
  payments,
  spamReport,
  rent,
  flags,
  contactUs,
  static_pages,
  waypoints,
});
