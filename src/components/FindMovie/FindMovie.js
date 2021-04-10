import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { findMovie } from '../../api/api';

export const FindMovie = ({ addToList }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState(null);
  const [isHiddenWarning, setIsHiddenWarning] = useState(true);

  const handleQuery = async(title) => {
    const movie = await findMovie(title);

    if (movie.Response === 'True') {
      setNewMovie({
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
        imdbId: movie.imdbID,
      });
      setIsHiddenWarning(true);
    } else {
      setIsHiddenWarning(false);
      setNewMovie(null);
    }
  };

  const handleAdding = () => {
    if (newMovie) {
      addToList(newMovie);
      setQuery('');
      setNewMovie(null);
    } else {
      setIsHiddenWarning(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          handleQuery(query);
        }}
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
              className={classNames(
                'input',
                { 'is-danger': !isHiddenWarning },
              )}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsHiddenWarning(true);
              }}
            />
          </div>

          {!isHiddenWarning && (
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
              onClick={() => handleQuery(query)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAdding}
            >
              Add to the list
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
  addToList: PropTypes.func.isRequired,
};
