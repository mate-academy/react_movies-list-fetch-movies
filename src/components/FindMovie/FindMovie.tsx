import React from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  findMovie: (event: React.MouseEvent<HTMLButtonElement>) => void,
  newTitle: string,
  changeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  newMovie: Movie | null,
  addMovie: () => void,
  isMovieFind: boolean,
  isError: boolean,
};

export const FindMovie: React.FC<Props> = ({
  findMovie,
  newTitle,
  changeTitle,
  newMovie,
  addMovie,
  isMovieFind,
  isError,
}) => {
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
              className="input is-dander"
              value={newTitle}
              onChange={changeTitle}
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
              className={isMovieFind
                ? 'button is-light'
                : 'button is-light is-loading'}
              onClick={findMovie}
              disabled={!newTitle}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {newMovie && <MovieCard movie={newMovie} />}
      </div>
    </>
  );
};
