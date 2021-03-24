import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';

import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovieHandler }) => {
  const [value, setValue] = useState('');
  const [movieCard, setMovie] = useState(null);

  const findNewMovie = useCallback(
    async() => {
      setMovie(await getMovie(value));
    },
    [value],
  );

  const addMovie = () => {
    const newMovie = {
      title: movieCard.Title,
      description: movieCard.Plot,
      imgUrl: movieCard.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieCard.imdbID}/`,
      imdbId: movieCard.imdbID,
    };

    if (movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      return;
    }

    addMovieHandler([
      ...movies,
      newMovie,
    ]);
    movies.push(newMovie);

    setValue('');
  };

  return (
    <>
      <form
        className="find-movie"
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
              className="input is-danger"
              value={value}
              onChange={event => setValue(event.target.value)}
            />
          </div>
          {!movieCard && (
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
              onClick={() => findNewMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movieCard && movieCard.Response === 'True' && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            title={movieCard.Title}
            description={movieCard.Plot}
            imgUrl={movieCard.Poster}
            imdbUrl={`https://www.imdb.com/title/${movieCard.imdbID}/`}
          />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovieHandler: PropTypes.func.isRequired,
};
