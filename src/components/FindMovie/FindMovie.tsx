import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const [movie, setMovie] = useState(null as Movie | null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const { onAdd } = props;

  const findMovie = () => {
    if (query.length === 0) {
      setError(true);

      return;
    }

    setMovie(null);

    getMovie(query)
      .then((result) => {
        if (result.Response === 'False') {
          setError(true);

          return;
        }

        const newMovie: Movie = {
          title: result.Title,
          description: result.Plot,
          imgUrl: result.Poster,
          imdbUrl: `imdb.com/title/${result.imdbID}/`,
          imdbId: result.imdbID,
        };

        setMovie(newMovie);
      });
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
              className="input is-danger"
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
