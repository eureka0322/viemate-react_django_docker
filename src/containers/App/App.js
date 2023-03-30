import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import { Header, Footer, AuthModal, EmailModal } from 'components';
import { Loader, NotificationMessages, ScreenType, Modal } from 'elements';
import { isLoaded as isAuthLoaded, load as loadAuth, unreadMessages, unreadNotifications } from 'redux/modules/auth';
import { initializeLocation } from 'redux/modules/location';
import { loadTweet, loadTumblr, loadTags, loadBlog } from 'redux/modules/initialAppState';
import { hideAuth, hideEmail } from 'redux/modules/modals';
import config from 'config';
import cookie from 'react-cookie';
import classNames from 'classnames';
import {} from './App.scss';

@asyncConnect(
  [{
    promise: ({ store: { dispatch, getState } }) => {
      const promises = [];
      const state = getState();
      if (!isAuthLoaded(state) && !state.auth.error) {
        promises.push(dispatch(loadAuth()));
      }
      return Promise.all(promises);
    }
  }, {
    deferred: true,
    promise: ({ store: {dispatch, getState}, helpers: {req} }) => {
      const state = getState();
      if (!state.location.chosen_location) {
        dispatch(initializeLocation(req));
      }
      return Promise.resolve();
    }
  }, {
    deferred: true,
    promise: ({ store: {dispatch, getState}}) => {
      const state = getState();
      const promises = [];
      if (!state.initialAppState.tags_loaded) {
        promises.push(dispatch(loadTags()));
      }
      return Promise.all(promises);
    }
  }])
@connect(
  state => ({
    user: state.auth.user,
    modals: state.modals,
    chosen_location: state.location.location,
    location: state.routing.locationBeforeTransitions,
    async_loaded: state.reduxAsyncConnect.loaded,
    tweet: state.initialAppState.tweet,
    tweet_loading: state.initialAppState.tweet_loading,
    tweet_loaded: state.initialAppState.tweet_loaded,
    tumblr: state.initialAppState.tumblr,
    tumblr_loading: state.initialAppState.tumblr_loading,
    tumblr_loaded: state.initialAppState.tumblr_loaded,
    blog: state.initialAppState.blog,
    blog_loading: state.initialAppState.blog_loading,
    blog_loaded: state.initialAppState.blog_loaded,
    hide_header: state.flags.hide_header,
    hide_footer: state.flags.hide_footer,
  }),
  {
    pushState: push,
    loadAuth,
    loadTweet,
    loadTumblr,
    loadBlog,
    unreadNotifications,
    unreadMessages,
    hideAuth,
    hideEmail
  }
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object, // eslint-disable-line
    location: PropTypes.object,
    user: PropTypes.object,
    modals: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    // chosen_location: PropTypes.string,
    async_loaded: PropTypes.bool,
    tweet_loading: PropTypes.bool,
    tweet_loaded: PropTypes.bool,
    hide_footer: PropTypes.bool,
    hide_header: PropTypes.bool,
    tweet: PropTypes.string,
    loadTweet: PropTypes.func,
    // tweet_loading: PropTypes.bool,
    tumblr_loaded: PropTypes.bool,
    tumblr: PropTypes.array,
    loadTumblr: PropTypes.func,
    blog_loaded: PropTypes.bool,
    blog: PropTypes.object,
    loadBlog: PropTypes.func,
    unreadMessages: PropTypes.func,
    unreadNotifications: PropTypes.func,
    hideAuth: PropTypes.func,
    hideEmail: PropTypes.func
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentDidMount() {
    require('helpers/Device');
    /*eslint-disable */
    if (typeof window !== 'undefined' && config.isProduction) {
      require('autotrack/lib/plugins/clean-url-tracker');
      require('autotrack/lib/plugins/outbound-link-tracker');
      require('autotrack/lib/plugins/url-change-tracker');
      ga('create', 'UA-52084842-1', 'auto');
      ga('require', 'cleanUrlTracker');
      ga('require', 'outboundLinkTracker');
      ga('require', 'urlChangeTracker');
      ga('send', 'pageview');
    }
    /*eslint-enable */
    this.curLocation = cookie.load('chosen_location');
    if (!this.props.tweet_loaded) this.props.loadTweet();
    if (!this.props.tumblr_loaded) this.props.loadTumblr();
    if (!this.props.blog_loaded) this.props.loadBlog();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user && !nextProps.user) {
      // logout
      if (/profile|messages|offered-post|wanted-post|favorite-wanted-apartments|favorite-apartments|notifications|incomplete_post|no_email/.test(nextProps.location.pathname)) {
        this.props.pushState('/');
      }
    }

    if (nextProps.chosen_location && nextProps.chosen_location !== this.curLocation) {
      const w = window;
      const replacedPath = w.location.pathname.replace(this.curLocation, nextProps.chosen_location);

      w.history.replaceState({}, '', replacedPath);
      this.curLocation = nextProps.chosen_location;
    }
    if (nextProps.user && (this.props.location.pathname !== nextProps.location.pathname)) {
      this.props.unreadMessages();
      this.props.unreadNotifications();
    }
  }

  render() {
    const { async_loaded, tweet, tweet_loading, tumblr, blog, hide_header, hide_footer } = this.props;

    return (
      <div className={classNames('app', {'app--hide_header': hide_header})}>
        <Helmet {...config.app.head} />
        <Header />
        {!async_loaded && <Loader />}
        <div className="app__container">{this.props.children}</div>
        <Footer tweet_loading={tweet_loading} tweet={tweet} tumblr={tumblr} blog={blog} hide_footer={hide_footer} />
        <NotificationMessages />
        <ScreenType.Detector />
        <Modal
          className="modal--sign-up"
          handleClose={this.props.hideAuth}
          opened={this.props.modals.auth_opened}
          innerButtonClose
        >
          <AuthModal />
        </Modal>
        <Modal
          className="modal--sign-up"
          handleClose={this.props.hideEmail}
          opened={this.props.modals.email_opened}
          innerButtonClose
        >
          <EmailModal />
        </Modal>
      </div>
    );
  }
}
