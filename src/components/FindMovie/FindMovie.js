import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { getFilm } from '../../api/api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

export const FindMovie = ({ addMovie }) => {
  const [searchQuery, setsearchQuery] = useState('');
  const [newMovie, setNewMovie] = useState(null);
  const [searchQueryError, setSearchQueryError] = useState(false);

  const searchMovie = () => {
    if (!searchQuery) {
      return;
    }

    getFilm(searchQuery).then((result) => {
      if (result.Error) {
        setSearchQueryError(true);

        return;
      }

      setNewMovie({
        title: result.Title,
        description: result.Plot,
        imgUrl: result.Poster,
        imdbId: result.imdbID,
      });
      setSearchQueryError(false);
    });
  };

  const onAddMovie = () => {
    addMovie((movies) => {
      if (newMovie === null) {
        return movies;
      }

      if (movies.find(movie => movie.title === newMovie.title) !== undefined) {
        return movies;
      }

      setNewMovie(null);
      setsearchQuery('');

      return [...movies, newMovie];
    });
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
              className={classNames('input', { 'is-danger': searchQueryError })}
              onChange={event => setsearchQuery(event.target.value)}
              value={searchQuery}
            />
          </div>

          {searchQueryError && (
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
              type="button"
              className="button is-primary"
              onClick={onAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie && <MovieCard {...newMovie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
