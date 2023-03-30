import React, { Component, PropTypes } from 'react';
import {} from './MessageSearch.scss';

export default class MessageSearch extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.submit = ::this.submit;
  }

  componentDidMount() {
    this._input.addEventListener('keyup', this.submit);
  }

  componentWillUnmount() {
    this._input.removeEventListener('keyup', this.submit);
  }

  submit() {
    this.props.onSearch(this._input.value);
  }

  render() {
    return (
      <div className="message-search" action="" method="post" onSubmit={(e) => {e.preventDefault();}}>
        <form action="" method="post" className="message-search__form">
          <div className="form-group ">
            <div className="input-group input-group-lg">
              <span className="input-group-addon"><i className="icon icon--search" /></span>
              <input type="text" ref={n => this._input = n} autoComplete="off" className="form-control " id="form-input-search" name="search" />
            </div>
          </div>
        </form>
      </div>
    );
  }
}
