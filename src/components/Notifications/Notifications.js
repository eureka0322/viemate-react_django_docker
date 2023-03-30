import React, { PropTypes, Component } from 'react';
import { NotificationItem, BookingNotification } from 'components';

export default class Notifications extends Component {
  static propTypes = {
    notifications: PropTypes.array.isRequired,
    user: PropTypes.object,
    meta: PropTypes.object,
    loadNotifications: PropTypes.func.isRequired,
    clearNotifications: PropTypes.func,
    handleRequest: PropTypes.func,
  };

  static defaultProps = {
    notifications: [],
    loadNotifications: () => Promise.resolve(),
    handleRequest: () => {},
  };

  constructor() {
    super();
    this.state = {
      page: 1,
    };
    this.hanldeScroll = ::this.hanldeScroll;
  }

  componentDidMount() {
    this._notifications.addEventListener('scroll', this.hanldeScroll);
  }

  componentWillUnmount() {
    this.props.clearNotifications();
    clearTimeout(this.scrollTimer);
    this._notifications.removeEventListener('scroll', this.hanldeScroll);
  }

  hanldeScroll() {
    const {meta, handleRequest} = this.props;
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      if (this._notifications.scrollTop >= this._notifications.scrollHeight - 500 && this.state.page < meta.pagination.total_pages) {
        this.setState({page: this.state.page + 1}, () => {
          this._notifications.removeEventListener('scroll', this.hanldeScroll);
          this.props.loadNotifications(this.state.page, handleRequest).then(() => {
            this._notifications.addEventListener('scroll', this.hanldeScroll);
          });
        });
      }
    }, 150);
  }

  render() {
    const {notifications, user} = this.props;
    return (
      <ul ref={n => this._notifications = n}>
        {notifications.map((c, i) => {
          switch (c.notification_type) {
            case 'booking':
              return <BookingNotification user={user} key={i} item={c} />;
            case 'post':
              return <NotificationItem key={i} item={c} />;
            default:
              return null;
          }
        })}
      </ul>
    );
  }
}
