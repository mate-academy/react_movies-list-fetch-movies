/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
/* eslint-disable max-len */
import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { requestMovie } from '../../api/api';

type Props = {
  movies: Movie[],
  onAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAdd, movies }) => {
  const [error, setError] = useState(false);
  const [visibleMovie, setVisibleMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');

  const showMovie = () => {
    requestMovie(query)
      .then(response => {
        setVisibleMovie(response);
        setError(false);
      })
      .catch(eror => {
        console.log('error', eror);
        setError(true);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          if (visibleMovie && !movies.some(movie => movie.imdbID === visibleMovie?.imdbID)) {
            onAdd(visibleMovie);
            setVisibleMovie(null);
          } else {
            setVisibleMovie(null);
          }

          setQuery('');
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              id="movie-title"
              placeholder="Enter a title to search"
              className={
                error
                  ? 'input is-danger'
                  : 'input'
              }
            />
          </div>

          {error
            ? (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
            : null}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                setVisibleMovie(null);
                showMovie();
              }}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              data-cy="add"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {visibleMovie && (<MovieCard movie={visibleMovie} />)}
      </div>
    </>
  );
};
