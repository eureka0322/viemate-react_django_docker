import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import { loadList } from 'redux/modules/static_pages';
import {
  App,
  Home,
  Profile,
  EditProfile,
  EditPost,
  EditWantedPost,
  Products,
  Product,
  ManagePost,
  Messages,
  User,
  Users,
  SignUp,
  NoEmail,
  Settings,
  Payments,
  ManagePosts,
  WantedPost,
  ResetPass,
  Notifications,
  Error404,
  WantedFavorite,
  OfferedFavorite,
  PaymentBraintree,
  ContactUs,
  StaticPages,
  IncompletePost,
  IdSuccess,
  IdError,
  VerifyContainer,
} from 'containers';

import available_cities from 'utils/available_cities';
import payment_tabs from 'utils/payment_tabs';
import { showDefault } from 'redux/modules/notifications';

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user } } = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace({pathname: '/users/sign_in', query: {callbackUrl: `${nextState.location.pathname}${nextState.location.search}`}});
      }
      if (user && !user.email_present) {
        replace({pathname: '/users/no_email', query: {callbackUrl: `${nextState.location.pathname}${nextState.location.search}`}});
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth).catch(checkAuth);
    } else {
      checkAuth();
    }
  };

  const requireAdmin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user } } = store.getState();
      if (!user || !user.admin) {
        // oops, not logged in, so can't be here!
        replace({pathname: '/'});
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth).catch(checkAuth);
    } else {
      checkAuth();
    }
  };

  const emailRedirect = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user } } = store.getState();
      if (!user || (user && user.email_present)) {
        // oops, not logged in or profile has email
        replace({pathname: '/'});
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth).catch(checkAuth);
    } else {
      checkAuth();
    }
  };

  const loggedRedirect = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user } } = store.getState();
      if (user) {
        // oops, not logged in, so can't be here!
        replace('/');
      }
      cb();
    }

    if (isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth).catch(checkAuth);
    } else {
      checkAuth();
    }
  };

  const checkStatic = (nextState, cb) => {
    const {page_name} = nextState.params;
    const { static_pages: { list_loaded } } = store.getState();
    function check() {
      const { static_pages: { list } } = store.getState();
      if (list.find(c => c === page_name)) {
        // oops, not logged in, so can't be here!
        cb(null, StaticPages);
      } else {
        cb(null, Error404);
      }
    }

    if (!list_loaded) {
      store.dispatch(loadList()).then(check).catch(() => {cb(null, Error404);});
    } else {
      check();
    }
  };

  const check_city = (component) => (nextState, cb) => {
    const {city, state, country} = nextState.params;
    if (!!(city && state && country) && !!available_cities.find(c => c.value === `${city}--${state}--${country}`)) {
      cb(null, component);
    }
    cb(null, Error404);
  };

  const check_id = (component) => (nextState, cb) => {
    const {id} = nextState.params;
    if (!id || /^\d+$/.test(id)) {
      cb(null, component);
    }
    cb(null, Error404);
  };

  const check_payment_tab = (component) => (nextState, cb) => {
    const {tab} = nextState.params;
    if (!tab || payment_tabs.find(c => c.value === tab)) {
      cb(null, component);
    }
    cb(null, Error404);
  };

  const checkPublishedPost = (postType) => (nextState, replace, cb) => {
    const { auth: { user } } = store.getState();

    if (!user.admin && ((postType === 'offered' && user.has_published_offered) || (postType === 'wanted' && user.has_published_wanted))) {
      replace('/profile/manage-posts');
      store.dispatch(showDefault('has_published_post', 0));
    }
    cb();
  };

  const checkOwnPost = (nextState, replace, cb) => {
    const { auth: { user } } = store.getState();
    const id = +nextState.params.id;
    const postIds = user.post_ids || [];
    const idIsInteger = /^\d+$/.test(id);

    if (!user.admin && !postIds.find(c => c === id) && idIsInteger) {
      replace('/');
      store.dispatch(showDefault('cannot_edit_post'));
    }
    cb();
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route>
      <Route path="id_error" component={IdError} onEnter={requireLogin} />
      <Route path="id_success" component={IdSuccess} onEnter={requireLogin} />
      <Route path="/" component={App}>
        { /* Home (main) route */ }
        <IndexRoute component={Home} />
        { /* Routes requiring login */ }
        <Route onEnter={requireLogin}>
          <Route path="profile">
            <IndexRoute component={Profile} />
            <Route path="edit" component={EditProfile} />
            <Route path="id_verification" component={VerifyContainer} />
            <Route path="manage-posts" component={ManagePosts} />
            <Route path="payments(/:tab)" getComponent={check_payment_tab(Payments)} />
            <Route path="settings" component={Settings} />
          </Route>
          <Route path="messages(/list/:id)" getComponent={check_id(Messages)} />
          <Route path="offered-post" onEnter={checkPublishedPost('offered')} component={ManagePost} />
          <Route path="offered-post/:id" onEnter={checkOwnPost} getComponent={check_id(EditPost)} />
          <Route path="wanted-post" onEnter={checkPublishedPost('wanted')} component={WantedPost} />
          <Route path="favorite-wanted-apartments" component={WantedFavorite} />
          <Route path="favorite-apartments" component={OfferedFavorite} />
          <Route path="wanted-post/:id" onEnter={checkOwnPost} getComponent={check_id(EditWantedPost)} />
          <Route path="notifications" component={Notifications} />
          <Route path="payment" component={PaymentBraintree} />
        </Route>

        { /* Routes */ }
        <Route onEnter={loggedRedirect}>
          <Route path="users/sign_in" component={SignUp} />
          <Route path="reset_password" component={ResetPass} />
        </Route>

        <Route path="users/no_email" component={NoEmail} onEnter={emailRedirect} />

        <Route path="incomplete_post/:id" component={IncompletePost} onEnter={requireAdmin} />

        <Route path="profile/:id" getComponent={check_id(Profile)} />

        <Route path="apartments">

          <Route path=":city--:state--:country/:id" getComponent={check_id(Product)} />
          <Route path=":city--:state--:country" getComponent={check_city(Products)} ignoreScrollBehavior />

          <Route path="by-brokers">
            <Route path=":city--:state--:country/:id" getComponent={check_id(Product)} />
            <Route path=":city--:state--:country" getComponent={check_city(Products)} ignoreScrollBehavior />
          </Route>

          <Route path="by-tenants">
            <Route path=":city--:state--:country/:id" getComponent={check_id(Product)} />
            <Route path=":city--:state--:country" getComponent={check_city(Products)} ignoreScrollBehavior />
          </Route>

        </Route>

        <Route path="wanted-apartments">
          <Route path=":city--:state--:country/:id" getComponent={check_id(User)} />
          <Route path=":city--:state--:country" getComponent={check_city(Users)} ignoreScrollBehavior />
        </Route>

        <Route path="contact_us" component={ContactUs} />

        <Route path=":page_name" getComponent={checkStatic} />

        { /* Catch all route */ }
        <Route path="*" component={Error404} status={404} />
      </Route>
    </Route>
  );
};
