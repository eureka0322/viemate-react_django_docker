import React, { PropTypes } from 'react';
import { Message as MessageComponent, MessageItem as MessageItemComponent } from 'components';
import { Loader } from 'elements';

const MessageMobile = (props) => {
  const {
    conversations,
    inbox_count,
    current,
    openConfirmModal,
    setCurrent,
    user,
    conversation,
    loading_message,
    createMessage,
    params,
    conv_loading,
    loading,
    loadConversation,
    conversation_meta,
  } = props;
  if (conversations && conversations.length) {
    if (params.id) {
      return (
        <div className="messages">
          {(conv_loading || loading) && <Loader /> }
          <div className="container--default-width container messages__container">
            <div className="messages__lists">
              {current && <MessageComponent.MessageListTitle isMobile titleList={(current && current.name) || ''} conv_id={current && current.id} onDelete={openConfirmModal} />}
            </div>
          </div>
          <div className="container--separator" />
          <div className="container--default-width container messages--search">
            {conversations.length > 0 &&
              <div className="messages__lists">
                <MessageComponent.MessageList
                  conversation_meta={conversation_meta}
                  loadConversation={loadConversation}
                  messages={conversation}
                  own_id={user.id}
                />
                <MessageItemComponent.MessageItemForm sending={loading_message} conv_id={current && current.id} send={createMessage} />
              </div>
            }
          </div>
        </div>
      );
    }
    return (
      <div className="messages">
        {(conv_loading || loading) && <Loader /> }
        <div className="container--default-width container messages__container">
          <div className="messages__users">
            <MessageComponent.MessageTitle countMessage={inbox_count} />
          </div>
        </div>
        <div className="container--separator" />
        <div className="container--default-width container messages--search">
          {conversations.length > 0 &&
            <div className="messages__users messages__users--bounds">
              <MessageComponent.MessageUser list={conversations} own_id={user.id} active={0} changeActive={setCurrent} onDelete={openConfirmModal} />
            </div>
          }
        </div>
      </div>
    );
  }
  return null;
};

MessageMobile.propTypes = {
  conversations: PropTypes.array,
  inbox_count: PropTypes.number,
  current: PropTypes.any,
  openConfirmModal: PropTypes.func,
  setCurrent: PropTypes.func,
  user: PropTypes.object,
  conversation: PropTypes.array,
  loading_message: PropTypes.bool,
  loading: PropTypes.bool,
  conv_loading: PropTypes.bool,
  createMessage: PropTypes.func,
  loadConversation: PropTypes.func,
  params: PropTypes.object,
  conversation_meta: PropTypes.object,
};

export default MessageMobile;
