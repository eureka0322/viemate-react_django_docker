import React, { Component, PropTypes } from 'react';
import {} from './Modal.scss';
import { Form } from 'elements';

const iconClose = require('./close.svg');

export default class Modal extends Component {
  static propTypes = {
    children: PropTypes.node,
    header: PropTypes.node,
    className: PropTypes.string,
    opened: PropTypes.bool,
    disableClickClose: PropTypes.bool,
    disableClose: PropTypes.bool,
    innerButtonClose: PropTypes.bool,
    handleClose: PropTypes.func
  };

  static defaultProps = {
    className: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      cant_close: false,
    };
    this.preventClick = true;
    this.close = ::this.close;
    this.handleClickClose = ::this.handleClickClose;
    this.handlePopstate = ::this.handlePopstate;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.close);
    window.addEventListener('popstate', this.handlePopstate);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.opened && !this.props.opened) {
      const doc = document;
      this.setState({cant_close: true});
      this._timeout = setTimeout(() => this.setState({cant_close: false}), 250);

      this._wrapperHideScroll = doc.querySelector('.modal:not(.hide-scroll)') || doc.body;
      this._wrapperHideScroll.classList.add('hide-scroll');
    }
    if (!nextProps.opened && this.props.opened) {
      this._wrapperHideScroll.classList.remove('hide-scroll');
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.close);
    window.removeEventListener('popstate', this.handlePopstate);
    clearTimeout(this._timeout);
  }

  close(event) {
    if (!this.state.cant_close && !this.props.disableClose && this.props.opened && event.keyCode === 27) {
      this.props.handleClose();
    }
  }

  handleClickClose(event) {
    if (!this.state.cant_close && !this._modal.contains(event.target)) {
      this.props.handleClose();
    }
  }

  handlePopstate() {
    if (this.props.opened) {
      this.props.handleClose();
    }
  }

  render() {
    const {
      children,
      className,
      opened,
      handleClose,
      disableClickClose,
      disableClose,
      innerButtonClose,
      header
    } = this.props;
    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { closeModal: this.props.handleClose })
    );

    if (!opened) return null;

    return (
      <div>
        {opened &&
          <div className={`modal ${className || ''} `} onClick={!disableClickClose && this.handleClickClose}>
            {!disableClose && !innerButtonClose &&
              <Form.Button
                className="modal-close"
                onClick={disableClickClose && handleClose}
                type="button"
              >
                <img src={iconClose} width={30} height={30} alt="Close" />
              </Form.Button>
            }
            <div className={'modal-dialog' + (innerButtonClose ? ' inner-btn-close' : '')}>
              <div className="modal-content">
                {header &&
                  <div className="modal-header">
                    {header}
                  </div>}
                <div className="modal-body modal-body__container" ref={(c) => { this._modal = c; }}>
                  {!disableClose && innerButtonClose &&
                    <Form.Button
                      className="modal-close modal-close--inner"
                      onClick={handleClose}
                      type="button"
                    >
                      <img src={iconClose} width={30} height={30} alt="Close" />
                    </Form.Button>}
                  <div className="modal-children-wrap">{childrenWithProps}</div>
                </div>
              </div>
            </div>
          </div>}
      </div>
    );
  }
}
