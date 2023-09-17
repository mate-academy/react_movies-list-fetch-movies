import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  setMovies: (movies: Movie[]) => void;
  loading: boolean,
  error: string,
  previewMovie: Movie,
  setPreviewMovie: (value: Movie) => void,
  setError: (value: string) => void,
  handleFindMovie: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    query: string
  ) => void,
};

export const FindMovie: React.FC<Props> = ({
  movies,
  setMovies,
  handleFindMovie,
  loading,
  error,
  previewMovie,
  setError,
  setPreviewMovie,
}) => {
  const [query, setQuery] = useState('');

  const isExistMovie = () => (
    movies.some(movie => movie.title === previewMovie.title)
  );

  const handleChangeQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError('');
  };

  const handlerAddMovie = () => {
    setPreviewMovie({} as Movie);
    setQuery('');
    if (!isExistMovie()) {
      setMovies([...movies, previewMovie]);
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                { 'is-danger': !!error },
              )}
              value={query}
              onChange={handleChangeQuery}
            />
          </div>

          {!!error
            && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button is-light',
                { 'is-loading': loading },
              )}
              disabled={!query}
              onClick={(e) => handleFindMovie(e, query)}
            >
              Find a movie
            </button>
          </div>

          {previewMovie.title
            && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={handlerAddMovie}
                >
                  Add to the list
                </button>
              </div>
            )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {previewMovie.title && <MovieCard movie={previewMovie} />}
      </div>
    </>
  );
};
