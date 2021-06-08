import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { request } from '../../api';

export const FindMovie = ({ addMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState(false);
  const [newMovie, setMovie] = useState(null);

  const handleTitleChange = (event) => {
    setSearchQuery(event.target.value);
    setSearchError(false);
  };

  const findMovie = (event) => {
    event.preventDefault();
    request(searchQuery)
      .then((movie) => {
        if (movie.Response === 'False') {
          setSearchError(true);
          setMovie(null);
        } else {
          setMovie({
            title: movie.Title,
            description: movie.Plot,
            imgUrl: movie.Poster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
            imdbId: movie.imdbID,
          });
        }
      });
  };

  const handleClick = () => {
    addMovie(newMovie);
    setSearchQuery('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={findMovie}
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
              className={classNames({
                input: true,
                'is-danger': searchError,
              })}
              value={searchQuery}
              onChange={handleTitleChange}
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
              type="submit"
              className="button is-light"
              disabled={!searchQuery}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!newMovie}
              onClick={handleClick}
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
  addMovie: PropTypes.func.isRequired,
};
