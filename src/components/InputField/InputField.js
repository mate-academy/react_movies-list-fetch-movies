import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const InputField = ({ value, error, handleChange }) => (
  <div className="field">
    <label className="label" htmlFor="movie-title">
      Movie title
    </label>

    <div className="control">
      <input
        type="text"
        id="movie-title"
        placeholder="Enter a title to search"
        value={value}
        className={classNames('input', {
          'is-danger': error,
        })}
        onChange={handleChange}
      />
    </div>

    {
      error && (
        <p className="help is-danger">
          {error}
        </p>
      )
    }
  </div>
);

InputField.propTypes = {
  value: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};
