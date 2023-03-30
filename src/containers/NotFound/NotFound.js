import React from 'react';
import {} from './NotFound.scss';
import Helmet from 'react-helmet';
import config from '../../config';

export default function NotFound() {
  return (
    <div className="not-found">
      <Helmet {...config.app.notFound} />
      <h5>Error 404</h5>
      <h1>Ooops!</h1>
      <p>These are <em>not</em> the droids you are looking for!</p>
    </div>
  );
}
