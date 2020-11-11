import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export function FindMovie({ addMovie, movies }) {
  const [query, setQuery] = useState('');
  const [movieForPreview, setMovieForPreview] = useState();
  const [movieAlreadyInList, setMovieAlreadyInList] = useState(false);
  const [searchError, setSearchError] = useState(false);

  const checkMovieInList = () => {
    if (movies.find(movie => movie.imdbID === movieForPreview.imdbID)) {
      setMovieAlreadyInList(true);

      return;
    }

    addMovie(movieForPreview);
    setQuery('');
  };

  const changeQuery = (event) => {
    setSearchError(false);
    setMovieAlreadyInList(false);
    setQuery(event.target.value);
    setMovieForPreview();
  };

  const movieSearch = async() => {
    const requestedMovie = await getMovie(query);

    if (requestedMovie.Response === 'False') {
      setSearchError(true);

      return;
    }

    setSearchError(false);
    setMovieForPreview(requestedMovie);
  };

  const preventDefaultSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <form className="find-movie" onSubmit={preventDefaultSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': searchError })}
              value={query}
              onChange={changeQuery}
              autoComplete="off"
            />
          </div>
          {searchError && (
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
              onClick={movieSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={checkMovieInList}
              disabled={!movieForPreview}
            >
              Add to the list
            </button>
            {movieAlreadyInList && (
              <p className={classNames({ 'help is-danger': !searchError })}>
                The movie already on the list
              </p>
            )}
          </div>
        </div>
      </form>

      <div className="container">
        {movieForPreview && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard
              Title={movieForPreview.Title}
              Plot={movieForPreview.Plot}
              Poster={movieForPreview.Poster}
              imdbID={movieForPreview.imdbID}
            />
          </>
        )}
      </div>
    </>
  );
}

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      Title: PropTypes.string.isRequired,
      Plot: PropTypes.string.isRequired,
      Poster: PropTypes.string.isRequired,
      imdbID: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
