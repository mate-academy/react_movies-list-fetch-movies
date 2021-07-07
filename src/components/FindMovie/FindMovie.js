import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

export const FindMovie = ({ onAdd }) => {
  const [search, setSearch] = useState('');
  const [movie, setMovie] = useState('');
  const [error, setError] = useState('');

  const searchMovie = (event) => {
    event.preventDefault();

    getMovie(search)
      .then((film) => {
        if (film.Response === 'True') {
          const newMovie = {
            title: film.Title,
            description: film.Plot,
            imgUrl: film.Poster,
            imdbUrl: `https://www.imdb.com/title/${film.imdbID}`,
            imdbId: film.imdbID,
          };

          return setMovie(newMovie);
        }

        return setError('Can\'t find a movie with such a title');
      });

    return setSearch('');
  };

  const handleChange = (event) => {
    setSearch(event.target.value);
    setError('');
  };

  const addFilm = () => {
    onAdd(movie);
    setMovie('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={searchMovie}
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
              className={classNames('input', {
                'is-danger': error.length !== 0,
              })}
              value={search}
              onChange={handleChange}
            />
          </div>

          <p className="help is-danger">
            {error}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addFilm}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {(movie.length !== 0) && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
