import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [isPreviewShown, setIsPreviewShown] = useState(false);
  const [newMovie, setNewMovie] = useState({});
  const [error, setError] = useState('');
  const [isAddButtonDisabled, setDisability] = useState(true);

  const handleChange = (event) => {
    setTitle(event.target.value);
    setError('');
  };

  const findMovie = () => {
    getMovie(title)
      .then((result) => {
        if (result.Response === 'False') {
          setError(result.Error);

          return;
        }

        setNewMovie(result);
        setIsPreviewShown(true);
        setDisability(false);
      });
  };

  const handleAddition = () => {
    setTitle('');
    setIsPreviewShown(false);
    setDisability(true);

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

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames({
                input: true,
                'is-danger': error,
              })}
              value={title}
              onChange={handleChange}
            />
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
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddition}
              disabled={isAddButtonDisabled}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {isPreviewShown && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...newMovie} />
        </div>
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
