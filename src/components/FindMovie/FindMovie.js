import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [isPreviewShown, switchPreviewDisplay] = useState(false);
  const [newMovie, setNewMovie] = useState({});
  const [error, setError] = useState('');
  const [isAddButtonDisabled, switchAddButtonDisability] = useState(true);
  const [isLoading, switchLoading] = useState(false);

  const handleChange = (event) => {
    setTitle(event.target.value);
    setError('');
  };

  const findMovie = async() => {
    switchLoading(true);

    try {
      const movieFromServer = await getMovie(title);

      if (movieFromServer.Response === 'False') {
        setError(`Can't find this movie`);
        switchLoading(false);

        return;
      }

      setNewMovie(movieFromServer);
      switchPreviewDisplay(true);
      switchAddButtonDisability(false);
      switchLoading(false);
    } catch (serverError) {
      setError(`Server doesn't response`);
      switchLoading(false);
    }
  };

  const handleAddition = () => {
    setTitle('');
    switchPreviewDisplay(false);
    switchAddButtonDisability(true);

    if (movies.some(movie => newMovie.imdbID === movie.imdbID)) {
      setError('You have already added this movie');

      return;
    }

    addMovie(newMovie);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control has-icons-left">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames({
                input: true,
                'is-danger': error,
                'is-loading': isLoading,
              })}
              value={title}
              onChange={handleChange}
            />
            <span className="icon is-small is-left">
              <i className="fas fa-search" />
            </span>
          </div>

          {error && (
            <p className="help is-danger">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={classNames({
                button: true,
                'is-light': true,
                'is-loading': isLoading,
              })}
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className={classNames({
                button: true,
                'is-success': !isAddButtonDisabled,
                'is-warning': isAddButtonDisabled,
              })}
              onClick={handleAddition}
              disabled={isAddButtonDisabled}
              title={isAddButtonDisabled ? 'Find movie first' : ''}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {isPreviewShown ? (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...newMovie} />
        </div>
      ) : (
        <h3>Start searching to see preview</h3>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      Title: PropTypes.string,
      Plot: PropTypes.string,
      Poster: PropTypes.string,
      imdbID: PropTypes.string,
    }),
  ).isRequired,
};
