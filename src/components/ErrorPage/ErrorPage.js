import React, { Component } from 'react';
import {} from './ErrorPage.scss';
import { Link } from 'elements';


export default class ErrorPage extends Component {

  render() {
    return (
      <div className="container-error">
        <h1 className="container-error__header"><span>Error code: 404!</span> <span>Page not found</span></h1>
        <div className="container-error__wrapper">
          <div className="container-error__nav">
            <Link to="/" className="form-button form-button--go-home form-button--uppercase">
              Go home
            </Link>
          </div>
        </div>
      </div>
    );
  }

}
