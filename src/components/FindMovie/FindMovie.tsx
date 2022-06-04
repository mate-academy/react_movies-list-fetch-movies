import React, { ChangeEvent, useCallback, useState } from 'react';
import { getMovie } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  isMovieInTheList: (movie: Movie) => boolean;
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ isMovieInTheList, addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const findMovie = useCallback(async () => {
    if (!query.trim().length) {
      setErrorMessage('Enter search text');
    }

    if (query.trim().length) {
      setErrorMessage('');
      const request = await getMovie(query);

      if (request.Response === 'True') {
        setMovie(request);
        setErrorMessage('');
      }

      if (request.Response === 'False') {
        setErrorMessage('Can\t find a movie with such title');
      }
    }
  }, [errorMessage, query]);

  const addMovieToTheList = useCallback(() => {
    if (movie) {
      if (isMovieInTheList(movie)) {
        setErrorMessage('This movie already is in the list');
      }

      if (!isMovieInTheList(movie)) {
        addMovie(movie);
        setQuery('');
        setMovie(null);
      }
    }

    if (!movie) {
      setErrorMessage('Select a movie first');
    }
  }, [movie]);

  const inputHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setQuery(target.value);
    setErrorMessage('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${errorMessage.length && 'is-danger'}`}
              value={query}
              onChange={inputHandler}
            />
          </div>

          <p className="help is-danger">
            {errorMessage}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              data-cy="find"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              data-cy="add"
              onClick={addMovieToTheList}
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
