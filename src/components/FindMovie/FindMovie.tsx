import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  addMovies: (film: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovies }) => {
  const [movie, setMovie] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const loadMovie = () => {
    getMovie(query)
      .then(movieFromServer => {
        if (!movieFromServer) {
          setError(movieFromServer.Error);
        } else {
          setMovie(movieFromServer);
        }
      });
  };

  const changeQuery = (event: { target: { value: string; }; }) => {
    const { value } = event.target;

    setQuery(value);
    setError('');
  };

  const submitForm = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (movie) {
      addMovies(movie);
      setQuery('');
      setMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submitForm}
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
              onChange={changeQuery}
            />
          </div>

          {error.length > 0 && (
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
              disabled={!query}
              onClick={loadMovie}
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
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
