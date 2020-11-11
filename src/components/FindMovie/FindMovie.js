import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../myApi';

export const FindMovie = ({ movies, addNewMovie }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState();
  const [movieAlreadyInList, setMovieAlreadyInList] = useState(false);
  const [error, setError] = useState(false);

  const checkMovieInList = () => {
    if (movies.find(movie => movie.imdbID === newMovie.imdbID)) {
      setMovieAlreadyInList(true);

      return;
    }

    addNewMovie(newMovie);
    setQuery('');
  };

  const handleChangeQuery = ({ target }) => {
    setError(false);
    setMovieAlreadyInList(false);
    setQuery(target.value);
    setNewMovie();
  };

  const findMovie = () => {
    getMovie(query)
      .then((movie) => {
        if (movie.Response === 'False') {
          setError(true);

          return;
        }

        setError(false);
        setNewMovie(movie);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={query}
              onChange={handleChangeQuery}
            />
          </div>
          {
            error && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
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
              onClick={checkMovieInList}
              disabled={!newMovie}
            >
              Add to the list
            </button>
            {movieAlreadyInList && (
              <p className={classNames({ 'help is-danger': !error })}>
                The movie already on the list
              </p>
            )}
          </div>
        </div>
      </form>
      <div className="container">
        {newMovie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard
              Title={newMovie.Title}
              Plot={newMovie.Plot}
              Poster={newMovie.Poster}
              imdbID={newMovie.imdbID}
            />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addNewMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      Title: PropTypes.string.isRequired,
      Plot: PropTypes.string.isRequired,
      Poster: PropTypes.string.isRequired,
      imdbID: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
