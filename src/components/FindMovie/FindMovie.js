import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getByTitle } from '../../api';

const IMDB_URL = 'https://www.imdb.com/title/';

export const FindMovie = ({ onAddMovie }) => {
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);

  async function handleFindMovie() {
    const foundMovie = await getByTitle(title);

    if (foundMovie.Response === 'False') {
      setTitleError(true);

      return;
    }

    setMovie({
      title: foundMovie.Title,
      description: foundMovie.Plot,
      imgUrl: foundMovie.Poster,
      imdbId: foundMovie.imdbID,
      imdbUrl: `${IMDB_URL}${foundMovie.imdbID}`,
    });
  }

  function handleTitleChange(e) {
    setTitleError(false);
    setTitle(e.target.value);
  }

  function handleAddMovie() {
    onAddMovie(movie);
    setTitle('');
    setMovie(null);
  }

  function isAddToListDisabled() {
    return titleError || title.length === 0 || !movie;
  }

  return (
    <>
      <form className="find-movie" onSubmit={e => e.preventDefault()}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': titleError,
              })}
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
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
              disabled={isAddToListDisabled()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  onAddMovie: PropTypes.func.isRequired,
};
