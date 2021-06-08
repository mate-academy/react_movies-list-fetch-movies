import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = ({ onHasMovie: hasMovie, onAddMovie: addMovie }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState(null);
  const [hasSearchError, setSearchError] = useState(false);

  const handleInput = (event) => {
    setMovieTitle(event.target.value);
  };

  const searchMovie = () => {
    request(movieTitle)
      .then((response) => {
        if (response.Response === 'False') {
          return Promise.reject(setFoundMovie(null));
        }

        const { Title, Plot, Poster, imdbID } = response;
        const newMovie = {
          title: Title,
          description: Plot,
          imgUrl: Poster,
          imdbId: imdbID,
          imdbUrl: `"https://www.imdb.com/title/${imdbID}`,
        };

        setFoundMovie(newMovie);
        setMovieTitle('');

        return Promise.resolve(setSearchError(false));
      })
      .catch(() => setSearchError(true));
  };

  const submitMovie = (event) => {
    event.preventDefault();
    if (foundMovie && !hasMovie(foundMovie.imdbId)) {
      addMovie(foundMovie);
      setFoundMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submitMovie}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              name="movieTitle"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames({
                input: true,
                'is-danger': hasSearchError,
              })}
              value={movieTitle}
              onChange={handleInput}
            />
          </div>

          {hasSearchError && (
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
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className={classNames({
                button: true,
                'is-primary': foundMovie,
              })}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {foundMovie && (
      <div className="container">
        <h2 className="title">Preview</h2>

        <MovieCard {...foundMovie} />
      </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  onHasMovie: PropTypes.func.isRequired,
  onAddMovie: PropTypes.func.isRequired,
};
