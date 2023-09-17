import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type FindMovieProps = {
  onSearch: (movieTitle: string) => void,
  movie: Movie | null,
  error: string,
  onAdd: (movie: Movie) => void,
  isLoading: boolean,
  clearErrorMessage: () => void,
};

export const FindMovie: React.FC<FindMovieProps>
  = ({
    onSearch, movie, error, onAdd, isLoading, clearErrorMessage,
  }) => {
    const [movieTitle, setMovieTitle] = useState('');

    const handleMovieTitle: React.ChangeEventHandler<HTMLInputElement>
    = (event) => {
      setMovieTitle(event.target.value);
      clearErrorMessage();
    };

    const handleSubmit: React.FormEventHandler = (event) => {
      event.preventDefault();
      onSearch(movieTitle);
    };

    const handleAddClick = (currentMovie: Movie) => {
      onAdd(currentMovie);
      setMovieTitle('');
    };

    return (
      <>
        <form className="find-movie" onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="movie-title">
              Movie title
            </label>

            <div className="control">
              <input
                data-cy="titleField"
                type="text"
                id="movie-title"
                value={movieTitle}
                onChange={handleMovieTitle}
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': error !== '' })}
              />
            </div>

            {error !== ''
            && (
              <p className="help is-danger" data-cy="errorMessage">
                {error}
              </p>
            )}
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                data-cy="searchButton"
                type="submit"
                className={classNames('button is-light',
                  { 'is-loading': isLoading })}
                disabled={movieTitle === ''}
              >
                Find a movie
              </button>
            </div>

            {movie !== null
            && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={() => handleAddClick(movie)}
                >
                  Add to the list
                </button>
              </div>
            )}
          </div>
        </form>

        {movie
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )}
      </>
    );
  };
