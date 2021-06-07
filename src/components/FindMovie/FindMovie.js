import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
// import movies from '../../api/movies.json';

const getMovie = request => fetch(`
  https://www.omdbapi.com/?apikey=c38f8b77&t=${request}
  `)
  .then(response => response.json());

export const FindMovie = () => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState(null);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          getMovie(query)
            .then((film) => {
              setMovie(film);
            });
        }}
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
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </div>

          {!movie && (
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
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard {...movie} />}
      </div>
    </>
  );
};
