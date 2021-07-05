import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

export const FindMovie = ({ onAdd }) => {
  const [search, setSearch] = useState('');
  const [movie, setMovie] = useState('');
  const [error, setError] = useState('');

  const searchMovie = () => {
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
              className={`input ${error.length !== 0 ? 'is-danger' : ''}`}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setError('');
              }}
            />
          </div>

          <p className="help is-danger">
            {error}
          </p>
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
              onClick={() => {
                onAdd(movie);
                setMovie('');
              }}
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
