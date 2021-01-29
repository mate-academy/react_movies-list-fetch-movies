import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../data/api';

export const FindMovie = ({ addMovie }) => {
  const [newMovie, setNewMovie] = useState(null);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState('');

  const onSearchField = (e) => {
    setQuery(e.target.value);
    setIsError(false);
  };

  const toFindMovie = async() => {
    const newFilm = await getMovie(query);

    if (newFilm.Error !== undefined) {
      setIsError(true);
      setQuery('');

      return;
    }

    setIsError(false);

    const movie = {
      title: newFilm.Title,
      description: newFilm.Plot,
      imgUrl: newFilm.Poster,
      imdbUrl: `https://www.imdb.com/title/${newFilm.imdbID}`,
      imdbId: newFilm.imdbID,
    };

    setNewMovie(movie);
    setQuery('');
  };

  const onCheckMovie = () => {
    if (!newMovie || newMovie.Error !== undefined) {
      setIsError(true);
      setQuery('');

      return;
    }

    addMovie(newMovie);

    setNewMovie(null);
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
              className={classNames('input',
                { 'is-danger': isError })}
              value={query}
              onChange={onSearchField}
            />
          </div>

          <p className={classNames('help',
            { 'is-danger': isError },
            { 'is-reveal': isError })}
          >
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={toFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onCheckMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {newMovie
        && (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard {...newMovie} />
          </div>
        )
      }
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
