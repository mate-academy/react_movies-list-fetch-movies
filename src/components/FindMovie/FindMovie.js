import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = ({ onAdd, movies }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(true);
  const [newMovie, setMovie] = useState(movies[0]);
  const [disabledButton, setDisabledButton] = useState(true);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
    setError(false);
  };

  const handleFindMovie = async() => {
    const movie = await request(title);

    setTitle('');

    if (movie.Title) {
      const collectedMovieProperies = {
        title: movie.Title,
        imdbId: movie.imdbID,
        imgUrl: movie.Poster,
        description: movie.Plot,
        imbdUrl: `https://www.imdb.com/title/${movie.imdbID}`,
      };

      const checkMovie = movies.some(
        property => property.imdbId === collectedMovieProperies.imdbId,
      );

      setIsDuplicate(checkMovie);
      setMovie(collectedMovieProperies);
      setDisabledButton(false);
    } else {
      setError(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isDuplicate) {
      setDisabledButton(true);

      return;
    }

    onAdd(newMovie);
    setDisabledButton(true);
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
        <MovieCard {...newMovie} />
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
