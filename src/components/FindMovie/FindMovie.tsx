import React, { useState } from 'react';
import './FindMovie.scss';
import { useMovie } from '../../hooks/useMovies';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';
import { Movie } from '../../types/Movie';

interface Props {
  addToTheList: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addToTheList }) => {
  const [title, setTitle] = useState('');
  const {
    getMovieFromServer,
    preMovie,
    isLoading,
    isError,
    clearError,
    setPreMovie,
  } = useMovie();

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value.trimStart());
    clearError();
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const trimedTitle = title.trim();

    if (trimedTitle === '') {
      return;
    }

    getMovieFromServer(trimedTitle);
  }

  function handleAddMovie() {
    if (preMovie) {
      addToTheList(preMovie);
    }

    setPreMovie(null);
  }

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
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': isError })}
              value={title}
              onChange={handleTitleChange}
            />
          </div>

          {isError && (
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
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
              disabled={title === ''}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {preMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {preMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={preMovie} />
        </div>
      )}
    </>
  );
};
