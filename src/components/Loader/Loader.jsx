import React from 'react';
import './Loader.css';

export const Loader = ({ children, isLoad }) => {
  if (isLoad) {
    return (
      <div className="lds-ripple">
        <div />
        <div />
      </div>
    );
  }

  return children;
};
