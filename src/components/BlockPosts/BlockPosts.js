import React, { Component, PropTypes } from 'react';
import {} from './BlockPosts.scss';
import { Link } from 'react-router';
import { Avatar } from 'elements';
import { chunk } from 'lodash';
import { detectOpenInNewTab, getDeviceType } from 'utils/helpers';

const image = require('../../images/user-img.jpg');

function handleCardClick(e, onClick, id, link) {
  const newTab = getDeviceType() === 'mobile' ? true : detectOpenInNewTab(e);

  if (onClick && !newTab) {
    e.preventDefault();
    onClick(id, link);
  }
}

export default class BlockPosts extends Component {
  static propTypes = {
    // location: PropTypes.string,
    title: PropTypes.string,
    posts: PropTypes.array,
    // loadBest: PropTypes.func,
    toggleProductModal: PropTypes.func,
    toggleUserModal: PropTypes.func,
    loading: PropTypes.bool,
    // pagination: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      show_all: false,
      device: 'desktop',
    };
    this.loadAll = ::this.loadAll;
    this.onResize = ::this.onResize;
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    clearTimeout(this.resize_timeout);
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    clearTimeout(this.resize_timeout);
    this.resize_timeout = setTimeout(() => {
      const device = this.getDeviceType();
      if (device !== this.state.device) {
        this.setState({device});
      }
    }, 100);
  }

  getDeviceType() {
    const w = window || null;
    const d = document;
    const e = d.documentElement;
    const g = d.getElementsByTagName('body')[0];
    const witdh = w.innerWidth || e.clientWidth || g.clientWidth;
    if (witdh <= 767) {
      return 'mobile';
    }
    if (witdh > 767 && witdh <= 1199) {
      return 'tablet';
    }
    return 'desktop';
  }

  setupArray(array, all = false, layout) {
    const per_page = (screen) => {
      switch (screen) {
        case 'mobile':
        case 'tablet':
          return 6;
        default:
          return 8;
      }
    };
    if (array && array.length) {
      const wanted = chunk(array.filter(c => c.post_type === 'wanted'), 4);
      const offered = array.filter(c => c.post_type === 'offered');
      const block_array = this.concatArray(offered, wanted, layout, per_page(layout));
      if (all) {
        return block_array;
      }
      return block_array.slice(0, per_page(layout));
    }
    return [];
  }

  concatArray(biggest, smaller, layout, per_page = 8) {
    if (smaller.length > 0) {
      // const step = Math.floor((biggest.length > 1 ? biggest.length - 1 : biggest.length) / smaller.length);
      const posts = [];
      let wanted_i = 0;
      let group = 0;
      switch (layout) {
        case 'mobile':
          biggest.forEach((c, i) => {
            if (((i + wanted_i) - (group * per_page) === 1 || (i + wanted_i) - (group * per_page) === 4) && wanted_i < smaller.length) {
              posts.push(smaller[wanted_i]);
              wanted_i++;
            }
            posts.push(c);
            if (i + 1 + wanted_i === per_page * (group + 1)) {
              group++;
            }
          });
          return posts;
        case 'tablet':
          biggest.forEach((c, i) => {
            posts.push(c);
            if (((i + wanted_i) - (group * per_page) === 1) && wanted_i < smaller.length) {
              posts.push(smaller[wanted_i]);
              wanted_i++;
              if (smaller[wanted_i]) {
                posts.push(smaller[wanted_i]);
                wanted_i++;
              }
            }
            if (i + 1 + wanted_i === per_page * (group + 1)) {
              group++;
            }
          });
          return posts;
        default:
          biggest.forEach((c, i) => {
            posts.push(c);
            if (((i + wanted_i) - (group * per_page) === 1 || (i + wanted_i) - (group * per_page) === 3 || (i + wanted_i) - (group * per_page) === 6) && wanted_i < smaller.length) {
              posts.push(smaller[wanted_i]);
              wanted_i++;
            }
            if (i + 1 + wanted_i === per_page * (group + 1)) {
              group++;
            }
          });
          return posts;
      }
    }
    return biggest;
  }

  selectType(type) {
    switch (type) {
      case 'entire_apt':
        return 'entire apartment';
      case 'private_room':
        return 'private room';
      case 'shared_room':
        return 'shared room';
      default:
        return '';
    }
  }

  loadAll() {
    this.setState({
      show_all: true,
    });
    // this.props.loadBest(this.props.pagination.total_objects).then((r) => {
    //   this.setState({
    //     show_all: true,
    //   });
    //   return r;
    // });
  }

  render() {
    const { title, posts, loading, toggleUserModal, toggleProductModal } = this.props;
    const { show_all, device } = this.state;
    const items = this.setupArray(posts, show_all, device);
    return (
      <div className="block-posts container container--full-width container--bg-grey">
        <div className="block-posts__header lazyload">
          <h1 className="block-posts__title">{title}</h1>
        </div>
        <div className="block-posts__offers">
          {items.map((c, i) => {
            if (Array.isArray(c)) {
              return (
                <div key={i} className="block-posts__offers-item block-posts__offers-item--users lazyload">
                  <div className="block-posts__users">
                    {c.map(item =>
                      <Link
                        to={`/wanted-apartments/${item.address}/${item.id}`}
                        key={item.id}
                        className="item-post"
                        style={{ backgroundImage: `url(${item.owner.avatar})` }}
                        onClick={e => handleCardClick(e, toggleUserModal, item.id, `/wanted-apartments/${item.address}/${item.id}`)}
                      >
                        <div className="item-post__overlay item-post__overlay--visible">
                          <div className="item-post__details item-post__details--position-center table">
                            <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                              <div className="item-post__user-title"><span className="item-post__user-pre-title">Looking for </span> <span className="place-type">{`a ${this.selectType(item.place_type)}`}</span></div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              );
            }
            return (
              <div key={c.id} className="block-posts__offers-item lazyload">
                <Link
                  to={`/apartments/${c.address}/${c.id}`}
                  className="item-post"
                  style={{ backgroundImage: `url(${c.attachments[0] ? c.attachments[0].urls.medium : image})` }}
                  onClick={e => handleCardClick(e, toggleProductModal, c.id, `/apartments/${c.address}/${c.id}`)}
                >
                  <div className="item-post__overlay item-post__overlay--visible">
                    <div className="item-post__details item-post__details--position-center table">
                      <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                        <div className="item-post__apart-title">{c.neighbourhood}</div>
                        <div className="type-room">
                          <span>{this.selectType(c.place_type)} </span>
                          <span className="price">${c.price} monthly</span>
                        </div>
                      </div>
                    </div>
                    <div className="item-post__details item-post__details--position-bottom">
                      <div
                        className="item-post__nav"
                      >
                        <div className="avatar-wrapper avatar-wrapper--md-max"><Avatar img={c.owner.avatar} /></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
          {/*<div className="block-posts__offers-item">
            <div className="item-post" style={{ backgroundImage: `url(${image})` }}>
              <div className="item-post__overlay item-post__overlay--visible">
                <div className="item-post__details item-post__details--position-center table">
                  <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                    <div className="item-post__apart-title">Beacon hill</div>
                    <div className="type-room">
                      <span>{roomType } </span>
                      <span className="price">{price} monthly</span>
                    </div>
                  </div>
                </div>
                <div className="item-post__details item-post__details--position-bottom">
                  <Link to="/" className="item-post__nav">
                    <Avatar className="avatar--md-max" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="block-posts__offers-item">
            <div className="item-post" style={{ backgroundImage: `url(${image})` }}>
              <div className="item-post__overlay item-post__overlay--visible">
                <div className="item-post__details item-post__details--position-center table">
                  <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                    <div className="item-post__apart-title">Beacon hill</div>
                    <div className="type-room">
                      <span>{roomType } </span>
                      <span className="price">{price} monthly</span>
                    </div>
                  </div>
                </div>
                <div className="item-post__details item-post__details--position-bottom">
                  <Link to="/" className="item-post__nav">
                    <Avatar className="avatar--md-max" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="block-posts__offers-item block-posts__offers-item--users">
            <div className="block-posts__users">
              <div className="item-post" style={{ backgroundImage: `url(${image})` }} >
                <div className="item-post__overlay item-post__overlay--visible">
                  <div className="item-post__details item-post__details--position-center table">
                    <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                      <div className="item-post__user-title"><span className="item-post__user-pre-title">Looking for </span> <span className="place-type">for a private room</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div to="#" className="item-post" style={{ backgroundImage: `url(${image})` }} >
                <div className="item-post__overlay item-post__overlay--visible">
                  <div className="item-post__details--position-center table">
                    <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                      <div className="item-post__user-title"><span className="item-post__user-pre-title">Looking for </span><span className="place-type">for a private room</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div to="#" className="item-post" style={{ backgroundImage: `url(${image})` }} >
                <div className="item-post__overlay item-post__overlay--visible">
                  <div className="item-post__details--position-center table">
                    <div className="item-post__properties item-post__properties--full-width item-post__properties--titles">
                      <div className="item-post__user-title"><span className="item-post__user-pre-title">Looking for </span> <span className="place-type">for a private room</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div to="#" className="item-post" style={{ backgroundImage: `url(${image})` }} >
                <div className="item-post__overlay item-post__overlay--visible">
                  <div className="item-post__details--position-center table">
                    <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                      <div className="item-post__user-title"><span className="item-post__user-pre-title">Looking for </span><span className="place-type">for a private room</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="block-posts__offers-item">
            <div className="item-post" style={{ backgroundImage: `url(${image})` }}>
              <div className="item-post__overlay item-post__overlay--visible">
                <div className="item-post__details item-post__details--position-center table">
                  <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                    <div className="item-post__apart-title">Beacon hill</div>
                    <div className="type-room">
                      <span>{roomType } </span>
                      <span className="price">{price} monthly</span>
                    </div>
                  </div>
                </div>
                <div className="item-post__details item-post__details--position-bottom">
                  <Link to="/" className="item-post__nav">
                    <Avatar className="avatar--md-max" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="block-posts__offers-item">
            <div className="item-post" style={{ backgroundImage: `url(${image})` }}>
              <div className="item-post__overlay item-post__overlay--visible">
                <div className="item-post__details item-post__details--position-center table">
                  <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                    <div className="item-post__apart-title">Beacon hill</div>
                    <div className="type-room">
                      <span>{roomType } </span>
                      <span className="price">{price} monthly</span>
                    </div>
                  </div>
                </div>
                <div className="item-post__details item-post__details--position-bottom">
                  <Link to="/" className="item-post__nav">
                    <Avatar className="avatar--md-max" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="block-posts__offers-item">
            <div className="item-post" style={{ backgroundImage: `url(${image})` }}>
              <div className="item-post__overlay item-post__overlay--visible">
                <div className="item-post__details item-post__details--position-center table">
                  <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                    <div className="item-post__apart-title">Beacon hill</div>
                    <div className="type-room">
                      <span>{roomType } </span>
                      <span className="price">{price} monthly</span>
                    </div>
                  </div>
                </div>
                <div className="item-post__details item-post__details--position-bottom">
                  <Link to="/" className="item-post__nav">
                    <Avatar className="avatar--md-max" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="block-posts__offers-item block-posts__offers-item--users">
            <div className="block-posts__users">
              <div className="item-post" style={{ backgroundImage: `url(${image})` }} >
                <div className="item-post__overlay item-post__overlay--visible">
                  <div className="item-post__details item-post__details--position-center table">
                    <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                      <div className="item-post__user-title"><span className="item-post__user-pre-title">Looking for </span> <span className="place-type">for a private room</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div to="#" className="item-post" style={{ backgroundImage: `url(${image})` }} >
                <div className="item-post__overlay item-post__overlay--visible">
                  <div className="item-post__details--position-center table">
                    <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                      <div className="item-post__user-title"><span className="item-post__user-pre-title">Looking for </span><span className="place-type">for a private room</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div to="#" className="item-post" style={{ backgroundImage: `url(${image})` }} >
                <div className="item-post__overlay item-post__overlay--visible">
                  <div className="item-post__details--position-center table">
                    <div className="item-post__properties item-post__properties--full-width item-post__properties--titles">
                      <div className="item-post__user-title"><span className="item-post__user-pre-title">Looking for </span> <span className="place-type">for a private room</span></div>
                    </div>
                  </div>
                </div>
              </div>
              <div to="#" className="item-post" style={{ backgroundImage: `url(${image})` }} >
                <div className="item-post__overlay item-post__overlay--visible">
                  <div className="item-post__details--position-center table">
                    <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                      <div className="item-post__user-title"><span className="item-post__user-pre-title">Looking for </span><span className="place-type">for a private room</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="block-posts__offers-item">
            <div className="item-post" style={{ backgroundImage: `url(${image})` }}>
              <div className="item-post__overlay item-post__overlay--visible">
                <div className="item-post__details item-post__details--position-center table">
                  <div className="item-post__properties item-post__properties--titles item-post__properties--full-width">
                    <div className="item-post__apart-title">Beacon hill</div>
                    <div className="type-room">
                      <span>{roomType } </span>
                      <span className="price">{price} monthly</span>
                    </div>
                  </div>
                </div>
                <div className="item-post__details item-post__details--position-bottom">
                  <Link to="/" className="item-post__nav">
                    <Avatar className="avatar--md-max" />
                  </Link>
                </div>
              </div>
            </div>
          </div>*/}
        </div>
        {!show_all &&
          <div className="block-posts__view-more lazyload">
            <button
              onClick={this.loadAll}
              disabled={loading}
              type="button"
              className="form-button form-button--circle form-button--grey form-button--view-more"
            >
              <span>{loading ? 'Loading...' : 'View more'}</span>
            </button>
          </div>
        }
      </div>
    );
  }

}
