import React, { Component, PropTypes } from 'react';
import {} from './MessageList.scss';
import { MessageItem as MessageItemComponent } from 'components';
import { Loader } from 'elements';
import moment from 'moment';

export default class MessageList extends Component {
  static propTypes = {
    messages: PropTypes.array,
    own_id: PropTypes.number,
    conversation_meta: PropTypes.object,
    loadConversation: PropTypes.func,
    conv_loading: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      old_scroll: 0,
      loading: props.conv_loading,
    };
    this.loadMore = ::this.loadMore;
    this.handleScroll = ::this.handleScroll;
    this.scrollToEnd = ::this.scrollToEnd;
  }

  componentDidMount() {
    this.scrollToEnd();
    this._container.addEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.messages !== nextProps.messages) {
      clearTimeout(this.toEndTimer);
      this.toEndTimer = setTimeout(() => {
        this.scrollToEnd();
      }, 10);
    }
    if (this.props.conv_loading !== nextProps.conv_loading) {
      clearTimeout(this.loadingTimer);
      this.loadingTimer = setTimeout(() => {
        this.setState({
          loading: nextProps.conv_loading,
        });
      }, 70);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.scrollTimer);
    clearTimeout(this.toEndTimer);
    clearTimeout(this.loadingTimer);
    this._container.removeEventListener('scroll', this.handleScroll);
  }

  scrollToEnd() {
    this._container.scrollTop = this._container.scrollHeight - this.state.old_scroll;
    this.setState({old_scroll: 0});
    if (this._container.scrollTop + 30 >= this._container.scrollHeight - this.state.old_scroll || !this._container.scrollTop) {
      this.setState({loading: false});
    }
  }

  handleScroll() {
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      if (this._container.scrollTop < 70) {
        this.loadMore();
      }
    }, 50);
  }

  loadMore() {
    if (this._container.scrollHeight > this._container.offsetHeight && this.props.conversation_meta && this.props.conversation_meta.pagination && this.props.conversation_meta.pagination.total_pages > this.state.page) {
      this._container.removeEventListener('scroll', this.handleScroll);
      this.setState({page: this.state.page + 1, old_scroll: this._container.scrollHeight}, () => {
        this.props.loadConversation(this.state.page).then(() => {
          this._container.addEventListener('scroll', this.handleScroll);
        }, () => {
          this._container.addEventListener('scroll', this.handleScroll);
        });
      });
    }
  }

  render() {
    const {messages, own_id, conv_loading} = this.props;
    return (
      <div>
        {(this.state.loading || conv_loading) && <Loader bgWhite absolute />}
        <div className="message-list" ref={n => this._container = n}>
          <div className="message-list__wrapper" ref={n => this._wrapper = n}>
            <ul className="message-list__container list-unstyled">
              {messages && messages.map((c, i) => {
                if (c.author.id === own_id) {
                  return (<MessageItemComponent.MessageItemSent key={i} content={c.body} author={c.author} timeMessage={moment(c.created_at).format('h:mm A')} />);
                }
                return (<MessageItemComponent.MessageItemInbox key={i} content={c.body} author={c.author} timeMessage={moment(c.created_at).format('h:mm A')} />);
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

