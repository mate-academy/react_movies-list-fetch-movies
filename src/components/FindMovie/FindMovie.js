import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { fetchMovie } from '../../api/api';

export const FindMovie = ({ addNewMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState(null);
  const [errorLoad, setErrorLoad] = useState(false);

  const handleChange = (e) => {
    setErrorLoad(false);
    setQuery(e.target.value);
  };

  const findMovie = async() => {
    const film = await fetchMovie(query);

    if (film.Response === 'False') {
      setMovie(null);
      setErrorLoad(true);
      setQuery('');

      return;
    }

    setMovie({
      title: film.Title,
      description: film.Plot,
      imgUrl: film.Poster,
      imdbUrl: `https://www.imdb.com/title/${film.imdbID}/`,
      imdbId: film.imdbID,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!movie) {
      setErrorLoad(false);

      return;
    }

    addNewMovie(movie);
    setQuery('');
    setMovie(null);
    setErrorLoad(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${errorLoad && 'is-danger'}`}
              value={query}
              onChange={handleChange}
            />
          </div>

          {errorLoad && (
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              onClick={onSubmit}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie
        && (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </div>
        )
      }

    </>
  );
};

FindMovie.propTypes = {
  addNewMovie: PropTypes.func.isRequired,
};
