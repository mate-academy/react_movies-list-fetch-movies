import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

import './FindMovie.scss';

export const FindMovie = ({ onAdd, movies }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(true);
  const [newMovie, setMovie] = useState('');
  const [disabledButton, setDisabledButton] = useState(true);

  const handleChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
    setError(false);
  }, []);

  const handleFindMovie = useCallback(async() => {
    const movie = await request(title);

    if (movie.Title) {
      const collectedMovieProperties = {
        title: movie.Title,
        imdbId: movie.imdbID,
        imgUrl: movie.Poster,
        description: movie.Plot,
        imbdUrl: `https://www.imdb.com/title/${movie.imdbID}`,
      };

      setTitle('');
      setMovie(collectedMovieProperties);
      setDisabledButton(false);
    } else {
      setError(true);
    }
  });

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    setDisabledButton(true);
    setMovie('');

    const checkMovie = movies.some(
      property => property.imdbId.includes(
        newMovie.imdbId,
      ),
    );

    if (checkMovie) {
      return;
    }

    onAdd(newMovie);
  });

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
              value={title}
              onChange={handleChangeTitle}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
            />
          </div>

          <p className={classNames(
            'help', 'is-danger', { 'is-hidden': !error },
          )}
          >
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              onClick={handleFindMovie}
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              disabled={disabledButton}
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie && (<MovieCard {...newMovie} />)}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imgUrl: PropTypes.string,
      imdbUrl: PropTypes.string,
      imdbId: PropTypes.string.isRequired,
    }),
  ),
};

FindMovie.defaultProps = {
  movies: [],
};
