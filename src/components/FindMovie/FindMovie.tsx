import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { request } from '../../movies';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movieFromServer: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const getMovies = (currentQuery: string) => {
    return request(currentQuery)
      .then((movieFromServer) => {
        if (movieFromServer.Error) {
          setError(true);
        } else {
          setMovie(movieFromServer);
        }
      });
  };

  const inputChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }

    setQuery(event.currentTarget.value.toLowerCase());
    setInputValue(event.currentTarget.value);
  };

  const addMovieHandler = (currentMovie: Movie | null) => {
    if (currentMovie) {
      const isDuplicat = movies
        .some(currentFilm => currentFilm.imdbID === movie?.imdbID);

      if (!isDuplicat) {
        addMovie(currentMovie);
      }

      setInputValue('');
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie">
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
              type="button"
              className="button is-primary"
              onClick={() => addMovieHandler(movie)}
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
