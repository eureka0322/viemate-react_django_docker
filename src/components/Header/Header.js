import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import {} from './Header.scss';
import DropdownNotification from './DropdownNotification';
import DropdownUserMenu from './DropdownUserMenu';
import DropdownCreatePost from './DropdownCreatePost';
import { Form, Modal, Link } from 'elements';
import { LocationLists, CreatePostMobile } from 'components';
import { logOut } from 'redux/modules/auth';
import { showAuth, toggleModal } from 'redux/modules/modals';
import { savePrefix, saveLocation } from 'redux/modules/location';
import { loadNotifications, clearNotifications } from 'redux/modules/profile';
import { executionEnvironment } from 'utils/helpers';
import locations from 'utils/available_cities';
import classNames from 'classnames';

@connect(
  state => ({
    user: state.auth.user,
    unread_messages: state.auth.unread_messages,
    unread_count: state.auth.unread_count,
    modals: state.modals,
    location: state.routing.locationBeforeTransitions,
    notifications_loading: state.profile.notifications_loading,
    notifications: state.profile.notifications,
    notifications_meta: state.profile.notifications_meta,
    chosen_location: state.location.location,
    hide_header: state.flags.hide_header,
  }), {
    logOut,
    showAuth,
    toggleModal,
    savePrefix,
    loadNotifications,
    clearNotifications,
    saveLocation
  }
)
export default class Header extends Component {
  static propTypes = {
    user: PropTypes.object,
    modals: PropTypes.object,
    location: PropTypes.object,
    notifications_meta: PropTypes.object,
    logOut: PropTypes.func,
    showAuth: PropTypes.func,
    toggleModal: PropTypes.func,
    savePrefix: PropTypes.func,
    unread_messages: PropTypes.number,
    unread_count: PropTypes.number,
    notifications: PropTypes.array,
    notifications_loading: PropTypes.bool,
    loadNotifications: PropTypes.func,
    clearNotifications: PropTypes.func,
    saveLocation: PropTypes.func,
    chosen_location: PropTypes.string,
    hide_header: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      create_is_opened: false
    };
    this.canUseDOM = executionEnvironment().canUseDOM;
    this.toggleAuthModal = ::this.toggleAuthModal;
    this.showMenu = ::this.showMenu;
    this.toggleCreateModal = ::this.toggleCreateModal;
    this.selectCity = ::this.selectCity;
    this.menuClick = ::this.menuClick;
    this.hideMenu = ::this.hideMenu;
  }

  componentDidMount() {
    const chosen_location = cookie.load('chosen_location');
    if (chosen_location && this.props.chosen_location !== chosen_location) {
      this.props.saveLocation(chosen_location);
    }
    if (this._menu) {
      this._menu.addEventListener('click', this.menuClick);
    }
  }

  componentWillUnmount() {
    if (this._menu) {
      this._menu.removeEventListener('click', this.menuClick);
    }
  }

  menuClick(e) {
    if (e.target.href || e.target.type === 'button') {
      this.hideMenu();
    }
  }

  showMenu() {
    document.body.classList.add('mobile-menu-active');
  }

  hideMenu() {
    document.body.classList.remove('mobile-menu-active');
  }

  toggleAuthModal() {
    this.props.showAuth();
  }

  toggleCreateModal() {
    this.setState({create_is_opened: !this.state.create_is_opened});
  }

  handleClick(e, prefix) {
    if (!this.props.chosen_location) {
      this.props.toggleModal('location_opened');
      this.props.savePrefix(prefix);
      e.preventDefault();
    }
  }

  selectCity() {
    // const chosen_location = this.canUseDOM ? cookie.load('chosen_location') : global && global.chosen_location;
    const chosen_location = this.props.chosen_location;
    if (chosen_location) {
      const current = locations.find(c => c.value === chosen_location);
      return (!!current && current.label) || 'Location';
    }
    return 'Location';
  }

  render() {
    const { user, location: { pathname }, unread_messages, unread_count, notifications_loading, notifications, notifications_meta, hide_header, chosen_location } = this.props;

    if (hide_header) {
      return null;
    }

    return (
      <div className={'header' + ((pathname === '/offered-post' || pathname === '/wanted-post') ? ' header--post' : '') + (!user ? ' header--unregistered' : '')}>

        <ul className="nav navbar-nav header__navbar-nav navbar-left">
          <li>
            <Link to="/" className="header__logo">
              viemate
            </Link>
          </li>
          <li>
            <Form.Button
              className="form-button--clear form-button--mobile-menu header__btn-nav"
              type="button"
              onClick={this.showMenu}
            >
              <span className="icon-bar" />
              <span className="icon-bar" />
              <span className="icon-bar" />
            </Form.Button>
          </li>
        </ul>
        <div className="location-container">
          <Form.Button
            className="form-button form-button--clear form-button--header-dropdown-location"
            type="button"
            onClick={() => this.props.toggleModal('location_opened')}
          >
              <span>
                {this.selectCity()}
                <i className="icon icon--arrow-down" />
              </span>
          </Form.Button>
        </div>
        <ul className="nav navbar-nav navbar-center  header__navbar-nav hidden-xs header_navbar-center-list">
          <li className={(~pathname.indexOf('/apartments/by-brokers/') ? 'is-active' : '')}>
            <Link
              to="/apartments/by-brokers/{{location}}"
              className={'form-button form-button--clear form-button--header-menu ' + (~pathname.indexOf('/apartments/by-brokers/') ? 'is-active' : '')} // eslint-disable-line
              onClick={e => this.handleClick(e, '/apartments/by-brokers/')}
            >
              By brokers
            </Link>
          </li>
          <li className={(~pathname.indexOf('/apartments/by-tenants/') ? 'is-active' : '')}>
            <Link to="/apartments/by-tenants/{{location}}"
              className={'form-button form-button--clear form-button--header-menu ' + (~pathname.indexOf('/apartments/by-tenants/') ? 'is-active' : '')} // eslint-disable-line
              onClick={e => this.handleClick(e, '/apartments/by-tenants/')}
            >
              By tenants
            </Link>
          </li>
          <li className={(~pathname.indexOf('/wanted-apartments/') ? 'is-active' : '')}>
            <Link to="/wanted-apartments/{{location}}"
              className={'form-button form-button--clear form-button--header-menu ' + (~pathname.indexOf('/wanted-apartments/') ? 'is-active' : '')} // eslint-disable-line
              onClick={e => this.handleClick(e, '/wanted-apartments/')}
            >
              Wanted places
            </Link>
          </li>
        </ul>
        <ul className="nav navbar-nav navbar-right header__navbar-nav">
          {user &&
            <li>
              <Link to="/messages" className={'form-button form-button--clear form-button--header-dropdown-email' + (pathname === '/messages' ? ' is-active' : '')}>
                <i className="icon icon--email" />
                <i className="icon icon--email-grey" />
                {unread_messages > 0 && <span className="icon-count"><span className="icon-count__item">{unread_messages}</span></span>}
              </Link>
            </li>
          }
          {user &&
            <li>
              <DropdownNotification user={user} notifications_meta={notifications_meta} loading={notifications_loading} loadNotifications={this.props.loadNotifications} clearNotifications={this.props.clearNotifications} notifications={notifications} unread_count={unread_count} />
            </li>
          }
          {user &&
            <li className="hidden-xs">
              <DropdownUserMenu logOut={this.props.logOut} img={!!user && !!user.profile && user.profile.avatar} />
            </li>
          }
          <li>
            {user && chosen_location &&
              <DropdownCreatePost />
            }
            {user && !chosen_location &&
              <div className="dropdown--create-post">
                <button
                  className="dropdown-toggle form-button form-button--pink form-button--header-create-post form-button--create header__button-registered"
                  onClick={() => this.props.toggleModal('location_opened')}
                >
                  <span>
                    Create a post
                  </span>
                </button>
              </div>}
            {!user &&
              <Form.Button
                className="form-button--unregistered form-button--clear header__button-unregistered"
                onClick={() => this.props.showAuth(() => {}, true)}
                disabled={false}
                type="button"
              >
                <span>Sign In</span>
              </Form.Button>
            }
          </li>
        </ul>
        <div className="header__mobile-menu nav-mobile" ref={n => this._menu = n}>
          <Link to="/" className="navbar-brand nav-mobile__logo">
            viemate
          </Link>
          <div className="nav-mobile__lists">
            <ul className="list-unstyled">
              <li className="nav-mobile__item nav-mobile__item--main">
                <Link to="/apartments/by-brokers/{{location}}" className="form-button form-button--clear form-button--uppercase" onClick={e => this.handleClick(e, '/apartments/by-brokers/')}>
                  By brokers
                </Link>
              </li>
              <li className="nav-mobile__item nav-mobile__item--main">
                <Link to="/apartments/by-tenants/{{location}}" className="form-button form-button--clear form-button--uppercase" onClick={e => this.handleClick(e, '/apartments/by-tenants/')}>
                  By tenants
                </Link>
              </li>
              <li className="nav-mobile__item nav-mobile__item--main">
                <Link to="/wanted-apartments/{{location}}" className="form-button form-button--clear form-button--uppercase" onClick={e => this.handleClick(e, '/wanted-apartments/')}>
                  Wanted places
                </Link>
              </li>
            </ul>
            {user &&
              <ul className="list-unstyled">
                <li className="nav-mobile__item">
                  <button type="button" className="form-button form-button--circle form-button--pink" onClick={() => chosen_location ? this.toggleCreateModal() : this.props.toggleModal('location_opened')}>
                    Create your post
                  </button>
                </li>
                <li className="nav-mobile__item">
                  <Link to="/profile" className={classNames('form-button form-button--clear', {'is-active': ~pathname.indexOf('/profile', pathname.length - '/profile'.length)})}>
                    Profile
                  </Link>
                </li>
                <li className="nav-mobile__item">
                  <Link to="/messages" className={classNames('form-button form-button--clear', {'is-active': ~pathname.indexOf('/messages')})}>
                    Inbox
                    {unread_messages > 0 && <span className="icon-count">{unread_messages}</span>}
                  </Link>
                </li>
                <li className="nav-mobile__item">
                  <Link to="/profile/settings" className={classNames('form-button form-button--clear', {'is-active': ~pathname.indexOf('/settings')})}>
                    Settings
                  </Link>
                </li>
                <li className="nav-mobile__item">
                  <Link to="/profile/payments" className={classNames('form-button form-button--clear', {'is-active': ~pathname.indexOf('/payments')})}>
                    Payments & Rental Requests
                  </Link>
                </li>
                <li className="nav-mobile__item">
                  <Link to="/profile/manage-posts" className={classNames('form-button form-button--clear', {'is-active': ~pathname.indexOf('/manage-posts')})}>
                    Manage Posts
                  </Link>
                </li>
              </ul>
            }
          </div>
          <ul className="list-unstyled nav-mobile__lists nav-mobile__lists-add-block">
            <li className="nav-mobile__item">
              <Link to="/contact_us" className="form-button form-button--clear">
                Contact Us
              </Link>
            </li>
            {user &&
              <li className="nav-mobile__item">
                <Form.Button
                  className="form-button form-button--clear"
                  type="button"
                  onClick={() => {
                    this.props.logOut().then(this.hideMenu, this.hideMenu);
                  }}
                >
                  Log out
                </Form.Button>
              </li>
            }
          </ul>
        </div>
        <Modal
          className="modal--location-lists"
          handleClose={() => this.props.toggleModal('location_opened')}
          opened={this.props.modals.location_opened}
          disableClickClose
        >
          <LocationLists />
        </Modal>
        <Modal
          className="modal--create-post"
          handleClose={this.toggleCreateModal}
          opened={this.state.create_is_opened}
        >
          <CreatePostMobile toggleCreateModal={this.toggleCreateModal} />
        </Modal>
        <div className="mobile-menu-mask" onClick={this.hideMenu}>
          <Form.Button
            className="form-button--clear form-button--mobile-menu header__btn-nav"
          >
            <span className="icon-bar" />
            <span className="icon-bar" />
            <span className="icon-bar" />
          </Form.Button></div>
      </div>
    );
  }
}
