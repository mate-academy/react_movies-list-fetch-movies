import React, { useState } from 'react';
import classNames from 'classnames';
import { request } from '../../movies';

type Props = {
  addMovie: (movieFromServer: Movie) => void;
  setCurrentMovie: (currentMovie: Movie | null) => void;
  movies: Movie[];
  movie: Movie | null;
};

export const MovieForm: React.FC<Props> = ({
  addMovie,
  setCurrentMovie,
  movies,
  movie,
}) => {
  const [query, setQuery] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);

  const inputChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }

    setQuery(event.currentTarget.value.toLowerCase());
    setInputValue(event.currentTarget.value);
  };

  const getMovies = (currentQuery: string) => {
    return request(currentQuery)
      .then((movieFromServer) => {
        if (movieFromServer.Error) {
          setError(true);
        } else {
          setCurrentMovie(movieFromServer);
        }
      });
  };

  const addMovieHandler = (currentMovie: Movie | null) => {
    if (currentMovie) {
      const isDuplicat = movies
        .some(currentFilm => currentFilm.imdbID === movie?.imdbID);

      if (!isDuplicat) {
        addMovie(currentMovie);
      }

      setInputValue('');
      setCurrentMovie(null);
    }
  };

  return (
    <form
      className="find-movie"
      onSubmit={(event) => {
        event.preventDefault();
        addMovieHandler(movie);
      }}
    >
      <div className="field">
        <label className="label" htmlFor="movie-title">
          Movie title
        </label>

        <div className="control">
          <input
            type="text"
            value={inputValue}
            id="movie-title"
            placeholder="Enter a title to search"
            className={classNames(
              'input',
              { 'is-danger': error },
            )}
            onChange={inputChangeHandler}
          />
        </div>

        {error
          && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
      </div>

      <div className="field is-grouped" data-cy="find">
        <div className="control">
          <button
            type="button"
            className="button is-light"
            onClick={() => getMovies(query)}
          >
            Find a movie
          </button>
        </div>

        <div className="control" data-cy="add">
          <button
            type="submit"
            className="button is-primary"
          >
            Add to the list
          </button>
        </div>
      </div>
    </form>
  );
};
