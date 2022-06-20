import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  addMovies: (film: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);

  const loadMovie = () => {
    getMovie(query)
      .then(movieFromServer => {
        if (movieFromServer.Error === 'Movie not found!') {
          setError(true);
          setMovie(null);
        } else {
          setMovie(movieFromServer);
        }
      });
  };

  const changeQuery = (event: { target: { value: string; }; }) => {
    const { value } = event.target;

    setQuery(value);
    setError(false);
  };

  const submitForm = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (movie) {
      addMovies(movie);
      setQuery('');
      setMovie(null);
    }

    setError(false);
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
              className={error ? 'is-danger input' : 'input'}
              value={query}
              onChange={changeQuery}
            />
          </div>

          {error && (
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
              disabled={error}
              onClick={() => {
                if (!query) {
                  setError(true);
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
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
