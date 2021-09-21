import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const { onAdd } = props;

  const findMovie = () => {
    if (query.length === 0) {
      setError(true);

      return;
    }

    (async () => {
      const movieFromApi = await getMovie(query);

      if (movieFromApi.Response === 'False') {
        setError(true);

        return;
      }

      const newMovie: Movie = {
        title: movieFromApi.Title,
        description: movieFromApi.Plot,
        imgUrl: movieFromApi.Poster,
        imdbUrl: `imdb.com/title/${movieFromApi.imdbID}/`,
        imdbId: movieFromApi.imdbID,
      };

      setMovie(newMovie);
    })();
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (movie) {
      onAdd(movie);
      setQuery('');
    }

    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={classNames('input', { 'is-danger': error })}
              onChange={handleQuery}
              value={query}
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={error}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {!error && movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
