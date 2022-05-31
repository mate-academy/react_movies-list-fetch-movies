import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  addMovie: (movie: Movie) => void,
  movies: Movie[],
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);

  const getMovieFromServer = async () => {
    const movieFromServer: Movie = await getMovie(query);

    if (!movieFromServer.Title) {
      setError(true);

      return;
    }

    setMovie(movieFromServer);
    setError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
  };

  const changeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => handleSubmit(event)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={changeQuery}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames({
                input: true,
                'is-danger': error,
              })}
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
            <button data-cy="find"
              onClick={() => getMovieFromServer()}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button data-cy="add"
              disabled={!movie
                || movies.some(film => film.imdbID === movie.imdbID)}
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div
          className="container"
        >
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
