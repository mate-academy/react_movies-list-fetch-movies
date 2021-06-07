import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './FindMovie.scss';
import classNames from 'classnames';

import { getMovieByTitle } from '../../api/movies';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ onAdd }) => {
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);

  const movieRequest = () => {
    getMovieByTitle(title)
      .then((result) => {
        if (result.Response === 'True') {
          setMovie({
            title: result.Title,
            description: result.Plot,
            imgUrl: result.Poster,
            imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
            imdbId: result.imdbID,
          });
        } else {
          setTitleError(true);
          setTitle('');
        }
      });
  };

  const handleTitleChange = ({ target }) => {
    setTitle(target.value);
    setTitleError(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (movie) {
      onAdd(movie);
      setMovie(null);
      setTitle('');
    }
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
              className={classNames('input', { 'is-danger': titleError })}
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          {titleError && (
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
              onClick={movieRequest}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              onClick={handleFormSubmit}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard {...movie} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
