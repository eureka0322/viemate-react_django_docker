const ADD = 'notifications/ADD';
const HIDE = 'notifications/HIDE';

const messages = {
  profile_success: {text: 'Your information was successfly updated', type: 'success'},
  product_success: {text: 'Your information was successfly updated', type: 'success'}, // edit product
  create_product_success: {text: 'Your post has been successfully published', type: 'success'},
  send_approve_product_success: {text: 'Your post has been successfully send to approve', type: 'success'},
  post_sold: {text: "Listing you're trying to open has been sold, here are current listings", type: 'success'},
  subscribe_ok: {text: 'You are now subscribed', type: 'success'},
  message_no_avatar: {text: 'You need to upload a profile picture first', type: 'error'},
  id_success: {text: 'Thanks for successfully uploading your ID. We will get back to you shortly.', type: 'success'},
  id_failed: {text: 'Looks like something went wrong. Please try again.', type: 'error'},
  has_published_post: {
    text: 'Oops! Looks like you have an active post. You cannot create a new post when you have an active one. Please deactivate your current post first, then create a new one. You can deactivate and edit your post from Manage posts.',
    type: 'error',
    show_btn_hide: true
  },
  cannot_edit_post: {
    text: 'Sorry, you cannot edit this post',
    type: 'error'
  }
};

const initialState = {
  notifications: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD:
      return { ...state, notifications: {...state.notifications, ...action.result}};
    case HIDE:
      if (state.notifications[action.result]) delete state.notifications[action.result];
      return { ...state, notifications: {...state.notifications}};
    default:
      return state;
  }
}

export function hideNotification(name) {
  return {
    types: ['', HIDE, ''],
    promise: () => Promise.resolve(name)
  };
}

export function showNotification(name, string, timeout = 5000) {
  return (dispatch) => {
    return dispatch({
      types: ['', ADD, ''],
      promise: () => {
        if (timeout !== 0) setTimeout(() => dispatch(hideNotification(name)), timeout);
        return Promise.resolve({[name]: string});
      }
    });
  };
}

export function showDefault(name, timeout = 5000) {
  return showNotification(name, messages[name], timeout);
}
