import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../myApi';

export const FindMovie = ({ movies, addNewMovie }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState();
  const [error, setError] = useState(false);

  const handleChangeQuery = ({ target }) => {
    setError(false);
    setQuery(target.value);
    setNewMovie();
  };

  const findMovie = () => {
    getMovie(query)
      .then((movie) => {
        if (movie.Response === 'False') {
          setError('No movie was found');
          setNewMovie(null);

          return;
        }

        setNewMovie({
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbId}`,
          imdbId: movie.imdbID,
        });
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (movies.find(movie => movie.imdbID === newMovie.imdbID)) {
      setError(true);

      return;
    }

    addNewMovie(newMovie);
    setQuery('');
  };

  const handleReset = () => {
    setQuery('');
    setNewMovie();
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
              onClick={() => {
                addNewMovie(newMovie);
                handleReset();
              }}
            >
              Add to the list
            </button>
            {newMovie && (
              <p className={classNames({ 'help is-danger': !error })}>
                The movie already on the list
              </p>
            )}
          </div>
        </div>
      </form>
      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie && (
          <MovieCard {...newMovie} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addNewMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imgUrl: PropTypes.string.isRequired,
      imdbUrl: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
