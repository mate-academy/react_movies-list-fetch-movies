import React from 'react';
import PropTypes from 'prop-types';

export const Buttons = ({ findMovie }) => (
  <div className="field is-grouped">
    <div className="control">
      <button
        type="button"
        className="button is-light"
        onClick={findMovie}
      >
        Find a movie
      </button>
    </div>

    <div className="control">
      <button
        type="submit"
        className="button is-primary"
      >
        Add to the list
      </button>
    </div>
  </div>
);

Buttons.propTypes = {
  findMovie: PropTypes.func.isRequired,
};
