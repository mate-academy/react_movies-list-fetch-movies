import React, { useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  onSubmit: (event: React.FormEvent, movieTitle: string) => void,
  isLoading: boolean,
  changeIsLoading: (el: boolean) => void,
  isValid: boolean,
  changeIsValid: () => void,
  movie: Movie | null,
  addFilmToList: () => void,
}

export const FindMovie: React.FC<Props> = ({
  onSubmit,
  isLoading,
  changeIsLoading,
  isValid,
  changeIsValid,
  movie,
  addFilmToList,
}) => {
  const [currentMovieTitle, setCurrentMovieTitle] = useState('');

  const handleAddMovie = () => {
    addFilmToList();
    setCurrentMovieTitle('');
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    changeIsValid();
    setCurrentMovieTitle(event.target.value);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => onSubmit(event, currentMovieTitle)}
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
              className={cn('input', { 'is-danger': !isValid })}
              value={currentMovieTitle}
              onChange={event => handleChangeInput(event)}
            />
          </div>

          {!isValid && (
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
              className={cn(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!(currentMovieTitle.length > 0)}
              onClick={() => changeIsLoading(true)}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
