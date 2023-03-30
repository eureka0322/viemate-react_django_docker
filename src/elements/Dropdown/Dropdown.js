import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {} from './Dropdown.scss';

class Dropdown extends Component {
  static propTypes = {
    trigger: PropTypes.node,
    children: PropTypes.object,
    className: PropTypes.string,
    self_closing: PropTypes.bool,
    prevent_close: PropTypes.bool,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    prevent_close: false,
    className: '',
    onOpen: () => {},
    onClose: () => {},
  };

  constructor(props) {
    super(props);
    this.close = this.close.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      is_open: false,
      cant_close: false
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.close);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.close);
    clearTimeout(this._timeout);
  }


  toggle() {
    if (!this.props.prevent_close) {
      if (!this.state.is_open) {
        this.props.onOpen();
      } else {
        this.props.onClose();
      }
      this.setState({ is_open: !this.state.is_open, cant_close: true });
      this._timeout = setTimeout(() => this.setState({ cant_close: false }), 100);
    }
  }

  close(e) {
    if (!this.props.prevent_close && !this.state.cant_close && this.state.is_open && !this.content.contains(e.target)) {
      this.setState({ is_open: false });
      this.props.onClose();
    }
  }

  render() {
    const { className, trigger, children } = this.props;
    const { is_open } = this.state;
    return (
      <div className={`dropdown ${className} ` + (is_open ? 'is-active ' : '')}>
        <div
          className="dropdown__trigger"
          onClick={this.toggle}
        >
          {trigger}
        </div>
        <ReactCSSTransitionGroup transitionName="dropdown-animation" component="div" transitionLeaveTimeout={150} transitionEnterTimeout={150}>
          {is_open &&
            <div onClick={() => this.props.self_closing && this.toggle()} className="dropdown-animation" ref={(c) => { this.content = c; }}>
              {children}
            </div>}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
export default Dropdown;
