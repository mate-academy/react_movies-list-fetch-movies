import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovies } from '../../api';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [errorIsDisplayed, setErrorIsDisplayed] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const loadMovie = () => {
    getMovies(query)
      .then(movieFromServer => {
        if (movieFromServer.Response === 'True') {
          setMovie(movieFromServer);
        } else {
          setErrorIsDisplayed(true);
        }
      });
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          {/* eslint-disable-next-line */}
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input', { 'is-danger': errorIsDisplayed },
              )}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setErrorIsDisplayed(false);
              }}
            />
          </div>

          {errorIsDisplayed && (
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
              onClick={
                () => {
                  loadMovie();
                  setQuery('');
                }
              }
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie) {
                  addMovie(movie);
                  setQuery('');
                  setMovie(null);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard
            movie={movie}
          />
        )}
      </div>
    </>
  );
};
