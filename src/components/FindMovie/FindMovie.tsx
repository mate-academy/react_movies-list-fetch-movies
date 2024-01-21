import React from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  errorMessage: string,
  onChangeSearch: (value: string) => void,
  query: string,
  searchMovie: () => void,
  onBackspacePress: () => void,
  foundMovie: Movie | null,
  isLoading: boolean,
  addingMovie: (movie: Movie) => void,
  resetForm: () => void,
  moviesList: Movie[],
  onHideErrorMessage: () => void,
};

export const FindMovie: React.FC<Props> = ({
  errorMessage,
  onChangeSearch,
  query,
  searchMovie,
  onBackspacePress,
  foundMovie,
  isLoading,
  addingMovie,
  resetForm,
  moviesList,
  onHideErrorMessage,
}) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (query.trim().length) {
      searchMovie();
    }
  };

  const onAddingMovieHandler = () => {
    if (foundMovie) {
      const existingMovie = moviesList.find(
        movieInList => movieInList.imdbId === foundMovie.imdbId,
      );

      if (!existingMovie) {
        addingMovie(foundMovie);
      }

      resetForm();
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={cn(
                'input',
                {
                  'is-danger': errorMessage.length,
                },
              )}
              value={query}
              onChange={(event) => {
                onChangeSearch(event.target.value);
                onHideErrorMessage();
              }}
              onKeyDown={(event) => {
                if (event.code === 'Backspace') {
                  onBackspacePress();
                }
              }}
            />
          </div>
        </div>

        {
          errorMessage.length > 0 && (
            <>
              <p className="help is-danger" data-cy="errorMessage">
                {errorMessage}
              </p>
              <br />
            </>
          )
        }

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddingMovieHandler}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {!!foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
