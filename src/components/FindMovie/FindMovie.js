import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie, movies }) => {
  const [newMovie, setNewMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isMovieLoaded, setIsMovieLoaded] = useState(false);

  const handleTitle = (event) => {
    const { value } = event.target;

    if (value !== title) {
      setLoadError(false);
      setIsMovieLoaded(false);
    }

    setTitle(value);
  };

  const findMovie = () => {
    getMovie(title)
      .then((movieFromServer) => {
        const movie = {
          title: movieFromServer.Title,
          description: movieFromServer.Plot,
          imgUrl: movieFromServer.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbId}`,
          imdbId: movieFromServer.imdbID,
        };

        if (!movie.imdbId) {
          setLoadError(true);
        } else {
          setNewMovie(movie);
          setDisabled(false);
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      addMovie(newMovie);
      setNewMovie(null);
      setTitle('');
      setDisabled(true);
    } else {
      setIsMovieLoaded(true);
    }
  };

  return (
    <>
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
              placeholder="Enter a title to search"
              className="input"
              name="value"
              value={title}
              onChange={handleTitle}
            />
          </div>

          {loadError && (
            <p className="help is-danger">
              Movie not found
            </p>
          )}
          {isMovieLoaded && (
            <p className="help is-danger">
              Movie already has been added
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
              Find
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={disabled}
            >
              Add
            </button>
          </div>
        </div>
      </form>

      {newMovie && (
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
  movies: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imgUrl: PropTypes.string.isRequired,
    imdbUrl: PropTypes.string.isRequired,
  }).isRequired).isRequired,
};
