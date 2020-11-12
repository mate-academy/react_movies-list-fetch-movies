import React from 'react';

export const Buttons = ({ onClick, disabled }) => (
  <div className="field is-grouped">
    <div className="control">
      <button
        type="button"
        className="button is-light"
        onClick={onClick}
      >
        Find a movie
      </button>
    </div>

    <div className="control">
      <button
        type="submit"
        className="button is-primary"
        disabled={disabled}
      >
        Add to the list
      </button>
    </div>
  </div>
);
