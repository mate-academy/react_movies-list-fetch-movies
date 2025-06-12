import React from 'react';
import './Loader.scss';

export const Loader: React.FC = () => (
  <div className="Loader is-loading" data-cy="loader">
    <div className="Loader__content" />
  </div>
);
