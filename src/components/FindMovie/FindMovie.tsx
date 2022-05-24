import {
  FC, useState, useCallback, ChangeEvent,
} from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void,
  isMovieInTheList: (movie: Movie) => boolean,
}

enum Error {
  noError = '',
  hasFindError = 'Can\'t find a movie with such a title',
  hasQueryError = 'Select a movie first',
  hasEmptyQuery = 'Enter search text',
  hasTheSameMovie = 'The movie is already on the list',
}

export const FindMovie: FC<Props> = ({ addMovie, isMovieInTheList }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState(Error.noError);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(Error.noError);
    setQuery(event.target.value);
  }, []);

  const findByTitle = useCallback(async () => {
    if (!query.trim().length) {
      setErrorMessage(Error.hasEmptyQuery);
    } else {
      setErrorMessage(Error.noError);
      const currentMovie = await getMovie(query);

      if (currentMovie.Response !== 'False') {
        setMovie(currentMovie);
      } else {
        setErrorMessage(Error.hasFindError);
      }
    }
  }, [query, errorMessage]);

  const onAddMovie = useCallback(() => {
    if (movie) {
      if (isMovieInTheList(movie)) {
        setErrorMessage(Error.hasTheSameMovie);
      } else {
        addMovie(movie);
        setQuery('');
      }
    }

    if (!movie) {
      setErrorMessage(Error.hasQueryError);
    }

    setMovie(null);
  }, [movie]);

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
              value={query}
              onChange={handleChange}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input',
                { 'is-danger': errorMessage.length })}
            />
          </div>

          {errorMessage.length > 0 && (
            <p className="help is-danger">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findByTitle}
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
