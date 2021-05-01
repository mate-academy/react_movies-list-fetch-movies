import React from 'react';
import PropTypes from 'prop-types';

export const InputFindMovie = ({ handleSubmit, findMovie, title,
  setTitle, hiddenError, setHiddenError, submitDisabled }) => (
    <form
      className="find-movie"
      onSubmit={handleSubmit}
    >
      <div className="field">
        <label className="label" htmlFor="movie-title">
          Movie title
        </label>

        <div className="control">
          <input
            type="text"
            id="movie-title"
            value={title}
            onChange={(e) => {
              setHiddenError('hidden');
              setTitle(e.target.value);
            }}
            placeholder="Enter a title to search"
            className="input"
          />
        </div>

        <p className={hiddenError}>
          Can&apos;t find a movie with such a title
        </p>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="button"
            className="button is-light"
            onClick={() => findMovie()}
          >
            Find a movie
          </button>
        </div>

        <div className="control">
          <button
            type="submit"
            className="button is-primary"
            disabled={submitDisabled}
          >
            Add to the list
          </button>
        </div>
      </div>
    </form>

);

InputFindMovie.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  findMovie: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  hiddenError: PropTypes.string.isRequired,
  setHiddenError: PropTypes.func.isRequired,
  submitDisabled: PropTypes.bool.isRequired,
};
