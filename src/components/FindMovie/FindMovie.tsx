/* eslint-disable no-useless-return */
import classNames from 'classnames';
import React, {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { InputErrors } from '../../enums/InputErrors';
import { findFilmByTitle } from '../../api/api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({
  setMovies,
}) => {
  const [error, setError] = useState(InputErrors.None);
  const [errorMessage, setErrorMessage] = useState('');
  const [titleTextPattern, setTitleTextPattern] = useState('');
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();

    if (!findedMovie) {
      setError(InputErrors.CantAddFirstlyFindSomeFilm);

      return;
    }

    setMovies(prevValue => {
      if (prevValue.find(
        film => film.imdbID === findedMovie.imdbID,
      ) !== undefined) {
        setError(InputErrors.FilmAlreadyAdded);

        return prevValue;
      }

      setFindedMovie(null);

      return [...prevValue, findedMovie];
    });
    setTitleTextPattern('');
  }, [findedMovie, setMovies]);

  const findMovie = useCallback(async () => {
    if (!titleTextPattern.trim()) {
      setError(InputErrors.EmptyField);

      return;
    }

    const filmPromise = await findFilmByTitle(titleTextPattern);

    if (filmPromise.Response === 'False') {
      setError(InputErrors.FilmNotFound);

      return;
    }

    setFindedMovie(filmPromise);
  }, [titleTextPattern, setFindedMovie, setError]);

  useEffect(() => {
    switch (error) {
      case InputErrors.FilmNotFound:
        setErrorMessage('*Film not found');
        break;

      case InputErrors.EmptyField:
        setErrorMessage('*Enter name in field please!');
        break;

      case InputErrors.CantAddFirstlyFindSomeFilm:
        setErrorMessage('*Firstly find some film');
        break;

      case InputErrors.FilmAlreadyAdded:
        setErrorMessage('*This film already added');
        break;

      case InputErrors.None:
        setErrorMessage('');
        break;

      default:
        throw new Error('unexpected inputError');
    }
  }, [error]);

  return (
    <>
      <form
        className="find-movie"
        method="post"
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
              className={classNames(
                'input',
                {
                  'is-danger': error !== InputErrors.None,
                },
              )}
              value={titleTextPattern}
              onChange={({ target }) => {
                setError(InputErrors.None);
                setTitleTextPattern(target.value);
              }}
            />
          </div>

          {error !== InputErrors.None && (
            <p className="help is-danger">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={classNames(
                'button',
                {
                  'is-primary':
                  titleTextPattern.trim(),
                },
              )}
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className={classNames(
                'button',
                {
                  'is-light':
                  !findedMovie,
                  'is-primary':
                  findedMovie,
                },
              )}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard movie={findedMovie} />
      </div>
    </>
  );
};
