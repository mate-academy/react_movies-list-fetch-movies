import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { loadMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState(null);
  const [isMovieNotFound, setIsMovieNotFound] = useState(false);

  const handleChange = (event) => {
    setQuery(event.target.value);
    setIsMovieNotFound(false);
  };

  const findMovie = () => {
    if (!query) {
      return;
    }

    loadMovie(query)
      .then((response) => {
        if (response.Response === 'False') {
          setIsMovieNotFound(true);
          setMovie(null);

          return;
        }

        setMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        });

        setQuery('');
      });
  };

  const addToMovies = () => {
    if (!movie) {
      return;
    }

    addMovie(movie);
  };

  return (
    <>
      <form className="find-movie" onSubmit={event => event.preventDefault()}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': isMovieNotFound })}
              value={query}
              onChange={event => handleChange(event)}
            />
          </div>

          {isMovieNotFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
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
              onClick={addToMovies}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard {...movie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
