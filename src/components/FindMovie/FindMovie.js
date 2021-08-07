import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  const findMovie = () => {
    getMovie(title)
      .then((film) => {
        if (film.Response === 'False') {
          setMovie(null);
          setError(true);

          return;
        }

        setMovie({
          title: film.Title,
          description: film.Plot,
          imgUrl: film.Poster,
          imdbUrl: `https://www.imdb.com/title/${film.imdbID}/`,
          imdbID: film.imdbID,
        });
      });

    setTitle('');
    setError(false);
  };

  const handleChange = (event) => {
    setTitle(event.target.value);
    setError(false);
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
              className={classNames('input', { 'is-danger': error })}
              value={title}
              onChange={handleChange}
            />
          </div>
          {error
            ? (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            ) : '' }

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
              onClick={() => addMovie(movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {(movie !== null)
          ? (
            <>
              <h2 className="title">Preview</h2>
              <MovieCard {...movie} />
            </>
          )
          : ''}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
