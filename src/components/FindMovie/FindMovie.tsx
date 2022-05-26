import React, { FormEvent, useCallback, useState } from 'react';
import { getMovie } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (newMovie: Movie) => void,
  isMovieInTheList: (movie: Movie) => boolean,
}

enum Error {
  noError = '',
  hasFindError = 'Can\'t find a movie with such a title',
  hasQueryError = 'Select a movie first',
  hasEmptyQuery = 'Enter search text',
  hasAddedMovie = 'The movie is already on the list',
}

export const FindMovie: React.FC<Props> = ({ addMovie, isMovieInTheList }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState(Error.noError);

  const handleChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitle(event.target.value);
    setIsErrorMessage(Error.noError);
  }, []);

  const validateMessage = () => {
    if (!title.trim()) {
      setIsErrorMessage(Error.hasEmptyQuery);

      return false;
    }

    return true;
  };

  const getMovieFromServer = useCallback(async () => {
    setIsErrorMessage(Error.noError);

    if (validateMessage()) {
      const newMovie = await getMovie(title);

      if (newMovie.Response !== 'False') {
        setMovie(newMovie);
      } else {
        setIsErrorMessage(Error.hasFindError);
      }
    }
  }, [title, isErrorMessage]);

  const onAddMovie = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (movie) {
      if (isMovieInTheList(movie)) {
        setIsErrorMessage(Error.hasAddedMovie);
      } else {
        addMovie(movie);
        setTitle('');
        setIsErrorMessage(Error.noError);
      }
    }

    if (!movie) {
      setIsErrorMessage(Error.hasQueryError);
    }

    setMovie(null);
  }, [movie]);

  return (
    <>
      <form
        name="find-movie-form"
        className="find-movie"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              value={title}
              name={title}
              onChange={handleChange}
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
            />
          </div>

          {isErrorMessage.length > 0 && (
            <p className="help is-danger">
              {isErrorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovieFromServer}
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
