import React, { useState, useCallback, FormEvent } from 'react';
import { getMovies } from '../../api/api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const onFindMovie = useCallback(() => {
    if (!query.trim()) {
      setError('Invalid input');
    } else {
      const finded = async () => {
        const value = await getMovies(query);

        if (value.Response === 'True') {
          setMovie(value);
          setError('');
        } else {
          setError("Can't find such movie");
        }
      };

      finded();
    }
  }, [query]);

  const onAddMovie = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!error && movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
  }, [movie, error]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onAddMovie}
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
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </div>

          {error && (
            <p className="help is-danger">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
