import React, {PropTypes, Component} from 'react';
// import { Link } from 'react-router';
import { Dropdown } from 'elements';
import { Notifications } from 'components';
// import classNames from 'classnames';

class DropdownNotification extends Component {

  constructor() {
    super();
    this.per_page = 10;
    this._request = null;

    this.onOpen = ::this.onOpen;
    this.getRequest = ::this.getRequest;
    this.requestEnded = ::this.requestEnded;
    this.cancelIfPending = ::this.cancelIfPending;
  }

  onOpen() {
    const { loadNotifications, clearNotifications } = this.props;
    clearNotifications().then(() => {
      loadNotifications(1, this.getRequest, this.per_page);
    });
  }

  getRequest(r) {
    this._request = r;
    this._request.addEventListener('end', this.requestEnded);
    return r;
  }

  requestEnded() {
    this._request.removeEventListener('end', this.requestEnded);
    this._request = null;
  }

  cancelIfPending() {
    if (this._request) {
      this._request.abort();
      this.requestEnded();
    }
  }

  render() {
    const {unread_count, loadNotifications, loading, notifications, notifications_meta, clearNotifications, user} = this.props;
    return (
      <div className="">
        <Dropdown
          className="dropdown--position-center dropdown--position-top dropdown--arrow dropdown--arrow-center dropdown--color-white dropdown--header dropdown__notification"
          onOpen={this.onOpen}
          onClose={this.cancelIfPending}
          self_closing
          trigger={
            <button className="dropdown-toggle form-button form-button--clear form-button--header-dropdown-notification form-button--header-dropdown-active">
              <span>
                <i className="icon icon--notification" />
                <i className="icon icon--notification-grey" />
                {unread_count > 0 && <span className="icon-count">{unread_count}</span>}
              </span>
            </button>
            }
        >
          <div>
            {!loading && (!notifications || notifications.length <= 0) &&
              <div className="dropdown-menu notification dropdown-menu--notification">
                <p className="notification__user-activity">0 unread notifications</p>
              </div>
            }
            {((!!notifications && notifications.length > 0) || loading) &&
              <ul className="dropdown-menu notification dropdown-menu--notification">
                {notifications.length > 0 &&
                  <li>
                    <Notifications user={user} notifications={notifications} meta={notifications_meta} loadNotifications={loadNotifications} clearNotifications={clearNotifications} handleRequest={this.getRequest} />
                  </li>
                }
                {/*!!notifications_meta && !!notifications_meta.pagination && notifications_meta.pagination.total_objects > per_page &&
                  <li
                    className={
                      classNames('notification__item', { 'notification__item--all-view': true })
                    }
                  >
                    <Link to="/notifications">View all</Link>
                  </li>
                */}
                {loading &&
                  <li className="notification__loader">
                    Loading...
                  </li>
                }
              </ul>
            }
          </div>
        </Dropdown>
      </div>
    );
  }
}

DropdownNotification.propTypes = {
  unread_count: PropTypes.number,
  loadNotifications: PropTypes.func,
  clearNotifications: PropTypes.func,
  loading: PropTypes.bool,
  notifications: PropTypes.array,
  notifications_meta: PropTypes.object,
  user: PropTypes.object,
};

export default DropdownNotification;
