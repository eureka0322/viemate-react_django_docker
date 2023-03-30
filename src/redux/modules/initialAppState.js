import config from 'config';

const SUBSCRIBE = 'mailchimp/SUBSCRIBE';
const SUBSCRIBE_SUCCESS = 'mailchimp/SUBSCRIBE_SUCCESS';
const SUBSCRIBE_FAIL = 'mailchimp/SUBSCRIBE_FAIL';

const LOAD_BLOG = 'blog/LOAD_BLOG';
const LOAD_BLOG_SUCCESS = 'blog/LOAD_BLOG_SUCCESS';
const LOAD_BLOG_FAIL = 'blog/LOAD_BLOG_FAIL';

const LOAD_TWEET = 'twitter/LOAD_TWEET';
const LOAD_TWEET_SUCCESS = 'twitter/LOAD_TWEET_SUCCESS';
const LOAD_TWEET_FAIL = 'twitter/LOAD_TWEET_FAIL';

const LOAD_TUMBLR = 'tumblr/LOAD_TUMBLR';
const LOAD_TUMBLR_SUCCESS = 'tumblr/LOAD_TUMBLR_SUCCESS';
const LOAD_TUMBLR_FAIL = 'tumblr/LOAD_TUMBLR_FAIL';

const LOAD_TAGS = 'tags/LOAD_TAGS';
const LOAD_TAGS_SUCCESS = 'tags/LOAD_TAGS_SUCCESS';
const LOAD_TAGS_FAIL = 'tags/LOAD_TAGS_FAIL';

const initialState = {
  tweet_loading: false,
  tweet_loaded: false,
  blog_loading: false,
  blog_loaded: false,
  tumblr_loading: false,
  tumblr_loaded: false,
  tumblr: [],
  tags_loading: false,
  tags_loaded: false,
  tags: [],
  nearby: [],
  friendly: [],
  included: [],
};

function tagsSort(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_TAGS_SUCCESS: {
      const tags = action.result || [];
      return {
        ...state,
        tags,
        nearby: tags.filter(c => c.type === 'nearby') || [],
        friendly: tags.filter(c => c.type === 'friendly') || [],
        included: tags.filter(c => c.type === 'included') || [],
      };
    }
    default:
      return {...state};
  }
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_BLOG:
      return { ...state, blog_loading: true, blog_error: null };
    case LOAD_BLOG_SUCCESS:
      return { ...state, blog_loading: false, blog_loaded: true, blog: action.result && action.result.posts && action.result.posts[0] };
    case LOAD_BLOG_FAIL:
      return { ...state, blog_loading: false, blog_loaded: false, blog_error: action.error };
    case LOAD_TWEET:
      return { ...state, tweet_loading: true, tweet_error: null };
    case LOAD_TWEET_SUCCESS:
      return { ...state, tweet_loading: false, tweet_loaded: true, tweet: action.result && action.result[0] && action.result[0].text };
    case LOAD_TWEET_FAIL:
      return { ...state, tweet_loading: false, tweet_loaded: false, tweet_error: action.error };
    case LOAD_TUMBLR:
      return { ...state, tumblr_loading: true, tumblr_error: null };
    case LOAD_TUMBLR_SUCCESS:
      return { ...state, tumblr_loading: false, tumblr_loaded: true, tumblr: action.result && action.result.response && action.result.response.posts };
    case LOAD_TUMBLR_FAIL:
      return { ...state, tumblr_loading: false, tumblr_loaded: false, tumblr_error: action.error };
    case LOAD_TAGS:
      return { ...state, tags_loading: true, tags_error: null };
    case LOAD_TAGS_SUCCESS:
      return { ...tagsSort(state, action), tags_loading: false, tags_loaded: true};
    case LOAD_TAGS_FAIL:
      return { ...state, tags_loading: false, tags_loaded: false, tags_error: action.error };
    default:
      return state;
  }
}

export function loadBlog() {
  return {
    types: [LOAD_BLOG, LOAD_BLOG_SUCCESS, LOAD_BLOG_FAIL],
    promise: (client) => client.get('/blog_post', {direct_url: true})
  };
}

export function loadTweet() {
  return {
    types: [LOAD_TWEET, LOAD_TWEET_SUCCESS, LOAD_TWEET_FAIL],
    promise: (client) => client.get('/twitter_post', {direct_url: true})
  };
}

export function loadTumblr() {
  return {
    types: [LOAD_TUMBLR, LOAD_TUMBLR_SUCCESS, LOAD_TUMBLR_FAIL],
    promise: (client) => client.get('/tumblr_post', {direct_url: true})
  };
}

export function loadTags() {
  return {
    types: [LOAD_TAGS, LOAD_TAGS_SUCCESS, LOAD_TAGS_FAIL],
    promise: (client) => client.get(`${config.apiPrefix}/tags`)
  };
}

export function subscribeEmail(data) {
  data = {...data, status: 'subscribed'};
  return {
    types: [SUBSCRIBE, SUBSCRIBE_SUCCESS, SUBSCRIBE_FAIL],
    promise: (client) => client.post('/email_subscribe', {direct_url: true, data})
  };
}
