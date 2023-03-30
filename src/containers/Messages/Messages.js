import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import config from 'config';
import {} from './Messages.scss';
import { Message as MessageComponent, MessageItem as MessageItemComponent, DeleteBlock } from 'components';
import { Modal, ScreenType, DisableComponent } from 'elements';
import { setBodyClassname, truncateUserName } from 'utils/helpers';
import { loadConversations, loadConversation, deleteConversation, createMessage, clearConverstions } from 'redux/modules/conversations';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

@connect(st => ({
  conversations: st.conversations.conversations,
  conversation: st.conversations.conversation,
  conversation_meta: st.conversations.conversation_meta,
  inbox_count: st.conversations.inbox_count,
  loading_message: st.conversations.loading_message,
  conv_loading: st.conversations.conv_loading,
  loading: st.conversations.loading,
  user: st.auth.user,
}), {
  loadConversations,
  loadConversation,
  deleteConversation,
  createMessage,
  clearConverstions,
  pushState: push,
})
export default class Messages extends Component {
  static propTypes = {
    user: PropTypes.object,
    conversation: PropTypes.array,
    conversations: PropTypes.array,
    conversation_meta: PropTypes.object,
    loadConversations: PropTypes.func,
    loadConversation: PropTypes.func,
    deleteConversation: PropTypes.func,
    createMessage: PropTypes.func,
    clearConverstions: PropTypes.func,
    inbox_count: PropTypes.number,
    loading_message: PropTypes.bool,
    conv_loading: PropTypes.bool,
    loading: PropTypes.bool,
    pushState: PropTypes.func,
    params: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      current_conv: 0,
      filtered_conv: props.conversations || [],
      del_id: -1
    };
    this.setCurrent = ::this.setCurrent;
    this.setCurrentMobile = ::this.setCurrentMobile;
    this.handleDelete = ::this.handleDelete;
    // this.handleSearch = ::this.handleSearch;
    this.openConfirmModal = ::this.openConfirmModal;
    this.closeConfirmModal = ::this.closeConfirmModal;
    this.loadConversation = ::this.loadConversation;
  }

  componentDidMount() {
    setBodyClassname('body-messages');
    const {params} = this.props;
    this.props.loadConversations().then(r => {
      if (params.id) {
        this.setCurrent(parseFloat(params.id));
      } else if (r.conversations.length) {
        const id = r.conversations[0].id;
        this.setCurrent(id);
        // this.handleSearch('');
      }
    });
  }

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.conversations && nextProps.conversations && this.props.conversations !== nextProps.conversations) {
  //     this.handleSearch(this.state.term, nextProps);
  //   }
  // }

  componentWillUnmount() {
    this.props.clearConverstions();
  }

  setCurrent(id) {
    this.setState({
      current_conv: id
    });
    this.props.loadConversations().then(() => this.props.loadConversation(id), () => this.props.loadConversation(id));
  }

  setCurrentMobile(id) {
    this.setCurrent(id);
    this.props.pushState(`/messages/list/${id}`);
  }

  loadConversation(page) {
    return this.props.loadConversation(this.state.current_conv, page);
  }

  handleDelete(id) {
    if (id === -1) {
      this.closeConfirmModal();
      return false;
    }
    return this.props.deleteConversation(id).then(() => {
      this.props.pushState('/messages');
      if (this.props.conversations.length) {
        this.setCurrent(this.props.conversations[0].id);
      }
      this.closeConfirmModal();
    });
  }

  // handleSearch(term, nextProps) {
  //   const props = nextProps || this.props;
  //   if (term) {
  //     const term_reg = new RegExp(term, 'i');
  //     this.setState({
  //       filtered_conv: props.conversations.filter(c => term_reg.test(c.name)),
  //       term,
  //     });
  //   } else {
  //     this.setState({
  //       filtered_conv: props.conversations,
  //       term,
  //     });
  //   }
  // }

  openConfirmModal(id) {
    this.setState({confirmation_opened: true, del_id: id});
  }

  closeConfirmModal() {
    this.setState({confirmation_opened: false, del_id: -1});
  }

  render() {
    const { conversations, conversation, user, inbox_count, loading_message, conversation_meta, conv_loading, loading } = this.props;
    const { current_conv, del_id } = this.state;
    const current = conversations && conversations.length > 0 && conversations.find(c => c.id === current_conv);
    const current_user = current && current.users.find(c => c.id !== user.id);
    return (
      <div>
        <DisableComponent.Footer />
        <Helmet {...config.app.head} />
        {conversations &&
          <ScreenType.TabletMin>
            <div className="messages">
              <div className="container--default-width container messages__container">
                <div className="messages__users">
                  <MessageComponent.MessageTitle countMessage={inbox_count} />
                </div>
                <div className="messages__lists">
                  {current && <MessageComponent.MessageListTitle titleList={truncateUserName((current_user && current_user.full_name) || '', true)} conv_id={current && current.id} onDelete={this.openConfirmModal} />}
                </div>
              </div>
              <div className="container--separator" />
              <div className="container--default-width container messages--search">
                {conversations.length > 0 &&
                  <div className="messages__users messages__users--bounds">
                    <MessageComponent.MessageUser loading={loading} list={conversations} own_id={user.id} active={current_conv} changeActive={this.setCurrent} onDelete={this.openConfirmModal} />
                  </div>
                }
                {conversations.length > 0 &&
                  <div className="messages__lists">
                    <MessageComponent.MessageList conv_loading={conv_loading || loading} key={current_conv} messages={conversation} own_id={user.id} conversation_meta={conversation_meta} loadConversation={this.loadConversation} />
                    <MessageItemComponent.MessageItemForm sending={loading_message} conv_id={current && current.id} send={this.props.createMessage} />
                  </div>
                }
              </div>
            </div>
          </ScreenType.TabletMin>
        }
        {conversations &&
          <ScreenType.Mobile>
            <MessageComponent.MessageMobile {...this.props} {...this.state} openConfirmModal={this.openConfirmModal} setCurrent={this.setCurrentMobile} current={current} loadConversation={this.loadConversation} />
          </ScreenType.Mobile>
        }
        <Modal
          className="modal--save-block"
          handleClose={this.closeConfirmModal}
          opened={this.state.confirmation_opened}
        >
          <DeleteBlock onConfirm={() => this.handleDelete(del_id)} onCancel={this.closeConfirmModal} />
        </Modal>
      </div>
    );
  }
}
