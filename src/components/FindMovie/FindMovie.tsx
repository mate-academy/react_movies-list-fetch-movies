import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { convertMovie, convertQuery } from '../../utils/__helpers';
import { request } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type FindFilm = {
  getQuery(film: string): void,
  findNewMovie(film: MovieData): void,
  onFormSubmit(setUpdate: boolean): void,
  inputValue: string,
};

export const FindMovie: React.FC<FindFilm> = ({
  getQuery,
  inputValue,
  findNewMovie,
  onFormSubmit,
}) => {
  const [movie, createMovie] = useState<Movie | null>(null);
  const [showErr, shouldShowError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

    const propperQuery: string = convertQuery(inputValue);
    const nextMovie = await request(propperQuery);

    if (nextMovie.Response !== 'False') {
      const propperFilm: Movie = convertMovie(nextMovie);

      createMovie(
        propperFilm,
      );

      findNewMovie(
        nextMovie,
      );

      setLoading(false);
      shouldShowError(false);
    } else {
      shouldShowError(true);
      createMovie(null);
      setLoading(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          onFormSubmit(true);
          getQuery('');
          createMovie(null);
          shouldShowError(false);
        }}
      >
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
              className="input is-dander"
              value={inputValue}
              onChange={({ target }) => {
                getQuery(target.value);
                shouldShowError(false);
              }}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {`${showErr ? 'Can`t find a movie with such a title' : ''}`}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="button"
              className={classNames(
                'button', 'is-light',
                { 'is-loading': isLoading },
              )}
              onClick={(event) => {
                handleClick(event);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="submit"
              className="button is-primary"
              disabled={movie === null}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie && showErr === false && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
